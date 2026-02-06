# Docker Setup Guide
> <p align="center" style="font-size: 1.3rem; font-weight: bold; text-decoration: underline; color: red;">DISCLAIMER</p>
> Some section of this document was AI-generated. If you spot inaccuracies, call it out and I’ll fix it. Don’t assume everything here is gospel. 😶‍🌫️

This directory contains Docker configurations for development, UAT, and production environments.

## Overview

The Docker setup uses a layered configuration approach:
- **`docker-compose.base.yml`** - Common service definitions shared across all environments
- **`docker-compose.dev.yml`** - Development environment overrides
- **`docker-compose.prod.yml`** - Production environment overrides
- **`docker-compose.uat.yml`** - UAT environment overrides

## Quick Start

### Prerequisites

1. Docker and Docker Compose installed
2. Environment files configured:
   - `backend/.env` (for development)
   - `backend/.env.prod` (for production)
   - `backend/.env.uat` (for UAT)
   - `frontend/.env.local` (for development)
   - `frontend/.env.production` (for production/UAT)

### Using Makefile (Recommended)

The easiest way to manage Docker environments is using the Makefile in the project root:

> **Note:** If you don't have `make` installed, you can install it on Windows using one of these commands:
```bash
choco install make           # Using Chocolatey (recommended)
# or
winget install GnuWin32.Make # Using Windows Package Manager
```
For other platforms, use your package manager, e.g. `brew install make` on macOS or `sudo apt install make` on Ubuntu.

```bash
# Development
make dev          # Start development environment
make dev-down     # Stop development environment
make dev-logs     # View logs
make dev-build    # Rebuild images

# Production
make prod         # Start production environment
make prod-down    # Stop production environment

# UAT
make uat          # Start UAT environment
make uat-down     # Stop UAT environment
```
> **NOTE**  
> Dev `make` targets only spin up the backend service.  
> The `frontend` and `celery-beat` services are intentionally excluded to keep development lightweight and avoid unnecessary resource usage.  
>  
> If you need them running, start them yourself using the specific compose file.


### Manual Docker Compose Commands

If you prefer using Docker Compose directly:

```bash
# Development
cd docker
docker compose -f docker-compose.base.yml -f docker-compose.dev.yml up -d

# Production
docker compose -f docker-compose.base.yml -f docker-compose.prod.yml up -d

# UAT
docker compose -f docker-compose.base.yml -f docker-compose.uat.yml up -d
```
--- 
## Environment-Specific Details

### Development Environment

**Services:**
- PostgreSQL (port 5432)
- Redis (port 6379)
- Django Backend (port 8000)
- Next.js Frontend (port 3000)
- Celery Worker
- Celery Beat
- PgAdmin (port 5050) - Database management UI
- Flower (port 5555) - Celery monitoring UI

**Features:**
- Hot reload enabled for both backend and frontend
- Source code mounted as volumes for live editing
- Development tools (PgAdmin, Flower) included
- Debug-friendly logging

**Access:**
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000 
- PgAdmin: http://localhost:5050
- Flower: http://localhost:5555

### Production Environment

**Services:**
- PostgreSQL (configurable port, default 5438)
- Redis (configurable port, default 6380)
- Django Backend (configurable port, default 8009)
- Next.js Frontend (configurable port, default 3009)
- Celery Worker
- Celery Beat

**Features:**
- Optimized production builds
- Resource limits configured
- Production entrypoint scripts
- Static files and media volumes
- No development tools

**Configuration:**
Set environment variables in `backend/.env.prod`:
- `DB_PORT` - PostgreSQL host port (default: 5438)
- `REDIS_PORT` - Redis host port (default: 6380)
- `BACKEND_PORT` - Backend host port (default: 8009)
- `FRONTEND_PORT` - Frontend host port (default: 3009)
- `NEXT_PUBLIC_API_URL` - Frontend API URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID

### UAT Environment

**Services:**
- PostgreSQL (configurable port, default 5432)
- Redis (configurable port, default 6382)
- Django Backend (configurable port, default 8012)
- Next.js Frontend (configurable port, default 3012)
- Celery Worker
- Celery Beat
- Flower (configurable port, default 5552) - For monitoring

