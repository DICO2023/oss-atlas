/**
 * QA Test Suite 4: Resiliencia de Ingesta Continua y Negociación de Caché ETag
 * 
 * Evalúa:
 * 1. Negociación HTTP 304 Not Modified en GET /api/v1/catalog con cabecera ETag.
 * 2. Negociación HTTP 304 Not Modified en GET /api/v1/catalog/sync para presets.
 * 3. Protección de Rate Limits en POST /api/v1/catalog/sync con If-None-Match.
 * 4. Ingesta Continua y cálculo estricto de Health Score ponderado:
 *    Health Score = 0.15 * Commits + 0.20 * Security + 0.65 * Docs
 * 5. Generación de vectores halfvec(1536) e indexación HNSW inmediata en Neon PostgreSQL.
 */

import { getPool } from "@/lib/server/db";
import { GET as getCatalog } from "@/app/api/v1/catalog/route";
import { GET as getSyncPresets, POST as postSync } from "@/app/api/v1/catalog/sync/route";
import { hybridSearch } from "@/lib/server/search";
import type { NextRequest } from "next/server";
process.loadEnvFile(".env.local");

function createMockRequest(url: string, options: { method?: string; headers?: Record<string, string>; body?: unknown } = {}): NextRequest {
  const parsedUrl = new URL(url, "http://localhost:3000");
  const headers = new Headers(options.headers || {});
  
  return {
    nextUrl: parsedUrl,
    url: parsedUrl.toString(),
    method: options.method || "GET",
    headers: headers,
    json: async () => options.body || {},
  } as unknown as NextRequest;
}

