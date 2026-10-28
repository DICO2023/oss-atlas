export type Language = 'es' | 'en';

export const TRANSLATIONS = {
  es: {
    brandTag: '100% Open Source',
    navCatalog: 'Catálogo & Categorías',
    navScope: 'Alcance de Servicios 💡',
    navRag: 'Arquitecto RAG B2B',
    navPricing: 'Comunidad & Manifiesto 🌟',
    navProActive: '100% Libre & Abierto',
    navUpgradePro: 'Star en GitHub ⭐',
    navSyncActive: 'INGESTA ETag: ACTIVA',
    navSyncCache: 'INGESTA: MODO CACHÉ',

    // Hero Section
    heroBadge: 'Ahorra 15–20h de investigación B2B por proyecto • Latencia HNSW P95 < 250ms',
    heroTitlePrefix: 'Catálogo Inteligente &',
    heroTitleGradient: 'Arquitecto RAG de Integraciones Open Source',
    heroSubtitle1: 'Erradicamos la fragmentación del ecosistema open-source para consultoría tecnológica B2B. Describe tu modelo de negocio y nuestro motor de',
    heroSubtitleBold: 'Búsqueda Híbrida (pgvector + Fusión de Rango Recíproco)',
    heroSubtitle2: 'emitirá un mapa de arquitectura auto-hospedado con métricas de salud estructural verificadas.',
    heroSearchPlaceholder: 'Ej: Plataforma de comercio electrónico B2B orientada a la logística con SKU-9941A...',
    heroGenerateButton: 'Generar Mapa RAG B2B',
    heroFtsDict: "Diccionario FTS: 'simple' (Sin stemming Snowball)",
    heroHnswRam: 'halfvec (50% menos RAM)',
    heroHnswStd: 'float32 estándar',
    heroHnswIndex: 'Índice HNSW:',
    heroRrfConstant: 'Constante RRF k=',
    heroAdjustK: 'Ajustar k',
    heroTestScenarios: 'Casos de prueba B2B:',

    // Scenarios titles
    scenario1: 'Comercio Electrónico B2B Orientado a la Logística',
    scenario2: 'Infraestructura Fintech B2B & Conciliación Bancaria',
    scenario3: 'Plataforma SaaS B2B con Copiloto RAG Auto-Hospedado',

    // Executive Metrics Bar
    heroMetricSavedTimeTitle: 'Tiempo Ahorrado / Proyecto',
    heroMetricSavedTimeVal: '15 a 20 Horas',
    heroMetricSavedTimeSub: 'Validación curada B2B',
    heroMetricTeamCapTitle: 'Capacidad Ágil del Equipo',
    heroMetricTeamCapVal: '126h Netas / Sem',
    heroMetricTeamCapSub: '9 Ing. × 14h (70% Focus)',
    heroMetricRateLimitTitle: 'Evasión Rate-Limit GitHub',
    heroMetricRateLimitVal: 'ETag + Token Bucket',
    heroMetricRateLimitSub: '< 2,000 pts/min GraphQL',
    heroMetricRagasTitle: 'Fidelidad RAGAS',
    heroMetricRagasVal: '100% Zero-Hallucination',
    heroMetricRagasSub: 'Colchón: 5 Días Buffer',

    // Categories Section
    categoriesBadge: 'Taxonomía Estructural Normalizada',
    categoriesTitle: 'Explorador de Categorías Open Source (CategoriesGrid)',
    categoriesSubtitle: 'Metadatos atómicos indexados en PostgreSQL para filtrado híbrido sin degradación por JSON plano.',
    categoriesAllBtn: 'Todas las Categorías',

    // Categories names & descriptions
    catAuthName: 'Autenticación & Identidad (IAM)',
    catAuthDesc: 'Control de acceso granular, SSO corporativo (SAML/OIDC), RBAC/ABAC y gestión de sesiones sin vendor lock-in.',
    catDbsName: 'Bases de Datos & Vectores',
    catDbsDesc: 'Motores OLTP, almacenes vectoriales de alto rendimiento e índices HNSW para cargas de trabajo RAG empresariales.',
    catPaymentsName: 'Pasarelas de Pago & Facturación B2B',
    catPaymentsDesc: 'Suscripciones recurrentes, conciliación bancaria automatizada y orquestación de pagos multi-adquirente.',
    catAiName: 'Modelos de Lenguaje & RAG Auto-Hospedado',
    catAiDesc: 'Inferencia local, pipelines de embedding y agentes autónomos desplegables en hardware propio con cero fuga de datos.',

    // Catalog & Filters Section
    catalogBadge: 'Catálogo Dinámico B2B',
    catalogTitle: 'Repositorios Evaluados con Métricas Cardinales',
    catalogSubtitle: 'Filtra por capa arquitectónica, tipo de licencia o umbral de salud para acelerar tu proceso de selección.',
    catalogSearchPlaceholder: 'Buscar herramientas (ej: keycloak, pgvector, rust, rag, licencias)...',
    catalogFilterLicense: 'Filtrar por Licencia:',
    catalogAllLicenses: 'Todas las Licencias',
    catalogMinHealth: 'Health Score Mínimo:',
    catalogEmpty: 'No se encontraron herramientas con los filtros actuales.',
    catalogResetFilters: 'Restablecer filtros',
    catalogToolsCount: 'Herramientas Disponibles',
    catalogSyncButton: '⚡ Ingesta & Sincronización',

    // Cards
    cardHealthScore: 'Health Score',
    cardWeightedBreakdown: 'Desglose Ponderado',
    cardCommits: 'Commits (15%)',
    cardSecurity: 'Seguridad (20%)',
    cardDocs: 'Docs/Com. (65%)',
    cardDifficulty: 'Dificultad:',
    cardTriggers: 'Disparadores (Triggers):',
    cardDockerCopied: 'Comando Docker Copiado',
    cardCopyDocker: 'Copiar Docker Run',
    cardInspect: 'Inspeccionar',
    cardIntegrationGuide: 'Guía Integración (.md & .pdf) [Win/Mac]',
    cardProBadge: 'OPEN SOURCE',
    cardDownloadBadge: 'DESCARGAR',

    // RAG Assistant Section
    ragBadge: 'SÍNTESIS DE ARQUITECTURA ASISTIDA POR IA',
    ragTitle: 'Asistente Conversacional de Arquitectura B2B',
    ragSubtitle: 'Recupera herramientas mediante Fusión de Rango Recíproco (RRF) en PostgreSQL 16 y genera arquitecturas multicapa auditadas.',
    ragSelectCase: '1. Seleccionar Caso de Negocio B2B',
    ragLiveGenerated: 'Generado en Vivo',
    ragCustomPromptTitle: '2. Consulta Personalizada de Arquitectura',
    ragGenerateButton: 'Sintetizar Arquitectura RAG',
    ragGenerating: 'Analizando Catálogo y Vectores...',
    ragMetricsTitle: 'Métricas Cardinales RAGAS (Auditoría Anti-Alucinación)',
    ragContextPrecision: 'Context Precision: 1.00',
    ragContextRecall: 'Context Recall: 1.00',
    ragFaithfulness: 'Faithfulness: 1.00',
    ragAnswerRelevance: 'Answer Relevance: 0.98',
    ragArchitectureMap: 'Mapa de Arquitectura Sintetizado',
    ragRecommendedStack: 'Pila Recomendada',
    ragTabSoftwareBlueprint: 'Capas 1-4: Arquitectura de Software',
    ragTabHardwarePhysical: 'Capa 0: Hardware Recomendado & Diagrama Radar',

    // Pricing Section
    pricingBadge: '💎 MODELO OPEN-CORE & MONETIZACIÓN B2B',
    pricingTitle: 'Planes Diseñados para Arquitectos y Equipos de Ingeniería',
    pricingSubtitle: 'Conserva el control total de tu infraestructura sin ataduras propietarias. Desbloquea guías de integración (.md y .pdf), consultas ilimitadas al Arquitecto RAG y soporte prioritario.',
    pricingMonthly: 'Facturación Mensual',
    pricingAnnual: 'Facturación Anual',
    pricingAnnualDiscount: 'AHORRA 20% (2 MESES GRATIS)',
    pricingCurrentPlan: 'Plan Actual (Activo)',
    pricingBaseIncluded: 'Plan Base Incluido',
    pricingUpgradePro: 'Mejorar a Pro Architecture',
    pricingProActive: 'Plan Activo • Ver Factura',
    pricingGetEnterprise: 'Contratar Enterprise Hub',
    pricingEnterpriseActive: 'Plan Enterprise Activo',
    pricingGuarantee: 'Garantía de reembolso de 14 días sin preguntas.',
    pricingInvoiceNotice: 'Factura legal B2B para deducción tributaria.',
    pricingInstantNotice: 'Activación inmediata con token de acceso corporativo.',

    // Pricing Cards
    pricingTier1Badge: 'OPEN-CORE LIBRE',
    pricingTier1Desc: 'Para desarrolladores independientes que buscan explorar herramientas open source evaluadas.',
    pricingTier1Freq: 'USD / siempre libre',
    pricingTier1F1: 'Acceso al Catálogo de 25 herramientas curadas',
    pricingTier1F2: 'Búsqueda Híbrida RRF (FTS + vectores halfvec)',
    pricingTier1F3: 'Cálculo transparente de Health Score ponderado',
    pricingTier1F4: 'Comandos Docker Run listos para ejecutar',
    pricingTier1F5: '3 consultas diarias al Arquitecto RAG',
    pricingTier1F6: 'Guías descargables en Markdown y PDF',

    pricingTier2Recommended: '⭐ RECOMENDADO B2B • MÁS POPULAR',
    pricingTier2Badge: 'ARQUITECTURA & GUÍAS PRO',
    pricingTier2Desc: 'Para arquitectos de software, tech leads y consultores B2B que necesitan integrar herramientas rápidamente.',
    pricingTier2FreqMonth: 'USD / mes',
    pricingTier2FreqYear: 'USD / año (equiv. $15.8/mes)',
    pricingTier2F1: 'Descarga de Guías de Integración (.md y .pdf) paso a paso para Windows y macOS',
    pricingTier2F2: 'Consultas ilimitadas al Arquitecto RAG sin límites diarios',
    pricingTier2F3: 'Generador de manifiestos unificados (Docker Compose & Terraform)',
    pricingTier2F4: 'Acceso prioritario al Pipeline de Ingesta Continua (ETags en vivo)',
    pricingTier2F5: 'Soporte asíncrono de arquitectura con SLA < 12h',

    pricingTier3Badge: 'EQUIPOS & ENTERPRISE',
    pricingTier3Desc: 'Para empresas y factorías de software con múltiples células que requieren gobernanza y cumplimiento.',
    pricingTier3FreqMonth: 'USD / mes',
    pricingTier3FreqYear: 'USD / año (equiv. $40.8/mes)',
    pricingTier3F1: 'Todo lo incluido en Pro Architecture',
    pricingTier3F2: 'Licencia multi-asiento para hasta 10 arquitectos',
    pricingTier3F3: 'Auditorías automáticas de cumplimiento (PCI-DSS, SOC2, HIPAA)',
    pricingTier3F4: 'Conectores directos a pipelines CI/CD (GitHub / GitLab)',
    pricingTier3F5: 'Facturación corporativa con RUT / Tax ID / NIT',
    pricingTier3F6: 'Sesión 1-on-1 de revisión arquitectónica con EdisonPEÑA (Iotdico)',

    // RAG bubble labels
    ragQueryHeader: 'Consulta de Arquitectura B2B',
    ragDomainLabel: 'Dominio',

    // Checkout Modal
    checkoutTitle: 'CHECKOUT SEGURO B2B',
    checkoutSsl: 'SSL 256-BIT ENCRIPTADO',
    checkoutIssuedBy: 'Facturación oficial emitida por EdisonPEÑA (Iotdico) · Dominio ossatlas.iotdico.com',
    checkoutPlanSelected: 'Plan Seleccionado',
    checkoutCorpEmail: 'Correo Corporativo *',
    checkoutCompanyName: 'Empresa / Razón Social *',
    checkoutTaxId: 'RUT / Tax ID / NIT (Para factura)',
    checkoutPaymentMethod: 'Método de Pago',
    checkoutPaypalOption: '🅿️ PayPal (Tarjeta Internacional / Saldo USD Global)',
    checkoutWeniaOption: '💎 Wenia • Criptoactivo USDW (Paridad 1:1 USD - Bancolombia)',
    checkoutBankOption: '🏦 Transferencia Bancaria B2B (Factura Legal)',
    checkoutSubtotal: 'Subtotal:',
    checkoutAnnualDiscount: 'Descuento 2 Meses Gratis (Anual):',
    checkoutTaxes: 'Impuestos (B2B Exportación):',
    checkoutTotalToPay: 'Total a Facturar:',
    checkoutExempt: '$0.00 USD (Exento)',
    checkoutProcessing: 'Validando Facturación B2B...',
    checkoutConfirmBtn: 'Confirmar y Activar Suscripción',
    checkoutSuccessTitle: '¡Suscripción B2B Confirmada y Activa!',
    checkoutSuccessSubtitle: 'Tu acceso ha sido activado inmediatamente.',
    checkoutInvoice: 'Factura:',
    checkoutTotalPaid: 'Total Pagado:',
    checkoutTokenTitle: 'Token de Acceso B2B Generado:',
    checkoutTokenNotice: 'Guardado automáticamente en tu navegador para desbloquear las descargas y el Asistente RAG.',
    checkoutBenefitsUnlocked: 'Beneficios Inmediatamente Desbloqueados:',
    checkoutBenefit1: 'Descarga de Guías de Integración (.md y .pdf) para Windows y macOS',
    checkoutBenefit2: 'Consultas ilimitadas al Arquitecto RAG con contexto PostgreSQL 16',
    checkoutBenefit3: 'Generador de manifiestos unificados (Docker Compose & Terraform)',
    checkoutContinueBtn: '🚀 Continuar y Explorar OSS Atlas Pro',

    // Guide Modal
    guideTitle: 'Guía de Integración:',
    guideSubtitle: 'Paso a paso técnico multiplataforma para entornos Windows (PowerShell/WSL2) y macOS (Homebrew/Zsh).',
    guideCategory: 'Categoría B2B',
    guideHealthScore: 'Health Score',
    guideDifficulty: 'Dificultad',
    guideWindowsStep: '🪟 Paso a Paso para Windows (PowerShell / Docker Desktop)',
    guideMacStep: '🍎 Paso a Paso para macOS (Terminal / Homebrew / Colima o OrbStack)',
    guideLinuxStep: '🐧 Paso a Paso para Linux (Ubuntu / Debian / RHEL / Docker Engine & systemd)',
    guideDownloadMd: '📥 Descargar .MD',
    guideDownloadPdf: '📥 Descargar .PDF',
    guideGeneratingPdf: '⏳ Generando PDF...',
    guidePlatformTabsWin: 'Windows (PowerShell / WSL2)',
    guidePlatformTabsMac: 'macOS (Terminal / Homebrew)',
    guideProUnlocked: '✓ Descarga gratuita y libre para todos los desarrolladores',
    ragDailyQueriesBadge: 'Acceso Comunitario:',
    ragDailyQueriesLimit: '100% Libre',
    ragUnlimitedQueriesBadge: '⚡ Consultas Ilimitadas (100% Open Source)',
    ragDailyLimitReachedNotice: 'Consultas ilimitadas disponibles de forma abierta y gratuita.',
    guideDownloadProNotice: 'Descarga libre de guías de integración ejecutivas en PDF y Markdown.',

    // Services Scope Section (Propuesta de Valor y Alcance)
    scopeBadge: 'Propuesta de Valor & Transparencia B2B',
    scopeTitle: 'Alcance de los Servicios OSS Atlas',
    scopeSubtitle: 'Conoce por qué no somos un simple buscador de GitHub, qué cubre cada nivel de servicio y cómo garantizamos cero código abandonado y cero alucinaciones.',
    scopePillar1Badge: 'Curaduría & Seguridad',
    scopePillar1Title: '1. Curaduría Técnica & Filtro Anti-Abandonware',
    scopePillar1Desc: 'Evaluamos rigurosamente cada herramienta: solo ingresan proyectos con licencias OSI permisivas, actividad de commits continua, soporte de contenedores Docker y ausencia de CVEs críticos.',
    scopePillar1Point1: 'Cero proyectos abandonados (inspección de commits < 90 días)',
    scopePillar1Point2: 'Garantía legal: MIT, Apache-2.0, PostgreSQL, AGPL-3.0',
    scopePillar1Point3: 'Health Score ponderado transparente (15% Commits, 20% Seguridad, 65% Docs)',

    scopePillar2Badge: 'Vectores HNSW & Ahorro',
    scopePillar2Title: '2. Búsqueda Híbrida RRF & Telemetría de Ahorro',
    scopePillar2Desc: 'Fusión de Rango Recíproco con vectores halfvec(1536) en PostgreSQL 16 y FTS sin degradación. Descubre alternativas open source y calcula ahorros reales frente a SaaS comerciales.',
    scopePillar2Point1: 'Ahorro cuantificado ($14 a $2,400 USD/mes vs nubes propietarias)',
    scopePillar2Point2: 'Recuperación semántica sub-200ms por significado y concepto',
    scopePillar2Point3: 'Telemetría de afinidad léxica y vectorial visible en cada ficha',

    scopePillar3Badge: 'Zero Alucinación',
    scopePillar3Title: '3. Arquitecto RAG Multi-Capa con Cero Alucinaciones',
    scopePillar3Desc: 'Generador de planos arquitectónicos basado estrictamente en el contexto recuperado de nuestra base de datos. Ensambla capas acopladas (Auth, DBs, Payments, AI) con disparadores de integración probados.',
    scopePillar3Point1: '100% de fidelidad evaluada (RAGAS Verified)',
    scopePillar3Point2: 'Plano técnico con triggers de integración por microservicio',
    scopePillar3Point3: 'Manifiestos unificados y comandos Docker listos para producción',

    scopePillar4Badge: 'Multiplataforma & On-Demand',
    scopePillar4Title: '4. Guías (.md & .pdf) y Auditoría On-Demand de GitHub',
    scopePillar4Desc: 'Manuales de despliegue paso a paso para Windows (WSL2/PowerShell) y macOS (Colima/Apple Silicon). Además, somete cualquier repositorio de GitHub a nuestra auditoría automatizada en segundos.',
    scopePillar4Point1: 'Descarga vectorial de informes PDF ejecutivos y Markdown',
    scopePillar4Point2: 'Evaluador On-Demand: pega un enlace de GitHub y audítalo en vivo',
    scopePillar4Point3: 'Ingesta inmediata al catálogo si cumple los criterios de calidad B2B',

    // Ingest Modal & GitHub On-Demand Audit
    ingestModalTitle: 'Módulo de Ingesta Continua & Auditoría On-Demand',
    ingestModalSubtitle: 'Gestión atómica de repositorios, auditoría de GitHub en vivo y generación de vectores semánticos en PostgreSQL 16.',
    ingestTabRoadmap: '📋 Catálogo 122 & Saldo',
    ingestTabAudit: '🔍 Auditoría On-Demand GitHub',
    ingestTabPresets: 'Presets Curados B2B',
    ingestTabCustom: 'Ingesta Personalizada',
    ingestTabReindex: 'Reindexación Global',
    ingestClose: 'Cerrar',

    // Audit Tab strings
    auditInputLabel: 'URL o Repositorio de GitHub a Auditar:',
    auditInputPlaceholder: 'Ej: https://github.com/supabase/realtime o qdrant/qdrant',
    auditBtnRun: '⚡ Auditar Repositorio en GitHub',
    auditBtnRunning: '⏳ Auditando con API de GitHub...',
    auditExamples: 'Ejemplos para probar:',
    auditStatusApproved: '✅ APROBADO B2B (Elegible)',
    auditStatusConditional: '⚠️ CONDICIONAL (Requiere Revisión)',
    auditStatusRejected: '❌ RECHAZADO (No Cumple Criterios)',
    auditBtnIngest: '⚡ Incorporar al Catálogo y Generar Guías (.md & .pdf)',
    auditBtnIngesting: '⏳ Guardando y Calculando Vectores...',
    auditSuccessNotice: '¡Herramienta auditada e incorporada exitosamente al catálogo en vivo!',
    auditConditionalTitle: '⚠️ ATENCIÓN DE MANTENIMIENTO B2B',
    auditConditionalWarning: 'Esta herramienta presenta observaciones técnicas (inactividad superior a 180 días o ausencia de Docker nativo). Al incorporarla, quedará registrada con la etiqueta pública CONDICIONAL y el Asistente RAG advertirá a los arquitectos sobre su estado de mantenimiento.',
    auditConditionalCheckbox: 'Entiendo que esta herramienta presenta inactividad o advertencias técnicas y asumo conscientemente los riesgos de mantenimiento en mi arquitectura.',
    auditConditionalRequired: 'Debes aceptar la advertencia técnica arriba para habilitar la incorporación al catálogo.',
    auditStatusRejectedDisabled: '❌ No elegible para incorporación (Rechazado)',
    catalogBadgeConditional: 'CONDICIONAL',
    catalogNoteConditional: 'Nota B2B: Esta herramienta cuenta con observaciones técnicas (inactividad o sin Docker nativo). Evaluar antes de producción.',
    ragNodeConditionalWarning: 'Advertencia de Mantenimiento: Esta herramienta fue incorporada con estado condicional (en observación).',

    // Footer
    footerAudit: 'DICTAMEN AUDITORÍA PMO & FRONTEND: APROBADO SIN RESERVAS (10/10 Checkpoints)',
    footerCopyright: '© 2026 OSS Atlas · Una iniciativa de Iotdico',
    footerCreatedBy: 'Creado por EdisonPEÑA (ossatlas.iotdico.com)',
  },

  en: {
    brandTag: '100% Open Source',
    navCatalog: 'Catalog & Categories',
    navScope: 'Scope of Services 💡',
    navRag: 'B2B RAG Architect',
    navPricing: 'Community & Manifesto 🌟',
    navProActive: '100% Free & Open',
    navUpgradePro: 'Star on GitHub ⭐',
    navSyncActive: 'INGESTION ETag: ACTIVE',
    navSyncCache: 'INGESTION: CACHED MODE',

    // Hero Section
    heroBadge: 'Save 15–20h of B2B research per project • P95 HNSW Latency < 250ms',
    heroTitlePrefix: 'Intelligent Catalog &',
    heroTitleGradient: 'Open Source Integration RAG Architect',
    heroSubtitle1: 'Eliminating open-source ecosystem fragmentation for B2B tech consulting. Describe your business model and our',
    heroSubtitleBold: 'Hybrid Search engine (pgvector + Reciprocal Rank Fusion)',
    heroSubtitle2: 'will emit a self-hosted architecture blueprint with verified structural health metrics.',
    heroSearchPlaceholder: 'E.g., B2B e-commerce platform for logistics with SKU-9941A...',
    heroGenerateButton: 'Generate B2B RAG Blueprint',
    heroFtsDict: "FTS Dictionary: 'simple' (No Snowball stemming)",
    heroHnswRam: 'halfvec (50% less RAM)',
    heroHnswStd: 'standard float32',
    heroHnswIndex: 'HNSW Index:',
    heroRrfConstant: 'RRF Constant k=',
    heroAdjustK: 'Adjust k',
    heroTestScenarios: 'B2B Test Scenarios:',

    // Scenarios titles
    scenario1: 'Logistics-Oriented B2B E-Commerce Platform',
    scenario2: 'B2B Fintech Infrastructure & Bank Reconciliation',
    scenario3: 'B2B SaaS Platform with Self-Hosted RAG Copilot',

    // Executive Metrics Bar
    heroMetricSavedTimeTitle: 'Saved Time / Project',
    heroMetricSavedTimeVal: '15 to 20 Hours',
    heroMetricSavedTimeSub: 'Curated B2B Validation',
    heroMetricTeamCapTitle: 'Agile Team Capacity',
    heroMetricTeamCapVal: '126 Net Hrs / Wk',
    heroMetricTeamCapSub: '9 Eng. × 14h (70% Focus)',
    heroMetricRateLimitTitle: 'GitHub Rate-Limit Evasion',
    heroMetricRateLimitVal: 'ETag + Token Bucket',
    heroMetricRateLimitSub: '< 2,000 pts/min GraphQL',
    heroMetricRagasTitle: 'RAGAS Fidelity',
    heroMetricRagasVal: '100% Zero-Hallucination',
    heroMetricRagasSub: 'Buffer: 5-Day Safety Net',

    // Categories Section
    categoriesBadge: 'Normalized Structural Taxonomy',
    categoriesTitle: 'Open Source Category Explorer (CategoriesGrid)',
    categoriesSubtitle: 'Atomic metadata indexed in PostgreSQL for hybrid filtering without flat JSON degradation.',
    categoriesAllBtn: 'All Categories',

    // Categories names & descriptions
    catAuthName: 'Authentication & Identity (IAM)',
    catAuthDesc: 'Granular access control, corporate SSO (SAML/OIDC), RBAC/ABAC and session management without vendor lock-in.',
    catDbsName: 'Databases & Vector Engines',
    catDbsDesc: 'OLTP engines, high-performance vector stores and HNSW indexes for enterprise RAG workloads.',
    catPaymentsName: 'Payment Gateways & B2B Billing',
    catPaymentsDesc: 'Recurring subscriptions, automated bank reconciliation and multi-acquirer payment orchestration.',
    catAiName: 'Language Models & Self-Hosted RAG',
    catAiDesc: 'Local inference, embedding pipelines and autonomous agents deployable on private hardware with zero data leakage.',

    // Catalog & Filters Section
    catalogBadge: 'Dynamic B2B Catalog',
    catalogTitle: 'Evaluated Repositories with Cardinal Metrics',
    catalogSubtitle: 'Filter by architectural tier, license type or health threshold to accelerate your selection process.',
    catalogSearchPlaceholder: 'Search tools (e.g., keycloak, pgvector, rust, rag, licenses)...',
    catalogFilterLicense: 'Filter by License:',
    catalogAllLicenses: 'All Licenses',
    catalogMinHealth: 'Minimum Health Score:',
    catalogEmpty: 'No open source tools found matching current filters.',
    catalogResetFilters: 'Reset filters',
    catalogToolsCount: 'Available Tools',
    catalogSyncButton: '⚡ Ingestion & Sync',

    // Cards
    cardHealthScore: 'Health Score',
    cardWeightedBreakdown: 'Weighted Breakdown',
    cardCommits: 'Commits (15%)',
    cardSecurity: 'Security (20%)',
    cardDocs: 'Docs/Com. (65%)',
    cardDifficulty: 'Difficulty:',
    cardTriggers: 'Integration Triggers:',
    cardDockerCopied: 'Docker Command Copied',
    cardCopyDocker: 'Copy Docker Run',
    cardInspect: 'Inspect',
    cardIntegrationGuide: 'Integration Guide (.md & .pdf) [Win/Mac]',
    cardProBadge: 'OPEN SOURCE',
    cardDownloadBadge: 'DOWNLOAD',

    // RAG Assistant Section
    ragBadge: 'AI-ASSISTED ARCHITECTURE SYNTHESIS',
    ragTitle: 'B2B Conversational Architecture Assistant',
    ragSubtitle: 'Retrieves repositories via Reciprocal Rank Fusion (RRF) on PostgreSQL 16 and generates audited multi-tier architectures.',
    ragSelectCase: '1. Select B2B Business Scenario',
    ragLiveGenerated: 'Live Generated',
    ragCustomPromptTitle: '2. Custom Architecture Prompt',
    ragGenerateButton: 'Synthesize RAG Architecture',
    ragGenerating: 'Analyzing Catalog and Vectors...',
    ragMetricsTitle: 'RAGAS Cardinal Metrics (Anti-Hallucination Audit)',
    ragContextPrecision: 'Context Precision: 1.00',
    ragContextRecall: 'Context Recall: 1.00',
    ragFaithfulness: 'Faithfulness: 1.00',
    ragAnswerRelevance: 'Answer Relevance: 0.98',
    ragArchitectureMap: 'Synthesized Architecture Blueprint',
    ragRecommendedStack: 'Recommended Stack',
    ragTabSoftwareBlueprint: 'Layers 1-4: Software Architecture',
    ragTabHardwarePhysical: 'Layer 0: Recommended Hardware & Radar',

    // Pricing Section
    pricingBadge: '💎 OPEN-CORE MODEL & B2B MONETIZATION',
    pricingTitle: 'Plans Built for Software Architects & Engineering Teams',
    pricingSubtitle: 'Retain full sovereignty over your infrastructure with zero proprietary lock-in. Unlock step-by-step guides (.md and .pdf), unlimited RAG queries, and priority support.',
    pricingMonthly: 'Monthly Billing',
    pricingAnnual: 'Annual Billing',
    pricingAnnualDiscount: 'SAVE 20% (2 MONTHS FREE)',
    pricingCurrentPlan: 'Current Plan (Active)',
    pricingBaseIncluded: 'Base Plan Included',
    pricingUpgradePro: 'Upgrade to Pro Architecture',
    pricingProActive: 'Active Plan • View Invoice',
    pricingGetEnterprise: 'Get Enterprise Hub',
    pricingEnterpriseActive: 'Enterprise Plan Active',
    pricingGuarantee: '14-day no-questions-asked refund guarantee.',
    pricingInvoiceNotice: 'Official B2B invoice for tax deduction.',
    pricingInstantNotice: 'Immediate activation with corporate access token.',

    // Pricing Cards
    pricingTier1Badge: 'OPEN-CORE FREE',
    pricingTier1Desc: 'For independent developers exploring evaluated open-source tools.',
    pricingTier1Freq: 'USD / free forever',
    pricingTier1F1: 'Access to curated catalog of 25+ tools',
    pricingTier1F2: 'Hybrid Search RRF (FTS + halfvec vectors)',
    pricingTier1F3: 'Transparent weighted Health Score calculation',
    pricingTier1F4: 'Ready-to-run Docker commands',
    pricingTier1F5: '3 daily queries to RAG Architect',
    pricingTier1F6: 'Downloadable Markdown and PDF guides',

    pricingTier2Recommended: '⭐ RECOMMENDED B2B • MOST POPULAR',
    pricingTier2Badge: 'ARCHITECTURE & PRO GUIDES',
    pricingTier2Desc: 'For software architects, tech leads, and B2B consultants needing rapid tool integration.',
    pricingTier2FreqMonth: 'USD / mo',
    pricingTier2FreqYear: 'USD / yr (equiv. $15.8/mo)',
    pricingTier2F1: 'Download step-by-step Integration Guides (.md & .pdf) for Windows and macOS',
    pricingTier2F2: 'Unlimited daily queries to RAG Architect',
    pricingTier2F3: 'Unified manifest generator (Docker Compose & Terraform)',
    pricingTier2F4: 'Priority access to Continuous Ingestion Pipeline (live ETags)',
    pricingTier2F5: 'Asynchronous architecture support with < 12h SLA',

    pricingTier3Badge: 'TEAMS & ENTERPRISE',
    pricingTier3Desc: 'For enterprises and software factories with multiple squads requiring governance and compliance.',
    pricingTier3FreqMonth: 'USD / mo',
    pricingTier3FreqYear: 'USD / yr (equiv. $40.8/mo)',
    pricingTier3F1: 'Everything in Pro Architecture included',
    pricingTier3F2: 'Multi-seat license for up to 10 architects',
    pricingTier3F3: 'Automated compliance audits (PCI-DSS, SOC2, HIPAA)',
    pricingTier3F4: 'Direct connectors to CI/CD pipelines (GitHub / GitLab)',
    pricingTier3F5: 'Corporate invoicing with Tax ID / RUT / VAT',
    pricingTier3F6: '1-on-1 architectural review session with EdisonPEÑA (Iotdico)',

    // RAG bubble labels
    ragQueryHeader: 'B2B Architecture Query',
    ragDomainLabel: 'Domain',

    // Checkout Modal
    checkoutTitle: 'SECURE B2B CHECKOUT',
    checkoutSsl: '256-BIT ENCRYPTED SSL',
    checkoutIssuedBy: 'Official billing issued by EdisonPEÑA (Iotdico) · Domain ossatlas.iotdico.com',
    checkoutPlanSelected: 'Selected Plan',
    checkoutCorpEmail: 'Corporate Email *',
    checkoutCompanyName: 'Company / Legal Entity *',
    checkoutTaxId: 'Tax ID / RUT / VAT (For invoice)',
    checkoutPaymentMethod: 'Payment Method',
    checkoutPaypalOption: '🅿️ PayPal (Global USD / Credit & Debit Card)',
    checkoutWeniaOption: '💎 Wenia • USDW Cryptoasset (1:1 USD Peg - Bancolombia)',
    checkoutBankOption: '🏦 B2B Bank Transfer (Official Invoice)',
    checkoutSubtotal: 'Subtotal:',
    checkoutAnnualDiscount: '2 Months Free Discount (Annual):',
    checkoutTaxes: 'Taxes (B2B Cross-border Export):',
    checkoutTotalToPay: 'Total to Invoice:',
    checkoutExempt: '$0.00 USD (Exempt)',
    checkoutProcessing: 'Validating B2B Billing...',
    checkoutConfirmBtn: 'Confirm & Activate Subscription',
    checkoutSuccessTitle: 'B2B Subscription Confirmed & Active!',
    checkoutSuccessSubtitle: 'Your access has been immediately granted.',
    checkoutInvoice: 'Invoice:',
    checkoutTotalPaid: 'Total Paid:',
    checkoutTokenTitle: 'Generated B2B Access Token:',
    checkoutTokenNotice: 'Automatically stored in your browser to unlock downloads and the RAG Assistant.',
    checkoutBenefitsUnlocked: 'Immediately Unlocked Features:',
    checkoutBenefit1: 'Download Step-by-Step Integration Guides (.md & .pdf) for Windows and macOS',
    checkoutBenefit2: 'Unlimited queries to the RAG Architect with live PostgreSQL 16 context',
    checkoutBenefit3: 'Unified multi-tier manifest generator (Docker Compose & Terraform)',
    checkoutContinueBtn: '🚀 Continue & Explore OSS Atlas Pro',

    // Guide Modal
    guideTitle: 'Integration Guide:',
    guideSubtitle: 'Multi-platform step-by-step for Windows (PowerShell/WSL2) and macOS (Homebrew/Zsh).',
    guideCategory: 'B2B Category',
    guideHealthScore: 'Health Score',
    guideDifficulty: 'Difficulty',
    guideWindowsStep: '🪟 Step-by-Step for Windows (PowerShell / Docker Desktop)',
    guideMacStep: '🍎 Step-by-Step for macOS (Terminal / Homebrew / Colima or OrbStack)',
    guideLinuxStep: '🐧 Step-by-Step for Linux (Ubuntu / Debian / RHEL / Native Docker & systemd)',
    guideDownloadMd: '📥 Download .MD',
    guideDownloadPdf: '📥 Download .PDF',
    guideGeneratingPdf: '⏳ Generating PDF...',
    guidePlatformTabsWin: 'Windows (PowerShell / WSL2)',
    guidePlatformTabsMac: 'macOS (Terminal / Homebrew)',
    guideProUnlocked: '✓ Free & Open download for all developers',
    ragDailyQueriesBadge: 'Community Access:',
    ragDailyQueriesLimit: '100% Free',
    ragUnlimitedQueriesBadge: '⚡ Unlimited Queries (100% Open Source)',
    ragDailyLimitReachedNotice: 'Unlimited queries freely available for the community.',
    guideDownloadProNotice: 'Free executive PDF and Markdown downloads for all developers.',

    // Services Scope Section (Value Proposition & Transparency)
    scopeBadge: 'B2B Value Proposition & Transparency',
    scopeTitle: 'OSS Atlas Scope of Services',
    scopeSubtitle: 'Learn why we are not a simple GitHub search, what each tier covers, and how we guarantee zero abandonware and zero hallucination.',
    scopePillar1Badge: 'Curation & Security',
    scopePillar1Title: '1. Technical Curation & Anti-Abandonware Filtering',
    scopePillar1Desc: 'We strictly vet each repository: only projects with OSI-approved licenses, active commit velocity, Docker container support, and zero critical CVEs are admitted.',
    scopePillar1Point1: 'Zero abandoned repos (commit recency verified < 90 days)',
    scopePillar1Point2: 'Legal compliance: MIT, Apache-2.0, PostgreSQL, AGPL-3.0',
    scopePillar1Point3: 'Transparent weighted Health Score (15% Commits, 20% Security, 65% Docs)',

    scopePillar2Badge: 'HNSW Vectors & Savings',
    scopePillar2Title: '2. Hybrid Search RRF & Savings Telemetry',
    scopePillar2Desc: 'Reciprocal Rank Fusion with halfvec(1536) vectors on PostgreSQL 16 and non-degrading FTS. Discover open-source alternatives and calculate verified savings vs commercial SaaS.',
    scopePillar2Point1: 'Quantified savings ($14 to $2,400 USD/mo vs proprietary cloud)',
    scopePillar2Point2: 'Sub-200ms semantic retrieval by meaning and concept',
    scopePillar2Point3: 'Lexical and vector affinity telemetry visible on every card',

    scopePillar3Badge: 'Zero Hallucination',
    scopePillar3Title: '3. Multi-Layer RAG Architect with Zero Hallucination',
    scopePillar3Desc: 'Architecture blueprint generator strictly grounded on context retrieved from our database. Assembles coupled layers (Auth, DBs, Payments, AI) with verified integration triggers.',
    scopePillar3Point1: '100% faithfulness score (RAGAS Verified)',
    scopePillar3Point2: 'Technical blueprint with microservice integration triggers',
    scopePillar3Point3: 'Unified manifests and production-ready Docker run commands',

    scopePillar4Badge: 'Multi-Platform & On-Demand',
    scopePillar4Title: '4. Guides (.md & .pdf) and On-Demand GitHub Audit',
    scopePillar4Desc: 'Step-by-step deployment manuals for Windows (WSL2/PowerShell) and macOS (Colima/Apple Silicon). Plus, submit any GitHub repo to our automated auditor in seconds.',
    scopePillar4Point1: 'Vectorized executive PDF reports and Markdown downloads',
    scopePillar4Point2: 'On-Demand Evaluator: paste any GitHub URL and audit it live',
    scopePillar4Point3: 'Instant catalog ingestion if it meets B2B quality standards',

    // Ingest Modal & GitHub On-Demand Audit
    ingestModalTitle: 'Continuous Ingestion & On-Demand Audit Module',
    ingestModalSubtitle: 'Atomic repository management, live GitHub audit, and semantic vector generation on PostgreSQL 16.',
    ingestTabRoadmap: '📋 122 Catalog & Backlog',
    ingestTabAudit: '🔍 On-Demand GitHub Audit',
    ingestTabPresets: 'Curated B2B Presets',
    ingestTabCustom: 'Custom Ingestion',
    ingestTabReindex: 'Global Reindexing',
    ingestClose: 'Close',

    // Audit Tab strings
    auditInputLabel: 'GitHub URL or Repository to Audit:',
    auditInputPlaceholder: 'E.g., https://github.com/supabase/realtime or qdrant/qdrant',
    auditBtnRun: '⚡ Audit Repository on GitHub',
    auditBtnRunning: '⏳ Auditing via GitHub API...',
    auditExamples: 'Try these examples:',
    auditStatusApproved: '✅ B2B APPROVED (Eligible)',
    auditStatusConditional: '⚠️ CONDITIONAL (Requires Review)',
    auditStatusRejected: '❌ REJECTED (Does Not Qualify)',
    auditBtnIngest: '⚡ Ingest into Catalog & Generate Guides (.md & .pdf)',
    auditBtnIngesting: '⏳ Saving & Computing Vectors...',
    auditSuccessNotice: 'Tool successfully audited and integrated into the live catalog!',
    auditConditionalTitle: '⚠️ B2B MAINTENANCE CAVEAT',
    auditConditionalWarning: 'This tool has technical caveats (inactivity > 180 days or no native Dockerfile). Upon ingestion, it will be labeled publicly as CONDITIONAL and the RAG Architect will warn architects about its maintenance status.',
    auditConditionalCheckbox: 'I understand this tool has inactivity or technical caveats and I consciously accept the maintenance risks in my architecture.',
    auditConditionalRequired: 'You must accept the technical warning above to enable ingestion into the catalog.',
    auditStatusRejectedDisabled: '❌ Ineligible for ingestion (Rejected)',
    catalogBadgeConditional: 'CONDITIONAL',
    catalogNoteConditional: 'B2B Note: This tool has technical caveats (inactivity or no native Docker). Review before production.',
    ragNodeConditionalWarning: 'Maintenance Caveat: This tool was ingested under conditional status (under observation).',

    // Footer
    footerAudit: 'PMO & FRONTEND AUDIT: APPROVED WITHOUT RESERVATION (10/10 Checkpoints)',
    footerCopyright: '© 2026 OSS Atlas · An initiative by Iotdico',
    footerCreatedBy: 'Created by EdisonPEÑA (ossatlas.iotdico.com)',
  },
};

