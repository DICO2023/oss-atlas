# Frontend — Next.js / React (App Router, full-stack)

Esta es la aplicación principal del proyecto: **UI + API en la misma app
Next.js**. `app/page.tsx` es el componente `OpenSourceAcceleratorPage`
entregado (Catálogo + Arquitecto RAG + Plan PMO + Traspaso Asíncrono).
No hay backend separado por defecto: los Route Handlers consultan
PostgreSQL + pgvector directamente.

```bash
npm install
cp .env.example .env.local   # DATABASE_URL, ANTHROPIC_API_KEY, GITHUB_TOKEN
npm run dev                  # http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

## Dependencias (ver `package.json`)

| Paquete | Para qué |
|---|---|
| `next`, `react`, `react-dom` | App Router, SSR, UI |
| `pg` (+ `@types/pg`) | Cliente PostgreSQL (pool en `lib/server/db.ts`) |
| `zod` | Validación de query/body en los Route Handlers |
| `langchain`, `@langchain/core`, `@langchain/anthropic` | Arquitecto RAG (Claude, `temperature: 0`) |
| `meilisearch` | Cliente de búsqueda instantánea / facetas (Fase 3) |
| `openid-client` | OIDC contra Keycloak (SSO) — integración en Fase 3 |
| `tailwindcss`, `postcss`, `autoprefixer` | Estilos (clases usadas en `page.tsx`) |
| `typescript`, `@types/*`, `eslint`, `eslint-config-next` | Tipos y lint |

## Estructura

- `app/` → `page.tsx`, `layout.tsx`, `globals.css`
- `app/api/` → Route Handlers: `health`, `v1/catalog`, `v1/hybrid-search`,
  `v1/rag/architecture`, `v1/tools/[slug]/health`
- `components/` → `catalog/` (CategoriesGrid, FeaturedToolsCatalog),
  `rag/` (asistente, modal SQL, escenarios), `pmo/` (WBS, traspaso), `ui/`
- `lib/` → `types.ts`, `api-client.ts` (navegador), `server/` (db, search RRF, rag)

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Salud app + PostgreSQL + pgvector |
| GET | `/api/v1/catalog?category=&license=` | Catálogo desde PostgreSQL |
| POST | `/api/v1/hybrid-search` | FTS `'simple'` + HNSW halfvec + RRF k=60 |
| POST | `/api/v1/rag/architecture` | Mapa de arquitectura RAG |
| GET | `/api/v1/tools/{slug}/health` | Health Score + desglose 0.15/0.20/0.65 |

> `backend/` (FastAPI) queda como servicio Python **opcional** — solo si el
> equipo decide extraer el worker de ingesta/RAG a Python. Por defecto no se
> necesita para correr la app.
