import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getPool } from "@/lib/server/db";
import { generateDeterministicEmbedding } from "@/lib/server/embedding";

export const dynamic = "force-dynamic";

const EvaluateSchema = z.object({
  url: z.string().min(2, "La URL o slug es obligatorio"),
  autoIngest: z.boolean().optional().default(false),
});

interface GitHubRepoResponse {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  updated_at: string;
  archived: boolean;
  disabled: boolean;
  fork: boolean;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  topics?: string[];
  homepage?: string | null;
}

const OSI_APPROVED_LICENSES = new Set([
  "MIT",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "PostgreSQL",
  "AGPL-3.0",
  "GPL-3.0",
  "MPL-2.0",
  "ISC",
  "BSL-1.1",
]);

function parseOwnerRepo(input: string): { owner: string; repo: string } | null {
  const cleaned = input.trim().replace(/\/+$/, "");
  // Match https://github.com/owner/repo or github.com/owner/repo or owner/repo
  const match = cleaned.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/i)
    || cleaned.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);

  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/i, "") };
}

function detectCategory(topics: string[], desc: string, name: string): "AUTH" | "DBS" | "PAYMENTS" | "AI" {
  const text = `${name} ${desc} ${topics.join(" ")}`.toLowerCase();

  if (
    text.includes("ai") ||
    text.includes("llm") ||
    text.includes("agent") ||
    text.includes("rag") ||
    text.includes("gpt") ||
    text.includes("whisper") ||
    text.includes("neural") ||
    text.includes("tts") ||
    text.includes("copilot") ||
    text.includes("inference")
  ) {
    return "AI";
  }

  if (
    text.includes("auth") ||
    text.includes("iam") ||
    text.includes("oauth") ||
    text.includes("oidc") ||
    text.includes("sso") ||
    text.includes("identity") ||
    text.includes("jwt") ||
    text.includes("saml") ||
    text.includes("passkey")
  ) {
    return "AUTH";
  }

  if (
    text.includes("payment") ||
    text.includes("billing") ||
    text.includes("subscription") ||
    text.includes("stripe") ||
    text.includes("invoice") ||
    text.includes("checkout") ||
    text.includes("fintech") ||
    text.includes("ledger")
  ) {
    return "PAYMENTS";
  }

  return "DBS";
}

function estimateSavings(category: string, name: string): string {
  switch (category) {
    case "AI":
      return `$50 - $200 USD / mes vs SaaS Propietario de IA`;
    case "AUTH":
      return `$1,200 - $2,500 USD / mes en licencias MAU B2B`;
    case "PAYMENTS":
      return `$1,500 - $3,500 USD / mes en comisiones de pasarela`;
    case "DBS":
    default:
      return `$800 - $2,000 USD / mes vs Cloud Gestionado`;
  }
}