export const TOOL_DESCRIPTIONS_EN: Record<string, string> = {
  'postgres/postgres':
    "The world's most advanced open-source relational database engine. Strict ACID compliance, native extensions, and proven MVCC concurrency.",
  'supabase/postgres-pgvector':
    'BaaS platform on PostgreSQL with native support for HNSW indexes (m=16, ef_construction=64), 16-bit halfvec vectors reducing RAM usage by 50%, and simple lexical search.',
  'qdrant/qdrant':
    'Vector search engine and database with REST/gRPC API written in Rust. Supports payload-based filtering, scalar quantization, and distributed clustering.',
  'keycloak/keycloak':
    'Industry standard open-source Identity and Access Management (IAM). Provides enterprise SSO (SAML/OIDC), LDAP/Active Directory federation, and B2B multi-tenancy.',
  'zitadel/zitadel':
    'Cloud-native Identity and Access Management platform written in Go. Supports turnkey B2B multi-tenancy, OAuth2/OIDC, and event-driven audit logging.',
  'casbin/casbin':
    'High-performance, multi-language authorization library supporting ACL, RBAC, ABAC, and RESTful route enforcement with SQL adapters.',
  'openfga/openfga':
    'High-performance relationship-based access control (ReBAC) engine inspired by Google Zanzibar. Designed for granular multi-tenant B2B permissions.',
  'goauthentik/authentik':
    'Open-source Identity Provider focused on flexibility and versatility. Supports custom authentication flows, reverse-proxy outpost, and user self-service.',
  'ory/kratos':
    'Headless identity and user management server implementing registration, login, MFA, and recovery flows under a Zero-Trust architecture.',
  'juspay/hyperswitch':
    'High-performance open-source financial switch written in Rust for smart B2B payment routing, multi-acquirer fallbacks, and PCI-DSS compliance.',
  'killbill/killbill':
    'Enterprise subscription management and recurrent billing platform with automated invoicing and multi-gateway payment orchestration.',
  'getlago/lago':
    'Open-source metering and usage-based billing engine for SaaS and enterprise platforms. Real-time event ingestion and automated invoice generation.',
  'meilisearch/meilisearch':
    'Lightning-fast Rust search engine with sub-50ms hybrid retrieval, typo tolerance, instant indexing, and faceted SKU filtering.',
  'vllm-project/vllm':
    'High-throughput, low-latency LLM serving library with PagedAttention, achieving up to 24x higher throughput than standard Transformers.',
  'run-llama/llama_index':
    'Data framework connecting enterprise data sources to LLMs for precise contextual retrieval and structured RAG pipelines.',
  'langchain-ai/langchain':
    'Comprehensive framework for developing context-aware applications powered by language models, agents, and retrieval chains.',
  'meetily/meetily':
    'Self-hosted AI meeting transcription and notes assistant. Private alternative to Granola ($14/mo) processing audio locally with zero data leakage.',
  'openshorts/openshorts':
    'Automated short clip and reels generator from long-form videos with AI. Open-source alternative to OpusClip ($15/mo) with zero watermarks or limits.',
  'presenton/presenton':
    'Interactive presentation and corporate deck generator with AI. Open-source alternative to Gamma ($12/mo) with native PDF/HTML export and no credit caps.',
  'topview/topview-3d-builder':
    'Interactive 3D modeling, rendering and visualization engine for B2B catalogs and architectural digital twins. Open-source alternative to Spline ($25/mo).',
  'voicestudio/voicestudio':
    'Ultra-realistic text-to-speech (TTS) and AI voice cloning studio. Open-source alternative to ElevenLabs ($22/mo) with zero character tier billing.',
  'copilotkit/copilotkit':
    'Framework for embedding in-app AI copilots and contextual agent assistants in React/Next.js. Alternative to per-seat ChatGPT Pro subscriptions ($200/mo).',
  'opennotebook/opennotebook':
    'Self-hosted augmented research notebook and multi-document RAG workspace. Private alternative to Google NotebookLM and Notion AI ($15/mo).',
  'freellmapi/freellmapi':
    'High-concurrency LLM gateway and proxy balancer for enterprise AI workloads. Alternative to Claude enterprise seat pricing ($200/seat) with automatic failover.',
  'vane/vane':
    'Conversational AI search engine with real-time academic citations and web retrieval. Self-hosted alternative to Perplexity Pro ($20/mo) for enterprise intranets.',
  'upscayl/upscayl':
    'AI-powered 4x/8x image super-resolution upscaler using local Real-ESRGAN models. Open-source alternative to Topaz Labs Gigapixel ($29/mo).',
  'dyad/dyad':
    'Full-stack application builder and generative AI prototyping studio. Alternative to Lovable ($25/mo) with full, unencumbered React/Node.js code export.',
  'treblo/treblo':
    'Commercial AI music, beat and soundscape generator. Open-source alternative to Suno ($10/mo) with full commercial usage rights and stem export.',
};

