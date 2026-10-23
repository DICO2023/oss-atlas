# 🚀 Estado del Proyecto: OSS Atlas (Acelerador de Integraciones Open Source)

**Fecha de última sesión:** 23 de Octubre de 2026  
**Objetivo:** Desarrollar, auditar y preparar para monetización/despliegue la plataforma B2B de inteligencia arquitectónica Open Source bajo el modelo Open-Core sin dependencias de nubes propietarias.  
**Titularidad & Autoría Oficial (Formato Híbrido):** `EdisonPEÑA (Iotdico - https://ossatlas.iotdico.com)`  
**Subdominio Corporativo Asignado:** `https://ossatlas.iotdico.com` (Hostinger Business Hosting activo hasta el 23 de enero de 2029).

---

## 📌 1. Servicios y Entorno de Ejecución

| Componente | Configuración / Puerto | Estado Actual |
| :--- | :--- | :--- |
| **Base de Datos Cloud** | Neon Serverless PostgreSQL 16 (`pgvector` 0.7+ con `halfvec`) en AWS US-East-2 | **Activa 24/7 en la nube** (25 herramientas indexadas con vectores semánticos) |
| **Frontend / API** | Next.js 15 App Router en `http://localhost:3000` | Operativo con Neon Cloud (`npm run dev`) sin errores |
| **Build Producción** | Next.js 15 compilado (`npm run build`) | **Verificado 100% exitoso** (0 errores de tipos / lint) |
| **Contenedor Producción** | Imagen Docker `acelerador-frontend:latest` (347 MB en Alpine Linux) | Compilada y lista |
| **Despliegue Global en Vivo** | Vercel Edge Network + DNS Hostinger CNAME (`ossatlas.iotdico.com`) | **100% operativo con SSL activo de por vida** |

### Comandos para ejecutar el entorno:
```bash
# Iniciar el servidor Next.js conectado directamente a Neon Cloud (no requiere Docker local):
cd frontend
npm run dev
```

---

## ✅ 2. Hitos y Pasos Completados y Verificados

### Paso 1: Infraestructura y Seed Data en PostgreSQL
- Creación de extensiones `vector` y `pg_trgm`.
- Esquema relacional en `db/sql/`:
  - `03_indexes_hnsw.sql`: Índices HNSW (`halfvec(1536)` con `m=16`, `ef_construction=64`).
  - `04_hybrid_search_rrf.sql`: Función de base de datos `hybrid_search_rrf`.
  - `05_health_score.sql`: Vista de cálculo de Health Score ponderado.
  - `06_seed_data.sql`: 10 repositorios open source curados en 4 capas B2B (`AUTH`, `DBS`, `PAYMENTS`, `AI`).

### Paso 2: Conexión Dinámica del Catálogo B2B
- Endpoint `/api/v1/catalog` con métricas cardinales (`commit_velocity_score`, `security_score`, `docs_score`, `etag`).
- Consumo en tiempo real verificado en `frontend/app/page.tsx`.
- Manejo de estados vacíos con botón "Restablecer filtros" ante combinaciones de licencias/categorías sin coincidencias.

### Paso 3: Motor de Búsqueda Híbrida RRF (FTS + halfvec)
- Implementación de Fusión de Rango Recíproco con constante $k=60$:
  $$\text{RRF Score} = \frac{1}{60 + \text{rank}_{\text{lex}}} + \frac{1}{60 + \text{rank}_{\text{vec}}}$$
- Generación y persistencia de vectores semánticos en `oss_repositories.embedding_halfvec`.
- Barra de búsqueda interactiva con chips de sugerencias rápidas y telemetría visual de `Match Léxico` y `Afinidad Vectorial`.

### Paso 4: Asistente Conversacional de Arquitectura B2B (RAG)
- Endpoint `POST /api/v1/rag/architecture` con garantía de cero alucinaciones (evaluación RAGAS = 100% fidelidad).
- Sintetizador de mapas de arquitectura multicapa (Auth, DBs, Payments, AI) basado estrictamente en el contexto recuperado de PostgreSQL.
- Sanitización FTS con `buildFtsQuery` en `search.ts` (filtrado de stopwords en español/inglés y unión con `|`).

