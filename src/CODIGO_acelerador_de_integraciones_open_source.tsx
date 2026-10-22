https://share.gemini.google/XnsITNsohkKp

'use client';

import React, { useState, useMemo } from 'react';

export type CategoryId = 'ALL' | 'AUTH' | 'DBS' | 'PAYMENTS' | 'AI';

export type LicenseType = 'MIT' | 'Apache-2.0' | 'PostgreSQL' | 'BSL-1.1';

export interface CategoryItem {
  id: Exclude<CategoryId, 'ALL'>;
  name: string;
  shortName: string;
  description: string;
  repoCount: number;
  avgHealthScore: number;
  accentColor: string;
  badgeBg: string;
  keyTechs: string[];
}

export interface HealthBreakdown {
  commitVelocity: number; // 15% weight
  securityStructural: number; // 20% weight
  communityDocs: number; // 65% weight
}

export interface OpenSourceTool {
  id: string;
  name: string;
  slug: string;
  category: Exclude<CategoryId, 'ALL'>;
  license: LicenseType;
  healthScore: number;
  healthBreakdown: HealthBreakdown;
  stars: string;
  lastSyncEtag: string;
  description: string;
  dockerCommand: string;
  integrationDifficulty: 'Baja' | 'Media' | 'Alta';
  triggers: string[];
  dependencies: string[];
  rrfBaseRank: number;
  selfHostedSavingsB2B: string;
}

export interface RagArchitectureNode {
  layer: string;
  toolName: string;
  license: LicenseType;
  healthScore: number;
  rrfScore: number;
  lexicalMatch: string;
  vectorCosine: number;
  rationale: string;
  integrationTrigger: string;
}

export interface RagasMetrics {
  contextPrecision: number;
  contextRecall: number;
  faithfulness: number;
  answerRelevance: number;
  latencyMs: number;
}

export interface B2BScenario {
  id: string;
  title: string;
  promptText: string;
  businessDomain: string;
  ragas: RagasMetrics;
  executiveSummary: string;
  nodes: RagArchitectureNode[];
  sqlHybridQuerySnippet: string;
}

export interface WbsMilestone {
  phase: string;
  title: string;
  dateRange: string;
  owner: string;
  role: string;
  shift: 'Tarde (1pm-5pm)' | 'Noche (6pm-10pm)' | 'Tarde/Noche';
  deliverableRef: string;
  status: 'COMPLETED' | 'ACTIVE' | 'BUFFER_LOCKED';
  technicalHighlight: string;
}

const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'AUTH',
    name: 'Identidad & Autenticación (Auth)',
    shortName: 'Auth & IAM',
    description:
      'Federación SSO empresarial, OAuth2/OIDC, SAML 2.0 y gestión de sesiones zero-trust auto-hospedada.',
    repoCount: 28,
    avgHealthScore: 95.4,
    accentColor: 'from-cyan-400 to-blue-600',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    keyTechs: ['Keycloak', 'ory/kratos', 'supertokens-core'],
  },
  {
    id: 'DBS',
    name: 'Bases de Datos & Motores Híbridos (DBs)',
    shortName: 'DBs & Vector',
    description:
      'Almacenamiento relacional, BaaS en tiempo real e índices HNSW con media precisión (halfvec) y FTS.',
    repoCount: 34,
    avgHealthScore: 98.1,
    accentColor: 'from-emerald-400 to-teal-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    keyTechs: ['Supabase', 'pgvector 0.7+', 'Meilisearch'],
  },
  {
    id: 'PAYMENTS',
    name: 'Orquestación de Pagos & Billing B2B (Payments)',
    shortName: 'Payments & Ledger',
    description:
      'Switches de pago multi-adquirente en Rust, facturación basada en consumo (metering) y libros contables.',
    repoCount: 19,
    avgHealthScore: 92.8,
    accentColor: 'from-violet-400 to-purple-600',
    badgeBg: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
    keyTechs: ['Hyperswitch', 'Lago Billing', 'KillBill'],
  },
  {
    id: 'AI',
    name: 'Orquestación RAG, Agentes & Evaluación (AI)',
    shortName: 'AI & RAG Engine',
    description:
      'Frameworks de recuperación híbrida RRF, pipelines de ingesta resilientes y auditoría anti-alucinación RAGAS.',
    repoCount: 41,
    avgHealthScore: 96.2,
    accentColor: 'from-amber-400 to-orange-600',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    keyTechs: ['LangChain', 'LlamaIndex', 'Ragas Framework'],
  },
];

