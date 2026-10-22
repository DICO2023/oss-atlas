-- Fase 3: índice HNSW halfvec (Riesgo R5: 50% menos RAM, P95 < 250ms).
-- pgvector 0.7+: halfvec(1536)
ALTER TABLE oss_repositories
  ADD COLUMN IF NOT EXISTS embedding_halfvec halfvec(1536);
CREATE INDEX IF NOT EXISTS idx_oss_repos_embedding_halfvec
  ON oss_repositories
  USING hnsw ((embedding_halfvec) halfvec_cosine_ops)
  WITH (m = 16, ef_construction = 64);
-- FTS con diccionario 'simple' (Riesgo R4: sin stemming Snowball).
CREATE INDEX IF NOT EXISTS idx_repos_fts
  ON oss_repositories USING gin (to_tsvector('simple', content));