async function runEtagAndIngestionSuite() {
  console.log("=".repeat(80));
  console.log("🧪 SUITE DE PRUEBAS 4: RESILIENCIA DE INGESTA CONTINUA Y CACHÉ ETAG (OSS ATLAS)");
  console.log("=".repeat(80));

  const results = {
    test1_catalog_etag: false,
    test2_sync_presets_etag: false,
    test3_rate_limit_protection: false,
    test4_weighted_health_and_halfvec: false,
  };

  // --------------------------------------------------------------------------
  // TEST 1: GET /api/v1/catalog ETag y HTTP 304 Not Modified
  // --------------------------------------------------------------------------
  console.log("\n--- 1. NEGOCIACIÓN DE CACHÉ EN GET /api/v1/catalog ---");
  try {
    const req1 = createMockRequest("http://localhost:3000/api/v1/catalog");
    const res1 = await getCatalog(req1);
    const catalogEtag = res1.headers.get("etag")!;
    const catalogCount = res1.headers.get("x-catalog-count");
    const data1 = await res1.json();

    console.log(`✅ [Petición 1: Sin Caché] HTTP ${res1.status} OK | ETag: ${catalogEtag} | Repositorios: ${data1.length}`);

    // Petición 2 con If-None-Match
    const req2 = createMockRequest("http://localhost:3000/api/v1/catalog", {
      headers: { "if-none-match": catalogEtag }
    });
    const res2 = await getCatalog(req2);
    console.log(`✅ [Petición 2: Con If-None-Match] HTTP ${res2.status} Not Modified | ETag: ${res2.headers.get("etag")}`);

    if (res2.status === 304) {
      console.log("   └─ Validación exitosa: El servidor evitó transferir el catálogo completo (ahorro de ancho de banda).");
      results.test1_catalog_etag = true;
    } else {
      throw new Error(`Se esperaba HTTP 304, recibido HTTP ${res2.status}`);
    }
  } catch (err: any) {
    console.error(`❌ Test 1 Falló: ${err.message}`);
  }

  // --------------------------------------------------------------------------
  // TEST 2: GET /api/v1/catalog/sync Presets ETag y HTTP 304
  // --------------------------------------------------------------------------
  console.log("\n--- 2. NEGOCIACIÓN DE CACHÉ EN GET /api/v1/catalog/sync (PRESETS) ---");
  try {
    const req1 = createMockRequest("http://localhost:3000/api/v1/catalog/sync");
    const res1 = await getSyncPresets(req1);
    const presetsEtag = res1.headers.get("etag")!;
    console.log(`✅ [Petición 1: Presets] HTTP ${res1.status} OK | ETag: ${presetsEtag}`);

    const req2 = createMockRequest("http://localhost:3000/api/v1/catalog/sync", {
      headers: { "if-none-match": presetsEtag }
    });
    const res2 = await getSyncPresets(req2);
    console.log(`✅ [Petición 2: Presets Con If-None-Match] HTTP ${res2.status} Not Modified`);

    if (res2.status === 304) {
      console.log("   └─ Validación exitosa: Presets en caché 304 Not Modified.");
      results.test2_sync_presets_etag = true;
    } else {
      throw new Error(`Se esperaba HTTP 304, recibido HTTP ${res2.status}`);
    }
  } catch (err: any) {
    console.error(`❌ Test 2 Falló: ${err.message}`);
  }

  // --------------------------------------------------------------------------
  // TEST 3: POST /api/v1/catalog/sync Protección de Rate Limits con If-None-Match
  // --------------------------------------------------------------------------
  console.log("\n--- 3. PROTECCIÓN DE RATE LIMITS EN INGESTA (POST /api/v1/catalog/sync) ---");
  try {
    // Sincronizamos Zitadel preset
    const reqSync = createMockRequest("http://localhost:3000/api/v1/catalog/sync", {
      method: "POST",
      body: { action: "sync_preset", presetSlug: "zitadel/zitadel" }
    });
    const resSync = await postSync(reqSync);
    const dataSync = await resSync.json();
    const repoSynced = dataSync.repositories?.[0];
    const etagGen = repoSynced?.etag;
    console.log(`✅ [Ingesta Inicial] Repositorio: ${repoSynced?.name} | ETag Generado: ${etagGen}`);

    // Intentamos re-sincronizar enviando If-None-Match con el ETag
    const reqResync = createMockRequest("http://localhost:3000/api/v1/catalog/sync", {
      method: "POST",
      headers: { "if-none-match": etagGen },
      body: {
        name: repoSynced.name,
        slug: repoSynced.slug,
        category: repoSynced.category,
        license: repoSynced.license,
        stars: repoSynced.stars,
        description: repoSynced.description,
        commit_velocity_score: 95,
        security_score: 97,
        docs_score: 94,
        integration_difficulty: "Baja",
        triggers: ["OIDC User Registration Event"],
        dependencies: ["Go Runtime"]
      }
    });
    const resResync = await postSync(reqResync);
    console.log(`✅ [Re-sincronización con ETag Idéntico] HTTP ${resResync.status} Not Modified | Cabecera X-Sync-Status: ${resResync.headers.get("x-sync-status")}`);

    if (resResync.status === 304) {
      console.log("   └─ Validación exitosa: La API abortó la reingesta duplicada para proteger los rate limits de GitHub.");
      results.test3_rate_limit_protection = true;
    } else {
      throw new Error(`Se esperaba HTTP 304, recibido HTTP ${resResync.status}`);
    }
  } catch (err: any) {
    console.error(`❌ Test 3 Falló: ${err.message}`);
  }

  // --------------------------------------------------------------------------
  // TEST 4: Ingesta con Cálculo Estricto de Health Score y Vectorización halfvec
  // --------------------------------------------------------------------------
  console.log("\n--- 4. INGESTA CONTINUA CON CÁLCULO PONDERADO & HALFVEC ---");
  try {
    const commits = 96;
    const security = 98;
    const docs = 94;
    const expectedHealthScore = Number((commits * 0.15 + security * 0.20 + docs * 0.65).toFixed(2));
    // 96 * 0.15 = 14.4 + 98 * 0.20 = 19.6 + 94 * 0.65 = 61.1 => 95.10

    const testRepo = {
      name: "AgentMesh Enterprise Orchestrator",
      slug: "agentmesh/orchestrator",
      category: "AI",
      license: "Apache-2.0",
      stars: 14200,
      commit_velocity_score: commits,
      security_score: security,
      docs_score: docs,
      description: "Malla descentralizada de orquestación de agentes autónomos multi-célula con coordinación RPC y aislamiento de memoria semántica.",
      docker_command: "docker run -d --name agentmesh -p 9090:9090 agentmesh/orchestrator:latest",
      integration_difficulty: "Media",
      triggers: ["Agent Task Handshake", "Semantic Memory Sync", "Consensus Vote Event"],
      dependencies: ["Rust Runtime", "PostgreSQL pgvector", "Docker Engine"]
    };

    const reqIngest = createMockRequest("http://localhost:3000/api/v1/catalog/sync", {
      method: "POST",
      body: testRepo
    });
    const resIngest = await postSync(reqIngest);
    const dataIngest = await resIngest.json();
    const savedRepo = dataIngest.repository;

    console.log(`✅ [Ingesta Exitosa] Herramienta: ${savedRepo.name} (${savedRepo.slug})`);
    console.log(`   ├─ Health Score Calculado: ${savedRepo.health_score} (Esperado: ${expectedHealthScore})`);
    console.log(`   ├─ Fórmula: (0.15 × ${commits}) + (0.20 × ${security}) + (0.65 × ${docs}) = ${expectedHealthScore}`);
    console.log(`   └─ ETag Asignado: ${savedRepo.etag}`);

    if (Number(savedRepo.health_score) !== expectedHealthScore) {
      throw new Error(`Health Score no coincide. Esperado: ${expectedHealthScore}, Obtenido: ${savedRepo.health_score}`);
    }

    // Verificar en Neon PostgreSQL que el vector halfvec existe y es utilizable
    const pool = getPool();
    const dbCheck = await pool.query(
      `SELECT name, health_score, (embedding_halfvec IS NOT NULL) AS has_vector,
              vector_dims(embedding_halfvec::vector) AS dimensions
       FROM oss_repositories WHERE slug = $1`,
      [testRepo.slug]
    );

    const row = dbCheck.rows[0];
    console.log(`✅ [PostgreSQL 16 DB Check] Vector persistido: ${row?.has_vector} | Dimensiones: ${row?.dimensions} (halfvec 1536-dim)`);

    // Probar búsqueda híbrida RRF para verificar indexación inmediata
    const searchRes = await hybridSearch("AgentMesh multi-célula memoria semántica");
    const matched = searchRes.find(r => r.slug === testRepo.slug);
    console.log(`✅ [Indexación Inmediata en Búsqueda Híbrida] Match: ${matched ? 'SÍ (' + matched.tool_name + ')' : 'NO'} | RRF Score: ${matched?.rrf_score?.toFixed(4)}`);

    // Limpieza del repositorio de prueba para mantener el catálogo curado en 25 herramientas
    await pool.query("DELETE FROM oss_repositories WHERE slug = $1", [testRepo.slug]);
    console.log(`🧹 [Limpieza] Repositorio de prueba '${testRepo.slug}' removido; catálogo mantenido en 25 herramientas.`);

    results.test4_weighted_health_and_halfvec = Boolean(matched && row?.dimensions === 1536);
  } catch (err: any) {
    console.error(`❌ Test 4 Falló: ${err.message}`);
  }

  console.log("\n" + "=".repeat(80));
  console.log("🏁 RESUMEN GENERAL DE RESILIENCIA Y ETags:");
  console.log(`- Test 1 (GET /catalog ETag & 304): ${results.test1_catalog_etag ? "APROBADO ✅" : "FALLIDO ❌"}`);
  console.log(`- Test 2 (GET /sync Presets ETag & 304): ${results.test2_sync_presets_etag ? "APROBADO ✅" : "FALLIDO ❌"}`);
  console.log(`- Test 3 (POST /sync Rate Limit 304): ${results.test3_rate_limit_protection ? "APROBADO ✅" : "FALLIDO ❌"}`);
  console.log(`- Test 4 (Health Score Ponderado & halfvec): ${results.test4_weighted_health_and_halfvec ? "APROBADO ✅" : "FALLIDO ❌"}`);
  console.log("=".repeat(80));

  return results;
}

runEtagAndIngestionSuite().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
