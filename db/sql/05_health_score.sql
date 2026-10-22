-- Vista con cálculo de Health Score ponderado (Fase 2).
CREATE OR REPLACE VIEW v_oss_repositories_health AS
SELECT id, name, slug, category, license, health_score,
       commit_velocity_score, security_score, docs_score,
       ROUND((commit_velocity_score * 0.15 + security_score * 0.20 + docs_score * 0.65)::NUMERIC, 2) AS calculated_health_score,
       stars, description, docker_command, integration_difficulty, triggers, dependencies, created_at, updated_at
FROM oss_repositories;

