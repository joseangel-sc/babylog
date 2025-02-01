.PHONY: install start stop clean db-start db-stop db-restart db-logs migrate-dev migrate-reset studio help prisma-generate seed

# Colors for prettier output
YELLOW=\033[1;33m
NC=\033[0m # No Color

# Default target when just running 'make'
.DEFAULT_GOAL := help

help: ## Show this help
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

install: ## Install all dependencies
	npm install
	@make prisma-generate

start: ## Start the Remix development server
	npm run dev -- --host

stop: ## Stop the Remix development server (if running)
	pkill -f "remix dev" || true

db-start: ## Start the database container
	docker compose up -d
	@echo "Waiting for database to be ready..."
	@sleep 3

db-stop: ## Stop the database container
	docker compose down

db-restart: ## Restart the database container
	make db-stop
	make db-start

db-logs: ## Show database logs
	docker compose logs -f

db-clean: ## Stop and remove database container, volume, and all data
	docker compose down -v

migrate-dev: ## Run Prisma migrations in development
	npx prisma migrate dev

migrate-reset: ## Reset database and run all migrations
	npx prisma migrate reset --force

studio: ## Open Prisma Studio
	npx prisma studio

init-db: ## Initialize database with first migration
	@if [ ! -f "prisma/migrations/migration_lock.toml" ]; then \
		echo "Running initial migration..." && \
		npx prisma migrate dev --name init; \
	else \
		echo "Migrations already initialized, running migrate dev..." && \
		npx prisma migrate dev; \
	fi

dev: db-start prisma-generate ## Start everything for development
	@make init-db
	@make start

reset-all: ## Reset everything - database, migrations, and node modules
	make db-clean
	rm -rf node_modules
	@make install
	@make db-start
	@make migrate-dev

lint: ## Run linter
	npm run lint || true

format: ## Format code with Prettier
	npm run format || true

test: ## Run vitest 
	npm run test 

prisma-generate: ## Generate Prisma types
	@if [ ! -d "node_modules/.prisma/client" ]; then \
		echo "Generating Prisma client..." && \
		npx prisma generate; \
	else \
		echo "Prisma client already exists"; \
	fi

seed: ## Seed the database with test data
	npx prisma db seed
