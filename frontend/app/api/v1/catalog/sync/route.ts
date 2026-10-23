import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getPool } from "@/lib/server/db";
import { generateDeterministicEmbedding } from "@/lib/server/embedding";

export const dynamic = "force-dynamic";

const SingleRepoSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(120),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres").max(120),
  category: z.enum(["AUTH", "DBS", "PAYMENTS", "AI"]),
  license: z.enum(["MIT", "Apache-2.0", "PostgreSQL", "BSL-1.1", "AGPL-3.0", "MPL-2.0", "GPL-3.0"]).default("Apache-2.0"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres").max(2000),
  content: z.string().optional(),
  stars: z.coerce.number().int().nonnegative().default(0),
  commit_velocity_score: z.coerce.number().min(0).max(100).default(85),
  security_score: z.coerce.number().min(0).max(100).default(90),
  docs_score: z.coerce.number().min(0).max(100).default(88),
  docker_command: z.string().optional().default(""),
  integration_difficulty: z.enum(["Baja", "Media", "Alta"]).default("Media"),
  triggers: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
});

const SyncBodySchema = z.union([
  z.object({
    action: z.literal("reindex_all"),
  }),
  z.object({
    action: z.literal("sync_preset"),
    presetSlug: z.string().optional(),
  }),
  z.object({
    repositories: z.array(SingleRepoSchema).min(1),
  }),
  SingleRepoSchema,
]);

/**
 * Presets curados de alta demanda B2B para demostración instantánea de ingesta
 */
const PRESET_REPOSITORIES = [
  {
    name: "Zitadel Cloud-Native IAM",
    slug: "zitadel/zitadel",
    category: "AUTH" as const,
    license: "Apache-2.0" as const,
    stars: 18500,
    commit_velocity_score: 95.0,
    security_score: 97.0,
    docs_score: 94.0,
    description: "Plataforma de gestión de identidades y accesos cloud-native escrita en Go. Soporta OAuth2/OIDC, auditoría de eventos y multi-tenancy nativo B2B.",
    content: "Zitadel autenticacion identidad IAM SSO OIDC OAuth2 Go multi-tenant auditoria eventos seguridad usuarios login passkeys",
    docker_command: "docker run -d --name zitadel -p 8080:8080 ghcr.io/zitadel/zitadel:latest start-from-init",
    integration_difficulty: "Baja" as const,
    triggers: ["OIDC User Registration Event", "Session Token Verification", "Organization Tenant Provisioning"],
    dependencies: ["Go Runtime", "PostgreSQL / CockroachDB", "Docker Engine"],
  },
  {
    name: "Qdrant Vector Database",
    slug: "qdrant/qdrant",
    category: "DBS" as const,
    license: "Apache-2.0" as const,
    stars: 22400,
    commit_velocity_score: 97.0,
    security_score: 96.0,
    docs_score: 96.0,
    description: "Motor de búsqueda vectorial y base de datos optimizada en Rust con filtrado avanzado de carga útil para embeddings de alta dimensionalidad.",
    content: "Qdrant vector database motor busqueda vectorial rust filtrado payload embeddings hnsw distancia coseno rag ai almacenamiento",
    docker_command: "docker run -d --name qdrant -p 6333:6333 -p 6334:6334 qdrant/qdrant",
    integration_difficulty: "Baja" as const,
    triggers: ["Batch Vector Embedding Upsert", "Cosine Hybrid Search Query", "Payload Filtering Event"],
    dependencies: ["Rust Binary / Docker", "Storage Volume"],
  },
  {
    name: "Casbin AuthZ Engine",
    slug: "casbin/casbin",
    category: "AUTH" as const,
    license: "Apache-2.0" as const,
    stars: 17200,
    commit_velocity_score: 92.0,
    security_score: 95.0,
    docs_score: 93.0,
    description: "Librería de autorización open-source compatible con modelos de control de acceso como ACL, RBAC, ABAC y políticas RESTful multinivel.",
    content: "Casbin autorizacion control de acceso RBAC ABAC ACL politicas seguridad permisos roles middleware authz",
    docker_command: "docker run -d --name casbin-server -p 50051:50051 casbin/casbin-server",
    integration_difficulty: "Media" as const,
    triggers: ["RBAC Policy Enforcement Hook", "Role Inheritance Evaluation", "Tenant Policy Reload"],
    dependencies: ["Go / Node.js / Python", "SQL Storage Adapter"],
  },
  {
    name: "OpenFGA Zanzibar Authorization",
    slug: "openfga/openfga",
    category: "AUTH" as const,
    license: "Apache-2.0" as const,
    stars: 4800,
    commit_velocity_score: 93.0,
    security_score: 96.0,
    docs_score: 95.0,
    description: "Sistema de autorización de grano fino (ReBAC) de alto rendimiento inspirado en la arquitectura Google Zanzibar y mantenido por CNCF.",
    content: "OpenFGA Google Zanzibar autorizacion grano fino ReBAC relaciones permisos control de acceso cncf granular",
    docker_command: "docker run -d --name openfga -p 8080:8080 -p 3000:3000 openfga/openfga run",
    integration_difficulty: "Media" as const,
    triggers: ["Relationship Tuple Write", "Authorization Check API Call", "Model Expansion Query"],
    dependencies: ["Docker Engine", "PostgreSQL / MySQL"],
  },
];

