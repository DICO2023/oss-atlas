"""Backend FastAPI — Acelerador de Integraciones Open Source.

Endpoints (Fase 2-3):
  GET  /health
  GET  /api/v1/catalog            (catálogo + filtros licencia/categoría)
  POST /api/v1/hybrid-search      (FTS 'simple' + HNSW halfvec + RRF k=60)
  POST /api/v1/rag/architecture   (mapa de arquitectura RAG)
  GET  /api/v1/tools/{slug}/health (Health Score)
"""
from fastapi import FastAPI

app = FastAPI(title="Acelerador de Integraciones Open Source", version="0.1.0")

@app.get("/health")
def health():
    return {"status": "ok"}

# Los routers viven en app/api/v1/endpoints/ (catalog.py, hybrid_search.py, rag.py, health.py).
