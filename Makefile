.PHONY: help up down build logs backend frontend db migrate

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Start all services
	docker compose up -d

down: ## Stop all services
	docker compose down

build: ## Rebuild all containers
	docker compose build

logs: ## Show logs (follow)
	docker compose logs -f

backend: ## Start only backend
	docker compose up -d db backend

frontend: ## Start only frontend
	docker compose up -d frontend

db: ## Start only database
	docker compose up -d db

migrate: ## Run database migrations
	docker compose exec backend alembic upgrade head

migrate-create: ## Create a new migration (usage: make migrate-create msg="description")
	docker compose exec backend alembic revision --autogenerate -m "$(msg)"

shell-backend: ## Open a shell in backend container
	docker compose exec backend bash

shell-db: ## Open psql in database container
	docker compose exec db psql -U postgres -d ai_pet_health

install-backend: ## Install backend dependencies locally
	cd backend && pip install -r requirements.txt

install-frontend: ## Install frontend dependencies locally
	cd frontend && npm install

dev-backend: ## Run backend locally (without Docker)
	cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Run frontend locally (without Docker)
	cd frontend && npm run dev

clean: ## Remove all containers, volumes, and build artifacts
	docker compose down -v
	rm -rf frontend/node_modules frontend/dist
	rm -rf backend/__pycache__ backend/.pytest_cache