async function syncSingleRepo(repo: z.infer<typeof SingleRepoSchema>) {
  const pool = getPool();

  // 1. Cálculo de Health Score automático ponderado (15% commit, 20% security, 65% docs)
  const healthScore = Number(
    (
      repo.commit_velocity_score * 0.15 +
      repo.security_score * 0.20 +
      repo.docs_score * 0.65
    ).toFixed(2)
  );

  // 2. Preparar texto y vector semántico determinista de 1536 dimensiones (halfvec)
  const content = repo.content && repo.content.trim().length > 0
    ? repo.content.trim()
    : `${repo.name} ${repo.description} ${repo.triggers.join(" ")} ${repo.category}`;
  const textToIndex = `${repo.name} ${repo.description} ${content}`;
  const embedding = generateDeterministicEmbedding(textToIndex, 1536);
  const vectorStr = `[${embedding.join(",")}]`;

  // 3. ETag de sincronización
  const cleanSlug = repo.slug.replace(/[^a-zA-Z0-9_-]/g, "-");
  const etag = `W/"sync-${cleanSlug}-${Date.now()}"`;

  // 4. Upsert en PostgreSQL
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
    RETURNING id, name, slug, category, license, health_score,
              commit_velocity_score, security_score, docs_score,
              stars, description, docker_command, integration_difficulty,
              triggers, dependencies, etag, updated_at;
  `;

  const values = [
    repo.name,
    repo.slug,
    repo.category,
    repo.license,
    repo.stars,
    healthScore,
    repo.commit_velocity_score,
    repo.security_score,
    repo.docs_score,
    repo.description,
    content,
    repo.docker_command,
    repo.integration_difficulty,
    repo.triggers,
    repo.dependencies,
    etag,
    vectorStr,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

/**
 * POST /api/v1/catalog/sync
 * Pipeline de Ingesta Continua:
 * - Agrega o actualiza herramientas Open Source en PostgreSQL.
 * - Calcula automáticamente el Health Score ponderado.
 * - Genera el embedding unitario y lo persiste en columna embedding_halfvec(1536).
 * - Soporta ingesta individual, lote, recálculo total (reindex_all) o presets curados.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json(
        { error: "Cuerpo de solicitud vacío o JSON inválido" },
        { status: 400 }
      );
    }

    const parsed = SyncBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de repositorio inválidos", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Negociación de Caché ETag para preservación de Rate Limits
    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch && "slug" in data) {
      const pool = getPool();
      const existing = await pool.query(
        "SELECT etag, name, slug FROM oss_repositories WHERE slug = $1",
        [data.slug]
      );
      if (existing.rows.length > 0 && existing.rows[0].etag && (existing.rows[0].etag === ifNoneMatch || ifNoneMatch.includes(existing.rows[0].etag))) {
        return new NextResponse(null, {
          status: 304,
          headers: {
            ETag: existing.rows[0].etag,
            "X-Sync-Status": "Not Modified - GitHub Rate-Limit Protected",
          },
        });
      }
    }

    // Acción 1: Reindexar toda la base de datos (recalcula embeddings y health scores)
    if ("action" in data && data.action === "reindex_all") {
      const pool = getPool();
      const { rows } = await pool.query(
        "SELECT id, name, slug, description, content, commit_velocity_score, security_score, docs_score, triggers FROM oss_repositories"
      );

      let updatedCount = 0;
      for (const row of rows) {
        const triggers = Array.isArray(row.triggers) ? row.triggers.join(" ") : "";
        const textToIndex = `${row.name} ${row.description || ""} ${row.content || ""} ${triggers}`;
        const embedding = generateDeterministicEmbedding(textToIndex, 1536);
        const vectorStr = `[${embedding.join(",")}]`;
        const healthScore = Number(
          (
            Number(row.commit_velocity_score || 0) * 0.15 +
            Number(row.security_score || 0) * 0.20 +
            Number(row.docs_score || 0) * 0.65
          ).toFixed(2)
        );

        await pool.query(
          `UPDATE oss_repositories 
           SET embedding_halfvec = $1::halfvec(1536),
               health_score = $2,
               updated_at = now()
           WHERE id = $3`,
          [vectorStr, healthScore, row.id]
        );
        updatedCount++;
      }

      return NextResponse.json({
        success: true,
        action: "reindex_all",
        totalProcessed: updatedCount,
        message: `Se reindexaron y actualizaron vectores halfvec y health scores para ${updatedCount} repositorios.`,
      });
    }

    // Acción 2: Sincronizar presets curados
    if ("action" in data && data.action === "sync_preset") {
      const targetPreset = data.presetSlug
        ? PRESET_REPOSITORIES.filter((p) => p.slug === data.presetSlug)
        : PRESET_REPOSITORIES;

      if (targetPreset.length === 0) {
        return NextResponse.json(
          { error: `Preset no encontrado para el slug '${data.presetSlug}'` },
          { status: 404 }
        );
      }

      const syncedResults = [];
      for (const preset of targetPreset) {
        const synced = await syncSingleRepo(preset);
        syncedResults.push(synced);
      }

      return NextResponse.json({
        success: true,
        action: "sync_preset",
        syncedCount: syncedResults.length,
        repositories: syncedResults,
        message: `Se sincronizaron con éxito ${syncedResults.length} repositorio(s) curado(s).`,
      });
    }

    // Acción 3: Ingesta en lote
    if ("repositories" in data) {
      const results = [];
      for (const repo of data.repositories) {
        const synced = await syncSingleRepo(repo);
        results.push(synced);
      }
      return NextResponse.json({
        success: true,
        count: results.length,
        repositories: results,
      });
    }

    // Acción 4: Ingesta de un único repositorio
    const synced = await syncSingleRepo(data);
    return NextResponse.json({
      success: true,
      repository: synced,
      message: `Repositorio '${synced.name}' (${synced.slug}) sincronizado e indexado con éxito.`,
    }, { status: 201 });

  } catch (error) {
    console.error("Error en POST /api/v1/catalog/sync:", error);
    return NextResponse.json(
      {
        error: "Error interno al sincronizar el catálogo",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/catalog/sync — Devuelve los presets disponibles para sincronización rápida con ETag
 */
export async function GET(request: NextRequest) {
  const presetsEtag = `W/"sync-presets-${PRESET_REPOSITORIES.length}"`;
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && (ifNoneMatch === presetsEtag || ifNoneMatch.includes(presetsEtag))) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: presetsEtag,
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    });
  }

  return NextResponse.json(
    {
      presets: PRESET_REPOSITORIES.map((p) => ({
        name: p.name,
        slug: p.slug,
        category: p.category,
        license: p.license,
        stars: p.stars,
        description: p.description,
        triggers: p.triggers,
        dependencies: p.dependencies,
      })),
    },
    {
      headers: {
        ETag: presetsEtag,
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    }
  );
}