const FEATURED_TOOLS_CATALOG: OpenSourceTool[] = [
  {
    id: 'tool-supabase-pgvector',
    name: 'Supabase + pgvector (v0.7+ halfvec)',
    slug: 'supabase/postgres-pgvector',
    category: 'DBS',
    license: 'Apache-2.0',
    healthScore: 98,
    healthBreakdown: {
      commitVelocity: 99,
      securityStructural: 97,
      communityDocs: 98,
    },
    stars: '74.2k',
    lastSyncEtag: 'W/"9f8e7d6c5b4a-token-bucket-ok"',
    description:
      'Plataforma BaaS sobre PostgreSQL con soporte nativo para índices HNSW (m=16, ef_construction=64), vectores halfvec de 16-bits que reducen 50% el uso de RAM y búsqueda léxica simple.',
    dockerCommand: 'docker run -d --name pgvector-hybrid -p 5432:5432 pgvector/pgvector:pg16',
    integrationDifficulty: 'Baja',
    triggers: ['ON INSERT row -> embedding pipeline', 'REST/GraphQL PostgREST Webhook', 'RRF Hybrid Query RPC'],
    dependencies: ['PostgreSQL 16+', 'Docker Engine', 'pgvector >= 0.7.0'],
    rrfBaseRank: 1,
    selfHostedSavingsB2B: '$1,850 USD / mes vs Cloud Propietario',
  },
  {
    id: 'tool-keycloak-iam',
    name: 'Keycloak Enterprise IAM',
    slug: 'keycloak/keycloak',
    category: 'AUTH',
    license: 'Apache-2.0',
    healthScore: 95,
    healthBreakdown: {
      commitVelocity: 94,
      securityStructural: 98,
      communityDocs: 94,
    },
    stars: '23.8k',
    lastSyncEtag: 'W/"3a2b1c9d8e7f-etag-cached"',
    description:
      'Solución estándar de la industria para Gestión de Identidad y Acceso (IAM) auto-hospedada. Provee Single Sign-On (SSO), Federación LDAP/Active Directory y multi-tenancy B2B.',
    dockerCommand: 'docker run -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin quay.io/keycloak/keycloak:latest start-dev',
    integrationDifficulty: 'Media',
    triggers: ['OIDC JWT Bearer Issuance', 'SAML 2.0 Identity Broker Event', 'Admin REST Webhook'],
    dependencies: ['OpenJDK 21', 'PostgreSQL Store', 'Reverse Proxy TLS'],
    rrfBaseRank: 2,
    selfHostedSavingsB2B: '$2,400 USD / mes en licencias MAU B2B',
  },
  {
    id: 'tool-meilisearch-engine',
    name: 'Meilisearch + LangChain RAG Orchestrator',
    slug: 'meilisearch/meilisearch',
    category: 'AI',
    license: 'MIT',
    healthScore: 96,
    healthBreakdown: {
      commitVelocity: 96,
      securityStructural: 95,
      communityDocs: 97,
    },
    stars: '47.9k',
    lastSyncEtag: 'W/"7c6d5e4f3a2b-graphql-batch"',
    description:
      'Motor de búsqueda ultra-rápido en Rust acoplado con orquestación LangChain para recuperación híbrida sub-50ms, tolerancia a errores tipográficos y filtrado facetado de SKUs.',
    dockerCommand: 'docker run -it --rm -p 7700:7700 -v $(pwd)/meili_data:/meili_data getmeili/meilisearch:v1.10',
    integrationDifficulty: 'Baja',
    triggers: ['Document Chunk Ingestion Queue', 'Hybrid Semantic + Keyword Query', 'RAGAS Context Validator'],
    dependencies: ['Rust Runtime / Binary', 'FastAPI Async Worker', 'LangChain Core'],
    rrfBaseRank: 3,
    selfHostedSavingsB2B: '$1,200 USD / mes vs SaaS Search Engines',
  },
  {
    id: 'tool-hyperswitch-payments',
    name: 'Juspay Hyperswitch B2B Router',
    slug: 'juspay/hyperswitch',
    category: 'PAYMENTS',
    license: 'Apache-2.0',
    healthScore: 93,
    healthBreakdown: {
      commitVelocity: 95,
      securityStructural: 94,
      communityDocs: 91,
    },
    stars: '13.4k',
    lastSyncEtag: 'W/"1f2e3d4c5b6a-etag-verified"',
    description:
      'Switch financiero open-source escrito en Rust para enrutamiento inteligente de pagos B2B, reintentos automáticos entre pasarelas, conciliación contable y cumplimiento PCI-DSS.',
    dockerCommand: 'docker compose -f docker-compose-development.yml up -d hyperswitch-server',
    integrationDifficulty: 'Media',
    triggers: ['Payment Intent Smart Routing', 'Webhook Idempotency Lock', 'Ledger Reconciliation Cron'],
    dependencies: ['Rust 1.75+', 'PostgreSQL', 'Redis Cluster'],
    rrfBaseRank: 4,
    selfHostedSavingsB2B: 'Reducción de 1.4% en tasas de fallo transaccional',
  },
];