**Features:**
- Similar to production but with monitoring tools
- UAT-specific environment variables

## Dockerfiles

### Backend Dockerfiles

- **`backend/Dockerfile.base`** - Reference template (not used directly)
- **`backend/Dockerfile.dev`** - Development build with hot reload support
- **`backend/Dockerfile.prod`** - Production build optimized for size and security
- **`backend/Dockerfile.uat`** - UAT build (similar to production)

**Key Features:**
- Multi-stage builds for smaller images
- Non-root user for security
- Python 3.11-slim base image
- Consistent health checks
- Entrypoint scripts for migrations and static collection

### Frontend Dockerfile

- **`frontend/Dockerfile`** - Multi-stage Next.js build

**Key Features:**
- Standalone output mode for minimal runtime
- Build cache optimization
- Non-root user
- Health checks

## Environment Variables

### Required Environment Variables

**Backend (.env, .env.prod, .env.uat):**
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- `REDIS_HOST`, `REDIS_PORT`
- `SECRET_KEY`
- `DEBUG` (false for prod/uat)
- `ALLOWED_HOSTS`

**Frontend (.env.local, .env.production):**
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID

**Optional (for development tools):**
- `PGADMIN_EMAIL`, `PGADMIN_PASSWORD` - PgAdmin credentials
- `FLOWER_USER`, `FLOWER_PASSWORD` - Flower credentials

### Build Arguments

Frontend build requires these build args (set via environment variables or compose):
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

## Common Tasks

### View Logs

```bash
# All services
make dev-logs

# Specific service
cd docker
docker compose -f docker-compose.base.yml -f docker-compose.dev.yml logs -f backend
```

### Execute Commands in Containers

```bash
# Backend shell
make dev-shell-backend

# Run Django management command
cd docker
docker compose -f docker-compose.base.yml -f docker-compose.dev.yml exec backend python manage.py migrate

# Frontend shell
make dev-shell-frontend
```

### Rebuild Images

```bash
# Rebuild all services
make dev-build

# Rebuild specific service
cd docker
docker compose -f docker-compose.base.yml -f docker-compose.dev.yml build backend
```

### Database Management

```bash
# Access database via PgAdmin (dev only)
# Open http://localhost:5050
# Login with PGADMIN_EMAIL and PGADMIN_PASSWORD

# Or via psql
cd docker
docker compose -f docker-compose.base.yml -f docker-compose.dev.yml exec db psql -U postgres -d your_db_name
```

### Cleanup

```bash
# Remove stopped containers and unused images
make clean

# Remove volumes (WARNING: deletes data)
make clean-volumes

# Remove everything including volumes
make clean-all
```

## Troubleshooting

### Port Already in Use

If you get port conflicts, modify the port mappings in the environment-specific compose files or set environment variables:

```bash
export BACKEND_PORT=8001
export FRONTEND_PORT=3001
make dev-up
```

### Database Connection Issues

Ensure:
1. Database service is healthy (check with `docker compose ps`)
2. Environment variables are set correctly
3. Database is ready before backend starts (handled by `depends_on` with health checks)

### Build Failures

1. Check Dockerfile syntax
2. Verify all required files exist (requirements.txt, package.json, etc.)
3. Check build logs: `docker compose build --no-cache`

### Permission Issues

All containers run as non-root users. If you encounter permission issues:
1. Check volume mount permissions
2. Ensure directories exist and have correct ownership
3. For media/staticfiles, ensure they're writable by the app user (UID 1000)

## Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use secrets management** in production (Docker secrets, Kubernetes secrets, etc.)
3. **Non-root users** - All containers run as non-root for security
4. **Health checks** - All services have health checks for proper orchestration
5. **Resource limits** - Production has resource limits to prevent resource exhaustion

## Best Practices

1. **Always use layered compose files** - Don't modify `docker-compose.base.yml` directly
2. **Use environment variables** - Never hardcode secrets or URLs
3. **Keep images updated** - Regularly update base images for security patches
4. **Monitor logs** - Use centralized logging in production
5. **Backup volumes** - Regularly backup database and media volumes

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