/**
 * POST /api/v1/github/evaluate
 * Evalúa on-demand cualquier repositorio de GitHub, calcula el Health Score B2B
 * y opcionalmente lo ingesta con vectorización halfvec al catálogo en vivo.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = EvaluateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Entrada inválida", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { url, autoIngest } = parsed.data;
    const repoInfo = parseOwnerRepo(url);
    if (!repoInfo) {
      return NextResponse.json(
        {
          error: "Formato de URL inválido. Usa 'https://github.com/owner/repo' o 'owner/repo'.",
        },
        { status: 400 }
      );
    }

    const { owner, repo } = repoInfo;
    const headers: Record<string, string> = {
      "User-Agent": "OSS-Atlas-Auditor-B2B/1.0",
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Consultar API de GitHub
    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (ghRes.status === 404) {
      return NextResponse.json(
        {
          error: `Repositorio '${owner}/${repo}' no encontrado en GitHub o es privado.`,
          status: "REJECTED",
          eligible: false,
        },
        { status: 404 }
      );
    }

    if (!ghRes.ok && ghRes.status !== 304) {
      // Manejo de rate limit o fallback
      return NextResponse.json(
        {
          error: `GitHub API respondió con estado HTTP ${ghRes.status}. Rate limit o servicio no disponible.`,
          status: "ERROR",
        },
        { status: 502 }
      );
    }

    const ghData: GitHubRepoResponse = await ghRes.json();

    // 2. Comprobar Dockerfile
    let hasDockerfile = false;
    try {
      const dockerRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/Dockerfile`,
        { headers }
      );
      hasDockerfile = dockerRes.ok;
      if (!hasDockerfile) {
        const composeRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/docker-compose.yml`,
          { headers }
        );
        hasDockerfile = composeRes.ok;
      }
    } catch {
      hasDockerfile = false;
    }

    // 3. Auditoría de Métricas B2B
    // 3.1 Commit Velocity (15%):
    const now = Date.now();
    const lastPushed = new Date(ghData.pushed_at).getTime();
    const daysSincePush = Math.max(0, Math.floor((now - lastPushed) / (1000 * 60 * 60 * 24)));

    let commitVelocity = 60;
    if (daysSincePush <= 7) commitVelocity = 99;
    else if (daysSincePush <= 30) commitVelocity = 96;
    else if (daysSincePush <= 60) commitVelocity = 91;
    else if (daysSincePush <= 90) commitVelocity = 86;
    else if (daysSincePush <= 180) commitVelocity = 75;
    else if (daysSincePush <= 365) commitVelocity = 55;
    else commitVelocity = 25;

    // 3.2 Security & Structural (20%):
    let securityScore = 75;
    const stars = ghData.stargazers_count;
    if (stars >= 15000) securityScore = 98;
    else if (stars >= 8000) securityScore = 95;
    else if (stars >= 3000) securityScore = 91;
    else if (stars >= 1000) securityScore = 87;
    else if (stars >= 300) securityScore = 80;

    const spdx = ghData.license?.spdx_id || "UNKNOWN";
    const isOsi = OSI_APPROVED_LICENSES.has(spdx);

    if (isOsi) {
      securityScore = Math.min(100, securityScore + 2);
    } else {
      securityScore = Math.max(30, securityScore - 25);
    }

    if (ghData.archived) {
      securityScore = Math.max(20, securityScore - 35);
    }

    // 3.3 Documentation & Community (65%):
    let docsScore = 70;
    if (ghData.description && ghData.description.length > 20) docsScore += 10;
    if (hasDockerfile) docsScore += 12;
    if (ghData.homepage) docsScore += 5;
    if (ghData.topics && ghData.topics.length >= 2) docsScore += 5;
    docsScore = Math.min(100, Math.max(40, docsScore));

    // 3.4 Health Score Ponderado:
    const healthScore = Number(
      (commitVelocity * 0.15 + securityScore * 0.20 + docsScore * 0.65).toFixed(2)
    );

    // 4. Determinar Elegibilidad y Dictamen B2B
    let status: "APPROVED" | "CONDITIONAL" | "REJECTED" = "APPROVED";
    const reasons: string[] = [];

    if (ghData.archived) {
      status = "REJECTED";
      reasons.push("El repositorio se encuentra archivado (abandonware) en GitHub.");
    }

    if (!isOsi) {
      if (status !== "REJECTED") status = "CONDITIONAL";
      reasons.push(`Licencia '${spdx}' no reconocida como estándar OSI permisivo.`);
    }

    if (daysSincePush > 180) {
      if (status !== "REJECTED") status = "CONDITIONAL";
      reasons.push(`Inactividad de commits superior a ${daysSincePush} días.`);
    }

    if (healthScore < 80) {
      status = "REJECTED";
      reasons.push(`Health Score insuficiente (${healthScore}/100, mínimo requerido: 80).`);
    } else if (healthScore >= 80 && healthScore < 88 && status === "APPROVED") {
      status = "CONDITIONAL";
      reasons.push("Cumple criterios mínimos pero requiere auditoría manual de arquitectura.");
    }

    if (status === "APPROVED") {
      reasons.push("Cumple con todos los estándares B2B de OSS Atlas (actividad reciente, licencia aprobada, documentación y tracción comunitaria).");
    }

    const category = detectCategory(ghData.topics || [], ghData.description || "", ghData.name);
    const savings = estimateSavings(category, ghData.name);
    const dockerCommand = hasDockerfile
      ? `docker run -d --name ${repo} -p 8080:8080 ${owner}/${repo}:latest`
      : `docker run -d --name ${repo} ${owner}/${repo}:latest`;

    const auditSummary = {
      name: ghData.name,
      slug: `${owner}/${repo}`,
      url: ghData.html_url,
      description: ghData.description || `Herramienta de arquitectura B2B: ${ghData.name}`,
      category,
      license: isOsi ? spdx : "Apache-2.0",
      stars: ghData.stargazers_count,
      forks: ghData.forks_count,
      openIssues: ghData.open_issues_count,
      lastPushDaysAgo: daysSincePush,
      hasDockerfile,
      isArchived: ghData.archived,
      metrics: {
        commitVelocityScore: commitVelocity,
        securityScore: securityScore,
        docsScore: docsScore,
        weightedHealthScore: healthScore,
      },
      status,
      eligible: status !== "REJECTED",
      reasons,
      selfHostedSavingsB2B: savings,
      suggestedDockerCommand: dockerCommand,
      dependencies: hasDockerfile ? ["Docker Engine 20.10+"] : ["Runtime específico", "Docker Engine"],
      triggers: ["B2B Architecture Evaluation", "API Webhook Integration"],
    };

    // 5. Ingesta Automática Opcional en Neon PostgreSQL
    let ingestedRecord = null;
    if (autoIngest && auditSummary.eligible) {
      const pool = getPool();
      const content = `${auditSummary.name} ${auditSummary.description} ${auditSummary.category} ${auditSummary.slug}`;
      const embedding = generateDeterministicEmbedding(content, 1536);
      const vectorStr = `[${embedding.join(",")}]`;
      const cleanSlug = auditSummary.slug.replace(/[^a-zA-Z0-9_-]/g, "-");
      const etag = `W/"audit-${cleanSlug}-${Date.now()}"`;

      const query = `
        INSERT INTO oss_repositories (
          name, slug, category, license, stars, health_score,
          commit_velocity_score, security_score, docs_score,
          description, content, docker_command, integration_difficulty,
          triggers, dependencies, etag, embedding_halfvec, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9,
          $10, $11, $12, $13,
          $14, $15, $16, $17::halfvec(1536), now()
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          license = EXCLUDED.license,
          stars = EXCLUDED.stars,
          health_score = EXCLUDED.health_score,
          commit_velocity_score = EXCLUDED.commit_velocity_score,
          security_score = EXCLUDED.security_score,
          docs_score = EXCLUDED.docs_score,
          description = EXCLUDED.description,
          content = EXCLUDED.content,
          docker_command = EXCLUDED.docker_command,
          integration_difficulty = EXCLUDED.integration_difficulty,
          triggers = EXCLUDED.triggers,
          dependencies = EXCLUDED.dependencies,
          etag = EXCLUDED.etag,
          embedding_halfvec = EXCLUDED.embedding_halfvec,
          updated_at = now()
        RETURNING id, name, slug, category, license, health_score, etag;
      `;

      const values = [
        auditSummary.name,
        auditSummary.slug,
        auditSummary.category,
        auditSummary.license,
        auditSummary.stars,
        auditSummary.metrics.weightedHealthScore,
        auditSummary.metrics.commitVelocityScore,
        auditSummary.metrics.securityScore,
        auditSummary.metrics.docsScore,
        auditSummary.description,
        content,
        auditSummary.suggestedDockerCommand,
        "Media",
        auditSummary.triggers,
        auditSummary.dependencies,
        etag,
        vectorStr,
      ];

      const { rows } = await pool.query(query, values);
      ingestedRecord = rows[0];
    }

    const evaluationPayload = {
      status: auditSummary.status,
      statusReason: auditSummary.reasons.join(". "),
      healthScore: auditSummary.metrics.weightedHealthScore,
      breakdown: {
        commitVelocity: auditSummary.metrics.commitVelocityScore,
        securityStructural: auditSummary.metrics.securityScore,
        communityDocs: auditSummary.metrics.docsScore,
      },
      metrics: {
        stars: auditSummary.stars,
        daysSinceLastPush: auditSummary.lastPushDaysAgo,
        licenseSpdx: auditSummary.license,
        hasDockerSupport: auditSummary.hasDockerfile,
        openIssues: auditSummary.openIssues,
      },
      suggestedCategory: auditSummary.category,
      b2bSavingsEstimate: auditSummary.selfHostedSavingsB2B,
    };

    const repoDataPayload = {
      name: auditSummary.name,
      slug: auditSummary.slug,
      description: auditSummary.description,
      category: auditSummary.category,
      license: auditSummary.license,
      dockerCommand: auditSummary.suggestedDockerCommand,
      triggers: auditSummary.triggers,
      dependencies: auditSummary.dependencies,
    };

    return NextResponse.json({
      audit: auditSummary,
      evaluation: evaluationPayload,
      repoData: repoDataPayload,
      ingested: ingestedRecord,
      message: ingestedRecord
        ? `Repositorio '${auditSummary.name}' evaluado exitosamente e incorporado al catálogo.`
        : `Auditoría completada. Dictamen: ${auditSummary.status}.`,
    });
  } catch (error) {
    console.error("Error en POST /api/v1/github/evaluate:", error);
    return NextResponse.json(
      {
        error: "Error interno al auditar el repositorio de GitHub.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
