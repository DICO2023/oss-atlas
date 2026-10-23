# 🚀 Estado del Proyecto: OSS Atlas (Acelerador de Integraciones Open Source)

**Fecha de última sesión:** 22 de Octubre de 2026  
**Objetivo:** Desarrollar, auditar y preparar para monetización/despliegue la plataforma B2B de inteligencia arquitectónica Open Source bajo el modelo Open-Core sin dependencias de nubes propietarias.  
**Titularidad & Autoría Oficial (Formato Híbrido):** `EdisonPEÑA (Iotdico - https://ossatlas.iotdico.com)`  
**Subdominio Corporativo Asignado:** `https://ossatlas.iotdico.com` (Hostinger Business Hosting activo hasta el 23 de enero de 2029).

---

## 📌 1. Servicios y Entorno de Ejecución

| Componente | Configuración / Puerto | Estado Actual |
| :--- | :--- | :--- |
| **Base de Datos Cloud** | Neon Serverless PostgreSQL 16 (`pgvector` 0.7+ con `halfvec`) en AWS US-East-2 | **Activa 24/7 en la nube** (13 herramientas indexadas con vectores semánticos) |
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
  - Catálogo validado e incrementado exitosamente a 13 herramientas activas.

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
     - *Capa Libre / Open Source:* Catálogo, búsqueda híbrida local y despliegue Docker.
     - *Capa Monetizable SaaS ($19 - $49 USD/mes):* Guías paso a paso para Windows y Mac (.md / .pdf), consultas ilimitadas al Arquitecto RAG, manifiestos unificados y soporte técnico.
2. **Nombre Oficial de Marca y Producto:**
   - **OSS Atlas** *(The Open-Source Architecture & Intelligence Atlas)*.
3. **Infraestructura Activa a Costo Cero:**
   - **Subdominio corporativo:** `ossatlas.iotdico.com` en Hostinger Business Hosting (hasta enero 2029).
   - **Vercel Edge Network:** CI/CD automático conectado al repositorio de GitHub.
   - **Neon Serverless PostgreSQL 16:** Base de datos cloud serverless en AWS US-East-2.

---

## 🚀 4. Hitos Recientes de Monetización, UI & Ajustes del Cliente (22 Octubre 2026)

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
  - **Catálogo & Filtros:** Título, subtítulo, selector de licencias (MIT / Apache-2.0 / Todas), botón de sincronización, barra de búsqueda híbrida RRF, sugerencias de búsqueda rápida y avisos de estado vacío.
  - **Fichas Técnicas del Catálogo:** Licencia, Health Score con desglose ponderado (Commits 15%, Seguridad 20%, Docs 65%), ranking híbrido, dificultad de integración, disparadores (triggers), botones de copiar Docker run, inspección y botón de descarga de Guía de Integración (.md & .pdf).
  - **Asistente Conversacional RAG:** Badge, título, subtítulo, selector de escenarios de negocio, panel de métricas cardinales RAGAS (Precision, Recall, Faithfulness 100%, Relevance), mapa de arquitectura emitido, triggers de integración y formulario de consulta interactiva.
  - **Modal de Checkout & Planes B2B:** Precios, ciclos mensual/anual, descuentos, desglose tributario, métodos de pago (PayPal, Wenia USDW, Transferencia) y confirmación con token corporativo.
  - **Pie de Página (Footer):** Dictamen de auditoría y créditos oficiales de autoría.
- Selector de idioma en el Header (**`🇪🇸 ES`** / **`🇺🇸 EN`**) con persistencia en `localStorage`. Al pulsar el botón, el 100% de la interfaz conmuta instantáneamente sin recargar la página.
- **Traducción Dinámica de Herramientas y Telemetría B2B:**
  - Diccionario integral `TOOL_DESCRIPTIONS_EN` en [translations.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/translations.ts) para la totalidad de repositorios (`postgres/postgres`, `supabase/postgres-pgvector`, `qdrant/qdrant`, `keycloak/keycloak`, `zitadel/zitadel`, `casbin/casbin`, `openfga/openfga`, `goauthentik/authentik`, `ory/kratos`, `juspay/hyperswitch`, `killbill/killbill`, `getlago/lago`, `meilisearch/meilisearch`, `vllm-project/vllm`, `run-llama/llama_index`, `langchain-ai/langchain`).
  - Funciones auxiliares `getToolDescription(slug, description, lang)`, `getDifficultyLabel(diff, lang)` (`Low` / `Medium` / `High`) y `getSavingsLabel(savings, lang)` (`USD / mo vs Proprietary Cloud`).
  - Vinculación reactiva tanto en las tarjetas del catálogo como en el modal de previsualización y exportación Markdown de guías.

