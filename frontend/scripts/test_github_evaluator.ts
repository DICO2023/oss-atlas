/**
 * QA Test: Validador de Auditoría On-Demand de Repositorios GitHub
 */
import { POST as evaluateGitHub } from "@/app/api/v1/github/evaluate/route";
import type { NextRequest } from "next/server";
process.loadEnvFile(".env.local");

function createMockPostRequest(body: unknown): NextRequest {
  return {
    method: "POST",
    json: async () => body,
  } as unknown as NextRequest;
}

async function testEvaluator() {
  console.log("=".repeat(80));
  console.log("🧪 PRUEBA DEL MÓDULO DE AUDITORÍA ON-DEMAND DE GITHUB");
  console.log("=".repeat(80));

  const testRepos = [
    { url: "https://github.com/qdrant/qdrant", desc: "Base de datos vectorial en Rust" },
    { url: "https://github.com/CopilotKit/CopilotKit", desc: "Framework de Copilotos de IA" },
    { url: "https://github.com/zitadel/zitadel", desc: "IAM Cloud-Native en Go" }
  ];

  for (const t of testRepos) {
    console.log(`\n🔍 Auditando: ${t.url} (${t.desc})...`);
    const start = Date.now();
    const req = createMockPostRequest({ url: t.url, autoIngest: false });
    const res = await evaluateGitHub(req);
    const data = await res.json();
    const duration = Date.now() - start;

    if (res.status === 200) {
      const a = data.audit;
      console.log(`✅ [${a.name}] Dictamen: ${a.status} (Eligible: ${a.eligible}) | Latencia: ${duration}ms`);
      console.log(`   ├─ Health Score B2B: ${a.metrics.weightedHealthScore} / 100`);
      console.log(`   ├─ Desglose: Commits ${a.metrics.commitVelocityScore} (15%) | Seguridad ${a.metrics.securityScore} (20%) | Docs ${a.metrics.docsScore} (65%)`);
      console.log(`   ├─ Licencia: ${a.license} | Estrellas: ${a.stars.toLocaleString()} | Dockerfile: ${a.hasDockerfile ? 'SÍ' : 'NO'}`);
      console.log(`   ├─ Categoría Asignada: ${a.category} | Ahorro B2B: ${a.selfHostedSavingsB2B}`);
      console.log(`   └─ Comando Docker: ${a.suggestedDockerCommand}`);
    } else {
      console.error(`❌ Falló con HTTP ${res.status}:`, data);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("🏁 Auditoría de prueba finalizada exitosamente.");
  console.log("=".repeat(80));
}

testEvaluator().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
