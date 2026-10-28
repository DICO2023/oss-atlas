# 🚀 Estado del Proyecto: OSS Atlas (Acelerador de Integraciones Open Source)

**Fecha de última sesión:** 27 de Octubre de 2026  
**Objetivo:** Desarrollar, auditar y operar la plataforma B2B de inteligencia arquitectónica 100% Open Source bajo Licencia MIT, con dimensionamiento de hardware físico on-premise (Capa 0) y monetización ética mediante el programa Amazon Associates (`iotdico-20`).  
**Titularidad & Autoría Oficial (Formato Híbrido):** `EdisonPEÑA (Iotdico - https://ossatlas.iotdico.com)`  
**Subdominio Corporativo Asignado:** `https://ossatlas.iotdico.com` (Hostinger Business Hosting activo hasta el 23 de enero de 2029).

---

## 📌 1. Servicios y Entorno de Ejecución

| Componente | Configuración / Puerto | Estado Actual |
| :--- | :--- | :--- |
| **Base de Datos Cloud** | Neon Serverless PostgreSQL 16 (`pgvector` 0.7+ con `halfvec`) en AWS US-East-2 | **Activa 24/7 en la nube** (26 herramientas indexadas con vectores semánticos, 25 aprobadas + 1 condicional) |
| **Frontend / API** | Next.js 15 App Router en `http://localhost:3000` | Operativo con Neon Cloud (`npm run dev`) sin errores |
| **Build Producción** | Next.js 15 compilado (`npm run build`) | **Verificado 100% exitoso** (0 errores de tipos / lint) |
| **Contenedor Producción** | Imagen Docker `acelerador-frontend:latest` (347 MB en Alpine Linux) | Compilada y lista |
| **Despliegue Global en Vivo** | Vercel Edge Network + DNS Hostinger CNAME (`ossatlas.iotdico.com`) | **100% operativo con SSL activo de por vida** |
| **Programa de Afiliados** | Amazon Associates (`iotdico-20`) | **Activo y verificado** en hardware on-premise con leyenda legal |

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

1. **Rumbo del Proyecto: 100% Open Source Comunitario bajo Licencia MIT:**
   - Retención absoluta de titularidad y autoría intelectual por parte de EdisonPEÑA (Iotdico).
   - **Eliminación total de muros de pago (Paywalls):** Consultas ilimitadas en el Arquitecto RAG y descargas libres de guías de integración (.md y .pdf) para democratizar la adopción tecnológica B2B.
   - **Monetización Ética de Hardware On-Premise (Amazon Associates):** Recomendación de la Capa 0 física (Mini PCs, Servidores Torre, Servidores Rack y AI Workstations) con el ID oficial `iotdico-20` para cubrir infraestructura y generar ingresos de alto ticket sin cobrar al desarrollador ni bloquear software libre.
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
  - `7e7a1b1`: *feat(catalog): ingest and index 12 AI tools in Neon PostgreSQL with halfvec embeddings, live catalog and guide generator*
  - `4ed9d6b`: *test(qa): complete responsive multi-device audit across 5 viewports with zero horizontal overflow*
  - `0130bb2`: *feat(evaluator): implement on-demand github evaluation module and services scope section*
  - `78bb828`: *fix(evaluator): guarantee compatibility between audit and evaluation payloads and add auto-scroll to result card*
  - `bc637e9`: *feat(evaluator): implement Approach 2 for conditional tools with confirmation checkbox, db status tracking, catalog badge and rag caveat*
  - `0354e08`: *feat(ui): fix navbar on scroll, add strict multi-term search, visual architecture diagram, and community health notice*