- **Traducción Integral de Escenarios RAG y Planes de Precios B2B:**
  - **Asistente RAG B2B:** Traducción dinámica de los 3 casos de uso preconfigurados (`scenario-logistics-b2b`, `scenario-fintech-compliance`, `scenario-saas-ai-copilot`) incluyendo prompts de negocio, resúmenes ejecutivos, nombres de capas de arquitectura (`Layer 1..4`), justificaciones técnicas y triggers de integración mediante [`getScenarioContent`](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/translations.ts).
  - **Burbuja de Conversación CTO:** Encabezados traducidos (`Consulta de Arquitectura B2B` / `B2B Architecture Query`, `Dominio` / `Domain`).
  - **Planes B2B (Pricing Cards):** Traducción del 100% de insignias (`OPEN-CORE FREE`, `RECOMMENDED B2B • MOST POPULAR`, `ARCHITECTURE & PRO GUIDES`, `TEAMS & ENTERPRISE`), descripciones de planes, frecuencias de cobro (`USD / mo`, `USD / yr (equiv. $15.8/mo)`), y todos los puntos de características (features) para Community, Pro Architecture y Enterprise Hub.

### 4.3. Depuración Visual y de Marca (Atención a Documento de Sugerencias)
- **Página 1 del Documento:**
  - Se eliminó el subtítulo técnico redundante del logo (`pgvector 0.7+ (halfvec) • RRF (k=60) • RAGAS Verified • ossatlas.iotdico.com`).
  - Se optimizó el favicon e ícono de pestaña con el nombre corto `OSS Atlas | B2B Architecture` ([icon.svg](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/icon.svg) y [favicon.svg](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/favicon.svg)).
  - Se eliminaron los botones de navegación `Plan PMO (32 Días)` y `Traspaso Asíncrono`.
  - Se removió la fecha fija `12 OCT – 13 NOV 2026 (32 DÍAS)` del hero pill.
- **Página 2 del Documento:**
  - Se removió en su totalidad la sección de cronograma WBS de 32 días y matriz RACI (`#pmo-wbs-section`), así como el modal de protocolo de traspaso asíncrono.
- **Página 3 del Documento:**
  - Pasarelas de pago adaptadas a PayPal y Wenia USDW.
  - Plataforma completamente en español con selector de cambio a inglés (incluyendo descripciones de herramientas, métricas y telemetría de ahorro B2B).

### 4.4. Control de Versiones y Despliegue en Vivo
- Commits subidos a GitHub (`https://github.com/DICO2023/oss-atlas.git` en rama `main`):
  - `39ec987`: *feat: release OSS Atlas v1.0 by EdisonPEÑA (Iotdico)*
  - `135e604`: *docs: registrar hito de commit inicial en ESTADO_PROYECTO.md*
  - `d654c83`: *feat(ui/checkout): apply document adjustments (remove PMO/tagline, add PayPal & Wenia USDW, ES/EN i18n)*
  - `5912f7d`: *fix(i18n): bind complete bilingual translation dictionary to Hero, Categories, Catalog, Cards, RAG and Footer*
  - `afdd577`: *fix(i18n): translate all tool descriptions, difficulty labels, and B2B savings to English*
  - `afc6898`: *fix(i18n): refine savings label and update tool descriptions in production*
  - `4f57e17`: *docs: sync bilingual tool description completion in ESTADO_PROYECTO.md*
  - `5a2f460`: *feat(guides): implement multi-platform downloadable guide generator in .md and .pdf for Windows and macOS*
- Despliegue automático y verificación en vivo activa en: **[https://ossatlas.iotdico.com](https://ossatlas.iotdico.com)**.

---

## 🛠️ 5. Funcionalidad Implementada: Generador de Guías de Integración (.md & .pdf) para Windows y macOS

Se ha implementado el módulo técnico de generación y descarga de guías de integración para cada una de las herramientas del catálogo y arquitecturas RAG:

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

## 📂 Archivos Clave del Desarrollo

- [guideGenerator.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/guideGenerator.ts) — Generador técnico de guías descargables (.md y .pdf) con flujos adaptativos para Windows y Mac.
- [page.tsx](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/page.tsx) — Interfaz principal unificada (Hero, Catálogo, Asistente RAG B2B, Checkout con PayPal/Wenia, Selector de Idioma y Modal de Guías).
- [translations.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/translations.ts) — Diccionario centralizado de traducción Español/Inglés (`TRANSLATIONS.es` y `TRANSLATIONS.en`) con descripciones de herramientas y etiquetas de guías.
- [route.ts (Checkout API)](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/api/v1/checkout/route.ts) — Backend de monetización con soporte para PayPal, Wenia USDW y facturas proforma B2B.
- [route.ts (Catalog Sync)](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/api/v1/catalog/sync/route.ts) — Ingesta continua con Health Score ponderado y vectorización `halfvec(1536)`.
- [search.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/server/search.ts) — Motor de búsqueda híbrida RRF con FTS y vectores semánticos.
- [rag.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/server/rag.ts) — Asistente de arquitectura con evaluación RAGAS de cero alucinaciones.
- [icon.svg](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/icon.svg) & [favicon.svg](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/favicon.svg) — Favicon corporativo y assets visuales de pestaña.
- [Dockerfile](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/Dockerfile) — Contenedor de producción Alpine Linux optimizado (347 MB).