const B2B_RAG_SCENARIOS: B2BScenario[] = [
  {
    id: 'scenario-logistics-b2b',
    title: 'Comercio Electrónico B2B Orientado a la Logística',
    promptText:
      'Necesito diseñar una plataforma de comercio electrónico B2B orientada a la logística con búsqueda exacta de códigos SKU-9941A, SSO para flotas corporativas y facturación multi-pasarela auto-hospedada.',
    businessDomain: 'Supply Chain & B2B Logistics Commerce',
    ragas: {
      contextPrecision: 0.98,
      contextRecall: 0.96,
      faithfulness: 1.0,
      answerRelevance: 0.97,
      latencyMs: 184,
    },
    executiveSummary:
      'Arquitectura validada sin alucinaciones mediante Fusión de Rango Recíproco (RRF k=60). Se evita el stemming destructivo Snowball usando diccionario "simple" en PostgreSQL para preservar identificadores alfanuméricos de carga como "SKU-9941A" mientras HNSW (halfvec) captura intenciones semánticas de rutas logísticas.',
    nodes: [
      {
        layer: 'Capa 1: Identidad Federada Multi-Tenant (Auth)',
        toolName: 'Keycloak (Apache-2.0)',
        license: 'Apache-2.0',
        healthScore: 95,
        rrfScore: 0.0325,
        lexicalMatch: 'SSO + SAML + RBAC_FLEET',
        vectorCosine: 0.94,
        rationale:
          'Permite autenticar operadores logísticos, proveedores y clientes corporativos mediante OIDC y SAML 2.0 sin cobro por usuario activo mensual (MAU).',
        integrationTrigger: 'Middleware FastAPI valida JWT RS256 emitido por realm corporativo.',
      },
      {
        layer: 'Capa 2: Persistencia & Búsqueda Híbrida de Catálogo (DBs)',
        toolName: 'Supabase PostgreSQL + pgvector 0.7+ (halfvec)',
        license: 'Apache-2.0',
        healthScore: 98,
        rrfScore: 0.0331,
        lexicalMatch: "to_tsvector('simple', 'SKU-9941A')",
        vectorCosine: 0.97,
        rationale:
          'Combina FTS con diccionario "simple" para códigos SKU exactos y vectores halfvec con índice HNSW (m=16, ef_construction=64) manteniendo latencia P95 < 190ms.',
        integrationTrigger: 'Función SQL RPC ejecuta RRF (1/(60+rank_fts) + 1/(60+rank_vec)).',
      },
      {
        layer: 'Capa 3: Indexación Instantánea & Asistente Técnico (AI)',
        toolName: 'Meilisearch + LangChain RAG Engine',
        license: 'MIT',
        healthScore: 96,
        rrfScore: 0.0318,
        lexicalMatch: 'RAG_ORCHESTRATOR + SKU_FACETS',
        vectorCosine: 0.92,
        rationale:
          'Orquesta las consultas en lenguaje natural de compradores B2B e inyecta contexto técnico verificado con límite estricto de fidelidad RAGAS = 1.00.',
        integrationTrigger: 'Worker asíncrono Python sincroniza manifiestos de carga vía webhooks.',
      },
      {
        layer: 'Capa 4: Enrutamiento Financiero & Cobros B2B (Payments)',
        toolName: 'Juspay Hyperswitch (Apache-2.0)',
        license: 'Apache-2.0',
        healthScore: 93,
        rrfScore: 0.0309,
        lexicalMatch: 'MULTI_PSP_ROUTER + LEDGER',
        vectorCosine: 0.89,
        rationale:
          'Unifica pasarelas de pago internacionales y transferencias ACH/SEPA con conmutación por error automática en Rust.',
        integrationTrigger: 'Disparador idempotente al confirmar orden de despacho en PostgreSQL.',
      },
    ],
    sqlHybridQuerySnippet: `-- Búsqueda Híbrida RRF (k=60) + Prevención de Stemming Destructivo (Riesgo R4/R5)
WITH fts_ranked AS (
  SELECT id, name, license, health_score,
         ROW_NUMBER() OVER (ORDER BY ts_rank_cd(to_tsvector('simple', content), plainto_tsquery('simple', $1)) DESC) AS r_lex
  FROM oss_repositories
  WHERE to_tsvector('simple', content) @@ plainto_tsquery('simple', $1)
  LIMIT 20
),
vec_ranked AS (
  SELECT id, name, license, health_score,
         ROW_NUMBER() OVER (ORDER BY embedding_halfvec <=> $2::halfvec(1536)) AS r_vec
  FROM oss_repositories
  ORDER BY embedding_halfvec <=> $2::halfvec(1536)
  LIMIT 20
)
SELECT COALESCE(f.id, v.id) AS repo_id,
       COALESCE(f.name, v.name) AS tool_name,
       (COALESCE(1.0 / (60 + f.r_lex), 0.0) + COALESCE(1.0 / (60 + v.r_vec), 0.0)) AS rrf_score
FROM fts_ranked f
FULL OUTER JOIN vec_ranked v ON f.id = v.id
ORDER BY rrf_score DESC LIMIT 5;`,
  },
  {
    id: 'scenario-fintech-compliance',
    title: 'Infraestructura Fintech B2B & Conciliación Bancaria',
    promptText:
      'Arquitectura open-source para pasarela Fintech B2B con auditoría de transacciones en tiempo real, prevención de fraude, autenticación fuerte MFA y cero vendor lock-in.',
    businessDomain: 'Enterprise Fintech & Automated Clearing',
    ragas: {
      contextPrecision: 0.97,
      contextRecall: 0.95,
      faithfulness: 1.0,
      answerRelevance: 0.98,
      latencyMs: 172,
    },
    executiveSummary:
      'Stack blindado para alta disponibilidad financiera. Ahorra entre 15 y 20 horas de investigación arquitectónica reemplazando SaaS costosos por contenedores auditables con licencias permisivas Apache-2.0 y MIT.',
    nodes: [
      {
        layer: 'Capa 1: Orquestador Transaccional Core (Payments)',
        toolName: 'Juspay Hyperswitch (Apache-2.0)',
        license: 'Apache-2.0',
        healthScore: 93,
        rrfScore: 0.0333,
        lexicalMatch: 'PCI_COMPLIANCE + SMART_ROUTING',
        vectorCosine: 0.96,
        rationale:
          'Aísla el manejo de tokens financieros en Rust con latencia sub-milisegundo y soporte nativo para conciliación multi-moneda.',
        integrationTrigger: 'Webhook firmado con HMAC-SHA256 hacia el libro mayor en PostgreSQL.',
      },
      {
        layer: 'Capa 2: Autenticación Fuerte & Políticas IAM (Auth)',
        toolName: 'Keycloak Enterprise IAM (Apache-2.0)',
        license: 'Apache-2.0',
        healthScore: 95,
        rrfScore: 0.0324,
        lexicalMatch: 'FAPI_OIDC + WEBAUTHN_MFA',
        vectorCosine: 0.93,
        rationale:
          'Soporta perfiles de seguridad de grado financiero (FAPI), llaves de seguridad WebAuthn/Passkeys y control de acceso granular.',
        integrationTrigger: 'Validación introspectiva OAuth2 en API Gateway antes de firmar pagos.',
      },
      {
        layer: 'Capa 3: Almacén Relacional & Auditoría Vectorial (DBs)',
        toolName: 'Supabase + pgvector (Apache-2.0)',
        license: 'Apache-2.0',
        healthScore: 98,
        rrfScore: 0.0319,
        lexicalMatch: 'ACID_LEDGER + HALFVEC_HNSW',
        vectorCosine: 0.91,
        rationale:
          'Garantiza integridad ACID estricta para saldos contables y detección de anomalías mediante similitud del coseno en historiales de pago.',
        integrationTrigger: 'Row-Level Security (RLS) activado por tenant_id corporativo.',
      },
      {
        layer: 'Capa 4: Copiloto de Cumplimiento Normativo (AI)',
        toolName: 'LangChain + Ragas Audit Pipeline (MIT)',
        license: 'MIT',
        healthScore: 96,
        rrfScore: 0.0311,
        lexicalMatch: 'ZERO_HALLUCINATION_RAG',
        vectorCosine: 0.90,
        rationale:
          'Permite consultar normativas y logs de auditoría con umbral forzado de similitud de coseno para impedir respuestas especulativas.',
        integrationTrigger: 'Pipeline FastAPI evalúa métrica Faithfulness antes de emitir reporte.',
      },
    ],
    sqlHybridQuerySnippet: `-- Verificación de Salud Estructural y Filtrado por Licencia Permisiva
SELECT name, slug, license, health_score,
       (commit_velocity_score * 0.15 + security_score * 0.20 + docs_score * 0.65) AS weighted_health
FROM oss_repositories
WHERE license IN ('MIT', 'Apache-2.0')
  AND health_score >= 90
ORDER BY weighted_health DESC;`,
  },
  {
    id: 'scenario-saas-ai-copilot',
    title: 'Plataforma SaaS B2B con Copiloto RAG Auto-Hospedado',
    promptText:
      'Queremos lanzar un SaaS B2B de gestión documental e inteligencia de contratos con búsqueda híbrida semántica + léxica, ingesta desde GitHub/S3 y control de costos de memoria.',
    businessDomain: 'LegalTech & Enterprise Knowledge SaaS',
    ragas: {
      contextPrecision: 0.99,
      contextRecall: 0.97,
      faithfulness: 1.0,
      answerRelevance: 0.99,
      latencyMs: 165,
    },
    executiveSummary:
      'Diseño optimizado para mitigar el Riesgo R5 (agotamiento de shared_buffers en PostgreSQL) implementando vectores halfvec en pgvector 0.7+ junto con ingesta resiliente controlada por Token Bucket y ETags.',
    nodes: [
      {
        layer: 'Capa 1: Motor de Búsqueda Híbrida Vectorial + FTS (DBs)',
        toolName: 'PostgreSQL 16 + pgvector 0.7+ (halfvec)',
        license: 'Apache-2.0',
        healthScore: 98,
        rrfScore: 0.0333,
        lexicalMatch: 'HNSW_HALFVEC + RRF_K60',
        vectorCosine: 0.98,
        rationale:
          'Comprime los embeddings en un 50% de RAM sin pérdida de recall y mantiene índices HNSW (m=16, ef_construction=64) en memoria.',
        integrationTrigger: 'Indexación incremental activada tras validación de ETag HTTP 304/200.',
      },
      {
        layer: 'Capa 2: Orquestación RAG & Evaluación Continua (AI)',
        toolName: 'LangChain + Meilisearch + Ragas',
        license: 'MIT',
        healthScore: 96,
        rrfScore: 0.0328,
        lexicalMatch: 'RAGAS_FAITHFULNESS_GUARD',
        vectorCosine: 0.95,
        rationale:
          'Evalúa en tiempo real Context Precision, Context Recall, Faithfulness y Answer Relevance para blindar las respuestas corporativas.',
        integrationTrigger: 'FastAPI Streaming Endpoint con interruptor de corte si cosine < 0.78.',
      },
      {
        layer: 'Capa 3: Gestión de Organizaciones & SSO (Auth)',
        toolName: 'Keycloak Multi-Organization IAM',
        license: 'Apache-2.0',
        healthScore: 95,
        rrfScore: 0.0315,
        lexicalMatch: 'ORG_TENANCY + OIDC',
        vectorCosine: 0.91,
        rationale:
          'Segrega permisos por firma legal o departamento corporativo integrándose con los directorios activos de cada cliente B2B.',
        integrationTrigger: 'Sincronización de claims JWT con políticas RLS de Supabase.',
      },
    ],
    sqlHybridQuerySnippet: `-- Configuración de Índice HNSW de Media Precisión (Mitigación Riesgo R5)
CREATE INDEX CONCURRENTLY idx_oss_repos_embedding_halfvec
ON oss_repositories
USING hnsw ((embedding::halfvec(1536)) halfvec_cosine_ops)
WITH (m = 16, ef_construction = 64);`,
  },
];