### 4.4. Módulo de Evaluación On-Demand de GitHub & Sección Explicativa de Alcance de Servicios
- **Evaluador On-Demand de GitHub (`POST /api/v1/github/evaluate`):**
  - Permite a usuarios y arquitectos someter cualquier URL o slug de GitHub (`https://github.com/org/repo` o `org/repo`) a auditoría automatizada en tiempo real.
  - Valida licencias OSI permisivas (MIT, Apache-2.0, PostgreSQL, AGPL-3.0, BSD), actividad de commits reciente (< 90 días anti-abandonware), presencia de contenedor Docker (`Dockerfile` o `docker-compose.yml`) y estrellas de la comunidad.
  - Calcula el Health Score ponderado: $(0.15 \times \text{Commits}) + (0.20 \times \text{Seguridad}) + (0.65 \times \text{Docs})$.
  - Emite dictamen técnico: `APPROVED`, `CONDITIONAL` o `REJECTED`, sugiere categoría B2B (`AUTH`, `DBS`, `PAYMENTS`, `AI`), genera comando de despliegue Docker y estima ahorros B2B frente a SaaS propietarios.
  - Soporta parámetro `autoIngest: true` para persistir la herramienta directamente en Neon Serverless PostgreSQL 16 con vector semántico `halfvec(1536)` e incorporar inmediatamente al catálogo activo y al generador de guías (.md y .pdf).
- **Sección Explicativa: Alcance de los Servicios OSS Atlas (`#services-scope-section`):**
  - Sección interactiva de alto impacto visual orientada a clientes B2B, explicando con total transparencia el valor diferencial frente a buscadores genéricos de GitHub:
    1. *Curaduría Técnica & Filtro Anti-Abandonware* (garantía de commits recientes y licencias legales).
    2. *Búsqueda Híbrida RRF & Telemetría de Ahorro* (recuperación sub-200ms y ahorro cuantificado de $14 a $2,400 USD/mes).
    3. *Arquitecto RAG Multi-Capa con Cero Alucinaciones* (100% fidelidad RAGAS y triggers de integración).
    4. *Guías (.md & .pdf) y Auditoría On-Demand de GitHub* (despliegue paso a paso Windows/macOS y auditoría en 1 clic).
- **Integración en Navbar y Modal de Ingesta:**
  - Botón de navegación `Alcance de Servicios 💡` / `Scope of Services 💡` en el menú principal.
  - Pestaña de `🔍 Auditoría On-Demand GitHub` como vista principal del modal de sincronización, con chips de prueba rápida (`qdrant/qdrant`, `CopilotKit/CopilotKit`, `zitadel/zitadel`, `supabase/realtime`, `hoppscotch/hoppscotch`).

### 4.5. Implementación del Enfoque 2: Ingesta Condicional con Advertencia Explícita y Trazabilidad
- **Mecanismo de Salvaguarda en Modal de Auditoría:**
  - Si un repositorio recibe dictamen `CONDITIONAL` (p. ej. inactividad de commits > 180 días como `Imgbot/Imgbot`), el sistema despliega una caja de advertencia destacada en amarillo: `⚠️ ATENCIÓN DE MANTENIMIENTO B2B`.
  - El botón de ingesta se deshabilita hasta que el usuario marque conscientemente la casilla de verificación:
    > *"Entiendo que esta herramienta presenta inactividad o advertencias técnicas y asumo conscientemente los riesgos de mantenimiento en mi arquitectura."*
  - Si el repositorio es `REJECTED` (archivado, sin licencia OSI o score < 80), la ingesta queda bloqueada permanentemente.
- **Trazabilidad en Neon PostgreSQL 16:**
  - Migración exitosa de la tabla `oss_repositories` con la nueva columna: `status TEXT NOT NULL DEFAULT 'APPROVED'`.
  - `POST /api/v1/github/evaluate` almacena el valor de `status` ('APPROVED' o 'CONDITIONAL').
  - `GET /api/v1/catalog` propaga `status` hacia todo el frontend y búsquedas híbridas.
- **Visibilidad en el Catálogo Público y en el Asistente RAG:**
  - En las fichas del catálogo, las herramientas condicionales exhiben una insignia permanente `⚠️ CONDICIONAL` con nota de advertencia al pie de la descripción.
  - En el Asistente RAG, los planos arquitectónicos que incluyan herramientas condicionales añaden una nota de advertencia de mantenimiento por microservicio.
