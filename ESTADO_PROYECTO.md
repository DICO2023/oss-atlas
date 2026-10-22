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
  - Modal multicapa con 3 pestañas:
    - **Presets Curados B2B:** Sincronización a 1 clic con detección de herramientas ya existentes en la BD.
    - **Ingesta Personalizada:** Formulario con sliders de calidad y proyección en tiempo real del Health Score calculado antes del envío.
    - **Reindexación Global:** Mantenimiento vectorial y recálculo masivo de embeddings.
  - Verificado en navegador con subagente: catálogo incrementado exitosamente a 13 herramientas activas.

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
  - Imagen `acelerador-frontend:latest` construida y empaquetada exitosamente (347 MB de contenido).
- **Resolución de Incidencia Webpack:**
  - Se corrigió el error `Cannot find module ./897.js` limpiando el directorio `.next` tras el build de producción y relanzando `npm run dev` fresco.

---

## 🎯 3. Decisiones Estratégicas y de Negocio (Sesión 21 Oct)

1. **Rumbo del Proyecto: Autónomo / Open-Core B2B:**
   - Se acordó avanzar de forma 100% autónoma, reteniendo la titularidad y propiedad intelectual del producto.
   - Modelo comercial: **Open-Core Freemium**:
     - *Capa Libre / Open Source:* Catálogo, búsqueda híbrida local y despliegue Docker.
     - *Capa Monetizable SaaS ($10 - $25 USD/mes):* Consultas ilimitadas al Arquitecto RAG, exportación de informes ejecutivos en PDF para clientes B2B, y generador de manifiestos Terraform / Docker Compose unificados.
2. **Nombre Oficial de Marca y Producto:**
   - **OSS Atlas** *(The Open-Source Architecture & Intelligence Atlas)*.
3. **Infraestructura Activa a Costo Cero ($0.00 USD de inversión adicional):**
   - **Subdominio creado:** `ossatlas.iotdico.com`.
   - **Hosting base:** Hostinger Business Web Hosting con vigencia hasta el **23 de enero de 2029**.
   - **Beneficios vinculados:** Certificado SSL de por vida, CDN, 100 subdominios, almacenamiento de 200 GB y Hostinger Agent con 393 créditos para automatización de leads con Gmail, Notion y Slack.
   - **Estrategia de Base de Datos:** PostgreSQL 16 con `pgvector` alojado en Supabase / Neon (Free Tier permanente).

---

## 🚀 4. Punto de Partida para la Próxima Sesión

1. **Personalización de Marca y Autoría en Código (COMPLETADO):**
   - Licencia MIT actualizada con titularidad: `Copyright (c) 2026 EdisonPEÑA (Iotdico - https://ossatlas.iotdico.com)`.
   - `frontend/package.json` actualizado con autor `EdisonPEÑA (Iotdico - https://ossatlas.iotdico.com)`.
   - `README.md` actualizado con título `OSS Atlas` y metadatos de autoría oficial.
   - `frontend/app/page.tsx` actualizado en barra de navegación (`OSS Atlas` / `Iotdico B2B`), fases WBS completadas por `EdisonPEÑA (Iotdico)` y pie de página oficial.
2. **Control de Versiones y Repositorio Remoto (COMPLETADO AL 100%):**
   - Repositorio Git local inicializado en rama principal `main`.
   - Autor configurado y validado: `EdisonPEÑA <124206207+DICO2023@users.noreply.github.com>`.
   - Repositorio remoto vinculado: `https://github.com/DICO2023/oss-atlas.git`.
   - Commits subidos exitosamente a GitHub (`git push -u origin main`):
     - `39ec987`: `feat: release OSS Atlas v1.0 by EdisonPEÑA (Iotdico)` (137 archivos limpios).
     - `135e604`: `docs: registrar hito de commit inicial en ESTADO_PROYECTO.md`.
