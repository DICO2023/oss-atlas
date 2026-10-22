# Backend — FastAPI (Python) — OPCIONAL

> **Stack principal: React.js / Next.js (App Router, full-stack).**
> La UI y la API viven en `frontend/` (Route Handlers en `app/api/`).
> Esta carpeta `backend/` es un servicio Python **opcional**: solo se usa si
> el equipo decide extraer el worker de ingesta/RAG a FastAPI.
> Por defecto **no se necesita** para correr la app.
> En `docker-compose.yml` está bajo el perfil `python-worker`:
> `docker compose --profile python-worker up -d`.

Si se activa:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload   # http://localhost:8000/docs
```

- `app/api/v1/endpoints/` → catalog, hybrid_search, rag, health
- `app/services/` → catalog, search (RRF), rag (LangChain), health_score
- `app/models/` + `app/schemas/` → SQLAlchemy + Pydantic (espejo de `db/sql/`)
- `app/core/` → config, seguridad (JWT Keycloak), rate-limit cliente