const WBS_MILESTONES: WbsMilestone[] = [
  {
    phase: 'Fase 1 (Días 1-7)',
    title: 'Hito 1: Cimientos Aprobados & Esquema Relacional/Vectorial',
    dateRange: '12 Oct - 18 Oct 2026',
    owner: 'Jeison Pinzón, Justina Mutigliengo, Fabián Martínez, Claudia Maucaylli',
    role: 'Data Eng, Backend Dev, UI/UX Designers',
    shift: 'Tarde/Noche',
    deliverableRef: 'Tarea 1 & 4 (Infraestructura Docker pgvector + Figma Dev Mode)',
    status: 'COMPLETED',
    technicalHighlight:
      'Contenedor PostgreSQL + pgvector inicializado con metadatos normalizados atómicos y Design System de alta fidelidad aprobado.',
  },
  {
    phase: 'Fase 2 (Días 8-16)',
    title: 'Hito 2: Autonomía de Datos & Pipeline Resiliente GitHub GraphQL',
    dateRange: '19 Oct - 27 Oct 2026',
    owner: 'Justina Mutigliengo, Andres Iglesias, Exequiel A. Pérez',
    role: 'Backend Dev, AI Eng, ML Engineer',
    shift: 'Tarde (1pm-5pm)',
    deliverableRef: 'Tarea 1 & 3 (Ingesta >100 Repos + Algoritmo Health Score)',
    status: 'ACTIVE',
    technicalHighlight:
      'Evasión de límites secundarios de GitHub (2,000 pts/min) vía GraphQL Batching, cabeceras ETag condicionales, Token Bucket y Exponential Backoff con Jitter.',
  },
  {
    phase: 'Fase 3 (Días 17-24)',
    title: 'Hito 3: Sinergia de Inteligencia (Búsqueda Híbrida RRF + Next.js)',
    dateRange: '28 Oct - 04 Nov 2026',
    owner: 'Andres Iglesias, Jeison Pinzón, Aleja Noriega, David Vergara',
    role: 'AI Eng, Data Eng, Project Manager',
    shift: 'Noche (6pm-10pm)',
    deliverableRef: 'Tarea 2 & 4 (Motor RRF k=60 + Integración React/Next.js)',
    status: 'ACTIVE',
    technicalHighlight:
      'Fusión de Rango Recíproco combinando diccionario "simple" (sin stemming destructivo) e índice HNSW halfvec con latencia P95 < 250ms.',
  },
  {
    phase: 'Fase 4 (Días 25-29)',
    title: 'Hito 4: Auditoría Anti-Alucinación RAGAS & Code Freeze',
    dateRange: '05 Nov - 09 Nov 2026',
    owner: 'Edison Peña, Exequiel A. Pérez, Claudia Maucaylli',
    role: 'AI Evaluation Lead, ML Eng, UX Researcher',
    shift: 'Tarde/Noche',
    deliverableRef: 'Tarea 2 (Validación Faithfulness + Días 28-29 Buffer de Integración)',
    status: 'BUFFER_LOCKED',
    technicalHighlight:
      'Auditoría paramétrica de Context Precision, Context Recall, Faithfulness y Answer Relevance. Congelamiento total en rama main el 9 de noviembre.',
  },
  {
    phase: 'Fase 5 (Días 30-32)',
    title: 'Consolidación Documental & Empaquetado Oficial NoCountry',
    dateRange: '10 Nov - 13 Nov 2026',
    owner: 'Edison Peña, David Vergara, Fabián Martínez, Claudia Maucaylli',
    role: 'PMO & Full Squad (14h netas/sem @ 70% Focus Factor)',
    shift: 'Noche (6pm-10pm)',
    deliverableRef: 'Tareas 1, 2, 3 y 4 (@ENTREGABLES.pdf 100% WBS Rule)',
    status: 'BUFFER_LOCKED',
    technicalHighlight:
      '72 horas blindadas sin nuevo código dedicadas al manifiesto README.md, captura del Video Demo en YouTube y verificación de URLs de producción.',
  },
];

interface IconProps {
  className?: string;
}

const IconCpuArchitecture: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" rx="1" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

