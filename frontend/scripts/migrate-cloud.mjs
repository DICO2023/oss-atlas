/**
 * Script de Migración y Sembrado Automático para Base de Datos Cloud (Neon / Supabase)
 * OSS Atlas - EdisonPEÑA (Iotdico)
 *
 * Uso:
 *   node scripts/migrate-cloud.mjs "postgresql://user:pass@host/db?sslmode=require"
 *   o teniendo DATABASE_URL en frontend/.env.local
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

// 1. Obtener la cadena de conexión del argumento o de .env.local
let connectionString = process.argv[2];

if (!connectionString) {
  try {
    const envPath = resolve(__dirname, "../.env.local");
    const envContent = readFileSync(envPath, "utf-8");
    const match = envContent.match(/^DATABASE_URL=(.+)$/m);
    if (match) {
      connectionString = match[1].trim();
    }
  } catch {
    // ignorar
  }
}

if (!connectionString) {
  console.error("❌ Error: No se proporcionó DATABASE_URL como argumento ni en .env.local.");
  console.log("Uso: node scripts/migrate-cloud.mjs \"postgresql://...\"");
  process.exit(1);
}

console.log("🚀 Iniciando migración a base de datos Cloud...");
console.log(`🔗 Target: ${connectionString.replace(/:[^:@]+@/, ":****@")}`);

const isCloud =
  connectionString.includes("neon.tech") ||
  connectionString.includes("supabase.co") ||
  connectionString.includes("sslmode=require") ||
  connectionString.includes("aws.");

const pool = new Pool({
  connectionString,
  ssl: isCloud ? { rejectUnauthorized: false } : undefined,
});

// Deterministic embedding generator (idéntico a lib/server/embedding.ts)
function generateDeterministicEmbedding(text, dimensions = 1536) {
  const vec = new Float64Array(dimensions);
  const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const STOPWORDS = new Set([
    "a", "al", "ante", "bajo", "cabe", "con", "contra", "de", "del", "desde", "durante", "en",
    "entre", "hacia", "hasta", "mediante", "para", "por", "segun", "sin", "so", "sobre", "tras",
    "el", "la", "los", "las", "un", "una", "unos", "unas", "lo", "le", "les", "me", "te", "se",
    "nos", "os", "mi", "tu", "su", "mis", "tus", "sus", "y", "e", "ni", "o", "u", "pero", "mas",
    "que", "como", "donde", "cuando", "quien", "cual", "cuyo", "este", "esta", "estos", "estas",
    "the", "and", "or", "in", "on", "at", "to", "for", "of", "with", "by", "an", "is"
  ]);

  const words = normalized.split(/[^a-z0-9_-]+/).filter((w) => w.length >= 2 && !STOPWORDS.has(w));
  if (words.length === 0) {
    vec[0] = 1.0;
    return Array.from(vec);
  }

  const CONCEPT_OFFSETS = {
    auth: 0, autenticacion: 0, login: 10, sso: 20, saml: 30, oidc: 40, oauth: 50,
    jwt: 60, token: 70, passwordless: 80, kratos: 90, keycloak: 100,
    identidad: 120, credencial: 130, sesiones: 140, rbac: 150, mfa: 160,
    db: 384, database: 384, postgres: 394, postgresql: 394, supabase: 404,
    pgvector: 414, hnsw: 424, vector: 434, search: 444, busqueda: 444,
    meilisearch: 454, sql: 464, relacional: 474, fts: 484,
    payment: 768, payments: 768, pago: 768, pagos: 768, billing: 778, facturacion: 778,
    hyperswitch: 788, stripe: 798, paypal: 808, transaccion: 818,
    ai: 1152, ia: 1152, rag: 1162, llm: 1172, langchain: 1182, llamaindex: 1192,
    embedding: 1202, embeddings: 1202, agente: 1212
  };

  for (const word of words) {
    for (const [key, offset] of Object.entries(CONCEPT_OFFSETS)) {
      if (word.includes(key) || key.includes(word)) {
        for (let i = 0; i < 30; i++) {
          const idx = (offset + i) % dimensions;
          vec[idx] += 3.0 / (1 + i * 0.1);
        }
      }
    }

    let h1 = 0xdeadbeef;
    let h2 = 0x41c64e6d;
    for (let i = 0; i < word.length; i++) {
      const code = word.charCodeAt(i);
      h1 = Math.imul(h1 ^ code, 2654435761);
      h2 = Math.imul(h2 ^ code, 1597334677);
    }
    const pos = Math.abs(h1) % dimensions;
    const sign = h2 % 2 === 0 ? 1.0 : -1.0;
    vec[pos] += sign * 1.5;

    const pos2 = Math.abs(h2) % dimensions;
    vec[pos2] += (h1 % 2 === 0 ? 1.0 : -1.0) * 1.0;
  }

  let sumSq = 0;
  for (let i = 0; i < dimensions; i++) sumSq += vec[i] * vec[i];
  const norm = Math.sqrt(sumSq) || 1.0;
  const result = new Array(dimensions);
  for (let i = 0; i < dimensions; i++) {
    result[i] = Number((vec[i] / norm).toFixed(4));
  }
  return result;
}

async function run() {
  try {
    console.log("📦 1. Verificando conexión y extensiones...");
    await pool.query("SELECT 1");
    console.log("   ✅ Conexión con PostgreSQL establecida.");

    console.log("📄 2. Leyendo y ejecutando 00_full_migration.sql...");
    const sqlPath = resolve(__dirname, "../../db/sql/00_full_migration.sql");
    const migrationSql = readFileSync(sqlPath, "utf-8");
    await pool.query(migrationSql);
    console.log("   ✅ Tablas, índices HNSW, vistas y semillas ejecutadas.");

    console.log("🧠 3. Calculando embeddings vectoriales halfvec(1536)...");
    const { rows } = await pool.query("SELECT id, name, category, description, content FROM oss_repositories");
    console.log(`   Se encontraron ${rows.length} herramientas en el catálogo.`);

    for (const repo of rows) {
      const textToEmbed = `${repo.name} ${repo.category} ${repo.description} ${repo.content}`;
      const embedding = generateDeterministicEmbedding(textToEmbed);
      const vectorLiteral = `[${embedding.join(",")}]`;

      await pool.query(
        `UPDATE oss_repositories
         SET embedding_halfvec = $1::halfvec
         WHERE id = $2`,
        [vectorLiteral, repo.id]
      );
      process.stdout.write(`   ✓ Vector semántico asignado a: ${repo.name}\n`);
    }

    console.log("\n🔍 4. Probando motor de búsqueda híbrida RRF...");
    const testQuery = "autenticacion sso jwt b2b";
    const testVec = `[${generateDeterministicEmbedding(testQuery).join(",")}]`;
    const searchRes = await pool.query(
      `SELECT tool_name, license, health_score, rrf_score
       FROM hybrid_search_rrf($1, $2::halfvec, 3)`,
      [testQuery, testVec]
    );

    console.log("   Top 3 resultados de búsqueda híbrida RRF:");
    console.table(searchRes.rows);

    console.log("🎉 ¡MIGRACIÓN CLOUD COMPLETADA CON ÉXITO AL 100%!");
  } catch (err) {
    console.error("❌ Error durante la migración cloud:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