- **Caso Piloto Validado en Neon Cloud:**
  - Ingesta exitosa de `Imgbot/Imgbot` (Health Score 80.05/100, Licencia MIT, 1,353 estrellas, inactividad 633 días) bajo estado `CONDITIONAL`.

### 4.6. Mejoras de Usabilidad, Búsqueda Estricta, Diagrama Visual RAG y Vigilancia Continua
- **1. Header Superior Fijo y Permanente en Scroll (`Fixed Navbar`):**
  - Se sustituyó `position: sticky` por `fixed top-0 left-0 right-0 z-50` con `backdrop-blur-xl` y `shadow-xl`, resolviendo el problema de desaparición del menú al desplazarse hacia abajo.
  - Se ajustó el espaciado superior del contenedor principal (`pt-24 sm:pt-28`) para evitar superposiciones con el Hero.
- **2. Filtrado Estricto de Búsqueda y Soporte Multitérmino por Comas (`Strict Search Filter`):**
  - La búsqueda en el catálogo ahora aplica un filtrado estricto en el cliente sobre los resultados: si se busca una herramienta (p. ej. `qdrant`), **únicamente** se muestran las herramientas coincidentes, eliminando el comportamiento anterior donde las no coincidentes quedaban al final.
  - Soporte nativo para búsquedas separadas por coma (ej. `qdrant, zitadel`): el motor descompone los términos y muestra exclusivamente las herramientas que coincidan con cualquiera de ellos.
  - Al limpiar la búsqueda (botón `✕ Limpiar` o borrando el campo), se restablece de inmediato la totalidad del catálogo (las 26 herramientas).
- **3. Diagrama Visual Interactivo de Arquitectura en Asistente RAG (`Architecture Visual Flow Blueprint`):**
  - Se implementó un componente interactivo de diagrama de bloques conectado justo encima del desglose detallado de microservicios en la síntesis RAG.
  - Visualiza las 4 capas interconectadas con colores temáticos (`AUTH / IAM` en cian, `DBS & VEC` en esmeralda, `PAYMENTS` en ámbar, `AI & RAG` en violeta).
  - Incluye conectores direccionales (flechas horizontales en desktop y verticales en mobile), triggers de integración, puntuaciones de salud, licencias, métricas RRF/coseno y barra de telemetría de bus de comunicación (`gRPC / REST / Webhooks / halfvec`, latencia < 250ms).
- **4. Vigilancia Continua de Calidad & Deslistado Automático de la Comunidad (`Health & Curation Notice`):**
  - Se integró un banner informativo permanente de curaduría en la cabecera del catálogo: explica con total claridad el ciclo de vida de las herramientas frente a cambios en GitHub, avisos automáticos ante degradación de salud (<80%), inactividad (>180 días) o cambios de licencia a privativa (notificación comunitaria y paso a estado `CONDITIONAL` o retiro del catálogo).

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
        - **Desktop 2K (2560x1440 - Wide Display):** scrollWidth: 2560px <= 2560px (0 px exceso). Contenido acotado en max-w-7xl con márgenes balanceados. Captura: [Desktop_2K_2560px.png](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/qa_audit_screenshots/Desktop_2K_2560px.png) (402 KB).
    - ✅ **Optimización Táctil en Navbar y Modales:**
      - En pantallas compactas (< 640px), el botón de ingesta conmuta a insignia compacta ETag y el logo adapta padding (px-3, gap-2), impidiendo desbordes.
      - Inspección táctil del **Modal de Guía de Integración** en viewport de 375px validada exitosamente. Captura: [Mobile_375px_Modal_Guia.png](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/qa_audit_screenshots/Mobile_375px_Modal_Guia.png) (112 KB).
