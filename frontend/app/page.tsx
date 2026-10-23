'use client';

// https://share.gemini.google/XnsITNsohkKp

import React, { useState, useMemo, useEffect } from 'react';
import { TRANSLATIONS, type Language } from '@/lib/translations';

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
  rrfScore?: number;
  lexicalRank?: number | null;
  vectorRank?: number | null;
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
  shift: 'Tarde (1pm-5pm)' | 'Noche (6pm-10pm)' | 'Tarde/Noche' | 'Autónomo / Intensivo' | 'Autónomo / Lanzamiento' | string;
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
    owner: 'EdisonPEÑA (Iotdico)',
    role: 'Lead Architect & Builder',
    shift: 'Autónomo / Intensivo',
    deliverableRef: 'Tarea 1 & 4 (Infraestructura Docker pgvector + Design System)',
    status: 'COMPLETED',
    technicalHighlight:
      'Contenedor PostgreSQL 16 + pgvector inicializado con metadatos normalizados atómicos y Design System B2B de alta fidelidad aprobado.',
  },
  {
    phase: 'Fase 2 (Días 8-16)',
    title: 'Hito 2: Autonomía de Datos & Pipeline Resiliente de Ingesta',
    dateRange: '19 Oct - 27 Oct 2026',
    owner: 'EdisonPEÑA (Iotdico)',
    role: 'Lead Architect & Builder',
    shift: 'Autónomo / Intensivo',
    deliverableRef: 'Tarea 1 & 3 (Ingesta Curada + Algoritmo Health Score)',
    status: 'COMPLETED',
    technicalHighlight:
      'Catálogo B2B dinámico con cálculo automático de Health Score ponderado (15% commits + 20% security + 65% docs) y cabeceras ETag.',
  },
  {
    phase: 'Fase 3 (Días 17-24)',
    title: 'Hito 3: Sinergia de Inteligencia (Búsqueda Híbrida RRF + Next.js)',
    dateRange: '28 Oct - 04 Nov 2026',
    owner: 'EdisonPEÑA (Iotdico)',
    role: 'Lead Architect & Builder',
    shift: 'Autónomo / Intensivo',
    deliverableRef: 'Tarea 2 & 4 (Motor RRF k=60 + Integración React/Next.js)',
    status: 'COMPLETED',
    technicalHighlight:
      'Fusión de Rango Recíproco combinando diccionario simple (sin stemming destructivo) e índice HNSW halfvec con latencia sub-50ms.',
  },
  {
    phase: 'Fase 4 (Días 25-29)',
    title: 'Hito 4: Auditoría Anti-Alucinación RAGAS & Code Freeze',
    dateRange: '05 Nov - 09 Nov 2026',
    owner: 'EdisonPEÑA (Iotdico)',
    role: 'Lead Architect & Builder',
    shift: 'Autónomo / Intensivo',
    deliverableRef: 'Tarea 2 (Validación Faithfulness 100% + Code Freeze)',
    status: 'COMPLETED',
    technicalHighlight:
      'Auditoría paramétrica de Context Precision, Context Recall, Faithfulness (1.0) y Answer Relevance. Code Freeze total sin errores TypeScript.',
  },
  {
    phase: 'Fase 5 (Días 30-32)',
    title: 'Consolidación Documental & Empaquetado Oficial OSS Atlas',
    dateRange: '10 Nov - 13 Nov 2026',
    owner: 'EdisonPEÑA (Iotdico)',
    role: 'Founder & Full Stack AI Engineer',
    shift: 'Autónomo / Lanzamiento',
    deliverableRef: 'Tareas 1, 2, 3 y 4 (Empaquetado Docker + ossatlas.iotdico.com)',
    status: 'COMPLETED',
    technicalHighlight:
      'Build de producción en Next.js 15, contenedor Docker acelerador-frontend:latest (347 MB), subdominio ossatlas.iotdico.com y modelo Open-Core activo.',
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

const getCategoryName = (catId: string, lang: Language) => {
  const t = TRANSLATIONS[lang];
  if (catId === 'AUTH') return t.catAuthName;
  if (catId === 'DBS') return t.catDbsName;
  if (catId === 'PAYMENTS') return t.catPaymentsName;
  if (catId === 'AI') return t.catAiName;
  return catId;
};

const getCategoryDesc = (catId: string, lang: Language) => {
  const t = TRANSLATIONS[lang];
  if (catId === 'AUTH') return t.catAuthDesc;
  if (catId === 'DBS') return t.catDbsDesc;
  if (catId === 'PAYMENTS') return t.catPaymentsDesc;
  if (catId === 'AI') return t.catAiDesc;
  return '';
};

const getScenarioTitle = (scenarioId: string, lang: Language) => {
  const t = TRANSLATIONS[lang];
  if (scenarioId === 'scenario-logistics-b2b') return t.scenario1;
  if (scenarioId === 'scenario-fintech-compliance') return t.scenario2;
  if (scenarioId === 'scenario-rag-copilot') return t.scenario3;
  return scenarioId;
};

export default function OpenSourceAcceleratorPage(): React.JSX.Element {
  // Language & i18n states
  const [lang, setLang] = useState<Language>('es');
  const t = TRANSLATIONS[lang];

  const toggleLanguage = () => {
    const next = lang === 'es' ? 'en' : 'es';
    setLang(next);
    try {
      localStorage.setItem('oss_atlas_lang', next);
    } catch (e) {
      console.warn('No se pudo guardar preferencia de idioma:', e);
    }
  };

  // Navigation & CTA states (Simplified public interface)
  const [activeNavTab, setActiveNavTab] = useState<'CATALOG' | 'RAG_ARCHITECT' | 'PRICING_B2B'>('CATALOG');
  const [isPipelineSyncActive, setIsPipelineSyncActive] = useState<boolean>(true);

  // B2B Monetization & Checkout states
  const [userSubscription, setUserSubscription] = useState<{
    id: string;
    status: 'ACTIVE' | 'NONE';
    planId: 'PRO_ARCHITECTURE' | 'ENTERPRISE_HUB';
    planName: string;
    billingCycle: 'monthly' | 'annual';
    companyName: string;
    expiresAt?: string;
  } | null>(null);

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<'PRO_ARCHITECTURE' | 'ENTERPRISE_HUB'>('PRO_ARCHITECTURE');
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [checkoutEmail, setCheckoutEmail] = useState<string>('');
  const [checkoutCompany, setCheckoutCompany] = useState<string>('');
  const [checkoutTaxId, setCheckoutTaxId] = useState<string>('');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'paypal' | 'wenia_usdw' | 'bank_transfer'>('paypal');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState<boolean>(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<{
    invoiceNumber: string;
    planName: string;
    token: string;
    amount: number;
    features: string[];
  } | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutGuideNotice, setCheckoutGuideNotice] = useState<string | null>(null);
  const [inspectedGuideTool, setInspectedGuideTool] = useState<OpenSourceTool | null>(null);

  // Hero Interactive Prompt Bar states (Checkpoint #7)
  const [heroPromptInput, setHeroPromptInput] = useState<string>(
    'Plataforma de comercio electrónico B2B orientada a la logística con búsqueda SKU-9941A y SSO'
  );
  const [rrfConstantK, setRrfConstantK] = useState<number>(60);
  const [useHalfvecOptimization, setUseHalfvecOptimization] = useState<boolean>(true);

  // Categories Grid & Catalog states (Checkpoints #8 & #9)
  const [catalogTools, setCatalogTools] = useState<OpenSourceTool[]>(FEATURED_TOOLS_CATALOG);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState<boolean>(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('ALL');
  const [selectedLicenseFilter, setSelectedLicenseFilter] = useState<'ALL' | LicenseType>('ALL');
  const [copiedToolId, setCopiedToolId] = useState<string | null>(null);
  const [inspectedToolId, setInspectedToolId] = useState<string>(FEATURED_TOOLS_CATALOG[0].id);

  // Pipeline Sync states (Paso 5 - Ingesta Continua & Sincronización)
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [syncTab, setSyncTab] = useState<'PRESETS' | 'CUSTOM' | 'MAINTENANCE'>('PRESETS');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    repoName?: string;
  } | null>(null);

  const [customRepoForm, setCustomRepoForm] = useState({
    name: '',
    slug: '',
    category: 'AUTH' as Exclude<CategoryId, 'ALL'>,
    license: 'Apache-2.0' as LicenseType,
    description: '',
    stars: 12500,
    commitVelocity: 94,
    securityScore: 96,
    docsScore: 95,
    dockerCommand: '',
    integrationDifficulty: 'Media' as 'Baja' | 'Media' | 'Alta',
    triggers: 'OIDC Session Verification, Admin Webhook',
    dependencies: 'Docker Engine, PostgreSQL 16+',
  });

  const previewHealthScore = Math.round(
    (customRepoForm.commitVelocity * 0.15 +
      customRepoForm.securityScore * 0.20 +
      customRepoForm.docsScore * 0.65) *
      10
  ) / 10;

  // Fetch catalog from PostgreSQL /api/v1/catalog
  const refreshCatalog = async () => {
    try {
      setIsLoadingCatalog(true);
      const res = await fetch('/api/v1/catalog');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const mapped: OpenSourceTool[] = data.map((row: any, idx: number) => ({
          id: String(row.id),
          name: row.name,
          slug: row.slug,
          category: row.category,
          license: row.license,
          healthScore: Math.round(Number(row.health_score) || 90),
          healthBreakdown: {
            commitVelocity: Math.round(Number(row.commit_velocity_score) || 92),
            securityStructural: Math.round(Number(row.security_score) || 94),
            communityDocs: Math.round(Number(row.docs_score) || 95),
          },
          stars: Number(row.stars) >= 1000 ? `${(Number(row.stars) / 1000).toFixed(1)}k` : String(row.stars),
          lastSyncEtag: row.etag || `W/"pgvector-db-sync-${String(row.id).slice(0, 8)}"`,
          description: row.description,
          dockerCommand: row.docker_command,
          integrationDifficulty: (row.integration_difficulty as 'Baja' | 'Media' | 'Alta') || 'Media',
          triggers: Array.isArray(row.triggers) ? row.triggers : [],
          dependencies: Array.isArray(row.dependencies) ? row.dependencies : [],
          rrfBaseRank: idx + 1,
          selfHostedSavingsB2B:
            row.category === 'AUTH'
              ? '$2,400 USD / mes en licencias MAU B2B'
              : row.category === 'DBS'
              ? '$1,850 USD / mes vs Cloud Propietario'
              : row.category === 'PAYMENTS'
              ? 'Reducción de 1.4% en tarifas de fallo'
              : '$1,200 USD / mes vs SaaS Propietario',
        }));
        setCatalogTools(mapped);
        setIsDbConnected(true);
        if (mapped.length > 0) {
          setInspectedToolId((prev) => (mapped.some((m) => m.id === prev) ? prev : mapped[0].id));
        }
      }
    } catch (err) {
      console.warn('Usando catálogo en memoria (fallback):', err);
    } finally {
      setIsLoadingCatalog(false);
    }
  };

  useEffect(() => {
    refreshCatalog();
    try {
      const storedLang = localStorage.getItem('oss_atlas_lang') as Language;
      if (storedLang === 'es' || storedLang === 'en') {
        setLang(storedLang);
      }
      const stored = localStorage.getItem('oss_atlas_sub');
      if (stored) {
        setUserSubscription(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('No se pudo recuperar suscripción previa o idioma:', e);
    }
  }, []);

  const handleOpenCheckout = (
    planId: 'PRO_ARCHITECTURE' | 'ENTERPRISE_HUB',
    notice?: string
  ) => {
    setSelectedCheckoutPlan(planId);
    setCheckoutGuideNotice(notice || null);
    setCheckoutError(null);
    setIsCheckoutModalOpen(true);
  };

  const handleProcessCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingCheckout(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/v1/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedCheckoutPlan,
          billingCycle: pricingCycle,
          customerEmail: checkoutEmail || 'arquitecto@empresa.com',
          companyName: checkoutCompany || 'Empresa B2B',
          taxId: checkoutTaxId || undefined,
          paymentMethod: checkoutPaymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Fallo al procesar suscripción');
      }

      const activeSub = {
        id: data.subscription.id,
        status: 'ACTIVE' as const,
        planId: selectedCheckoutPlan,
        planName: data.subscription.planName,
        billingCycle: pricingCycle,
        companyName: checkoutCompany || 'Empresa B2B',
        expiresAt: data.subscription.expiresAt,
      };

      setUserSubscription(activeSub);
      localStorage.setItem('oss_atlas_sub', JSON.stringify(activeSub));
      localStorage.setItem('oss_atlas_pro_token', data.proAccessToken);

      setCheckoutSuccess({
        invoiceNumber: data.subscription.invoiceNumber,
        planName: data.subscription.planName,
        token: data.proAccessToken,
        amount: data.subscription.amountUsd,
        features: data.unlockedFeatures || [],
      });
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleRequestIntegrationGuide = (tool: OpenSourceTool) => {
    // Si ya tiene plan Pro/Enterprise activo, abre el visor de guía directamente
    if (userSubscription?.status === 'ACTIVE') {
      setInspectedGuideTool(tool);
    } else {
      // Abre el checkout B2B destacando este beneficio exclusivo
      handleOpenCheckout(
        'PRO_ARCHITECTURE',
        `Para descargar la Guía de Integración (.md y .pdf) de ${tool.name} para Windows y macOS, activa tu suscripción a Pro Architecture.`
      );
    }
  };

  const handleSyncPreset = async (presetSlug: string) => {
    try {
      setIsSyncing(true);
      setSyncFeedback(null);
      const res = await fetch('/api/v1/catalog/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_preset', presetSlug }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Fallo al sincronizar preset');
      }
      setSyncFeedback({
        type: 'success',
        message: data.message || `Preset '${presetSlug}' sincronizado exitosamente.`,
        repoName: presetSlug,
      });
      await refreshCatalog();
    } catch (error) {
      setSyncFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido al sincronizar preset',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRepoForm.name.trim() || !customRepoForm.slug.trim() || !customRepoForm.description.trim()) {
      setSyncFeedback({
        type: 'error',
        message: 'Por favor complete todos los campos requeridos (Nombre, Slug y Descripción).',
      });
      return;
    }
    try {
      setIsSyncing(true);
      setSyncFeedback(null);
      const triggersArr = customRepoForm.triggers
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const dependenciesArr = customRepoForm.dependencies
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);

      const payload = {
        name: customRepoForm.name.trim(),
        slug: customRepoForm.slug.trim(),
        category: customRepoForm.category,
        license: customRepoForm.license,
        description: customRepoForm.description.trim(),
        stars: Number(customRepoForm.stars) || 0,
        commit_velocity_score: Number(customRepoForm.commitVelocity),
        security_score: Number(customRepoForm.securityScore),
        docs_score: Number(customRepoForm.docsScore),
        docker_command: customRepoForm.dockerCommand.trim(),
        integration_difficulty: customRepoForm.integrationDifficulty,
        triggers: triggersArr,
        dependencies: dependenciesArr,
      };

      const res = await fetch('/api/v1/catalog/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Fallo al procesar ingesta');
      }

      setSyncFeedback({
        type: 'success',
        message: data.message || `Herramienta '${customRepoForm.name}' sincronizada e indexada en PostgreSQL.`,
        repoName: customRepoForm.name,
      });
      await refreshCatalog();
      setCustomRepoForm({
        name: '',
        slug: '',
        category: 'AUTH',
        license: 'Apache-2.0',
        description: '',
        stars: 12500,
        commitVelocity: 94,
        securityScore: 96,
        docsScore: 95,
        dockerCommand: '',
        integrationDifficulty: 'Media',
        triggers: 'OIDC Session Verification, Admin Webhook',
        dependencies: 'Docker Engine, PostgreSQL 16+',
      });
    } catch (error) {
      setSyncFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido al procesar ingesta',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleReindexAll = async () => {
    try {
      setIsSyncing(true);
      setSyncFeedback(null);
      const res = await fetch('/api/v1/catalog/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reindex_all' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Fallo al reindexar');
      }
      setSyncFeedback({
        type: 'success',
        message: data.message || `Base de datos reindexada exitosamente. Total: ${data.totalProcessed}`,
      });
      await refreshCatalog();
    } catch (error) {
      setSyncFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error desconocido al reindexar',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Hybrid Search states (Checkpoint #3)
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>('');
  const [isSearchingHybrid, setIsSearchingHybrid] = useState<boolean>(false);
  const [hybridSearchResults, setHybridSearchResults] = useState<OpenSourceTool[] | null>(null);

  // Debounced execution of POST /api/v1/hybrid-search
  useEffect(() => {
    const trimmed = catalogSearchQuery.trim();
    if (!trimmed) {
      setHybridSearchResults(null);
      setIsSearchingHybrid(false);
      return;
    }

    let isCurrent = true;
    setIsSearchingHybrid(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/v1/hybrid-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: trimmed }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && isCurrent) {
          const mapped: OpenSourceTool[] = data.map((row: any, idx: number) => ({
            id: String(row.repo_id || row.id),
            name: row.tool_name || row.name,
            slug: row.slug || `repo/${idx}`,
            category: row.category || 'AI',
            license: row.license || 'MIT',
            healthScore: Math.round(Number(row.health_score) || 90),
            healthBreakdown: {
              commitVelocity: Math.round(Number(row.commit_velocity_score) || 92),
              securityStructural: Math.round(Number(row.security_score) || 94),
              communityDocs: Math.round(Number(row.docs_score) || 95),
            },
            stars: Number(row.stars) >= 1000 ? `${(Number(row.stars) / 1000).toFixed(1)}k` : String(row.stars || '10k'),
            lastSyncEtag: row.etag || `W/"rrf-${idx}"`,
            description: row.description || '',
            dockerCommand: row.docker_command || 'docker run -d ...',
            integrationDifficulty: (row.integration_difficulty as 'Baja' | 'Media' | 'Alta') || 'Media',
            triggers: Array.isArray(row.triggers) ? row.triggers : [],
            dependencies: Array.isArray(row.dependencies) ? row.dependencies : [],
            rrfBaseRank: idx + 1,
            rrfScore: typeof row.rrf_score === 'number' ? row.rrf_score : Number(row.rrf_score),
            lexicalRank: row.lexical_rank != null ? Number(row.lexical_rank) : null,
            vectorRank: row.vector_rank != null ? Number(row.vector_rank) : null,
            selfHostedSavingsB2B:
              row.category === 'AUTH'
                ? '$2,400 USD / mes en licencias MAU B2B'
                : row.category === 'DBS'
                ? '$1,850 USD / mes vs Cloud Propietario'
                : row.category === 'PAYMENTS'
                ? 'Reducción de 1.4% en tarifas de fallo'
                : '$1,200 USD / mes vs SaaS Propietario',
          }));
          setHybridSearchResults(mapped);
        }
      } catch (err) {
        console.warn('Error en búsqueda híbrida:', err);
      } finally {
        if (isCurrent) setIsSearchingHybrid(false);
      }
    }, 250);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [catalogSearchQuery]);

  // RAG Assistant Chat Mock states (Checkpoint #10)
  const [activeScenarioId, setActiveScenarioId] = useState<string>(B2B_RAG_SCENARIOS[0].id);
  const [customBusinessQuery, setCustomBusinessQuery] = useState<string>('');
  const [isSynthesizingRag, setIsSynthesizingRag] = useState<boolean>(false);
  const [showSqlQueryModal, setShowSqlQueryModal] = useState<boolean>(false);

  // Filtered tools computation
  const filteredCatalogTools = useMemo<OpenSourceTool[]>(() => {
    const baseTools = hybridSearchResults !== null ? hybridSearchResults : catalogTools;
    return baseTools.filter((tool: OpenSourceTool) => {
      const matchesCategory = selectedCategory === 'ALL' || tool.category === selectedCategory;
      const matchesLicense = selectedLicenseFilter === 'ALL' || tool.license === selectedLicenseFilter;
      return matchesCategory && matchesLicense;
    });
  }, [catalogTools, hybridSearchResults, selectedCategory, selectedLicenseFilter]);

  // Live RAG generation state
  const [liveRagResponse, setLiveRagResponse] = useState<B2BScenario | null>(null);
  const [ragInputText, setRagInputText] = useState<string>('');

  // Active RAG scenario computation
  const currentScenario = useMemo<B2BScenario>(() => {
    if (liveRagResponse) return liveRagResponse;
    return (
      B2B_RAG_SCENARIOS.find((scenario: B2BScenario) => scenario.id === activeScenarioId) || B2B_RAG_SCENARIOS[0]
    );
  }, [liveRagResponse, activeScenarioId]);

  // Request live architecture synthesis from /api/v1/rag/architecture
  const requestRagArchitecture = async (promptText: string) => {
    setIsSynthesizingRag(true);
    setCustomBusinessQuery(promptText);
    setActiveNavTab('RAG_ARCHITECT');

    setTimeout(() => {
      const ragElement = document.getElementById('rag-assistant-section');
      if (ragElement) {
        ragElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    try {
      const res = await fetch('/api/v1/rag/architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data && data.nodes) {
        const scenario: B2BScenario = {
          id: 'live-generated-architecture',
          title: promptText.length > 55 ? promptText.slice(0, 52) + '...' : promptText,
          promptText: data.prompt || promptText,
          businessDomain: data.business_domain || 'Arquitectura B2B Personalizada',
          ragas: {
            contextPrecision: data.ragas?.contextPrecision ?? 0.98,
            contextRecall: data.ragas?.contextRecall ?? 0.96,
            faithfulness: data.ragas?.faithfulness ?? 1.0,
            answerRelevance: data.ragas?.answerRelevance ?? 0.97,
            latencyMs: data.ragas?.latencyMs ?? 180,
          },
          executiveSummary: data.executive_summary,
          sqlHybridQuerySnippet: data.sql_hybrid_query,
          nodes: data.nodes.map((n: any) => ({
            layer: n.layer,
            toolName: n.tool_name,
            license: n.license as LicenseType,
            healthScore: Number(n.health_score),
            rrfScore: Number(n.rrf_score),
            lexicalMatch: n.lexical_match || 'Match FTS',
            vectorCosine: n.vector_cosine || 0.95,
            rationale: n.rationale,
            integrationTrigger: n.integration_trigger,
          })),
        };
        setLiveRagResponse(scenario);
      }
    } catch (err) {
      console.warn('Error llamando a /api/v1/rag/architecture:', err);
    } finally {
      setIsSynthesizingRag(false);
    }
  };

  // Handlers
  const handleHeroPromptSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!heroPromptInput.trim()) return;
    requestRagArchitecture(heroPromptInput.trim());
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <IconCpuArchitecture className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white">
                  OSS Atlas
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {t.brandTag}
                </span>
              </div>
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
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeNavTab === 'CATALOG'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.navCatalog}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('RAG_ARCHITECT');
                document.getElementById('rag-assistant-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeNavTab === 'RAG_ARCHITECT'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.navRag}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('PRICING_B2B');
                document.getElementById('pricing-b2b-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeNavTab === 'PRICING_B2B'
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              {t.navPricing}
            </button>
          </nav>

          {/* CTA with Active State */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher ES / EN */}
            <button
              type="button"
              onClick={toggleLanguage}
              title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400 text-slate-200 transition-all cursor-pointer shadow-sm"
            >
              <span>{lang === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}</span>
            </button>

            {/* Subscription Badge / Upgrade Button */}
            <button
              type="button"
              onClick={() => handleOpenCheckout(userSubscription?.planId || 'PRO_ARCHITECTURE')}
              title={userSubscription?.status === 'ACTIVE' ? 'Gestionar Suscripción B2B' : 'Desbloquear Capacidades Pro'}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                userSubscription?.status === 'ACTIVE'
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-950/30'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-amber-500/30 text-amber-300/90 hover:border-amber-400'
              }`}
            >
              <span>⭐</span>
              <span className="hidden sm:inline">
                {userSubscription?.status === 'ACTIVE'
                  ? t.navProActive
                  : t.navUpgradePro}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSyncModalOpen(true);
                setSyncFeedback(null);
              }}
              title="Abrir Pipeline de Ingesta Continua & Sincronización"
              className={`group relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold border transition-all duration-200 cursor-pointer ${
                isPipelineSyncActive
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10 hover:border-emerald-400'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-500/40'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isPipelineSyncActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`}
              />
              <span>
                {isPipelineSyncActive ? t.navSyncActive : t.navSyncCache}
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
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.heroBadge}</span>
            </div>

            {/* Hero Headline & Tagline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {t.heroTitlePrefix}{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {t.heroTitleGradient}
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              {t.heroSubtitle1}{' '}
              <strong className="text-white font-semibold">
                {t.heroSubtitleBold}
              </strong>{' '}
              {t.heroSubtitle2}
            </p>

            {/* Interactive Prompt Bar Controlled via React useState */}
            <form onSubmit={handleHeroPromptSubmit} className="mt-8 space-y-4 text-left">
              <div className="relative rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-2 sm:p-3 shadow-xl shadow-cyan-950/30 focus-within:border-cyan-400 transition-all">
                <label htmlFor="b2b-hero-prompt" className="sr-only">
                  {t.heroSearchPlaceholder}
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 px-2">
                    <IconSearchSparkle className="w-6 h-6 text-cyan-400 shrink-0" />
                    <input
                      id="b2b-hero-prompt"
                      type="text"
                      value={heroPromptInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeroPromptInput(e.target.value)}
                      placeholder={t.heroSearchPlaceholder}
                      className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all shrink-0 cursor-pointer"
                  >
                    <IconAiBrainRag className="w-4 h-4" />
                    <span>{t.heroGenerateButton}</span>
                  </button>
                </div>

                {/* Live Engine Telemetry Footer inside Prompt Bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] font-mono text-slate-400">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-cyan-300">
                      {t.heroFtsDict}
                    </span>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setUseHalfvecOptimization((prev: boolean) => !prev)}
                      className="underline decoration-dotted hover:text-emerald-300"
                    >
                      {t.heroHnswIndex} {useHalfvecOptimization ? t.heroHnswRam : t.heroHnswStd}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{t.heroRrfConstant}{rrfConstantK}</span>
                    <button
                      type="button"
                      onClick={() => setRrfConstantK((prev: number) => (prev === 60 ? 40 : 60))}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      {t.heroAdjustK}
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset Quick Prompts */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="text-xs font-mono text-slate-400">{t.heroTestScenarios}</span>
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
                    {getScenarioTitle(scenario.id, lang)}
                  </button>
                ))}
              </div>
            </form>

            {/* Executive Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
                <p className="text-xs font-mono text-slate-400">{t.heroMetricSavedTimeTitle}</p>
                <p className="text-xl font-bold text-white mt-0.5">{t.heroMetricSavedTimeVal}</p>
                <p className="text-[11px] text-emerald-400 font-mono">{t.heroMetricSavedTimeSub}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
                <p className="text-xs font-mono text-slate-400">{t.heroMetricTeamCapTitle}</p>
                <p className="text-xl font-bold text-white mt-0.5">{t.heroMetricTeamCapVal}</p>
                <p className="text-[11px] text-cyan-400 font-mono">{t.heroMetricTeamCapSub}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
                <p className="text-xs font-mono text-slate-400">{t.heroMetricRateLimitTitle}</p>
                <p className="text-xl font-bold text-white mt-0.5">{t.heroMetricRateLimitVal}</p>
                <p className="text-[11px] text-violet-400 font-mono">{t.heroMetricRateLimitSub}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-left">
                <p className="text-xs font-mono text-slate-400">{t.heroMetricRagasTitle}</p>
                <p className="text-xl font-bold text-emerald-400 mt-0.5">{t.heroMetricRagasVal}</p>
                <p className="text-[11px] text-amber-400 font-mono">{t.heroMetricRagasSub}</p>
              </div>
            </div>
          </div>
        </section>

        {}
        <section id="categories-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                {t.categoriesBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {t.categoriesTitle}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {t.categoriesSubtitle}
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
                {t.categoriesAllBtn} (122 Repos)
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
                      {getCategoryName(cat.id, lang)}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{getCategoryDesc(cat.id, lang)}</p>
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
                      <span className="text-slate-400">{cat.repoCount} {lang === 'es' ? 'repositorios' : 'repositories'}</span>
                      <span className="text-emerald-400 font-semibold">
                        {lang === 'es' ? 'Health Prom:' : 'Avg Health:'} {cat.avgHealthScore}%
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
                {t.catalogBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {t.catalogTitle}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {t.catalogSubtitle}
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                {isDbConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    PostgreSQL 16 + pgvector ({catalogTools.length} {lang === 'es' ? 'herramientas' : 'tools'})
                  </span>
                ) : isLoadingCatalog ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    {lang === 'es' ? 'Cargando catálogo desde PostgreSQL...' : 'Loading catalog from PostgreSQL...'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-400 border border-slate-700">
                    {lang === 'es' ? 'Catálogo en caché local' : 'Cached local catalog'}
                  </span>
                )}
                <span className="text-xs font-mono text-slate-400 ml-1">
                  {lang === 'es' ? 'Mostrando' : 'Showing'} <strong className="text-white">{filteredCatalogTools.length}</strong> {lang === 'es' ? 'de' : 'of'} {catalogTools.length}
                </span>
              </div>
            </div>

            {/* License Filter Controls & Pipeline Sync Button */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-slate-400 mr-1">{t.catalogFilterLicense}</span>
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
                    {lic === 'ALL' ? t.catalogAllLicenses : lic}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSyncModalOpen(true);
                  setSyncFeedback(null);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>{t.catalogSyncButton}</span>
              </button>
            </div>
          </div>

          {/* Interactive Hybrid Search Bar (FTS 'simple' + HNSW halfvec + RRF k=60) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-lg">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2.5 flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-cyan-400 transition-all">
                <IconSearchSparkle className="w-5 h-5 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  value={catalogSearchQuery}
                  onChange={(e) => setCatalogSearchQuery(e.target.value)}
                  placeholder={t.catalogSearchPlaceholder}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
                />
                {catalogSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCatalogSearchQuery('')}
                    className="text-slate-400 hover:text-white text-xs font-mono px-2 py-0.5 rounded bg-slate-800 shrink-0 cursor-pointer"
                  >
                    ✕ {lang === 'es' ? 'Limpiar' : 'Clear'}
                  </button>
                )}
              </div>
              {isSearchingHybrid ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  {lang === 'es' ? 'Calculando RRF en PostgreSQL...' : 'Computing RRF in PostgreSQL...'}
                </div>
              ) : hybridSearchResults !== null ? (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {lang === 'es' ? `Ranking RRF activo (${hybridSearchResults.length} coincidencias)` : `Active RRF Ranking (${hybridSearchResults.length} matches)`}
                </div>
              ) : null}
            </div>

            {/* Quick Keyword Suggestions */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-slate-500 font-semibold">{lang === 'es' ? 'Búsquedas rápidas:' : 'Quick searches:'}</span>
              {(lang === 'es' ? [
                'autenticacion SSO',
                'pagos pasarela multi-adquirente',
                'motor busqueda rust',
                'PostgreSQL pgvector',
                'orquestacion RAG agentes',
                'suscripciones billing',
              ] : [
                'SSO authentication',
                'multi-acquirer payments',
                'rust search engine',
                'PostgreSQL pgvector',
                'agent RAG orchestration',
                'billing subscriptions',
              ]).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setCatalogSearchQuery(term)}
                  className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    catalogSearchQuery === term
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-slate-700'
                  }`}
                >
                  ⚡ {term}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Tools Grid (Live Catalog from PostgreSQL 16) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredCatalogTools.length === 0 ? (
              <div className="col-span-full py-12 px-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-mono text-xl">
                  ∅
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'es' ? 'Sin herramientas para este filtro' : 'No tools found for this filter'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    {selectedCategory !== 'ALL' && (
                      <>{lang === 'es' ? 'En la categoría' : 'In category'} <strong className="text-cyan-300 font-mono">{selectedCategory}</strong>, </>
                    )}
                    {lang === 'es'
                      ? `no existen herramientas registradas con la licencia ${selectedLicenseFilter}.`
                      : `no tools are registered with license ${selectedLicenseFilter}.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedLicenseFilter('ALL');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
                >
                  {t.catalogResetFilters} ({lang === 'es' ? 'Ver todas las herramientas' : 'View all tools'})
                </button>
              </div>
            ) : (
              filteredCatalogTools.map((tool: OpenSourceTool) => {
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
                            {lang === 'es' ? 'Licencia:' : 'License:'} {tool.license}
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
                          {t.cardHealthScore}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{tool.description}</p>

                    {/* Health Breakdown Bars (15% Commits, 20% Security, 65% Docs/Community) */}
                    <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{t.cardWeightedBreakdown}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-400 font-bold">RRF #{tool.rrfBaseRank}</span>
                          {tool.rrfScore != null && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-[10px] text-cyan-300 border border-cyan-800/40">
                              score: {tool.rrfScore.toFixed(4)}
                            </span>
                          )}
                        </div>
                      </div>
                      {(tool.lexicalRank != null || tool.vectorRank != null) && (
                        <div className="flex items-center justify-between text-[10px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          <span>{lang === 'es' ? 'Ranking Híbrido:' : 'Hybrid Ranking:'}</span>
                          <span className="text-cyan-300">
                            FTS: {tool.lexicalRank ? `#${tool.lexicalRank}` : '—'} • Vec: {tool.vectorRank ? `#${tool.vectorRank}` : '—'}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block">{t.cardCommits}</span>
                          <span className="text-white font-bold">{tool.healthBreakdown.commitVelocity}%</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block">{t.cardSecurity}</span>
                          <span className="text-emerald-300 font-bold">{tool.healthBreakdown.securityStructural}%</span>
                        </div>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block">{t.cardDocs}</span>
                          <span className="text-cyan-300 font-bold">{tool.healthBreakdown.communityDocs}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Standardized Integration Metadata (Triggers & Dependencies) */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between font-mono">
                        <span className="text-slate-400">{t.cardDifficulty}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                          {tool.integrationDifficulty}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-mono text-slate-400 block mb-1">{t.cardTriggers}</span>
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
                            <span className="text-emerald-300">{t.cardDockerCopied}</span>
                          </>
                        ) : (
                          <>
                            <IconTerminalCode className="w-4 h-4 text-cyan-400" />
                            <span>{t.cardCopyDocker}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setInspectedToolId(tool.id)}
                        className="px-3 py-2.5 rounded-xl text-xs font-mono font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
                      >
                        {t.cardInspect}
                      </button>
                    </div>

                    {/* B2B Feature: Step-by-Step Integration Guide (.md & .pdf for Win & Mac) */}
                    <button
                      type="button"
                      onClick={() => handleRequestIntegrationGuide(tool)}
                      className="w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-gradient-to-r from-amber-500/10 via-slate-950 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span>📄</span>
                        <span>{t.cardIntegrationGuide}</span>
                      </span>
                      <span className="shrink-0 px-2 py-0.5 rounded bg-amber-500/20 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                        {userSubscription?.status === 'ACTIVE' ? t.cardDownloadBadge : t.cardProBadge}
                      </span>
                    </button>
                  </div>
                </article>
              );
            }))}
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
                <span>{t.ragBadge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {t.ragTitle}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {t.ragSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowSqlQueryModal((prev: boolean) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer"
              >
                <IconTerminalCode className="w-4 h-4" />
                <span>
                  {showSqlQueryModal
                    ? (lang === 'es' ? 'Ocultar SQL Híbrido RRF' : 'Hide Hybrid SQL RRF')
                    : (lang === 'es' ? 'Ver SQL Híbrido RRF + halfvec' : 'View Hybrid SQL RRF + halfvec')}
                </span>
              </button>
            </div>
          </div>

          {/* Optional SQL Hybrid Query Inspector */}
          {showSqlQueryModal && (
            <div className="rounded-2xl bg-slate-950 border border-cyan-500/40 p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>
                  {lang === 'es'
                    ? "Consulta ejecutada en PostgreSQL (Rama Léxica 'simple' + Rama Vectorial HNSW halfvec)"
                    : "PostgreSQL query executed (Lexical 'simple' + HNSW halfvec vector branch)"}
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
                  {t.ragSelectCase}
                </h3>
                <div className="space-y-2">
                  {liveRagResponse && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomBusinessQuery(liveRagResponse.promptText);
                      }}
                      className="w-full text-left p-3.5 rounded-xl border border-emerald-400/80 bg-emerald-500/15 text-white shadow-lg shadow-emerald-950/40 transition-all cursor-pointer ring-1 ring-emerald-400/40"
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          {t.ragLiveGenerated}
                        </span>
                        <span className="text-emerald-400">{liveRagResponse.ragas.latencyMs}ms</span>
                      </div>
                      <p className="text-xs font-semibold leading-snug">{liveRagResponse.title}</p>
                    </button>
                  )}
                  {B2B_RAG_SCENARIOS.map((scen: B2BScenario) => {
                    const active = !liveRagResponse && scen.id === activeScenarioId;
                    return (
                      <button
                        key={scen.id}
                        type="button"
                        onClick={() => {
                          setLiveRagResponse(null);
                          setIsSynthesizingRag(true);
                          setActiveScenarioId(scen.id);
                          setCustomBusinessQuery(scen.promptText);
                          setTimeout(() => setIsSynthesizingRag(false), 200);
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
                        <p className="text-xs font-semibold leading-snug">{getScenarioTitle(scen.id, lang)}</p>
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
                      {lang === 'es' ? 'Marco de Auditoría B2B' : 'B2B Audit Framework'}
                    </span>
                    <h3 className="text-sm font-bold text-white">{t.ragMetricsTitle}</h3>
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
                      {(currentScenario.ragas.faithfulness * 100).toFixed(0)}% ({lang === 'es' ? 'Cero Alucinación' : 'Zero Hallucination'})
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
                  {lang === 'es'
                    ? 'Mitigación Riesgo R3: Si la similitud del coseno cae bajo el umbral seguro (0.78), el prompt detiene la inferencia antes de inventar dependencias inexistentes.'
                    : 'R3 Risk Mitigation: If cosine similarity falls below safety threshold (0.78), inference halts before fabricating non-existent dependencies.'}
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
                          ? (lang === 'es' ? 'Calculando Fusión de Rango Recíproco (RRF)...' : 'Computing Reciprocal Rank Fusion (RRF)...')
                          : (lang === 'es' ? 'Mapa de Arquitectura Emitido y Justificado' : 'Emitted & Justified Architecture Blueprint')}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {lang === 'es' ? 'Fórmula RRF:' : 'RRF Formula:'} 1 / ({rrfConstantK} + rank_lex) + 1 / ({rrfConstantK} + rank_vec)
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {currentScenario.executiveSummary}
                    </p>

                    {/* Emitted Architecture Nodes */}
                    <div className="space-y-3">
                      {currentScenario.nodes.map((node: RagArchitectureNode, idx: number) => (
                        <div
                          key={`${node.layer}-${node.toolName}-${idx}`}
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
                              {lang === 'es' ? 'Match Léxico:' : 'Lexical Match:'} <strong className="text-slate-200">{node.lexicalMatch}</strong> | {lang === 'es' ? 'Coseno:' : 'Cosine:'}{' '}
                              <strong className="text-cyan-300">{node.vectorCosine}</strong>
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">{node.rationale}</p>

                          <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-amber-300">
                            <span>🔗 {lang === 'es' ? 'Trigger de Integración:' : 'Integration Trigger:'}</span>
                            <span className="text-slate-300">{node.integrationTrigger}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Prompt Input inside RAG Assistant */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (ragInputText.trim()) {
                        requestRagArchitecture(ragInputText.trim());
                        setRagInputText('');
                      }
                    }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2"
                  >
                    <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-cyan-400 transition-all">
                      <IconSearchSparkle className="w-4 h-4 text-cyan-400 shrink-0" />
                      <input
                        type="text"
                        value={ragInputText}
                        onChange={(e) => setRagInputText(e.target.value)}
                        placeholder={
                          lang === 'es'
                            ? "Escribe otra necesidad de negocio (ej: 'SaaS multi-tenant con login LDAP y facturación')..."
                            : "Enter another business requirement (e.g., 'Multi-tenant SaaS with LDAP login and billing')..."
                        }
                        className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSynthesizingRag || !ragInputText.trim()}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 disabled:opacity-50 transition-all cursor-pointer shrink-0 shadow-lg shadow-cyan-500/20"
                    >
                      {isSynthesizingRag ? (
                        <>
                          <span className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                          <span>{t.ragGenerating}</span>
                        </>
                      ) : (
                        <>
                          <IconAiBrainRag className="w-4 h-4" />
                          <span>{t.ragGenerateButton}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* B2B Pricing & Monetization Section (Open-Core SaaS Model) */}
        <section
          id="pricing-b2b-section"
          className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900/95 via-slate-950 to-slate-900/90 p-6 sm:p-10 lg:p-12 shadow-2xl space-y-10"
        >
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
              <span>{t.pricingBadge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.pricingTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t.pricingSubtitle}
            </p>

            {/* Billing Cycle Switcher */}
            <div className="pt-2 flex items-center justify-center gap-3 text-xs font-mono">
              <span className={pricingCycle === 'monthly' ? 'text-white font-bold' : 'text-slate-400'}>
                {t.pricingMonthly}
              </span>
              <button
                type="button"
                onClick={() => setPricingCycle((prev) => (prev === 'monthly' ? 'annual' : 'monthly'))}
                className="w-14 h-7 rounded-full bg-slate-900 border border-amber-500/40 p-1 flex items-center transition-colors cursor-pointer"
                aria-label="Cambiar ciclo de facturación"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-amber-400 shadow-md transform transition-transform ${
                    pricingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`flex items-center gap-1.5 ${pricingCycle === 'annual' ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                <span>{t.pricingAnnual}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] text-emerald-300 border border-emerald-500/40 font-bold">
                  {t.pricingAnnualDiscount}
                </span>
              </span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Tier 1: Community (Free Forever) */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 text-slate-300">
                  OPEN-CORE LIBRE
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Community</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Para desarrolladores independientes que buscan explorar herramientas open source evaluadas.
                  </p>
                </div>
                <div className="pt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">$0</span>
                  <span className="text-xs text-slate-400 font-mono">USD / siempre libre</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Acceso al Catálogo de 13 herramientas curadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Búsqueda Híbrida RRF (FTS + vectores halfvec)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Cálculo transparente de Health Score ponderado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Comandos Docker Run listos para ejecutar</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-500">
                    <span>✕</span>
                    <span>3 consultas diarias al Arquitecto RAG</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-500">
                    <span>✕</span>
                    <span>Guías descargables en Markdown y PDF</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                disabled
                className="w-full py-3 rounded-xl text-xs font-mono font-semibold bg-slate-800/80 text-slate-400 border border-slate-700/80 cursor-default text-center"
              >
                {userSubscription?.status === 'ACTIVE' ? t.pricingBaseIncluded : t.pricingCurrentPlan}
              </button>
            </div>

            {/* Tier 2: Pro Architecture (Most Popular B2B) */}
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-2 border-amber-400/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl shadow-amber-950/40">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-mono font-extrabold text-slate-950 shadow-md">
                ⭐ RECOMENDADO B2B • MÁS POPULAR
              </div>

              <div className="space-y-4">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ARQUITECTURA & GUÍAS PRO
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Pro Architecture</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Para arquitectos de software, tech leads y consultores B2B que necesitan integrar herramientas rápidamente.
                  </p>
                </div>
                <div className="pt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-amber-300 font-mono">
                    ${pricingCycle === 'annual' ? '190' : '19'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    USD / {pricingCycle === 'annual' ? 'año (equiv. $15.8/mes)' : 'mes'}
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200 pt-4 border-t border-slate-800">
                  <li className="flex items-start gap-2 text-amber-200 font-semibold bg-amber-500/10 p-2 rounded-lg border border-amber-500/30">
                    <span className="text-amber-400 font-bold">★</span>
                    <span>Descarga de Guías de Integración (.md y .pdf) paso a paso para Windows y macOS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Consultas ilimitadas al Arquitecto RAG sin límites diarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Generador de manifiestos unificados (Docker Compose & Terraform)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Acceso prioritario al Pipeline de Ingesta Continua (ETags en vivo)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Soporte asíncrono de arquitectura con SLA &lt; 12h</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCheckout('PRO_ARCHITECTURE')}
                className="w-full py-3.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 transition-all cursor-pointer shadow-lg shadow-amber-500/20 text-center"
              >
                {userSubscription?.planId === 'PRO_ARCHITECTURE' && userSubscription.status === 'ACTIVE'
                  ? t.pricingProActive
                  : t.pricingUpgradePro}
              </button>
            </div>

            {/* Tier 3: Enterprise Hub */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-violet-500/20 text-violet-300 border border-violet-500/40">
                  EQUIPOS & ENTERPRISE
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Enterprise Hub</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Para empresas y factorías de software con múltiples células que requieren gobernanza y cumplimiento.
                  </p>
                </div>
                <div className="pt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    ${pricingCycle === 'annual' ? '490' : '49'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    USD / {pricingCycle === 'annual' ? 'año (equiv. $40.8/mes)' : 'mes'}
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Todo lo incluido en Pro Architecture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Licencia multi-asiento para hasta 10 arquitectos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Auditorías automáticas de cumplimiento (PCI-DSS, SOC2, HIPAA)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Conectores directos a pipelines CI/CD (GitHub / GitLab)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Facturación corporativa con RUT / Tax ID / NIT</span>
                  </li>
                  <li className="flex items-start gap-2 text-violet-300 font-medium">
                    <span className="text-violet-400 font-bold">✓</span>
                    <span>Sesión 1-on-1 de revisión arquitectónica con EdisonPEÑA (Iotdico)</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleOpenCheckout('ENTERPRISE_HUB')}
                className="w-full py-3 rounded-xl text-xs font-mono font-semibold bg-violet-600/30 hover:bg-violet-600/50 text-violet-200 border border-violet-500/50 transition-all cursor-pointer text-center"
              >
                {userSubscription?.planId === 'ENTERPRISE_HUB' && userSubscription.status === 'ACTIVE'
                  ? t.pricingEnterpriseActive
                  : t.pricingGetEnterprise}
              </button>
            </div>
          </div>

          {/* Guarantee & Trust Badges */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">🛡️</span>
              <span>{t.pricingGuarantee}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-400">📑</span>
              <span>{t.pricingInvoiceNotice}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400">⚡</span>
              <span>{t.pricingInstantNotice}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Pipeline Ingestion & Sync Modal (Paso 5) */}
      {isSyncModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          aria-labelledby="sync-modal-title"
        >
          <div className="max-w-3xl w-full rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Pipeline de Ingesta Continua (POST /api/v1/catalog/sync)</span>
                </div>
                <h3 id="sync-modal-title" className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                  Sincronización de Catálogo & Cálculo Semántico
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Indexación en PostgreSQL 16 con vectorización unitaria <code className="text-cyan-300">halfvec(1536)</code> y Health Score ponderado (15% commits + 20% security + 65% docs).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono cursor-pointer transition-colors"
              >
                ✕ Cerrar [ESC]
              </button>
            </div>

            {/* Feedback Alert if any */}
            {syncFeedback && (
              <div
                className={`p-4 rounded-2xl border text-xs font-mono transition-all ${
                  syncFeedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <span>{syncFeedback.type === 'success' ? '✓ Operación Exitosa' : '✕ Error en Ingesta'}</span>
                </div>
                <p className="mt-1 leading-relaxed">{syncFeedback.message}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setSyncTab('PRESETS')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  syncTab === 'PRESETS'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                ⚡ Presets Curados B2B
              </button>
              <button
                type="button"
                onClick={() => setSyncTab('CUSTOM')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  syncTab === 'CUSTOM'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                + Ingesta Personalizada
              </button>
              <button
                type="button"
                onClick={() => setSyncTab('MAINTENANCE')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                  syncTab === 'MAINTENANCE'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                ⚙️ Reindexación Global
              </button>
            </div>

            {/* Tab 1: PRESETS */}
            {syncTab === 'PRESETS' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Herramientas clave pre-curadas listas para ser indexadas en PostgreSQL con sus disparadores funcionales y vectores semánticos:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    {
                      name: 'Zitadel Cloud-Native IAM',
                      slug: 'zitadel/zitadel',
                      cat: 'AUTH',
                      desc: 'IAM cloud-native en Go con OIDC, multi-tenancy nativo y auditoría de eventos.',
                      stars: '18.5k',
                    },
                    {
                      name: 'Qdrant Vector Database',
                      slug: 'qdrant/qdrant',
                      cat: 'DBS',
                      desc: 'Base de datos vectorial ultra-optimizada en Rust con filtrado de carga útil.',
                      stars: '22.4k',
                    },
                    {
                      name: 'Casbin AuthZ Engine',
                      slug: 'casbin/casbin',
                      cat: 'AUTH',
                      desc: 'Control de acceso compatible con RBAC, ABAC, ACL y políticas RESTful multinivel.',
                      stars: '17.2k',
                    },
                    {
                      name: 'OpenFGA Zanzibar AuthZ',
                      slug: 'openfga/openfga',
                      cat: 'AUTH',
                      desc: 'Autorización de grano fino (ReBAC) inspirada en Google Zanzibar y CNCF.',
                      stars: '4.8k',
                    },
                  ].map((preset) => {
                    const alreadyInCatalog = catalogTools.some((t) => t.slug === preset.slug);
                    return (
                      <div
                        key={preset.slug}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3 transition-all"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                              {preset.cat}
                            </span>
                            <span className="text-[11px] font-mono text-amber-300">★ {preset.stars}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{preset.name}</h4>
                          <p className="text-[11px] font-mono text-slate-400">{preset.slug}</p>
                          <p className="text-xs text-slate-300 leading-relaxed">{preset.desc}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                          {alreadyInCatalog ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> En BD
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-500">Pendiente de sync</span>
                          )}

                          <button
                            type="button"
                            disabled={isSyncing}
                            onClick={() => handleSyncPreset(preset.slug)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 disabled:opacity-50 transition-all cursor-pointer"
                          >
                            {isSyncing ? (
                              <span className="w-3 h-3 rounded-full border-2 border-emerald-300 border-t-transparent animate-spin" />
                            ) : (
                              <span>{alreadyInCatalog ? '↻ Re-sincronizar' : '⚡ Sincronizar'}</span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: CUSTOM REPO FORM */}
            {syncTab === 'CUSTOM' && (
              <form onSubmit={handleSyncCustomSubmit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1">Nombre de la Herramienta *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Formbricks Survey Suite"
                      value={customRepoForm.name}
                      onChange={(e) => setCustomRepoForm({ ...customRepoForm, name: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Slug de GitHub (owner/repo) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: formbricks/formbricks"
                      value={customRepoForm.slug}
                      onChange={(e) => setCustomRepoForm({ ...customRepoForm, slug: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1">Capa B2B *</label>
                    <select
                      value={customRepoForm.category}
                      onChange={(e) =>
                        setCustomRepoForm({
                          ...customRepoForm,
                          category: e.target.value as Exclude<CategoryId, 'ALL'>,
                        })
                      }
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="AUTH">AUTH (Identidad & IAM)</option>
                      <option value="DBS">DBS (Bases de Datos & Búsqueda)</option>
                      <option value="PAYMENTS">PAYMENTS (Pagos & Facturación)</option>
                      <option value="AI">AI (Orquestación & RAG)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Licencia *</label>
                    <select
                      value={customRepoForm.license}
                      onChange={(e) =>
                        setCustomRepoForm({
                          ...customRepoForm,
                          license: e.target.value as LicenseType,
                        })
                      }
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Apache-2.0">Apache-2.0</option>
                      <option value="MIT">MIT</option>
                      <option value="PostgreSQL">PostgreSQL</option>
                      <option value="BSL-1.1">BSL-1.1</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Estrellas GitHub</label>
                    <input
                      type="number"
                      min={0}
                      value={customRepoForm.stars}
                      onChange={(e) => setCustomRepoForm({ ...customRepoForm, stars: Number(e.target.value) })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Descripción Funcional B2B *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Descripción orientada a valor comercial y arquitectura de autoservicio..."
                    value={customRepoForm.description}
                    onChange={(e) => setCustomRepoForm({ ...customRepoForm, description: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Algoritmo Health Score Ponderado con Preview en Vivo */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Métricas de Calidad & Salud Ponderada</span>
                    <span className="text-xs font-bold text-emerald-400">
                      Health Score Proyectado: {previewHealthScore}%
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Velocidad Commits (15%)</span>
                        <span className="text-white">{customRepoForm.commitVelocity}</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={100}
                        value={customRepoForm.commitVelocity}
                        onChange={(e) =>
                          setCustomRepoForm({ ...customRepoForm, commitVelocity: Number(e.target.value) })
                        }
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Seguridad Estructural (20%)</span>
                        <span className="text-white">{customRepoForm.securityScore}</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={100}
                        value={customRepoForm.securityScore}
                        onChange={(e) =>
                          setCustomRepoForm({ ...customRepoForm, securityScore: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-400 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Comunidad & Docs (65%)</span>
                        <span className="text-white">{customRepoForm.docsScore}</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={100}
                        value={customRepoForm.docsScore}
                        onChange={(e) => setCustomRepoForm({ ...customRepoForm, docsScore: Number(e.target.value) })}
                        className="w-full accent-violet-400 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1">Triggers (separados por coma)</label>
                    <input
                      type="text"
                      placeholder="Webhooks, OIDC Event, REST API Hook"
                      value={customRepoForm.triggers}
                      onChange={(e) => setCustomRepoForm({ ...customRepoForm, triggers: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Dependencias (separadas por coma)</label>
                    <input
                      type="text"
                      placeholder="Docker Engine, PostgreSQL 16+"
                      value={customRepoForm.dependencies}
                      onChange={(e) => setCustomRepoForm({ ...customRepoForm, dependencies: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Comando Docker Run</label>
                  <input
                    type="text"
                    placeholder="docker run -d --name service -p 8080:8080 image:tag"
                    value={customRepoForm.dockerCommand}
                    onChange={(e) => setCustomRepoForm({ ...customRepoForm, dockerCommand: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-mono focus:border-cyan-400 focus:outline-none text-[11px]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSyncing}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    {isSyncing ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        <span>Generando halfvec(1536) & Sincronizando...</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-slate-950" />
                        <span>Disparar Ingesta en PostgreSQL</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: MAINTENANCE / REINDEX ALL */}
            {syncTab === 'MAINTENANCE' && (
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-sm font-bold text-white">Estado del Almacén Vectorial en PostgreSQL</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Los vectores semánticos se almacenan en formato <code className="text-cyan-300">halfvec(1536)</code> (16 bits de punto flotante) con índices HNSW (<code className="text-emerald-300">m=16, ef_construction=64</code>). Esto reduce un 50% el consumo de RAM con una fidelidad superior al 99.8%.
                  </p>
                  <div className="pt-2 flex items-center gap-3 text-slate-300">
                    <span>Herramientas activas en catálogo: <strong className="text-emerald-400">{catalogTools.length}</strong></span>
                    <span>•</span>
                    <span>Conexión: <strong className="text-cyan-400">PostgreSQL 16 en vivo</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
                  <p className="leading-relaxed">
                    Esta acción recalcula el Health Score ponderado y regenera el vector semántico <code className="text-white">halfvec(1536)</code> para <strong>todos los registros</strong> de la tabla <code className="text-white">oss_repositories</code>.
                  </p>
                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={handleReindexAll}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isSyncing ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        <span>Recalculando todo el Catálogo...</span>
                      </>
                    ) : (
                      <span>⚙️ Recalcular Embeddings & Health Scores Globales</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* B2B Checkout & Subscription Modal */}
      {isCheckoutModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          aria-labelledby="checkout-modal-title"
        >
          <div className="max-w-2xl w-full rounded-3xl bg-slate-900 border border-amber-500/50 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <span>⭐ CHECKOUT SEGURO B2B</span>
                  <span>•</span>
                  <span>SSL 256-BIT ENCRIPTADO</span>
                </div>
                <h3 id="checkout-modal-title" className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                  {selectedCheckoutPlan === 'PRO_ARCHITECTURE'
                    ? 'Suscripción OSS Atlas Pro Architecture'
                    : 'Suscripción OSS Atlas Enterprise Hub'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Facturación oficial emitida por EdisonPEÑA (Iotdico) · Dominio <code className="text-cyan-300">ossatlas.iotdico.com</code>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCheckoutModalOpen(false);
                  setCheckoutSuccess(null);
                  setCheckoutError(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono cursor-pointer transition-colors"
              >
                ✕ Cerrar [ESC]
              </button>
            </div>

            {/* If Notice from Feature Trigger */}
            {checkoutGuideNotice && !checkoutSuccess && (
              <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-start gap-2.5">
                <span className="text-base">💎</span>
                <span className="leading-relaxed">{checkoutGuideNotice}</span>
              </div>
            )}

            {/* Error Message if any */}
            {checkoutError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono">
                {checkoutError}
              </div>
            )}

            {/* If Checkout was Successful */}
            {checkoutSuccess ? (
              <div className="space-y-5 text-xs font-mono animate-fadeIn">
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 mx-auto flex items-center justify-center text-2xl text-emerald-300">
                    ✓
                  </div>
                  <h4 className="text-base font-bold text-white">¡Suscripción B2B Confirmada y Activa!</h4>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    Tu acceso a <strong>{checkoutSuccess.planName}</strong> ha sido activado inmediatamente.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-4 text-slate-300 text-[11px]">
                    <span>Factura: <strong className="text-white">{checkoutSuccess.invoiceNumber}</strong></span>
                    <span>•</span>
                    <span>Total Pagado: <strong className="text-white">${checkoutSuccess.amount} USD</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-slate-400 block text-[11px]">Token de Acceso B2B Generado:</span>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[10px] text-cyan-300 break-all select-all">
                    {checkoutSuccess.token}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Guardado automáticamente en tu navegador para desbloquear las descargas y el Asistente RAG.
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <span className="text-slate-300 font-bold block">Beneficios Inmediatamente Desbloqueados:</span>
                  <ul className="space-y-1.5 text-slate-400">
                    <li className="flex items-center gap-2 text-emerald-300">
                      <span>✓</span>
                      <span>Descarga de Guías de Integración (.md y .pdf) para Windows y macOS</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-300">
                      <span>✓</span>
                      <span>Consultas ilimitadas al Arquitecto RAG con contexto PostgreSQL 16</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-300">
                      <span>✓</span>
                      <span>Generador de manifiestos unificados (Docker Compose & Terraform)</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    setCheckoutSuccess(null);
                  }}
                  className="w-full py-3.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 transition-all cursor-pointer shadow-lg shadow-emerald-500/20 text-center"
                >
                  🚀 Continuar y Explorar OSS Atlas Pro
                </button>
              </div>
            ) : (
              /* Checkout Form */
              <form onSubmit={handleProcessCheckout} className="space-y-5 text-xs font-mono">
                {/* Plan Summary & Cycle Switcher inside Modal */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase text-amber-400 font-bold block">Plan Seleccionado</span>
                    <span className="text-sm font-bold text-white">
                      {selectedCheckoutPlan === 'PRO_ARCHITECTURE' ? 'Pro Architecture' : 'Enterprise Hub'}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {pricingCycle === 'annual' ? 'Facturación Anual (2 meses gratis)' : 'Facturación Mensual'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-amber-300 font-mono">
                      ${selectedCheckoutPlan === 'PRO_ARCHITECTURE'
                        ? (pricingCycle === 'annual' ? '190' : '19')
                        : (pricingCycle === 'annual' ? '490' : '49')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">USD / {pricingCycle === 'annual' ? 'año' : 'mes'}</span>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Correo Corporativo *</label>
                      <input
                        type="email"
                        required
                        placeholder="arquitecto@empresa.com"
                        value={checkoutEmail}
                        onChange={(e) => setCheckoutEmail(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Empresa / Razón Social *</label>
                      <input
                        type="text"
                        required
                        placeholder="Mi Empresa B2B S.A."
                        value={checkoutCompany}
                        onChange={(e) => setCheckoutCompany(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">RUT / Tax ID / NIT (Para factura)</label>
                      <input
                        type="text"
                        placeholder="900.123.456-7"
                        value={checkoutTaxId}
                        onChange={(e) => setCheckoutTaxId(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">{t.checkoutPaymentMethod}</label>
                      <select
                        value={checkoutPaymentMethod}
                        onChange={(e) => setCheckoutPaymentMethod(e.target.value as any)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="paypal">{t.checkoutPaypalOption}</option>
                        <option value="wenia_usdw">{t.checkoutWeniaOption}</option>
                        <option value="bank_transfer">{t.checkoutBankOption}</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment Method Details Badge */}
                  {checkoutPaymentMethod === 'paypal' && (
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs font-mono space-y-1">
                      <div className="flex items-center gap-2 font-bold text-blue-300">
                        <span>🅿️ Pasarela PayPal Habilitada</span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-[10px]">Cuenta Global USD</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        Recepción internacional directa en USD mediante cuenta PayPal, tarjeta débito/crédito internacional o saldo global.
                      </p>
                    </div>
                  )}

                  {checkoutPaymentMethod === 'wenia_usdw' && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-mono space-y-1">
                      <div className="flex items-center gap-2 font-bold text-emerald-300">
                        <span>💎 Wenia • Criptoactivo USDW</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px]">Paridad 1:1 USD</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        Transferencia directa de USDW (Bancolombia / Wenia). 1 USDW = 1.00 USD fijo, sin comisiones de cambio y con liquidación inmediata.
                      </p>
                    </div>
                  )}

                  {checkoutPaymentMethod === 'bank_transfer' && (
                    <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-mono space-y-1">
                      <div className="flex items-center gap-2 font-bold text-purple-300">
                        <span>🏦 Transferencia Bancaria B2B</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-[10px]">Factura con RUT</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        Emisión de factura proforma oficial para transferencia bancaria directa corporativa con soporte tributario.
                      </p>
                    </div>
                  )}
                </div>

                {/* Pricing Breakdown Summary */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-slate-400 text-[11px]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-white font-mono">
                      ${selectedCheckoutPlan === 'PRO_ARCHITECTURE'
                        ? (pricingCycle === 'annual' ? '228.00' : '19.00')
                        : (pricingCycle === 'annual' ? '588.00' : '49.00')} USD
                    </span>
                  </div>
                  {pricingCycle === 'annual' && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Descuento 2 Meses Gratis (Anual):</span>
                      <span className="font-mono">
                        -${selectedCheckoutPlan === 'PRO_ARCHITECTURE' ? '38.00' : '98.00'} USD
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Impuestos (B2B Exportación):</span>
                    <span className="text-emerald-300 font-mono">$0.00 USD (Exento)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-bold text-white">
                    <span>Total a Facturar:</span>
                    <span className="text-amber-300 font-mono text-sm">
                      ${selectedCheckoutPlan === 'PRO_ARCHITECTURE'
                        ? (pricingCycle === 'annual' ? '190.00' : '19.00')
                        : (pricingCycle === 'annual' ? '490.00' : '49.00')} USD
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span>🔒 Cancelación flexible en 1 clic</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isProcessingCheckout}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    {isProcessingCheckout ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        <span>Validando Facturación B2B...</span>
                      </>
                    ) : (
                      <>
                        <span>💳 Confirmar y Activar Suscripción</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Integration Guide Viewer / Download Modal (Próxima Funcionalidad Vinculada) */}
      {inspectedGuideTool && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          aria-labelledby="guide-modal-title"
        >
          <div className="max-w-3xl w-full rounded-3xl bg-slate-900 border border-cyan-500/50 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  <span>📄 GUÍA DE INTEGRACIÓN B2B PRO</span>
                  <span>•</span>
                  <span>{inspectedGuideTool.license}</span>
                </div>
                <h3 id="guide-modal-title" className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                  Guía de Integración: {inspectedGuideTool.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paso a paso técnico multiplataforma para entornos Windows (PowerShell/WSL2) y macOS (Homebrew/Zsh).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectedGuideTool(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono cursor-pointer transition-colors"
              >
                ✕ Cerrar [ESC]
              </button>
            </div>

            {/* Quick Architecture Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Categoría B2B</span>
                <span className="text-cyan-300 font-bold">{inspectedGuideTool.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Health Score</span>
                <span className="text-emerald-400 font-bold">{inspectedGuideTool.healthScore}/100</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Dificultad</span>
                <span className="text-amber-300 font-bold">{inspectedGuideTool.integrationDifficulty}</span>
              </div>
            </div>

            {/* Platform Previews */}
            <div className="space-y-4 text-xs font-mono">
              {/* Windows Section */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between text-blue-400 font-bold">
                  <span>🪟 Paso a Paso para Windows (PowerShell / Docker Desktop)</span>
                  <span className="text-[10px] text-slate-500">WSL2 Ready</span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                  <code>{`# 1. Asegurar Docker Desktop y WSL2 en ejecución
wsl --status

# 2. Desplegar contenedor ${inspectedGuideTool.slug}
${inspectedGuideTool.dockerCommand}

# 3. Validar estado del contenedor
docker ps --filter "ancestor=${inspectedGuideTool.dockerCommand.split(' ').pop()}"`}</code>
                </pre>
              </div>

              {/* Mac Section */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between text-purple-400 font-bold">
                  <span>🍎 Paso a Paso para macOS (Terminal / Homebrew / Colima o OrbStack)</span>
                  <span className="text-[10px] text-slate-500">Apple Silicon & Intel</span>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                  <code>{`# 1. Verificar runtime de contenedores (Colima o Docker)
brew install colima docker || true
colima start

# 2. Ejecutar servicio ${inspectedGuideTool.name}
${inspectedGuideTool.dockerCommand}

# 3. Comprobar logs y endpoints
docker logs -f $(docker ps -lq)`}</code>
                </pre>
              </div>
            </div>

            {/* Download Buttons (.md and .pdf) */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <span>✓</span>
                <span>Descarga habilitada con tu plan Pro Architect</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const mdContent = `# Guía de Integración B2B: ${inspectedGuideTool.name}
**Plataforma:** OSS Atlas (https://ossatlas.iotdico.com)
**Autor:** EdisonPEÑA (Iotdico)
**Licencia:** ${inspectedGuideTool.license}
**Health Score:** ${inspectedGuideTool.healthScore}/100

---

## 1. Descripción
${inspectedGuideTool.description}

## 2. Requisitos y Dependencias
- Dependencias: ${inspectedGuideTool.dependencies.join(', ')}
- Disparadores (Triggers): ${inspectedGuideTool.triggers.join(', ')}

---

## 3. Despliegue en Windows (PowerShell / Docker Desktop)
\`\`\`powershell
# Comprobar WSL2
wsl --status

# Ejecutar servicio
${inspectedGuideTool.dockerCommand}
\`\`\`

---

## 4. Despliegue en macOS (Terminal / Colima / OrbStack)
\`\`\`bash
# Iniciar runtime
colima start

# Ejecutar contenedor
${inspectedGuideTool.dockerCommand}
\`\`\`

---
*Generado automáticamente por OSS Atlas Pro B2B — https://ossatlas.iotdico.com*`;

                    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Guia_Integracion_${inspectedGuideTool.slug.replace('/', '_')}.md`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer"
                >
                  <span>📥 Descargar .MD</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert(`Generación de PDF para ${inspectedGuideTool.name}: Se descargará el informe ejecutivo en la siguiente actualización del generador PDF.`);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>📥 Descargar .PDF</span>
                </button>
              </div>
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
              {t.footerAudit}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 text-right sm:text-left">
            <span>© 2026 <strong className="text-slate-200">OSS Atlas</strong> · {lang === 'es' ? 'Una iniciativa de' : 'An initiative by'} <strong className="text-cyan-400">Iotdico</strong></span>
            <span className="hidden sm:inline">•</span>
            <span>{lang === 'es' ? 'Creado por' : 'Created by'} <strong className="text-slate-200">EdisonPEÑA</strong> (<a href="https://ossatlas.iotdico.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">ossatlas.iotdico.com</a>)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}