import pg from "pg";
import { generateDeterministicEmbedding } from "../lib/server/embedding.ts";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/acelerador";
const pool = new Pool({ connectionString });

async function main() {
  console.log("Conectando a PostgreSQL...");
  const { rows } = await pool.query("SELECT id, name, description, content FROM oss_repositories;");
  console.log(`Calculando y guardando embeddings para ${rows.length} herramientas...`);

  for (const row of rows) {
    const textToIndex = `${row.name} ${row.description} ${row.content}`;
    const embedding = generateDeterministicEmbedding(textToIndex, 1536);
    const vectorStr = `[${embedding.join(",")}]`;
    await pool.query(
      "UPDATE oss_repositories SET embedding_halfvec = $1::halfvec(1536) WHERE id = $2;",
      [vectorStr, row.id]
    );
    console.log(`✓ Vector halfvec(1536) guardado para: ${row.name}`);
  }

  const { rows: verify } = await pool.query(
    "SELECT COUNT(*)::int as populated FROM oss_repositories WHERE embedding_halfvec IS NOT NULL;"
  );
  console.log(`Total herramientas con embedding_halfvec activo: ${verify[0].populated}`);
  await pool.end();
}

main().catch((err) => {
  console.error("Error poblando embeddings:", err);
  process.exit(1);
});
