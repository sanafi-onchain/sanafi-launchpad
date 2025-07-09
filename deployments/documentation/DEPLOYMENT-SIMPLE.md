# 🚀 Sanafi Launchpad Deployment Guide

Simple 3-step deployment workflow: Build → Push → Deploy

## 📋 Prerequisites

- ✅ Docker installed locally and on VPS
- ✅ Docker Hub account
- ✅ VPS with Docker running
- ✅ `pnpm` installed locally

## 🔧 Quick Setup

### 1. Configure Docker Hub Username

```bash
# Edit deploy.config
DOCKER_HUB_USERNAME="your-actual-username"  # Replace with your Docker Hub username
```

### 2. Configure Environment Variables (Important!)

```bash
# Copy the example file
cp .env.production.example .env.production

# Edit with your actual values
# Update NEXT_PUBLIC_POOL_CONFIG_KEY and other variables
```

## 🚀 Deployment Workflow (3 Steps Only)

### Step 1: Build and Test

```bash
./build-docker.sh
```

### Step 2: Push to Docker Hub

```bash
./push-to-hub.sh
```

### Step 3: Deploy on VPS

Run this on your VPS:

```bash
# Enhanced Production Deployment (Recommended)
docker stop sanafi-launchpad 2>/dev/null || echo "No container to stop"
docker rm sanafi-launchpad 2>/dev/null || echo "No container to remove"
docker pull reviart18/sanafi-launchpad:latest

docker run -d \
  --name sanafi-launchpad \
  --restart on-failure:5 \
  --platform linux/amd64 \
  -p 3013:3013 \
  --health-cmd="curl -f http://localhost:3013 || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-start-period=15s \
  --health-retries=3 \
  reviart18/sanafi-launchpad:latest
```

## 🔧 Environment Variables Setup

### Method 1: Build-time (Recommended)

Edit `.env.production` and rebuild:

```bash
# Edit your environment variables
vim .env.production

# Rebuild and redeploy
./build-docker.sh
./push-to-hub.sh
# Then run Step 3 on VPS
```

### Method 2: Runtime (Alternative)

Add environment variables to the docker run command:

```bash
docker run -d \
  --name sanafi-launchpad \
  --restart on-failure:5 \
  --platform linux/amd64 \
  -p 3013:3013 \
  -e NEXT_PUBLIC_POOL_CONFIG_KEY=your_key_here \
  -e NEXT_PUBLIC_API_URL=your_api_url \
  --health-cmd="curl -f http://localhost:3013 || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-start-period=15s \
  --health-retries=3 \
  reviart18/sanafi-launchpad:latest
```

## 🔍 Health Monitoring

### Check Status

```bash
# View container status
docker ps

# Check application logs
docker logs sanafi-launchpad

# Test application
curl http://localhost:3013
```

### Update Deployment

When you need to update:

```bash
# Local: Build and push
./build-docker.sh
./push-to-hub.sh

# VPS: Run Step 3 deployment command again
```

## ⚙️ Configuration Files

- **`deploy.config`** - Docker Hub username and container settings
- **`.env.production`** - Environment variables for your app
- **`build-docker.sh`** - Build script
- **`push-to-hub.sh`** - Push to Docker Hub script

## 🎉 Success Indicators

✅ `docker ps` shows container as "healthy"  
✅ `curl http://localhost:3013` returns your application  
✅ Browser shows your app at `http://your-vps-ip:3013`

---

**That's it! Simple 3-step deployment.** 🚀
