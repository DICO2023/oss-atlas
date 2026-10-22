/**
 * Búsqueda híbrida RRF (k=60). Misma consulta que db/sql/04_hybrid_search_rrf.sql:
 * rama FTS con diccionario 'simple' + rama vectorial HNSW halfvec.
 * Si no se provee embedding, se ejecuta solo la rama léxica (RRF parcial).
 */
import { getPool } from "./db";
import { generateDeterministicEmbedding } from "./embedding";
import type { HybridSearchResult } from "../types";

export const RRF_K = 60;

const STOPWORDS = new Set([
  "a", "al", "ante", "bajo", "cabe", "con", "contra", "de", "del", "desde", "durante", "en",
  "entre", "hacia", "hasta", "mediante", "para", "por", "segun", "sin", "so", "sobre", "tras",
  "el", "la", "los", "las", "un", "una", "unos", "unas", "lo", "le", "les", "me", "te", "se",
  "nos", "os", "mi", "tu", "su", "mis", "tus", "sus", "y", "e", "ni", "o", "u", "pero", "mas",
  "que", "como", "donde", "cuando", "quien", "cual", "cuyo", "este", "esta", "estos", "estas",
  "ese", "esa", "esos", "esas", "aquel", "aquella", "aquellos", "aquellas", "sistema", "sistemas",
  "plataforma", "plataformas", "necesito", "quiero", "disenar", "crear", "implementar",
  "the", "and", "or", "in", "on", "at", "to", "for", "of", "with", "by", "an", "is"
]);

export function buildFtsQuery(rawQuery: string): string {
  const normalized = rawQuery
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ");

  const terms = normalized
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));

  if (terms.length === 0) {
    return "open | source";
  }

  return terms.join(" | ");
}

export async function hybridSearch(
  query: string,
  embedding?: number[],
  k: number = 60
): Promise<HybridSearchResult[]> {
  const pool = getPool();
  const vector = embedding && embedding.length === 1536 
    ? embedding 
    : generateDeterministicEmbedding(query, 1536);

  const vectorStr = `[${vector.join(",")}]`;
  const ftsQuery = buildFtsQuery(query);

  const sql = `
    WITH fts_ranked AS (
      SELECT id,
             ROW_NUMBER() OVER (
               ORDER BY ts_rank_cd(
                 to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, '')),
                 to_tsquery('simple', $1)
               ) DESC
             ) AS r_lex
      FROM oss_repositories
      WHERE to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, '')) @@ to_tsquery('simple', $1)
      LIMIT 20
    ),
    vec_ranked AS (
      SELECT id,
             ROW_NUMBER() OVER (ORDER BY embedding_halfvec <=> $2::halfvec(1536)) AS r_vec
      FROM oss_repositories
      WHERE embedding_halfvec IS NOT NULL
      ORDER BY embedding_halfvec <=> $2::halfvec(1536)
      LIMIT 20
    )
    SELECT r.id AS repo_id,
           r.name AS tool_name,
           r.slug,
           r.category,
           r.license,
           r.health_score,
           r.commit_velocity_score,
           r.security_score,
           r.docs_score,
           r.stars,
           r.description,
           r.docker_command,
           r.integration_difficulty,
           r.triggers,
           r.dependencies,
           r.etag,
           f.r_lex::int AS lexical_rank,
           v.r_vec::int AS vector_rank,
           (COALESCE(1.0 / ($3 + f.r_lex), 0.0) + COALESCE(1.0 / ($3 + v.r_vec), 0.0))::float8 AS rrf_score
    FROM fts_ranked f
    FULL OUTER JOIN vec_ranked v ON f.id = v.id
    JOIN oss_repositories r ON r.id = COALESCE(f.id, v.id)
    ORDER BY rrf_score DESC
    LIMIT 10;
  `;

  const { rows } = await pool.query(sql, [ftsQuery, vectorStr, k]);
  return rows as HybridSearchResult[];
}
