-- Búsqueda Híbrida RRF (k=60).
-- Función reutilizable en PostgreSQL que combina FTS 'simple' y distancia coseno en embedding_halfvec.
CREATE OR REPLACE FUNCTION hybrid_search_rrf(
  query_text TEXT,
  query_embedding halfvec(1536) DEFAULT NULL,
  match_limit INT DEFAULT 10
)
RETURNS TABLE (
  repo_id UUID,
  tool_name TEXT,
  license TEXT,
  health_score NUMERIC(5,2),
  rrf_score DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
  WITH fts_ranked AS (
    SELECT id, name, license, health_score,
           ROW_NUMBER() OVER (ORDER BY ts_rank_cd(to_tsvector('simple', content), plainto_tsquery('simple', query_text)) DESC) AS r_lex
    FROM oss_repositories
    WHERE to_tsvector('simple', content) @@ plainto_tsquery('simple', query_text)
    LIMIT 20
  ),
  vec_ranked AS (
    SELECT id, name, license, health_score,
           ROW_NUMBER() OVER (ORDER BY embedding_halfvec <=> query_embedding) AS r_vec
    FROM oss_repositories
    WHERE query_embedding IS NOT NULL AND embedding_halfvec IS NOT NULL
    ORDER BY embedding_halfvec <=> query_embedding
    LIMIT 20
  )
  SELECT COALESCE(f.id, v.id) AS repo_id,
         COALESCE(f.name, v.name) AS tool_name,
         COALESCE(f.license, v.license) AS license,
         COALESCE(f.health_score, v.health_score) AS health_score,
         (COALESCE(1.0 / (60 + f.r_lex), 0.0) + COALESCE(1.0 / (60 + v.r_vec), 0.0))::DOUBLE PRECISION AS rrf_score
  FROM fts_ranked f
  FULL OUTER JOIN vec_ranked v ON f.id = v.id
  ORDER BY rrf_score DESC
  LIMIT match_limit;
$$;