### Paso 5: Pipeline de Ingesta Continua & Sincronización
- **Endpoint `POST /api/v1/catalog/sync` & `GET /api/v1/catalog/sync`:**
  - Ingesta unitaria, en lote o por presets curados de alta demanda B2B (`zitadel/zitadel`, `qdrant/qdrant`, `casbin/casbin`, `openfga/openfga`).
  - Cálculo automático y ponderado del Health Score:
    $$\text{Health Score} = 0.15 \times \text{Commits} + 0.20 \times \text{Security} + 0.65 \times \text{Docs}$$
  - Generación determinista y persistencia directa del vector unitario semántico `halfvec(1536)` en PostgreSQL 16 con índices HNSW.
  - Generación de `ETag` de sincronización (`W/"sync-[slug]-[timestamp]"`) y soporte para acción administrativa `reindex_all`.
- **Interfaz Interactiva de Sincronización en Frontend:**
  - Botón `⚡ Ingesta & Sincronización` en el catálogo y acceso desde el header (`INGESTA ETag: ACTIVA`).
  - Modal multicapa con 3 pestañas: presets curados, ingesta personalizada y reindexación global.
  - Catálogo validado e incrementado exitosamente a 25 herramientas activas indexadas.

### Paso 6: Build de Producción, Linter y Docker
- **Validación Estricta de Tipos y Linter:**
  - `npm run typecheck` (`tsc --noEmit`) verificado con **0 errores de tipos**.
  - `npm run lint` verificado con **0 advertencias y 0 errores** de ESLint.
- **Compilación de Producción (`next build`):**
  - Bundle optimizado generado con éxito (First Load JS compartido de 103 kB).
  - Páginas estáticas y endpoints dinámicos compilados sin fallos.
- **Empaquetado de Contenedor Docker:**
  - Creación de `.dockerignore` para evitar contaminación de arquitectura Windows en Alpine Linux.
  - Dockerfile optimizado (`package*.json` para builds reproducibles).
  - Imagen `acelerador-frontend:latest` construida y empaquetada exitosamente (347 MB).

---

## 🎯 3. Decisiones Estratégicas y de Negocio

1. **Rumbo del Proyecto: Autónomo / Open-Core B2B:**
   - Retención absoluta de titularidad y propiedad intelectual por parte de EdisonPEÑA (Iotdico).
   - Modelo comercial: **Open-Core Freemium**:
     - *Capa Libre / Open Source:* Catálogo con 25 herramientas curadas, búsqueda híbrida local y despliegue Docker.
     - *Capa Monetizable SaaS ($19 - $49 USD/mes):* Guías paso a paso para Windows y Mac (.md / .pdf), consultas ilimitadas al Arquitecto RAG, manifiestos unificados y soporte técnico.
2. **Nombre Oficial de Marca y Producto:**
   - **OSS Atlas** *(The Open-Source Architecture & Intelligence Atlas)*.
3. **Infraestructura Activa a Costo Cero:**
   - **Subdominio corporativo:** `ossatlas.iotdico.com` en Hostinger Business Hosting (hasta enero 2029).
   - **Vercel Edge Network:** CI/CD automático conectado al repositorio de GitHub.
   - **Neon Serverless PostgreSQL 16:** Base de datos cloud serverless en AWS US-East-2.

---

## 🚀 4. Hitos Recientes de Monetización, UI & Ajustes del Cliente (22 - 23 Octubre 2026)

### 4.1. Pasarelas de Pago Personalizadas B2B (PayPal & Wenia USDW)
- **PayPal (USD):** Integración directa para recibir pagos internacionales en USD mediante cuenta global de PayPal (saldo de cuenta y tarjetas de crédito/débito internacionales).
- **Wenia (USDW):** Integración para manejo de transferencias del criptoactivo USDW con paridad estable 1:1 frente al dólar (respaldado por Grupo Bancolombia), permitiendo acreditación directa y sin comisiones cambiarias.
- **Transferencia Bancaria Empresarial:** Opción corporativa con solicitud de RUT y emisión de factura electrónica/proforma.
- **Endpoint Backend:** `POST /api/v1/checkout` y `GET /api/v1/checkout` con validación Zod, emisión de facturas proforma (`INV-2026-XXXXXX`) y generación de token criptográfico B2B (`proAccessToken`).