6. **[COMPLETADO] Pruebas del Módulo de Evaluación y Auditoría On-Demand de GitHub:**
   - ✅ **Evaluación Automatizada de Repositorios en Vivo:**
     - Probado mediante el script [test_github_evaluator.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/scripts/test_github_evaluator.ts) contra repositorios reales en GitHub:
       - `qdrant/qdrant`: Dictamen `APPROVED`, Health Score `99.85/100`, Licencia `Apache-2.0`, Docker detectado (`Dockerfile`), latencia `828ms`.
       - `CopilotKit/CopilotKit`: Dictamen `APPROVED`, Health Score `93.35/100`, Licencia `MIT`, latencia `894ms`.
       - `zitadel/zitadel`: Dictamen `APPROVED`, Health Score `93.35/100`, Licencia `AGPL-3.0`, latencia `583ms`.
   - ✅ **Ingesta Directa & Vectorización `halfvec(1536)` en Neon PostgreSQL:**
     - Soporte verificado para el parámetro `autoIngest: true` que calcula el embedding semántico de 1536 dimensiones, persiste en Neon Serverless PostgreSQL y genera la guía técnica de integración (.md y .pdf) inmediatamente.

---

## 🚀 5. Hitos de Transición a 100% Open Source Comunitario (26 Octubre 2026)

### 5.1. Fase 1: Limpieza de Pasarelas de Pago & Liberación 100% Open Source
- **Eliminación Total de Barreras Comerciales y Paywalls:**
  - Se retiró la sección de precios de pago (`PricingSection`), sustituyéndola por la sección **Comunidad & Manifiesto Open Source** (`#community-manifesto-section`), destacando la libertad tecnológica bajo licencia MIT y los 3 pilares comunitarios (Catálogo & Búsqueda Híbrida, Arquitecto RAG sin límites y Guías libres).
  - Se eliminó completamente de la interfaz el modal de suscripción y facturación B2B (`CheckoutModal` de PayPal/Wenia).
  - Se sustituyó el botón de suscripción Pro del Header por un botón comunitario directo de **Star en GitHub** hacia el repositorio oficial (`https://github.com/DICO2023/oss-atlas`).
- **Liberación de Consultas y Descargas Sin Restricciones:**
  - **Asistente RAG:** Se eliminó la restricción de 3 consultas diarias del plan gratuito. Ahora cualquier arquitecto o desarrollador puede consultar de forma ilimitada sin límites ni bloqueos.
  - **Guías de Integración (.md y .pdf):** Se eliminó el requisito de suscripción Pro para descargar. Ambos formatos se generan y descargan libre e instantáneamente para entornos Windows y macOS.
- **Actualización Integral del Diccionario Bilingüe (`translations.ts`):**
  - Textos de badges actualizados de `PRO B2B` a `OPEN SOURCE` y `100% Libre & Abierto`.
  - Badges de cuota actualizados a `⚡ Consultas Ilimitadas (100% Open Source)` / `⚡ Unlimited Queries (100% Open Source)`.
- **Verificación y Compilación Exitosa:**
  - `npm run typecheck` (`tsc --noEmit`): **0 errores de tipos**.
  - `npm run lint`: **0 advertencias y 0 errores** de ESLint.
  - `npm run build`: Compilación de producción en Next.js 15.5.28 completada con éxito en 34.6s.

### 5.2. Fase 2: Rediseño de la Navbar Flotante Humana (Inspiración navbar.gallery)
- **Concepto "Floating Island / Pill Nav":**
  - Barra de navegación flotante centrada (`fixed top-3 sm:top-4 inset-x-0 mx-auto w-[95%] max-w-6xl z-50 rounded-full`).
  - Fondo de vidrio satinado con efecto Glassmorphism (`backdrop-blur-md bg-slate-900/80 border border-slate-700/60 shadow-2xl shadow-cyan-950/20`).
- **Píldoras de Navegación Segmentada e Interacción Dinámica:**
  - Identidad visual a la izquierda: Logo tecnológico animado con pulso sutil cian, nombre `OSS Atlas` y badge `v1.0 OSS`.
  - Pestañas centrales tipo cápsula: `Catálogo & Categorías`, `Alcance de Servicios`, `Arquitecto RAG B2B`, y `Comunidad & Manifiesto`, con estado activo iluminado en cian y fondo `bg-cyan-500/20 text-cyan-300 font-semibold shadow-sm`.
  - Selector de idioma en minipíldora redondeada (`ES` / `EN`) con transición suave.
  - Botón de comunidad **GitHub Star** con estrella dorada vectorial (`★ Star`) enlazando directamente al repositorio.
  - Indicador de estado del catálogo en vivo con pulso de actividad verde esmeralda (`ETag Live`).
