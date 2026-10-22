# Base de datos — PostgreSQL 16 + pgvector 0.7+

- `sql/01_extensions.sql` → `vector`, `pg_trgm`
- `sql/02_schema.sql` → `oss_repositories` (metadatos atómicos)
- `sql/03_indexes_hnsw.sql` → HNSW `halfvec(1536)`, `m=16`, `ef_construction=64` + GIN FTS `'simple'`
- `sql/04_hybrid_search_rrf.sql` → búsqueda híbrida RRF `k=60`
- `sql/05_health_score.sql` → Health Score ponderado
- `migrations/` → migraciones versionadas (Alembic) · `seeds/` → catálogo inicial (122 repos)