export function getToolDescription(slug: string, fallbackDescription: string, lang: Language): string {
  if (lang === 'es') return fallbackDescription;
  const normalizedSlug = slug.toLowerCase().trim();
  return TOOL_DESCRIPTIONS_EN[normalizedSlug] || fallbackDescription;
}

export function getDifficultyLabel(diff: string, lang: Language): string {
  if (lang === 'es') return diff;
  const d = diff.toLowerCase();
  if (d.includes('baja') || d.includes('low')) return 'Low';
  if (d.includes('media') || d.includes('medium')) return 'Medium';
  if (d.includes('alta') || d.includes('high')) return 'High';
  return diff;
}

export function getSavingsLabel(savings: string, lang: Language): string {
  if (lang === 'es' || !savings) return savings;
  return savings
    .replace('Ahorro de', 'Savings of')
    .replace('USD / mes', 'USD / mo')
    .replace('USD / mes vs Cloud Propietario', 'USD / mo vs Proprietary Cloud')
    .replace('USD / mes en licencias MAU B2B', 'USD / mo in B2B MAU licenses')
    .replace('USD / mes vs SaaS Search Engines', 'USD / mo vs SaaS Search Engines')
    .replace('Reducción de 1.4% en tasas de fallo transaccional', '1.4% reduction in transactional failure rates');
}

