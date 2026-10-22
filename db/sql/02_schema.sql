-- Fase 1: esquema relacional con metadatos atómicos (sin conglomerados JSON).
CREATE TABLE IF NOT EXISTS oss_repositories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,          -- ej. 'keycloak/keycloak'
  category      TEXT NOT NULL,                 -- AUTH | DBS | PAYMENTS | AI
  license       TEXT NOT NULL,                 -- MIT | Apache-2.0 | PostgreSQL | BSL-1.1
  description   TEXT NOT NULL DEFAULT '',
  content       TEXT NOT NULL DEFAULT '',      -- texto indexable (FTS)
  stars         INTEGER NOT NULL DEFAULT 0,
  health_score  NUMERIC(5,2) NOT NULL DEFAULT 0,
  commit_velocity_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  security_score        NUMERIC(5,2) NOT NULL DEFAULT 0,
  docs_score            NUMERIC(5,2) NOT NULL DEFAULT 0,
  docker_command TEXT NOT NULL DEFAULT '',
  integration_difficulty TEXT NOT NULL DEFAULT 'Media', -- Baja | Media | Alta
  triggers      TEXT[] NOT NULL DEFAULT '{}',
  dependencies  TEXT[] NOT NULL DEFAULT '{}',
  etag          TEXT,
  embedding     vector(1536),                  -- se migra a halfvec(1536) en 03
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_repos_category ON oss_repositories(category);
CREATE INDEX IF NOT EXISTS idx_repos_license  ON oss_repositories(license);
CREATE INDEX IF NOT EXISTS idx_repos_health   ON oss_repositories(health_score DESC);
