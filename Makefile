.PHONY: up down setup backend frontend test
up: ## Levanta toda la infraestructura
	docker compose up -d
down:
	docker compose down
setup: ## Instala dependencias backend + frontend
	cd backend && pip install -r requirements.txt
	cd frontend && npm install
backend:
	cd backend && uvicorn app.main:app --reload
frontend:
	cd frontend && npm run dev
test:
	cd backend && pytest -q
	cd pipeline && pytest -q
