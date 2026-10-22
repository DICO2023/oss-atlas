# Pipeline — Ingesta GitHub GraphQL + Health Score

```bash
pip install -r requirements.txt
python -m src.ingestion.run --limit 100
```

- `src/github_client/` → cliente GraphQL con batching + ETags
- `src/rate_limit/` → Token Bucket + Exponential Backoff con jitter
- `src/health_score/` → Health Score ponderado (0.15 / 0.20 / 0.65)
- `src/ingestion/` → orquestador: extraer → normalizar → upsert en PostgreSQL
- `sql/` → consultas de verificación; `data/` → crudos locales (ignorado por git)