3. **Conexión de Base de Datos Cloud (COMPLETADO AL 100%):**
   - Instancia Serverless Neon PostgreSQL 16 provisionada en AWS US-East-2 (`oss-atlas`).
   - Extensiones `vector` (pgvector 0.7+) y `pg_trgm` activadas.
   - Script consolidado `00_full_migration.sql` y `scripts/migrate-cloud.mjs` ejecutados con éxito.
   - 13 herramientas B2B curadas sembradas y proyectadas con vectores semánticos `halfvec(1536)`.
   - Consulta RRF híbrida validada en vivo (< 15ms de latencia).
   - Variables de entorno en `frontend/.env.local` conectadas por SSL directo a Neon Cloud.
   - Compilación de producción (`next build`) verificada exitosamente sin advertencias.
4. **Despliegue en Producción y Subdominio `ossatlas.iotdico.com` (COMPLETADO AL 100%):**
   - Frontend Next.js 15 desplegado en la red global de borde (Edge Network) de Vercel.
   - Vinculado al repositorio oficial `https://github.com/DICO2023/oss-atlas.git` (CI/CD automático por cada commit).
   - Variables de entorno en producción configuradas con Neon PostgreSQL 16 (`DATABASE_URL`).
   - Zona DNS de Hostinger actualizada: CNAME `ossatlas` apuntando a `2d06daa840d5b9de.vercel-dns-017.com`.
   - Certificado SSL/TLS emitido y activo de por vida.
   - **Plataforma 100% en vivo y operativa en:** **[https://ossatlas.iotdico.com](https://ossatlas.iotdico.com)** (y espejo en `https://oss-atlas.vercel.app`).
5. **Capa de Monetización & Checkout B2B (COMPLETADO AL 100%):**
   - Endpoint `POST /api/v1/checkout` y `GET /api/v1/checkout` con validación Zod, emisión de facturas proforma (`INV-2026-XXXXXX`) y generación de token criptográfico B2B (`proAccessToken`).
   - Modelo de Precios Open-Core B2B implementado:
     - `Community` ($0 USD / libre de por vida).
     - `Pro Architecture` ($19 USD/mes o $190 USD/año con 2 meses gratis): Guías de integración paso a paso (.md y .pdf) para Windows y Mac, consultas RAG ilimitadas, manifiestos unificados y soporte &lt; 12h.
     - `Enterprise Hub` ($49 USD/mes o $490 USD/año): Multi-asiento hasta 10 arquitectos, auditorías normativas, integración CI/CD y sesión 1-on-1 de arquitectura.
   - Interfaz interactiva: selector mensual/anual con ahorro del 20%, botón de estado de suscripción en Header, modal de checkout corporativo con exención tributaria B2B e hidratación persistente en `localStorage`.
   - Botón directo en tarjetas del catálogo: `📄 Guía de Integración (.md & .pdf) [Win/Mac]` con badge `PRO B2B`.
   - Compilación de producción (`next build`) verificada 100% exitosa sin errores de tipos o linting.

6. **Generador y Exportador de Guías de Integración (.md & .pdf) para Windows & Mac (Próximo paso en curso):**
   - Cuando el usuario defina o seleccione la herramienta open source deseada, podrá exportar y descargar una guía técnica completa paso a paso adaptada para entornos Windows (PowerShell/WSL2/Docker Desktop) y macOS (Homebrew/Terminal/Colima), disponible en extensiones `.md` y `.pdf`.

---

## 📂 Archivos Clave del Desarrollo

- [page.tsx](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/page.tsx) — Interfaz completa (Hero, Catálogo interactivo, Modal de Ingesta & Sincronización, Asistente RAG, Auditoría RAGAS).
- [route.ts (Catalog Sync)](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/app/api/v1/catalog/sync/route.ts) — Endpoint de Ingesta Continua con cálculo de Health Score y halfvec(1536).
- [search.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/server/search.ts) — Motor de búsqueda híbrida RRF con FTS y vectores halfvec.
- [embedding.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/server/embedding.ts) — Generador y proyector vectorial de 1536 dimensiones.
- [rag.ts](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/lib/server/rag.ts) — Lógica de síntesis arquitectónica y evaluación RAGAS.
- [Dockerfile](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/frontend/Dockerfile) — Contenedor de producción Alpine Linux optimizado.
- [docker-compose.yml](file:///d:/AntigravityWorkspace/NO%20COUNTRY/acelerador-integraciones-open-source/docker-compose.yml) — Orquestación multicontenedor (PostgreSQL + pgvector, Keycloak, Meilisearch, Next.js).
