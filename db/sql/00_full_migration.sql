-- ==============================================================================
-- OSS Atlas (Acelerador de Integraciones Open Source)
-- Script de Migración Completa para Cloud PostgreSQL (Neon / Supabase)
-- Titularidad: EdisonPEÑA (Iotdico - https://ossatlas.iotdico.com)
-- ==============================================================================

-- 1. Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Tabla principal de repositorios
CREATE TABLE IF NOT EXISTS oss_repositories (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   TEXT NOT NULL,
  slug                   TEXT NOT NULL UNIQUE,
  category               TEXT NOT NULL,
  license                TEXT NOT NULL,
  description            TEXT NOT NULL DEFAULT '',
  content                TEXT NOT NULL DEFAULT '',
  stars                  INTEGER NOT NULL DEFAULT 0,
  health_score           NUMERIC(5,2) NOT NULL DEFAULT 0,
  commit_velocity_score  NUMERIC(5,2) NOT NULL DEFAULT 0,
  security_score         NUMERIC(5,2) NOT NULL DEFAULT 0,
  docs_score             NUMERIC(5,2) NOT NULL DEFAULT 0,
  docker_command         TEXT NOT NULL DEFAULT '',
  integration_difficulty TEXT NOT NULL DEFAULT 'Media',
  triggers               TEXT[] NOT NULL DEFAULT '{}',
  dependencies           TEXT[] NOT NULL DEFAULT '{}',
  etag                   TEXT,
  embedding              vector(1536),
  embedding_halfvec      halfvec(1536),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices relacionales
CREATE INDEX IF NOT EXISTS idx_repos_category ON oss_repositories(category);
CREATE INDEX IF NOT EXISTS idx_repos_license  ON oss_repositories(license);
CREATE INDEX IF NOT EXISTS idx_repos_health   ON oss_repositories(health_score DESC);

-- Índice HNSW con halfvec(1536) (50% menos consumo de RAM, P95 < 250ms)
CREATE INDEX IF NOT EXISTS idx_oss_repos_embedding_halfvec
  ON oss_repositories
  USING hnsw ((embedding_halfvec) halfvec_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Índice GIN para Full-Text Search con diccionario 'simple'
CREATE INDEX IF NOT EXISTS idx_repos_fts
  ON oss_repositories USING gin (to_tsvector('simple', content));

-- 3. Función de Búsqueda Híbrida RRF (Reciprocal Rank Fusion, k=60)
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

-- 4. Vista de Health Score Ponderado
CREATE OR REPLACE VIEW v_oss_repositories_health AS
SELECT id, name, slug, category, license, health_score,
       commit_velocity_score, security_score, docs_score,
       ROUND((commit_velocity_score * 0.15 + security_score * 0.20 + docs_score * 0.65)::NUMERIC, 2) AS calculated_health_score,
       stars, description, docker_command, integration_difficulty, triggers, dependencies, created_at, updated_at
FROM oss_repositories;

-- 5. Semillas iniciales B2B (13 herramientas curadas)
INSERT INTO oss_repositories (
  name, slug, category, license, stars, health_score,
  commit_velocity_score, security_score, docs_score,
  description, content, docker_command, integration_difficulty,
  triggers, dependencies
) VALUES
(
  'Supabase + pgvector (v0.7+ halfvec)',
  'supabase/postgres-pgvector',
  'DBS',
  'Apache-2.0',
  74200,
  98.0,
  99.0, 97.0, 98.0,
  'Plataforma BaaS sobre PostgreSQL con soporte nativo para índices HNSW (m=16, ef_construction=64), vectores halfvec de 16-bits que reducen 50% el uso de RAM y búsqueda léxica simple.',
  'Supabase BaaS PostgreSQL pgvector HNSW halfvec base de datos tiempo real sql relacional vector store almacenamiento embebidos',
  'docker run -d --name pgvector-hybrid -p 5432:5432 pgvector/pgvector:pg16',
  'Baja',
  ARRAY['ON INSERT row -> embedding pipeline', 'REST/GraphQL PostgREST Webhook', 'RRF Hybrid Query RPC'],
  ARRAY['PostgreSQL 16+', 'Docker Engine', 'pgvector >= 0.7.0']
),
(
  'Keycloak Enterprise IAM',
  'keycloak/keycloak',
  'AUTH',
  'Apache-2.0',
  23800,
  95.0,
  94.0, 98.0, 94.0,
  'Solución estándar de la industria para Gestión de Identidad y Acceso (IAM) auto-hospedada. Provee Single Sign-On (SSO), Federación LDAP/Active Directory y multi-tenancy B2B.',
  'Keycloak autenticacion identidad IAM SSO SAML 2.0 OAuth2 OpenID Connect OIDC LDAP usuarios tokens permisos login roles',
  'docker run -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin quay.io/keycloak/keycloak:latest start-dev',
  'Media',
  ARRAY['OIDC JWT Bearer Issuance', 'SAML 2.0 Identity Broker Event', 'Admin REST Webhook'],
  ARRAY['OpenJDK 21', 'PostgreSQL Store', 'Reverse Proxy TLS']
),
(
  'Meilisearch Engine',
  'meilisearch/meilisearch',
  'DBS',
  'MIT',
  47900,
  96.0,
  96.0, 95.0, 97.0,
  'Motor de búsqueda ultra-rápido en Rust acoplado con recuperación híbrida sub-50ms, tolerancia a errores tipográficos y filtrado facetado de SKUs.',
  'Meilisearch motor de busqueda rapido typo-tolerance full-text search indexacion instantanea rust facetado filtros skus',
  'docker run -d --name meilisearch -p 7700:7700 -v $(pwd)/meili_data:/meili_data getmeili/meilisearch:v1.10',
  'Baja',
  ARRAY['Document Chunk Ingestion Queue', 'Hybrid Semantic + Keyword Query', 'Search Index Sync'],
  ARRAY['Rust Runtime / Binary', 'Docker Engine']
),
(
  'Juspay Hyperswitch B2B Router',
  'juspay/hyperswitch',
  'PAYMENTS',
  'Apache-2.0',
  13400,
  93.0,
  92.0, 96.0, 92.0,
  'Router de pagos open source de alto rendimiento escrito en Rust. Orquestación multi-procesador (Stripe, Adyen, PayPal), bóveda PCI-DSS y ruteo inteligente.',
  'Hyperswitch pasarela de pagos router pagos rust stripe adyen paypal pci dss orquestacion transacciones checkout',
  'docker run -d --name hyperswitch -p 8080:8080 juspay/hyperswitch-router:latest',
  'Media',
  ARRAY['Payment Intent Confirmation Webhook', 'PCI-DSS Token Vault Sync', 'Dispute Dispute Webhook'],
  ARRAY['Rust 1.75+', 'PostgreSQL / Redis']
),
(
  'vLLM High-Throughput Inference',
  'vllm-project/vllm',
  'AI',
  'Apache-2.0',
  31200,
  94.0,
  98.0, 91.0, 94.0,
  'Biblioteca líder para inferencia y servicio de LLMs con PagedAttention, logrando 24x mayor throughput que HuggingFace Transformers.',
  'vLLM inferencia LLM paged attention huggingface gpu serving modelos throughput serving servidor openai compatible',
  'docker run --gpus all -p 8000:8000 vllm/vllm-openai:latest --model meta-llama/Llama-3-8B',
  'Alta',
  ARRAY['OpenAI Compatible Stream Request', 'PagedAttention Memory Allocation', 'Continuous Batching Scheduler'],
  ARRAY['NVIDIA CUDA 12.1+', 'Python 3.10+']
),
(
  'PostgreSQL Relational Core',
  'postgres/postgres',
  'DBS',
  'PostgreSQL',
  16500,
  99.0,
  98.0, 99.0, 100.0,
  'El motor de base de datos relacional de código abierto más avanzado del mundo. Soporte ACID estricto, extensiones nativas y concurrencia MVCC probada.',
  'PostgreSQL base de datos relacional sql acid transacciones extensiones mvcc postgres db core enterprise',
  'docker run -d --name postgres-core -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16-alpine',
  'Baja',
  ARRAY['Write-Ahead Log (WAL) Replication', 'Foreign Data Wrapper (FDW) Query', 'ACID Transaction Commit'],
  ARRAY['C Runtime', 'Linux / POSIX Kernel']
),
(
  'Authentik Modern Identity Provider',
  'goauthentik/authentik',
  'AUTH',
  'GPL-3.0',
  16800,
  93.0,
  93.0, 95.0, 92.0,
  'Proveedor de identidad de código abierto centrado en flexibilidad y versatilidad. Soporta flujos de autenticación personalizables, Proxy de autenticación y User Self-Service.',
  'Authentik identidad SSO autenticacion proxy flujos MFA oauth2 openid connect ldap python go',
  'docker compose -f docker-compose.yml up -d',
  'Media',
  ARRAY['Outpost Forward Auth Handshake', 'User Enrollment Stage Pipeline', 'SAML Assertion Consumer'],
  ARRAY['Python 3.12+', 'Go Outpost', 'PostgreSQL / Redis']
),
(
  'LlamaIndex Data Framework for LLMs',
  'run-llama/llama_index',
  'AI',
  'MIT',
  37500,
  95.0,
  97.0, 93.0, 95.0,
  'Framework de datos para conectar fuentes estructuradas y no estructuradas a modelos LLM para recuperación precisa de contexto.',
  'LlamaIndex RAG indexacion busqueda vectorial chunking conectores de datos LLM recuperacion de contexto semantic search',
  'docker run -d --name llamaindex-api -p 8001:8001 llamaindex/llama-index:latest',
  'Media',
  ARRAY['Data Ingestion & Indexing', 'Semantic Search Query', 'RAG Pipeline Query'],
  ARRAY['Python 3.10+', 'Vector Store']
),
(
  'Ory Kratos Identity',
  'ory/kratos',
  'AUTH',
  'Apache-2.0',
  10800,
  92.0,
  90.0, 96.0, 91.0,
  'Servidor de identidad headless que implementa flujos de registro, login, MFA y recuperación con filosofía Zero-Trust.',
  'Ory Kratos identidad headless zero-trust autenticacion MFA WebAuthn passkeys seguridad auth cuentas',
  'docker run -d --name kratos -p 4433:4433 oryd/kratos:latest',
  'Alta',
  ARRAY['Self-service Registration Flow', 'MFA WebAuthn Verification', 'Session Token Validation'],
  ARRAY['Go Runtime / Docker', 'PostgreSQL / CockroachDB']
),
(
  'Kill Bill Open Source Billing',
  'killbill/killbill',
  'PAYMENTS',
  'Apache-2.0',
  5400,
  90.0,
  88.0, 93.0, 90.0,
  'Plataforma empresarial de facturación y gestión de suscripciones recurrentes con integraciones a múltiples procesadores bancarios.',
  'Kill Bill facturacion recurrente suscripciones pasarela de pagos pagos b2b contabilidad facturas cobros recurrentes',
  'docker run -d --name killbill -p 8080:8080 killbill/killbill:latest',
  'Alta',
  ARRAY['Subscription State Machine', 'Recurring Payment Batch', 'Invoice PDF Rendering'],
  ARRAY['Java 11+', 'MySQL / PostgreSQL', 'ActiveMQ']
),
(
  'Zitadel Cloud-Native IAM',
  'zitadel/zitadel',
  'AUTH',
  'Apache-2.0',
  18500,
  95.2,
  95.0, 97.0, 94.0,
  'Plataforma de gestión de identidades y accesos cloud-native escrita en Go. Soporta OAuth2/OIDC, auditoría de eventos y multi-tenancy nativo B2B.',
  'Zitadel autenticacion identidad IAM SSO OIDC OAuth2 Go multi-tenant auditoria eventos seguridad usuarios login passkeys',
  'docker run -d --name zitadel -p 8080:8080 ghcr.io/zitadel/zitadel:latest start-from-init',
  'Baja',
  ARRAY['OIDC User Registration Event', 'Session Token Verification', 'Organization Tenant Provisioning'],
  ARRAY['Go Runtime', 'PostgreSQL / CockroachDB', 'Docker Engine']
),
(
  'Qdrant Vector Database',
  'qdrant/qdrant',
  'DBS',
  'Apache-2.0',
  21400,
  96.4,
  98.0, 96.0, 96.0,
  'Motor de búsqueda vectorial y base de datos con API REST/gRPC escrito en Rust. Soporta filtrado de cargas útiles, cuantización escalar y clustering distribuido.',
  'Qdrant vector database motor vectorial embeddings busqueda semantica rust hnsw grpc payload filtering',
  'docker run -d --name qdrant -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest',
  'Baja',
  ARRAY['Vector Search Query', 'Point Ingestion Batch', 'Collection Snapshot Event'],
  ARRAY['Rust Runtime', 'Docker Engine']
),
(
  'Casbin Authorization Engine',
  'casbin/casbin',
  'AUTH',
  'Apache-2.0',
  17900,
  94.8,
  94.0, 95.0, 95.0,
  'Biblioteca de control de acceso eficiente y potente que soporta modelos de autorización como ACL, RBAC, ABAC y RESTful routing multi-lenguaje.',
  'Casbin autorizacion permisos RBAC ABAC ACL control de acceso politicas roles tokens middleware golang',
  'go get github.com/casbin/casbin/v2',
  'Baja',
  ARRAY['Enforce Permission Check', 'Role Policy Mutation', 'Tenant Context Enforcement'],
  ARRAY['Go / Node.js / Python / Rust', 'SQL Storage Adapter']
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  license = EXCLUDED.license,
  stars = EXCLUDED.stars,
  health_score = EXCLUDED.health_score,
  commit_velocity_score = EXCLUDED.commit_velocity_score,
  security_score = EXCLUDED.security_score,
  docs_score = EXCLUDED.docs_score,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  docker_command = EXCLUDED.docker_command,
  integration_difficulty = EXCLUDED.integration_difficulty,
  triggers = EXCLUDED.triggers,
  dependencies = EXCLUDED.dependencies,
  updated_at = now();