export interface RagScenarioTranslation {
  promptText: string;
  executiveSummary: string;
  nodes: {
    layer: string;
    rationale: string;
    integrationTrigger: string;
  }[];
}

export const RAG_SCENARIOS_TRANSLATIONS_EN: Record<string, RagScenarioTranslation> = {
  'scenario-logistics-b2b': {
    promptText:
      'I need to design a B2B logistics-oriented e-commerce platform with exact SKU-9941A part search, SSO for corporate fleets, and self-hosted multi-gateway billing.',
    executiveSummary:
      'Zero-hallucination architecture verified via Reciprocal Rank Fusion (RRF k=60). Destructive Snowball stemming is prevented using PostgreSQL "simple" dictionary to preserve alphanumeric cargo IDs like "SKU-9941A" while HNSW (halfvec) captures logistic routing semantics.',
    nodes: [
      {
        layer: 'Layer 1: Multi-Tenant Federated Identity (Auth)',
        rationale:
          'Allows authenticating logistics operators, suppliers, and enterprise clients via OIDC and SAML 2.0 with no monthly active user (MAU) fees.',
        integrationTrigger: 'FastAPI middleware validates RS256 JWT issued by corporate realm.',
      },
      {
        layer: 'Layer 2: Catalog Persistence & Hybrid Search (DBs)',
        rationale:
          'Combines FTS with "simple" dictionary for exact SKU codes and halfvec vectors with HNSW index (m=16, ef_construction=64) sustaining P95 latency < 190ms.',
        integrationTrigger: 'PostgreSQL RPC function executes RRF (1/(60+rank_fts) + 1/(60+rank_vec)).',
      },
      {
        layer: 'Layer 3: Instant Indexing & Technical Assistant (AI)',
        rationale:
          'Orchestrates natural language inquiries from B2B buyers and injects verified technical context with strict RAGAS faithfulness threshold = 1.00.',
        integrationTrigger: 'Python async worker synchronizes shipping manifests via webhooks.',
      },
      {
        layer: 'Layer 4: Financial Routing & B2B Billing (Payments)',
        rationale:
          'Directs payments across multiple card acquirers with automated fallbacks, reducing transaction rejection rates by 1.4%.',
        integrationTrigger: 'Idempotency key checked on Redis cluster before executing payment intent.',
      },
    ],
  },
  'scenario-fintech-compliance': {
    promptText:
      'Open-source architecture for a B2B Fintech payment switch with real-time transaction auditing, fraud prevention, strong MFA authentication, and zero vendor lock-in.',
    executiveSummary:
      'Hardened stack for high financial availability. Saves 15 to 20 hours of architectural research by replacing expensive SaaS with auditable containers under permissive Apache-2.0 and MIT licenses.',
    nodes: [
      {
        layer: 'Layer 1: Core Transactional Orchestrator (Payments)',
        rationale:
          'Isolates financial token handling in Rust with sub-millisecond latency and native multi-currency reconciliation support.',
        integrationTrigger: 'HMAC-SHA256 signed webhook dispatched to PostgreSQL general ledger.',
      },
      {
        layer: 'Layer 2: Strong Authentication & IAM Policies (Auth)',
        rationale:
          'Supports Financial-grade API (FAPI) security profiles, WebAuthn/Passkeys hardware tokens, and granular access control.',
        integrationTrigger: 'OAuth2 token introspection validation at API Gateway prior to signing payments.',
      },
      {
        layer: 'Layer 3: Relational Store & Vector Audit (DBs)',
        rationale:
          'Ensures strict ACID compliance for accounting balances and anomaly detection via cosine similarity on payment history.',
        integrationTrigger: 'Row-Level Security (RLS) enforced per corporate tenant_id.',
      },
      {
        layer: 'Layer 4: Regulatory Compliance Copilot (AI)',
        rationale:
          'Queries compliance regulations and audit logs with forced cosine similarity threshold to prevent speculative answers.',
        integrationTrigger: 'FastAPI pipeline evaluates Faithfulness metric before generating compliance report.',
      },
    ],
  },
  'scenario-saas-ai-copilot': {
    promptText:
      'We want to launch a B2B SaaS for document management and contract intelligence with hybrid semantic + lexical search, ingestion from GitHub/S3, and RAM cost controls.',
    executiveSummary:
      'Design optimized to mitigate Risk R5 (PostgreSQL shared_buffers exhaustion) by implementing halfvec vectors in pgvector 0.7+ alongside resilient Token Bucket & ETag-controlled ingestion.',
    nodes: [
      {
        layer: 'Layer 1: Hybrid Vector + FTS Search Engine (DBs)',
        rationale:
          'Compresses embeddings into 50% less RAM with zero recall degradation, holding HNSW indexes (m=16, ef_construction=64) in memory.',
        integrationTrigger: 'Incremental indexing triggered upon HTTP 304/200 ETag validation.',
      },
      {
        layer: 'Layer 2: RAG Orchestration & Continuous Evaluation (AI)',
        rationale:
          'Evaluates Context Precision, Context Recall, Faithfulness, and Answer Relevance in real time to safeguard enterprise responses.',
        integrationTrigger: 'FastAPI Streaming Endpoint with circuit-breaker cutoff if cosine similarity < 0.78.',
      },
      {
        layer: 'Layer 3: Multi-Organization IAM & SSO (Auth)',
        rationale:
          'Segregates permissions by corporate firm or department, integrating directly with each B2B client active directory.',
        integrationTrigger: 'JWT claims synchronized with Supabase Row-Level Security policies.',
      },
    ],
  },
};

export function getScenarioContent(
  scenarioId: string,
  defaultPrompt: string,
  defaultSummary: string,
  defaultNodes: any[],
  lang: Language
) {
  if (lang === 'es') {
    return { promptText: defaultPrompt, executiveSummary: defaultSummary, nodes: defaultNodes };
  }
  const tr = RAG_SCENARIOS_TRANSLATIONS_EN[scenarioId];
  if (!tr) {
    return { promptText: defaultPrompt, executiveSummary: defaultSummary, nodes: defaultNodes };
  }
  const translatedNodes = defaultNodes.map((node, i) => {
    const nodeTr = tr.nodes[i];
    if (!nodeTr) return node;
    return {
      ...node,
      layer: nodeTr.layer || node.layer,
      rationale: nodeTr.rationale || node.rationale,
      integrationTrigger: nodeTr.integrationTrigger || node.integrationTrigger,
    };
  });
  return {
    promptText: tr.promptText || defaultPrompt,
    executiveSummary: tr.executiveSummary || defaultSummary,
    nodes: translatedNodes,
  };
}