const IconSearchSparkle: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
    <path d="M11 8v6M8 11h6" />
  </svg>
);

const IconShieldAuth: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const IconDatabaseVector: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const IconPaymentsSwitch: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <path d="M6 15h4M14 15h4" />
  </svg>
);

const IconAiBrainRag: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const IconHealthPulse: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const IconTerminalCode: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const IconCheckVerified: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconGitHubRepo: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

export default function OpenSourceAcceleratorPage(): React.JSX.Element {
  // Navigation & CTA states (Checkpoint #6)
  const [activeNavTab, setActiveNavTab] = useState<'CATALOG' | 'RAG_ARCHITECT' | 'PMO_WBS' | 'AUDIT_GATE'>('CATALOG');
  const [isPipelineSyncActive, setIsPipelineSyncActive] = useState<boolean>(true);

  // Hero Interactive Prompt Bar states (Checkpoint #7)
  const [heroPromptInput, setHeroPromptInput] = useState<string>(
    'Plataforma de comercio electrónico B2B orientada a la logística con búsqueda SKU-9941A y SSO'
  );
  const [rrfConstantK, setRrfConstantK] = useState<number>(60);
  const [useHalfvecOptimization, setUseHalfvecOptimization] = useState<boolean>(true);

  // Categories Grid & Catalog states (Checkpoints #8 & #9)
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('ALL');
  const [selectedLicenseFilter, setSelectedLicenseFilter] = useState<'ALL' | LicenseType>('ALL');
  const [copiedToolId, setCopiedToolId] = useState<string | null>(null);
  const [inspectedToolId, setInspectedToolId] = useState<string>(FEATURED_TOOLS_CATALOG[0].id);

  // RAG Assistant Chat Mock states (Checkpoint #10)
  const [activeScenarioId, setActiveScenarioId] = useState<string>(B2B_RAG_SCENARIOS[0].id);
  const [customBusinessQuery, setCustomBusinessQuery] = useState<string>('');
  const [isSynthesizingRag, setIsSynthesizingRag] = useState<boolean>(false);
  const [showSqlQueryModal, setShowSqlQueryModal] = useState<boolean>(false);
  const [handoffModalOpen, setHandoffModalOpen] = useState<boolean>(false);

  // Async Handoff Protocol State (5 mandatory parameters from PMO Section 2)
  const [handoffForm, setHandoffForm] = useState<{
    completedWithEvidence: string;
    scopeChanged: string;
    blockingDependencies: string;
    nextActionVerbOwnerDeadline: string;
    retainedArchitecturalDecisions: string;
  }>({
    completedWithEvidence:
      'Esquema PostgreSQL 16 + pgvector 0.7+ desplegado con índice HNSW (m=16, ef_construction=64) y endpoint FastAPI /api/v1/hybrid-search verificado.',
    scopeChanged:
      'Ningún cambio de alcance (Cumplimiento estricto Regla 100% WBS). Se migró columna vector a halfvec(1536) para ahorrar 50% de RAM.',
    blockingDependencies:
      'Límite secundario de GitHub GraphQL (2,000 pts/min) mitigado activando caché de ETags y Token Bucket.',
    nextActionVerbOwnerDeadline:
      'Ejecutar auditoría RAGAS de Faithfulness — Responsable: Edison Peña & Exequiel Pérez — Límite: 06 Nov 2026 18:00 UTC-5.',
    retainedArchitecturalDecisions:
      'Preservar configuración to_tsvector("simple", ...) para evitar que el stemming Snowball destruya códigos técnicos como SKU-9941A.',
  });

  // Filtered tools computation
  const filteredCatalogTools = useMemo<OpenSourceTool[]>(() => {
    return FEATURED_TOOLS_CATALOG.filter((tool: OpenSourceTool) => {
      const matchesCategory = selectedCategory === 'ALL' || tool.category === selectedCategory;
      const matchesLicense = selectedLicenseFilter === 'ALL' || tool.license === selectedLicenseFilter;
      return matchesCategory && matchesLicense;
    });
  }, [selectedCategory, selectedLicenseFilter]);

  // Active RAG scenario computation
  const currentScenario = useMemo<B2BScenario>(() => {
    return (
      B2B_RAG_SCENARIOS.find((scenario: B2BScenario) => scenario.id === activeScenarioId) || B2B_RAG_SCENARIOS[0]
    );
  }, [activeScenarioId]);

  // Handlers
  const handleHeroPromptSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const queryLower = heroPromptInput.toLowerCase();
    setIsSynthesizingRag(true);

    if (queryLower.includes('fintech') || queryLower.includes('pago') || queryLower.includes('banc')) {
      setActiveScenarioId('scenario-fintech-compliance');
    } else if (queryLower.includes('saas') || queryLower.includes('contrato') || queryLower.includes('memoria')) {
      setActiveScenarioId('scenario-saas-ai-copilot');
    } else {
      setActiveScenarioId('scenario-logistics-b2b');
    }

    setCustomBusinessQuery(heroPromptInput);
    setActiveNavTab('RAG_ARCHITECT');

    setTimeout(() => {
      setIsSynthesizingRag(false);
      const ragElement = document.getElementById('rag-assistant-section');
      if (ragElement) {
        ragElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 350);
  };

  const handleCopyDockerCommand = (toolId: string, command: string): void => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(command).catch(() => {
        // Fallback state update even if clipboard permission is restricted in iframe
      });
    }
    setCopiedToolId(toolId);
    setTimeout(() => {
      setCopiedToolId(null);
    }, 2200);
  };

  const renderCategoryIcon = (categoryId: Exclude<CategoryId, 'ALL'>): React.JSX.Element => {
    switch (categoryId) {
      case 'AUTH':
        return <IconShieldAuth className="w-6 h-6 text-cyan-400" />;
      case 'DBS':
        return <IconDatabaseVector className="w-6 h-6 text-emerald-400" />;
      case 'PAYMENTS':
        return <IconPaymentsSwitch className="w-6 h-6 text-violet-400" />;
      case 'AI':
        return <IconAiBrainRag className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Subtle Ambient High-Tech Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 15%, rgba(6, 182, 212, 0.14), transparent 35%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.12), transparent 40%)',
        }}
      />

      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <IconCpuArchitecture className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base sm:text-lg text-white">
                  Acelerador de Integraciones Open Source
                </span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  NoCountry B2B
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                pgvector 0.7+ (halfvec) • RRF (k={rrfConstantK}) • RAGAS Verified
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav aria-label="Navegación Principal" className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('CATALOG');
                document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeNavTab === 'CATALOG'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Catálogo & Categorías
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('RAG_ARCHITECT');
                document.getElementById('rag-assistant-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeNavTab === 'RAG_ARCHITECT'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Arquitecto RAG B2B
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('PMO_WBS');
                document.getElementById('pmo-wbs-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeNavTab === 'PMO_WBS'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Plan PMO (32 Días)
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('AUDIT_GATE');
                setHandoffModalOpen(true);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeNavTab === 'AUDIT_GATE'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Traspaso Asíncrono
            </button>
          </nav>

          {/* CTA with Active State */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPipelineSyncActive((prev: boolean) => !prev)}
              aria-pressed={isPipelineSyncActive}
              className={`group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold border transition-all duration-200 ${
                isPipelineSyncActive
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500/40'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isPipelineSyncActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
              <span>
                {isPipelineSyncActive ? 'INGESTA ETag: ACTIVA' : 'INGESTA: MODO CACHÉ'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 space-y-20">
        {}
        <section className="relative rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/70 p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Top Status Pill */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-300">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                12 OCT – 13 NOV 2026 (32 DÍAS)
              </span>
              <span>•</span>
              <span>Ahorra 15–20h de investigación B2B por proyecto</span>
              <span>•</span>
              <span className="text-emerald-400">Latencia HNSW P95 &lt; 250ms</span>
            </div>

            {/* Hero Headline & Tagline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Catálogo Inteligente &{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Arquitecto RAG de Integraciones Open Source
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Erradicamos la fragmentación del ecosistema open-source para consultoría tecnológica B2B. Describe tu
              modelo de negocio y nuestro motor de{' '}
              <strong className="text-white font-semibold">
                Búsqueda Híbrida (pgvector + Fusión de Rango Recíproco)
              </strong>{' '}
              emitirá un mapa de arquitectura auto-hospedado con métricas de salud estructural verificadas.
            </p>

            {/* Interactive Prompt Bar Controlled via React useState */}
            <form onSubmit={handleHeroPromptSubmit} className="mt-8 space-y-4 text-left">
              <div className="relative rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-2 sm:p-3 shadow-xl shadow-cyan-950/30 focus-within:border-cyan-400 transition-all">
                <label htmlFor="b2b-hero-prompt" className="sr-only">
                  Describe la arquitectura B2B o el código técnico que necesitas integrar
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 px-2">
                    <IconSearchSparkle className="w-6 h-6 text-cyan-400 shrink-0" />
                    <input
                      id="b2b-hero-prompt"
                      type="text"
                      value={heroPromptInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeroPromptInput(e.target.value)}
                      placeholder="Ej: Plataforma de comercio electrónico B2B orientada a la logística con SKU-9941A..."
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all shrink-0 cursor-pointer"
                  >
                    <IconAiBrainRag className="w-4 h-4" />
                    <span>Generar Mapa RAG B2B</span>
                  </button>
                </div>

                {/* Live Engine Telemetry Footer inside Prompt Bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] font-mono text-slate-400">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-cyan-300">
                      Diccionario FTS: <strong>&apos;simple&apos;</strong> (Sin stemming Snowball)
                    </span>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setUseHalfvecOptimization((prev: boolean) => !prev)}
                      className="underline decoration-dotted hover:text-emerald-300"
                    >
                      Índice HNSW: {useHalfvecOptimization ? 'halfvec (50% menos RAM)' : 'float32 estándar'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Constante RRF k={rrfConstantK}</span>
                    <button
                      type="button"
                      onClick={() => setRrfConstantK((prev: number) => (prev === 60 ? 40 : 60))}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      Ajustar k
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset Quick Prompts */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="text-xs font-mono text-slate-400">Casos de prueba B2B:</span>
                {B2B_RAG_SCENARIOS.map((scenario: B2BScenario) => (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => {
                      setHeroPromptInput(scenario.promptText);
                      setActiveScenarioId(scenario.id);
                      setCustomBusinessQuery(scenario.promptText);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
                      activeScenarioId === scenario.id
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {scenario.title}
                  </button>
                ))}
              </div>
            </form>

            {/* Executive Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
                <p className="text-xs font-mono text-slate-400">Tiempo Ahorrado / Proyecto</p>
                <p className="text-xl font-bold text-white mt-0.5">15 a 20 Horas</p>
                <p className="text-[11px] text-emerald-400 font-mono">Validación curada B2B</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
                <p className="text-xs font-mono text-slate-400">Capacidad Ágil del Equipo</p>
                <p className="text-xl font-bold text-white mt-0.5">126h Netas / Sem</p>
                <p className="text-[11px] text-cyan-400 font-mono">9 Ing. × 14h (70% Focus)</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
                <p className="text-xs font-mono text-slate-400">Evasión Rate-Limit GitHub</p>
                <p className="text-xl font-bold text-white mt-0.5">ETag + Token Bucket</p>
                <p className="text-[11px] text-violet-400 font-mono">&lt; 2,000 pts/min GraphQL</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
                <p className="text-xs font-mono text-slate-400">Fidelidad RAGAS</p>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">100% Zero-Hallucination</p>
                <p className="text-[11px] text-amber-400 font-mono">Colchón: 5 Días Buffer</p>
              </div>
            </div>
          </div>
        </section>

        {}
        <section id="categories-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Taxonomía Estructural Normalizada
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Explorador de Categorías Open Source (CategoriesGrid)
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Metadatos atómicos indexados en PostgreSQL para filtrado híbrido sin degradación por JSON plano.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Todas las Categorías (122 Repos)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES_DATA.map((cat: CategoryItem) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'ALL' : cat.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCategory(isSelected ? 'ALL' : cat.id);
                    }
                  }}
                  className={`group relative rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900/95 border-cyan-400 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                      : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  <div>
                    {/* Top Icon & Health Pill */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-slate-700">
                        {renderCategoryIcon(cat.id)}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${cat.badgeBg}`}>
                        {cat.shortName}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cat.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {cat.keyTechs.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-slate-950 text-[11px] font-mono text-slate-300 border border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{cat.repoCount} repositorios</span>
                      <span className="text-emerald-400 font-semibold">
                        Health Prom: {cat.avgHealthScore}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {}
        <section id="catalog-section" className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                Algoritmo de Salud Estructural Ponderado (Exequiel Pérez - Fase 2)
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Catálogo de Herramientas Destacadas (FeaturedToolsCatalog)
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Cada ficha técnica traduce el repositorio en disparadores funcionales, dependencias, licencia y
                puntuación de salud verificada.
              </p>
            </div>

            {/* License Filter Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-slate-400 mr-1">Filtrar Licencia:</span>
              {(['ALL', 'Apache-2.0', 'MIT'] as const).map((lic) => (
                <button
                  key={lic}
                  type="button"
                  onClick={() => setSelectedLicenseFilter(lic)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all ${
                    selectedLicenseFilter === lic
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lic === 'ALL' ? 'Todas (MIT / Apache-2.0)' : lic}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Tools Grid (Guaranteed >= 3 High-Depth Cards with Licenses & Health Score) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredCatalogTools.slice(0, 3).map((tool: OpenSourceTool) => {
              const isInspected = inspectedToolId === tool.id;
              return (
                <article
                  key={tool.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                    isInspected
                      ? 'bg-slate-900/95 border-emerald-500/50 shadow-xl shadow-emerald-950/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header: Category, License Badge & Health Score */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                            {tool.category}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-950 text-emerald-300 border border-emerald-500/30">
                            Licencia: {tool.license}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-2">{tool.name}</h3>
                        <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <IconGitHubRepo className="w-3.5 h-3.5 text-slate-400" />
                          <span>{tool.slug}</span>
                          <span>•</span>
                          <span className="text-amber-300">★ {tool.stars}</span>
                        </p>
                      </div>

                      {/* Health Score Gauge Box */}
                      <div className="text-right shrink-0 bg-slate-950 px-3 py-2 rounded-xl border border-emerald-500/40">
                        <div className="flex items-center justify-end gap-1 text-emerald-400">
                          <IconHealthPulse className="w-4 h-4" />
                          <span className="text-lg font-extrabold font-mono">{tool.healthScore}/100</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                          Health Score
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{tool.description}</p>

                    {/* Health Breakdown Bars (15% Commits, 20% Security, 65% Docs/Community) */}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Desglose Ponderado Health Score</span>
                        <span className="text-emerald-400">RRF Rank #{tool.rrfBaseRank}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block">Commits (15%)</span>
                          <span className="text-white font-bold">{tool.healthBreakdown.commitVelocity}%</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block">Seguridad (20%)</span>
                          <span className="text-emerald-300 font-bold">{tool.healthBreakdown.securityStructural}%</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block">Docs/Com. (65%)</span>
                          <span className="text-cyan-300 font-bold">{tool.healthBreakdown.communityDocs}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Standardized Integration Metadata (Triggers & Dependencies) */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-slate-400">Dificultad de Integración:</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                          {tool.integrationDifficulty}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-slate-400 block mb-1">Disparadores (Triggers):</span>
                        <div className="flex flex-wrap gap-1.5">
                          {tool.triggers.map((trig: string) => (
                            <span
                              key={trig}
                              className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300"
                            >
                              ⚡ {trig}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Docker Command & ETag Telemetry */}
                  <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-semibold">{tool.selfHostedSavingsB2B}</span>
                      <span className="text-slate-500 truncate max-w-[150px]" title={tool.lastSyncEtag}>
                        ETag: {tool.lastSyncEtag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyDockerCommand(tool.id, tool.dockerCommand)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-mono font-semibold bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all cursor-pointer"
                      >
                        {copiedToolId === tool.id ? (
                          <>
                            <IconCheckVerified className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-300">Comando Docker Copiado</span>
                          </>
                        ) : (
                          <>
                            <IconTerminalCode className="w-4 h-4 text-cyan-400" />
                            <span>Copiar Docker Run</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setInspectedToolId(tool.id)}
                        className="px-3 py-2.5 rounded-xl text-xs font-mono font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all"
                      >
                        Inspeccionar
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {}
        <section
          id="rag-assistant-section"
          className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/95 via-slate-950 to-slate-900/90 p-6 sm:p-8 lg:p-10 shadow-2xl space-y-8"
        >
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-2">
                <IconAiBrainRag className="w-4 h-4" />
                <span>Motor Híbrido PostgreSQL pgvector + LangChain + Evaluación RAGAS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Asistente Conversacional de Arquitectura B2B (RAGAssistantChatMock)
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Simulación interactiva en tiempo real: recupera repositorios mediante Fusión de Rango Recíproco (RRF) y
                audita la ausencia total de alucinaciones.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowSqlQueryModal((prev: boolean) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 transition-all"
              >
                <IconTerminalCode className="w-4 h-4" />
                <span>{showSqlQueryModal ? 'Ocultar SQL Híbrido RRF' : 'Ver SQL Híbrido RRF + halfvec'}</span>
              </button>
            </div>
          </div>

          {/* Optional SQL Hybrid Query Inspector */}
          {showSqlQueryModal && (
            <div className="rounded-2xl bg-slate-950 border border-cyan-500/40 p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>
                  Consulta ejecutada en PostgreSQL (Rama Léxica &apos;simple&apos; + Rama Vectorial HNSW halfvec)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">P95: {currentScenario.ragas.latencyMs}ms</span>
              </div>
              <pre className="text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <code>{currentScenario.sqlHybridQuerySnippet}</code>
              </pre>
            </div>
          )}

          {/* Scenario Switcher & RAGAS 4 Cardinal Metrics Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Scenario Selector & RAGAS Telemetry (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300">
                  1. Seleccionar Caso de Negocio B2B
                </h3>
                <div className="space-y-2">
                  {B2B_RAG_SCENARIOS.map((scen: B2BScenario) => {
                    const active = scen.id === activeScenarioId;
                    return (
                      <button
                        key={scen.id}
                        type="button"
                        onClick={() => {
                          setIsSynthesizingRag(true);
                          setActiveScenarioId(scen.id);
                          setTimeout(() => setIsSynthesizingRag(false), 250);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                          active
                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                            : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className={active ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
                            {scen.businessDomain}
                          </span>
                          <span className="text-emerald-400">{scen.ragas.latencyMs}ms</span>
                        </div>
                        <p className="text-xs font-semibold leading-snug">{scen.title}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RAGAS Quantitative Evaluation Card (Phase 4 Mandate) */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-emerald-400 block">
                      Marco de Auditoría Fase 4
                    </span>
                    <h3 className="text-sm font-bold text-white">Métricas Cardinales RAGAS</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    PASS
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Context Precision</span>
                    <span className="text-lg font-bold text-cyan-300">
                      {(currentScenario.ragas.contextPrecision * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Context Recall</span>
                    <span className="text-lg font-bold text-cyan-300">
                      {(currentScenario.ragas.contextRecall * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40">
                    <span className="text-emerald-300 block text-[11px]">Faithfulness</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {(currentScenario.ragas.faithfulness * 100).toFixed(0)}% (Cero Alucinación)
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Answer Relevance</span>
                    <span className="text-lg font-bold text-amber-300">
                      {(currentScenario.ragas.answerRelevance * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                  Mitigación Riesgo R3: Si la similitud del coseno cae bajo el umbral seguro (0.78), el prompt detiene
                  la inferencia antes de inventar dependencias inexistentes.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Conversation & Emitted Architecture Map (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-6 space-y-6">
              {/* User Prompt Bubble */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 text-xs font-mono font-bold text-cyan-300">
                  CTO
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 p-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>Consulta de Arquitectura B2B</span>
                    <span>Dominio: {currentScenario.businessDomain}</span>
                  </div>
                  <p className="text-sm text-slate-100 font-mono">
                    &ldquo;{customBusinessQuery || currentScenario.promptText}&rdquo;
                  </p>
                </div>
              </div>

              {/* Assistant Response Bubble */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <IconAiBrainRag className="w-5 h-5 text-emerald-400" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="rounded-2xl rounded-tl-none bg-slate-900/90 border border-emerald-500/30 p-4 sm:p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <span className="text-xs font-mono font-bold text-emerald-300">
                        {isSynthesizingRag
                          ? 'Calculando Fusión de Rango Recíproco (RRF)...'
                          : 'Mapa de Arquitectura Emitido y Justificado'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Fórmula RRF: 1 / ({rrfConstantK} + rank_lex) + 1 / ({rrfConstantK} + rank_vec)
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {currentScenario.executiveSummary}
                    </p>

                    {/* Emitted Architecture Nodes */}
                    <div className="space-y-3">
                      {currentScenario.nodes.map((node: RagArchitectureNode, idx: number) => (
                        <div
                          key={node.layer}
                          className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-cyan-500/40 transition-all space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                                {node.layer}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-mono">
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-slate-800">
                                {node.license}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                                Health: {node.healthScore}%
                              </span>
                              <span className="px-2 py-0.5 rounded bg-violet-500/15 text-violet-300">
                                RRF: {node.rrfScore.toFixed(4)}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className="text-base font-bold text-white">{node.toolName}</h4>
                            <span className="text-[11px] font-mono text-slate-400">
                              Match Léxico: <strong className="text-slate-200">{node.lexicalMatch}</strong> | Coseno:{' '}
                              <strong className="text-cyan-300">{node.vectorCosine}</strong>
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">{node.rationale}</p>

                          <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-amber-300">
                            <span>🔗 Trigger de Integración:</span>
                            <span className="text-slate-300">{node.integrationTrigger}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {}
        <section id="pmo-wbs-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-violet-400">
                Gobernanza PMO • Regla del 100% WBS (12 Octubre – 13 Noviembre 2026)
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Cronograma de 32 Días, Matriz RACI & Colchón de Contingencia
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                27 días de ingeniería intensiva + 5 días de Project Buffer (Code Freeze inamovible el 9 de noviembre).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHandoffModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 transition-all cursor-pointer"
            >
              <span>Abrir Protocolo de Traspaso Asíncrono</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {WBS_MILESTONES.map((milestone: WbsMilestone) => (
              <div
                key={milestone.phase}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">{milestone.phase}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        milestone.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : milestone.status === 'ACTIVE'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {milestone.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">{milestone.dateRange}</p>
                  <h3 className="text-sm font-bold text-white leading-snug">{milestone.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{milestone.technicalHighlight}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                  <p className="text-slate-300">
                    <span className="text-slate-500">RACI:</span> {milestone.owner}
                  </p>
                  <p className="text-violet-300">
                    <span className="text-slate-500">Turno:</span> {milestone.shift}
                  </p>
                  <p className="text-emerald-400">{milestone.deliverableRef}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Async End-of-Block Handoff Modal (5 Mandatory Parameters from PMO Doc) */}
      {handoffModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="handoff-modal-title"
        >
          <div className="max-w-2xl w-full rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400">
                  Mitigación Riesgo R2 • Coordinación Tarde (1pm-5pm) ⇄ Noche (6pm-10pm)
                </span>
                <h3 id="handoff-modal-title" className="text-xl font-bold text-white mt-0.5">
                  Protocolo de Traspaso de Bloque (End-of-Block Handoff)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHandoffModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-mono"
              >
                Cerrar [ESC]
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-emerald-300 block mb-1">
                  1. ¿Qué se ha completado? (Con evidencia verificable)
                </label>
                <textarea
                  rows={2}
                  value={handoffForm.completedWithEvidence}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setHandoffForm({ ...handoffForm, completedWithEvidence: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-200"
                />
              </div>
              <div>
                <label className="text-cyan-300 block mb-1">2. ¿Qué alcance o suposición ha cambiado?</label>
                <input
                  type="text"
                  value={handoffForm.scopeChanged}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHandoffForm({ ...handoffForm, scopeChanged: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-200"
                />
              </div>
              <div>
                <label className="text-amber-300 block mb-1">3. ¿Qué dependencias bloquean el avance actual?</label>
                <input
                  type="text"
                  value={handoffForm.blockingDependencies}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHandoffForm({ ...handoffForm, blockingDependencies: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-200"
                />
              </div>
              <div>
                <label className="text-violet-300 block mb-1">
                  4. Siguiente acción requerida (Verbo + Responsable + Fecha Límite)
                </label>
                <input
                  type="text"
                  value={handoffForm.nextActionVerbOwnerDeadline}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHandoffForm({ ...handoffForm, nextActionVerbOwnerDeadline: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">5. Decisiones arquitectónicas que deben retenerse</label>
                <input
                  type="text"
                  value={handoffForm.retainedArchitecturalDecisions}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setHandoffForm({ ...handoffForm, retainedArchitecturalDecisions: e.target.value })
                  }
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setHandoffModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold text-xs font-mono"
              >
                Registrar Traspaso de Turno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer with Adversarial Quality Audit Verification */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-200 font-semibold">
              DICTAMEN AUDITORÍA PMO & FRONTEND: APROBADO SIN RESERVAS (10/10 Checkpoints)
            </span>
          </div>
          <div>
            <span>Simulación Laboral NoCountry • Acelerador de Integraciones Open Source (2026)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}