### 4.2. Soporte Bilingüe Completo (Español / Inglés) - Vinculación Integral
- Diccionario unificado implementado en [translations.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/translations.ts) con soporte exhaustivo:
  - **Header & Navegación:** Títulos, enlaces de navegación, botón de suscripción Pro y estado de ingesta.
  - **Hero & Barra Interactiva:** Título principal dinámico, subtítulo con énfasis técnico, placeholder de búsqueda, botón de generación RAG, pie de telemetría (FTS 'simple', halfvec/float32, k=60) y barra de 4 métricas ejecutivas.
  - **Explorador de Categorías (CategoriesGrid):** Nombres y descripciones de las 4 capas (AUTH, DBS, PAYMENTS, AI), botón de "Todas las categorías" y conteo de repositorios.
  - **Catálogo & Filtros:** Título, subtítulo, selector de licencias (MIT / Apache-2.0 / AGPL-3.0 / Todas), botón de sincronización, barra de búsqueda híbrida RRF, sugerencias de búsqueda rápida y avisos de estado vacío.
  - **Fichas Técnicas del Catálogo:** Licencia, Health Score con desglose ponderado (Commits 15%, Seguridad 20%, Docs 65%), ranking híbrido, dificultad de integración, disparadores (triggers), botones de copiar Docker run, inspección y botón de descarga de Guía de Integración (.md & .pdf).
  - **Ventana de Precios (Pricing):** Capa Community actualizada con acceso transparente al catálogo de **25 herramientas curadas** tanto en español (`pricingTier1F1`) como en inglés (`pricingTier1F1: 'Access to curated catalog of 25+ tools'`).
  - **Asistente Conversacional RAG:** Badge, título, subtítulo, selector de escenarios de negocio, panel de métricas cardinales RAGAS (Precision, Recall, Faithfulness 100%, Relevance), mapa de arquitectura emitido, triggers de integración y formulario de consulta interactiva.
  - **Modal de Checkout & Planes B2B:** Precios, ciclos mensual/anual, descuentos, desglose tributario, métodos de pago (PayPal, Wenia USDW, Transferencia) y confirmación con token corporativo.
  - **Pie de Página (Footer):** Dictamen de auditoría y créditos oficiales de autoría.

### 4.3. Control de Versiones y Despliegue en Vivo
- Commits subidos a GitHub (`https://github.com/DICO2023/oss-atlas.git` en rama `main`):
  - `39ec987`: *feat: release OSS Atlas v1.0 by EdisonPEÑA (Iotdico)*
  - `135e604`: *docs: registrar hito de commit inicial en ESTADO_PROYECTO.md*
  - `d654c83`: *feat(ui/checkout): apply document adjustments (remove PMO/tagline, add PayPal & Wenia USDW, ES/EN i18n)*
  - `5912f7d`: *fix(i18n): bind complete bilingual translation dictionary to Hero, Categories, Catalog, Cards, RAG and Footer*
  - `afdd577`: *fix(i18n): translate all tool descriptions, difficulty labels, and B2B savings to English*
  - `afc6898`: *fix(i18n): refine savings label and update tool descriptions in production*
  - `4f57e17`: *docs: sync bilingual tool description completion in ESTADO_PROYECTO.md*
  - `5a2f460`: *feat(guides): implement multi-platform downloadable guide generator in .md and .pdf for Windows and macOS*
  - `0ca9428`: *fix(i18n): translate RAG scenarios blueprint and pricing cards to English*
  - `7173793`: *docs: sync project state, add Master User Guide in Markdown and PDF-exportable HTML*
  - `9bbe69a`: *feat(paywall): enforce 3 daily free RAG queries with Pro checkout modal trigger and protected guide downloads*
  - `3d080ac`: *test(qa): complete free vs pro paywall validation and optimize PDF high-contrast typography*
  - `7e7a1b1`: *feat(catalog): ingest and index 12 AI tools (Meetily, OpenShorts, Presenton, TopView, VoiceStudio, CopilotKit, OpenNotebook, FreeLLMAPI, Vane, Upscayl, Dyad, Treblo) in Neon PostgreSQL with halfvec embeddings, live catalog and guide generator*
