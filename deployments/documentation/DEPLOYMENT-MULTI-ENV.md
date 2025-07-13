# 🚀 Sanafi Launchpad - Multi-Environment Deployment

Professional staging and production deployment workflows with separate environments, configurations, and Docker images.

## 🏗️ Architecture Overview

```
📦 Staging Environment
├── Image: reviart18/sanafi-launchpad:staging
├── Port: 3013
├── Container: sanafi-launchpad-staging
└── Config: .env.staging

📦 Production Environment
├── Image: reviart18/sanafi-launchpad:production
├── Port: 3014
├── Container: sanafi-launchpad-production
└── Config: .env.production
```

## 📋 Prerequisites

- ✅ Docker installed locally and on VPS
- ✅ Docker Hub account configured in `deploy.config`
- ✅ `pnpm` installed locally
- ✅ Separate VPS or VPS with multiple ports (3013, 3014)

## 🔧 Initial Setup

### 1. Configure Docker Hub

```bash
# Edit deploy.config - already configured for multi-environment
DOCKER_HUB_USERNAME="reviart18"  # Your username
```

### 2. Create Environment Files

```bash
# Create staging environment
cp deployments/configuration/.env.staging.example .env.staging
# Edit .env.staging with staging values

# Create production environment
cp deployments/configuration/.env.production.example .env.production
# Edit .env.production with production values
```

> **🔒 Security Note:** Environment files (`.env.staging`, `.env.production`) are automatically ignored by git and will not be pushed to your repository.

## 🚀 Staging Deployment Workflow

### Step 1: Build Staging

```bash
./build-staging.sh
```

- Builds with `.env.staging`
- Creates `reviart18/sanafi-launchpad:staging`
- Tests locally on port 3013

### Step 2: Push Staging

```bash
./push-staging.sh
```

- Pushes staging image to Docker Hub
- Provides VPS deployment command

### Step 3: Deploy Staging on VPS

```bash
# Run this on your VPS
docker pull reviart18/sanafi-launchpad:staging
docker stop sanafi-launchpad-staging 2>/dev/null || true
docker rm sanafi-launchpad-staging 2>/dev/null || true
docker run -d \
  --name sanafi-launchpad-staging \
  --restart on-failure:5 \
  --platform linux/amd64 \
  -p 3013:3013 \
  --health-cmd="curl -f http://localhost:3013 || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-start-period=15s \
  --health-retries=3 \
  reviart18/sanafi-launchpad:staging
```

**🌐 Staging URL:** `http://your-vps-ip:3013`

---

## 🏭 Production Deployment Workflow

### Step 1: Build Production

```bash
./build-production.sh
```

- Builds with `.env.production`
- Creates `reviart18/sanafi-launchpad:production`
- Tests locally on port 3014

### Step 2: Push Production

```bash
./push-production.sh
```

- Pushes production image to Docker Hub
- Provides VPS deployment command

### Step 3: Deploy Production on VPS

```bash
# Run this on your VPS
docker pull reviart18/sanafi-launchpad:production
docker stop sanafi-launchpad-production 2>/dev/null || true
docker rm sanafi-launchpad-production 2>/dev/null || true
docker run -d \
  --name sanafi-launchpad-production \
  --restart on-failure:5 \
  --platform linux/amd64 \
  -p 3014:3014 \
  --health-cmd="curl -f http://localhost:3014 || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-start-period=15s \
  --health-retries=3 \
  reviart18/sanafi-launchpad:production
```

**🌐 Production URL:** `http://your-vps-ip:3014`

---

## 🔍 Environment Management

### Key Differences

| Aspect          | Staging                    | Production                    |
| --------------- | -------------------------- | ----------------------------- |
| **Image Tag**   | `:staging`                 | `:production`                 |
| **Port**        | 3013                       | 3014                          |
| **Container**   | `sanafi-launchpad-staging` | `sanafi-launchpad-production` |
| **Environment** | `.env.staging`             | `.env.production`             |
| **API URLs**    | `staging-api.domain.com`   | `api.domain.com`              |

### Environment Variables Examples

```bash
# .env.staging
NEXT_PUBLIC_POOL_CONFIG_KEY=staging_key_123
NEXT_PUBLIC_API_URL=https://staging-api.domain.com
NEXT_PUBLIC_ENVIRONMENT=staging

# .env.production
NEXT_PUBLIC_POOL_CONFIG_KEY=prod_key_456
NEXT_PUBLIC_API_URL=https://api.domain.com
NEXT_PUBLIC_ENVIRONMENT=production
```

## 📊 Monitoring Both Environments

### Check Status

```bash
# Staging
docker ps | grep staging
docker logs sanafi-launchpad-staging
curl http://your-vps-ip:3013

# Production
docker ps | grep production
docker logs sanafi-launchpad-production
curl http://your-vps-ip:3014
```

### Health Status

```bash
# Check health of both environments
docker inspect sanafi-launchpad-staging | grep -A 5 "Health"
docker inspect sanafi-launchpad-production | grep -A 5 "Health"
```

## 🔄 Update Workflows

### Update Staging

```bash
# Local
./build-staging.sh
./push-staging.sh

# VPS - rerun staging deployment command
```

### Update Production (after staging validation)

```bash
# Local
./build-production.sh
./push-production.sh

# VPS - rerun production deployment command
```

## 📁 File Structure

```
├── deploy.config                    # Multi-environment config
├── .env.staging.example             # Staging environment template
├── .env.production.example          # Production environment template
├── .env.staging                     # Your staging values (create this)
├── .env.production                  # Your production values (create this)
├── build-staging.sh                 # Build staging image
├── build-production.sh              # Build production image
├── push-staging.sh                  # Push staging to Docker Hub
├── push-production.sh               # Push production to Docker Hub
└── Dockerfile                       # Shared Docker configuration
```

## 🎯 Best Practices

1. **Test in staging first** - Always deploy to staging before production
2. **Separate secrets** - Use different API keys, database URLs, etc.
3. **Monitor both environments** - Set up health checks for both
4. **Use different domains/subdomains** - `staging.domain.com` vs `domain.com`
5. **Backup before production deploys** - Always have a rollback plan

---

## 🎉 Quick Reference

### Staging: Test & Validate

```bash
./build-staging.sh && ./push-staging.sh
# Deploy on VPS, test at http://vps:3013
```

### Production: Go Live

```bash
./build-production.sh && ./push-production.sh
# Deploy on VPS, live at http://vps:3014
```

**Perfect for professional development workflows!** 🌟