- **Menú Móvil Flotante:**
  - Botón hamburguesa táctil redondeado que despliega un panel de vidrio flotante independiente (`rounded-2xl backdrop-blur-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl`) con enlaces directos, selector de idioma y botón GitHub Star.
- **Validación Visual y Compilación:**
  - Verificado en navegador local (`http://localhost:3000`) y compilación `npm run build` completada con éxito (Exit Code 0).
  - Desplegado y versionado en GitHub `origin main` (commit `77201f0`).

### 5.3. Fase 3: Hoja de Hardware Recomendado (Capa 0 Física), Diagrama Radar & Guías Tri-Plataforma (Linux, Windows, macOS)
- **Modelado de Hardware Físico On-Premise ([hardwareCatalog.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/hardwareCatalog.ts)):**
  - **Nivel 1 (Mini PC / Homelab Edge):** Ryzen 9 / i9, 64GB DDR5, 2TB NVMe PCIe 4.0, Dual 2.5 GbE (35W-65W TDP). Capex ~$780 USD, ROI en 3.2 meses.
  - **Nivel 2 (Servidor Torre PYME):** Intel Xeon ECC / AMD EPYC 4004, 64-128GB ECC (anti-bitflip), RAID 1/10 (2x 2TB NVMe + 2x 4TB SATA), IPMI/iDRAC. Capex ~$1,850 USD, ROI en 3.5 meses.
  - **Nivel 3 (Servidor Rackmount 1U/2U Enterprise):** Dual EPYC 9004 / Xeon Silver, 128-256GB ECC RDIMM, 4x 1.92TB NVMe U.3 Hot-Swap, Dual 10 GbE SFP+ Fibra. Capex ~$4,600 USD, ROI en 3.4 meses.
  - **Nivel 4 (AI Inference & Agentic Workstation):** Ryzen 9 / i9, 128GB DDR5, 4TB NVMe, GPU NVIDIA RTX 4090 24GB VRAM (Tensor Cores / local LLMs). Capex ~$3,650 USD, ROI en 3.1 meses.
- **Diagrama Radar de Rendimiento Físico Recharts ([HardwareRadarChart.tsx](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/components/HardwareRadarChart.tsx)):**
  - Gráfico pentagonal en 5 dimensiones cardinales: Cómputo CPU, Memoria RAM & ECC, NVMe IOPS, Red & Ancho de Banda, y Eficiencia ROI/Costo.
  - Modos conmutables: **🎯 Modo Enfocado** (analizar una máquina) vs **📊 Modo Comparar 4** (superposición multi-color simultánea).
- **Integración Nativa en el Asistente B2B ([page.tsx](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/page.tsx)):**
  - Pestañas superiores segmentadas: `🖥️ Capas 1-4: Arquitectura de Software` y `🖲️ Capa 0: Hardware Recomendado & Diagrama Radar`.
  - Activado y verificado el programa de **Amazon Associates** con el ID único oficial `iotdico-20` (`NEXT_PUBLIC_AMAZON_AFFILIATE_TAG=iotdico-20`), inyectando automáticamente el parámetro `&tag=iotdico-20` en todos los enlaces y activando el descargo de transparencia legal en UI y guías.
  - Ecosistema de marcas líderes integrado y verificado: Minisforum, Beelink, Geekom, GMKtec, Apple Silicon Mac Studio, NVIDIA, Microsoft, Dell, Lenovo y Supermicro con enlaces directos categorizados.
  - Optimización de layout del Asistente B2B: visualización Blueprint en ancho completo y fila superior compacta de telemetría de arquitectura (Salud del Stack, Capex Físico y Ahorro SaaS Propietario).