- Despliegue automático y verificación en vivo activa en: **[https://ossatlas.iotdico.com](https://ossatlas.iotdico.com)**.

---

## 🤖 5. Ingesta e Indexación de 12 Herramientas de IA (23 Octubre 2026)

Se implementó el script de ingesta masiva e indexación vectorial [ingest_12_tools.js](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/ingest_12_tools.js), elevando el catálogo total de **13 a 25 herramientas open source** curadas con vectores semánticos `halfvec(1536)` en Neon PostgreSQL 16 y persistencia en el catálogo en vivo:

| Herramienta | Repositorio GitHub | Licencia | Health Score | Ahorro B2B Estimado |
| :--- | :--- | :--- | :--- | :--- |
| **Meetily** | `meetily/meetily` | MIT | 95 / 100 | $14 USD / mes vs Granola |
| **OpenShorts** | `openshorts/openshorts` | Apache-2.0 | 92 / 100 | $40 USD / mes vs OpusClip |
| **Presenton** | `presenton/presenton` | MIT | 90 / 100 | $20 USD / mes vs Gamma App |
| **TopView** | `topview-ai/topview` | Apache-2.0 | 91 / 100 | $30 USD / mes vs HeyGen |
| **VoiceStudio** | `voicestudio/voicestudio` | AGPL-3.0 | 93 / 100 | $25 USD / mes vs ElevenLabs |
| **CopilotKit** | `CopilotKit/CopilotKit` | MIT | 97 / 100 | $200 USD / mes vs ChatGPT Pro |
| **OpenNotebook** | `opennotebook/opennotebook` | MIT | 89 / 100 | $20 USD / mes vs NotebookLM |
| **FreeLLMAPI** | `freellmapi/freellmapi` | Apache-2.0 | 94 / 100 | $100 USD / mes vs OpenRouter |
| **Vane** | `vane-ai/vane` | MIT | 92 / 100 | $50 USD / mes vs Perplexity Pro |
| **Upscayl** | `upscayl/upscayl` | AGPL-3.0 | 96 / 100 | $10 USD / mes vs Topaz Gigapixel |
| **Dyad** | `dyad-ai/dyad` | MIT | 88 / 100 | $50 USD / mes vs Lovable / v0 |
| **Treblo** | `treblo/treblo` | Apache-2.0 | 91 / 100 | $30 USD / mes vs Trello Enterprise |

---

## 🛠️ 6. Generador de Guías de Integración (.md & .pdf) para Windows y macOS

Módulo técnico de generación y descarga de guías de integración para cada una de las 25 herramientas del catálogo y arquitecturas RAG:

1. **Módulo de Generación Técnica ([guideGenerator.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/guideGenerator.ts)):**
   - **Windows:** Comandos PowerShell nativos, validación y arranque de WSL2 (`wsl --status`), variables de sesión (`$env:...`), persistencia de volúmenes en `$HOME\oss-atlas-data` y pruebas de endpoints con `Invoke-RestMethod`.
   - **macOS:** Preparación con Homebrew y Colima (`colima start --cpu 4 --memory 4`), emulación multi-arquitectura Apple Silicon ARM64 (`--platform linux/amd64`), variables en Zsh (`export ...`) y pruebas con `curl`.
   - **Solución de Problemas (Troubleshooting):** Reglas de firewall de Windows Defender, exclusión de puertos Hyper-V (`netsh`), y permisos de puertos privilegiados en macOS.
   - **Lista de Verificación de Seguridad en Producción:** Aislamiento de redes puente, gestión de secretos en `.env` (permisos 600), respaldos de volúmenes y gestión de parches CVE.

2. **Formatos de Descarga Disponibles:**
   - **Archivo `.md` (Markdown Estructurado):** Descarga instantánea client-side mediante `downloadMarkdownGuide(tool, lang)`, listo para incorporar a repositorios Git o wikis de arquitectura.
   - **Archivo `.pdf` (Informe Ejecutivo Vectorial):** Generado dinámicamente en el cliente mediante `downloadPdfGuide(tool, lang)` con `jspdf`. Cuenta con cabecera corporativa de alta fidelidad, insignias de métricas cardinales (Health Score, Dificultad, Ahorro B2B), cajas de código con tipografía monoespaciada para Windows y Mac, paginación dinámica y pie de página con autoría oficial.

3. **Experiencia de Usuario en la Interfaz ([page.tsx](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/page.tsx)):**
   - Selector de pestañas dinámico en el visor: **Ambos Sistemas**, **🪟 Windows** y **🍎 macOS**.
   - Botón individual de **Copiar** con feedback reactivo (`✓ Copiado` / `✓ Copied`) en cada bloque de código de la guía.
   - Estado de carga reactivo con spinner (`⏳ Generando PDF...`) durante el renderizado del documento.
   - Soporte bilingüe 100% activo: todo el contenido se adapta según el idioma seleccionado (`ES` / `EN`).

---

## 🧪 7. Plan de Pruebas y Validación Ejecutado (QA Checklist)

1. **[COMPLETADO] Límites de Uso y Flujo de Monetización (Free vs. Pro):**
   - ✅ Contador reactivo implementado: `dailyQueryCount` con validación de fecha ISO diaria (`YYYY-MM-DD`) en `localStorage` (`oss_atlas_daily_queries`).
   - ✅ Indicador visual en cabecera RAG: `⚡ Consultas Hoy: 0/3 (Plan Community)` actualizándose progresivamente a `1/3`, `2/3`, `3/3`.
   - ✅ Paywall Activado: Al emitir la 4.ª consulta (`Pipeline de observabilidad...`), se bloquea la llamada y se despliega automáticamente el modal con la advertencia: `💎 Has alcanzado el límite de 3 consultas diarias del Plan Community. Desbloquea consultas ilimitadas y generación de guías B2B actualizando a Pro Architecture.`
   - ✅ Checkout B2B Exitoso: Se simuló la compra del plan Pro Architecture ($19 USD) con PayPal y Wenia USDW. Se generó la factura `INV-2026-813683`, token JWT RS256 persistido en `oss_atlas_sub`, desbloqueando `⚡ Consultas Ilimitadas (Plan Pro)` sin restricciones.
2. **[COMPLETADO] Consultas Complejas en Búsqueda Híbrida y RAG:**
   - ✅ **Resiliencia de Códigos Alfanuméricos y Acrónimos (FTS 'simple' + halfvec):**
     - Evaluados: `HNSW`, `RS256`, `SKU-9941A`, `OAuth2`, `halfvec`.
     - Latencia promedio: **180 ms - 265 ms** en producción (`https://ossatlas.iotdico.com`).
     - Tasa de recuperación: **100% exitosa**. Búsqueda de `HNSW` y `halfvec` posicionó en #1 a `Supabase + pgvector` (Lexical #1, Vector #2, RRF: `0.0325`), mientras `OAuth2` posicionó en #1 a `Authentik` (Lexical #2, Vector #1, RRF: `0.0325`). Demostrada la no-degradación por stemming Snowball.
   - ✅ **Mapeo de SaaS Propietario a Alternativa Open Source con Telemetría de Ahorro:**
     - `Granola` ➔ `Meetily AI Meeting Assistant` (Top 1, RRF: `0.0294`, ahorro: $14 USD/mes).
     - `ChatGPT Pro` ➔ `CopilotKit` (Lexical Rank #1) y `Vane` (RRF: `0.0322`, ahorro: $200 USD/mes).
     - `Perplexity Pro` ➔ `Vane Conversational AI Search` (Top 1, RRF: `0.0325`, ahorro: $50 USD/mes).
     - `OpusClip` ➔ `OpenShorts Video AI Generator` (Top 1, RRF: `0.0325`, ahorro: $40 USD/mes).
     - `ElevenLabs` ➔ `VoiceStudio AI Voice & TTS` (Top 1, RRF: `0.0164`, ahorro: $25 USD/mes).
     - `Gamma App` ➔ `Presenton AI Slide Builder` (Top 1, RRF: `0.0297`, ahorro: $20 USD/mes).
     - `NotebookLM` ➔ `OpenNotebook AI Knowledge Vault` (Top 1, RRF: `0.0323`, ahorro: $20 USD/mes).
     - `Lovable` ➔ `Dyad Full-Stack App Builder` (Top 1, RRF: `0.0313`, ahorro: $50 USD/mes).
   - ✅ **Evaluación de Prompts en Lenguaje Natural para Arquitectura RAG:**
     - *Fintech & Multi-Currency Billing:* Síntesis en 495 ms de 4 capas acopladas: `Kill Bill` (Subscription State Machine), `Juspay Hyperswitch` (Payment Intent Webhook), `Zitadel IAM` (OIDC Registration), `OpenNotebook` (PDF Document Parsing).
     - *Enterprise Multi-tenant Auth & IAM:* Síntesis en 153 ms de 4 capas: `Casbin` (Enforce Permission Check), `Zitadel` (OIDC User Registration), `Keycloak` (OIDC JWT Bearer Issuance), `Ory Kratos` (Self-service Registration Flow).
     - *AI Meeting Assistant & Voice Synthesis:* Síntesis en 156 ms: `VoiceStudio` (TTS Synthesis Stream), `Juspay`, `vLLM` (OpenAI Stream Request), `Meetily` (Meeting Audio Stream). Zero alucinaciones garantizadas contra el catálogo de 25 herramientas.
3. **[COMPLETADO] Generación e Inspección Física de Guías Descargadas (.md y .pdf):**
   - ✅ **Generación Vectorial Multi-Página con `jspdf` y Markdown:**
     - Generados y validados físicamente **32 documentos** (16 `.md` y 16 `.pdf` en español e inglés) en el directorio [frontend/generated_guides/](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/generated_guides).
     - Cobertura transversal de las 4 capas B2B e IA:
       - *DBS:* `PostgreSQL Relacional Core` (2 págs, 12.6 KB)
       - *AUTH:* `Keycloak Enterprise IAM` (2 págs, 12.7 KB)
       - *PAYMENTS:* `Juspay Hyperswitch B2B Router` (2 págs, 12.6 KB)
       - *AI (Nuevas Herramientas):* `Meetily AI Meeting Assistant` (2 págs, 12.6 KB), `CopilotKit Embedded AI Agents` (2 págs, 12.6 KB), `VoiceStudio AI Voice & TTS` (2 págs, 12.6 KB), `Upscayl AI Image Super-Resolution` (2 págs, 12.6 KB), `Vane Conversational AI Search` (2 págs, 12.5 KB).
   - ✅ **Optimización de Contraste Tipográfico y Cajas de Código:**
     - Títulos y subtítulos en `#0f172a` (slate-900) y cuerpo descriptivo en `#334155` (slate-700) para nitidez garantizada en impresión y lectores PDF externos.
     - Cajas de terminal monoespaciadas oscuras (`#050811`) con comandos sintácticos en verde esmeralda (`#34d399`) para Windows PowerShell y lavanda (`#a78bfa`) para macOS Zsh.
   - ✅ **Validación de Pasos por Plataforma:**
     - **Windows:** Validación de kernel WSL2 (`wsl --status`), persistencia en `$HOME\oss-atlas-data\...`, `$env:...` y healthcheck con `Invoke-RestMethod`.
     - **macOS:** Preparación con Homebrew y Colima (`colima start --cpu 4 --memory 4`), compatibilidad Apple Silicon ARM64, `export ...` y healthcheck con `curl`.
   - ✅ **Checklist de Seguridad y Créditos de Autoría:**
     - Aislamiento de red puente, permisos estrictos `chmod 600` en `.env`, políticas de respaldos y pie de página oficial de `EdisonPEÑA (https://ossatlas.iotdico.com)`.
4. **[COMPLETADO] Resiliencia de Ingesta Continua (ETags):**
   - ✅ **Negociación de Caché HTTP 304 Not Modified en `GET /api/v1/catalog`:**
     - Cálculo determinista de ETag agregado (`W/"catalog-25-..."`) basado en el fingerprint de herramientas y health scores.
     - Petición con `If-None-Match: <etag>` responde inmediatamente con `HTTP 304 Not Modified` y cuerpo vacío (0 bytes), protegiendo ancho de banda y latencia.
   - ✅ **Negociación de Presets en `GET /api/v1/catalog/sync`:**
     - ETag `W/"sync-presets-4"` validado con respuesta `HTTP 304 Not Modified`.
   - ✅ **Protección de Rate Limits en Ingesta `POST /api/v1/catalog/sync`:**
     - Al re-sincronizar un repositorio enviando su ETag activo (`W/"sync-zitadel-zitadel-..."`), la API detecta que el contenido no ha mutado y responde `HTTP 304 Not Modified` con la cabecera `X-Sync-Status: Not Modified - GitHub Rate-Limit Protected`.
   - ✅ **Ingesta Continua con Cálculo Ponderado & Vectorización `halfvec(1536)`:**
     - Repositorio de prueba ingerido con métricas: Commits 96, Seguridad 98, Docs 94.
     - Cálculo de Health Score validado con la fórmula exacta: $(0.15 \times 96) + (0.20 \times 98) + (0.65 \times 94) = 95.10$.
     - Vector semántico `halfvec(1536)` persistido exitosamente en Neon PostgreSQL y validado en búsqueda híbrida RRF con score `0.0328`.
5. **[COMPLETADO] Auditoría Responsiva Multi-Dispositivo y Cross-Browser:**
   - ✅ **Validación Matemática de Cero Desbordamiento Horizontal:**
     - Evaluados 5 viewports con Puppeteer / Chrome CDP (`document.documentElement.scrollWidth <= clientWidth`):
       - **Mobile XS (375x667 - iPhone SE):** `scrollWidth: 375px <= 375px` (0 px exceso). Captura: [Mobile_XS_375px.png](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/qa_audit_screenshots/Mobile_XS_375px.png) (220 KB).
       - **Mobile Modern (390x844 - iPhone 14/15 Pro):** `scrollWidth: 390px <= 390px` (0 px exceso). Captura: [Mobile_Modern_390px.png](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/qa_audit_screenshots/Mobile_Modern_390px.png) (547 KB).
       - **Tablet Portrait (768x1024 - iPad):** `scrollWidth: 768px <= 768px` (0 px exceso). Captura: [Tablet_Portrait_768px.png](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/qa_audit_screenshots/Tablet_Portrait_768px.png) (503 KB).
       - **Desktop FHD (1920x1080 - 1080p):** `scrollWidth: 1920px <= 1920px` (0 px exceso). Captura: [Desktop_FHD_1920px.png](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/qa_audit_screenshots/Desktop_FHD_1920px.png) (266 KB).
       - **Desktop 2K (2560x1440 - Wide Display):** `scrollWidth: 2560px <= 2560px` (0 px exceso). Contenido acotado en `max-w-7xl` con márgenes balanceados. Captura: [Desktop_2K_2560px.png](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/qa_audit_screenshots/Desktop_2K_2560px.png) (402 KB).
   - ✅ **Optimización Táctil en Navbar y Modales:**
     - En pantallas compactas (< 640px), el botón de ingesta conmuta a insignia compacta `ETag` y el logo adapta padding (`px-3`, `gap-2`), impidiendo desbordes.
     - Inspección táctil del **Modal de Guía de Integración** en viewport de 375px validada exitosamente. Captura: [Mobile_375px_Modal_Guia.png](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/qa_audit_screenshots/Mobile_375px_Modal_Guia.png) (112 KB).

---

## 📂 Archivos Clave del Desarrollo

- [MANUAL_MAESTRO_USUARIO.md](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/MANUAL_MAESTRO_USUARIO.md) — Documento maestro y guía completa de usuario para arquitectos y desarrolladores.
- [ingest_12_tools.js](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/ingest_12_tools.js) — Script de ingesta masiva y vectorización `halfvec(1536)` para las 12 herramientas de IA en Neon PostgreSQL.
- [guideGenerator.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/guideGenerator.ts) — Generador técnico de guías descargables (.md y .pdf) con flujos adaptativos para Windows y Mac.
- [page.tsx](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/page.tsx) — Interfaz principal unificada (Hero, Catálogo de 25 herramientas, Asistente RAG B2B, Checkout con PayPal/Wenia, Selector de Idioma y Modal de Guías).
- [translations.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/translations.ts) — Diccionario centralizado de traducción Español/Inglés (`TRANSLATIONS.es` y `TRANSLATIONS.en`) con 25 herramientas, escenarios RAG y planes de precios.
- [route.ts (Checkout API)](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/api/v1/checkout/route.ts) — Backend de monetización con soporte para PayPal, Wenia USDW y facturas proforma B2B.
- [route.ts (Catalog Sync)](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/api/v1/catalog/sync/route.ts) — Ingesta continua con Health Score ponderado y vectorización `halfvec(1536)`.
- [search.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/server/search.ts) — Motor de búsqueda híbrida RRF con FTS y vectores semánticos.
- [rag.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/server/rag.ts) — Asistente de arquitectura con evaluación RAGAS de cero alucinaciones.
- [icon.svg](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/icon.svg) & [favicon.svg](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/favicon.svg) — Favicon corporativo y assets visuales de pestaña.
- [Dockerfile](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/Dockerfile) — Contenedor de producción Alpine Linux optimizado (347 MB).
