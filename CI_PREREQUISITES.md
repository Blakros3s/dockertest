# CI/CD Prerequisites Guide

This document outlines the necessary configuration and dependencies required for the project's Continuous Integration (CI) and Continuous Deployment (CD) pipelines to function correctly.

## Backend Requirements

The backend CI uses **Python 3.11** and performs linting checks.

### Required Files
- [backend/requirements.txt](file:///d:/Technest/dockertest/backend/requirements.txt): Must contain all backend dependencies.

### Required Packages
- **flake8**: Used for code linting. Ensure it is listed in `requirements.txt`:
  ```txt
  flake8==7.0.0
  ```

---

## Frontend Requirements

The frontend CI uses **Node.js 20**, perform security audits, linting, and build checks.

### Required Files
- [frontend/package.json](file:///d:/Technest/dockertest/frontend/package.json): Must contain scripts and dependencies.
- [frontend/eslint.config.mjs](file:///d:/Technest/dockertest/frontend/eslint.config.mjs): ESLint 9 Flat Config file.

### Required Scripts
The `package.json` must include the following scripts:
```json
"scripts": {
    "lint": "eslint .",
    "build": "next build"
}
```

### Required Packages
- **eslint**: `^9.14.0` (Required for Flat Config support)
- **eslint-config-next**: `^15.1.5` (Stable version)
- **@eslint/eslintrc**: Required for compatibility with Next.js rules in ESLint 9.

---

## Infrastructure & Docker

The CI performs sanity builds for your Docker images.

### Required Files
- [backend/Dockerfile](file:///d:/Technest/dockertest/backend/Dockerfile)
- [frontend/Dockerfile](file:///d:/Technest/dockertest/frontend/Dockerfile)

---

## Deployment (CD) Secrets

For the `Test & Deploy` workflow ([ci-cd.yml](file:///d:/Technest/dockertest/.github/workflows/ci-cd.yml)) to work, the following **GitHub Actions Secrets** must be configured:

| Secret Name | Description |
| ----------- | ----------- |
| `SSH_HOST` | The IP address or hostname of your VPS. |
| `SSH_USER` | The username for SSH access (e.g., `root`). |
| `SSH_KEY` | Your private SSH key. |
| `SSH_PASSPHRASE` | The passphrase for your SSH key (if applicable). |
| `SSH_PORT` | The SSH port (usually `22`). |

---

## CI Configuration
- **CI Workflow**: [.github/workflows/ci.yml](file:///d:/Technest/dockertest/.github/workflows/ci.yml) (Runs on every Push/PR).
- **CD Workflow**: [.github/workflows/ci-cd.yml](file:///d:/Technest/dockertest/.github/workflows/ci-cd.yml) (Runs on Push to `main`).