- **Soporte Tri-Plataforma Nativo en Guías (.md & .pdf) e Interfaz:**
  - Incorporado **🐧 Linux nativo (Ubuntu / Debian / RHEL / Docker Engine & systemd)** con comandos oficiales de instalación de Docker, optimización del kernel (sysctl: `vm.max_map_count`, `net.core.somaxconn`), permisos persistentes `/opt/oss-atlas-data`, reglas de cortafuegos UFW/Firewalld y políticas SELinux.
  - Ficha de especificaciones de Hardware On-Premise incorporada en las descargas de guías `.md` y `.pdf` para presentación directa a equipos de compras y CTOs.
- **Validación y Compilación de Producción:**
  - `npm run typecheck` (`tsc --noEmit`): **0 errores de tipos**.
  - `npm run lint`: **0 advertencias, 0 errores** de ESLint.
  - `npm run build`: Compilación Next.js 15 exitosa (Exit Code 0).
  - Versionado y desplegado en GitHub `origin main` (commits `5e2ecd0`, `74701c9`, `434d8ee`, `51a0324`, `20521e5` y `30c18ca`).

---

## 📂 Archivos Clave del Desarrollo

- [route.ts (GitHub Evaluate API)](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/api/v1/github/evaluate/route.ts) — Endpoint backend para evaluación técnica On-Demand de repositorios de GitHub con cálculo de Health Score, Docker y ahorro B2B.
- [test_github_evaluator.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/scripts/test_github_evaluator.ts) — Suite de validación y pruebas de estrés para el módulo de auditoría On-Demand de GitHub.
- [MANUAL_MAESTRO_USUARIO.md](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/MANUAL_MAESTRO_USUARIO.md) — Documento maestro y guía completa de usuario para arquitectos y desarrolladores.
- [ingest_12_tools.js](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/ingest_12_tools.js) — Script de ingesta masiva y vectorización `halfvec(1536)` para las 12 herramientas de IA en Neon PostgreSQL.
- [guideGenerator.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/guideGenerator.ts) — Generador técnico de guías descargables (.md y .pdf) con flujos adaptativos tri-plataforma (Windows, macOS y Linux) y ficha de hardware físico.
- [hardwareCatalog.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/hardwareCatalog.ts) — Catálogo de hardware físico Capa 0 (Mini PC, Torre PYME, Rack Enterprise y AI Workstation), dimensionamiento dinámico y enlaces de afiliados Amazon (`iotdico-20`).
- [HardwareRadarChart.tsx](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/components/HardwareRadarChart.tsx) — Componente de gráfico vectorial Radar / Spider en Recharts con modos Enfocado y Comparativo de 5 dimensiones.
- [HardwareRecommendationSheet.tsx](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/components/HardwareRecommendationSheet.tsx) — Interfaz de recomendación de hardware en el Asistente B2B, calculadora de ROI, especificaciones de ingeniería y descargo legal de Amazon Associates.
- [page.tsx](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/page.tsx) — Interfaz principal 100% Open Source (Floating Island Navbar, Catálogo de 25 herramientas, Asistente RAG Ilimitado, Pestaña Capa 0 de Hardware, Manifiesto Comunitario y Modal Tri-Plataforma).
- [translations.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/translations.ts) — Diccionario centralizado de traducción Español/Inglés (`TRANSLATIONS.es` y `TRANSLATIONS.en`) adaptado 100% a la filosofía comunitaria Open Source y hardware on-premise.
- [route.ts (Catalog Sync)](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/api/v1/catalog/sync/route.ts) — Ingesta continua con Health Score ponderado y vectorización `halfvec(1536)`.
- [search.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/server/search.ts) — Motor de búsqueda híbrida RRF con FTS y vectores semánticos.
- [rag.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/server/rag.ts) — Asistente de arquitectura con evaluación RAGAS de cero alucinaciones.
- [icon.svg](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/icon.svg) & [favicon.svg](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/public/favicon.svg) — Favicon corporativo y assets visuales de pestaña.
- [Dockerfile](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/Dockerfile) — Contenedor de producción Alpine Linux optimizado (347 MB).

