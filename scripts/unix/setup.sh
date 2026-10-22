#!/usr/bin/env bash
# Setup Unix/macOS: dependencias + .env + docker
set -euo pipefail
cp -n .env.example .env || true
docker compose up -d
(cd backend && pip install -r requirements.txt)
(cd frontend && npm install)
echo "Listo. Backend: uvicorn app.main:app --reload | Frontend: npm run dev"
