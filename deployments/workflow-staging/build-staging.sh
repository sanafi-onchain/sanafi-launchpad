#!/bin/bash
# build-staging.sh - Build for staging environment

set -e

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Load configuration
CONFIG_FILE="${SCRIPT_DIR}/../configuration/deploy.config"
if [ -f "${CONFIG_FILE}" ]; then
  source "${CONFIG_FILE}"
else
  echo "❌ Error: deploy.config file not found!"
  echo "Expected location: ${CONFIG_FILE}"
  exit 1
fi

# Set environment-specific variables
ENVIRONMENT="staging"
PORT="${STAGING_PORT}"
TAG="${ENVIRONMENT}"
FULL_IMAGE_NAME="${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "🚀 === Building Sanafi Launchpad for STAGING ==="
echo "Target image: ${FULL_IMAGE_NAME}"
echo "Environment: ${ENVIRONMENT}"
echo "Port: ${PORT}"
echo "Node version: ${NODE_VERSION}"
echo ""

# Check if staging environment file exists
if [ ! -f "${PROJECT_ROOT}/.env.staging" ]; then
  echo "⚠️  Warning: .env.staging not found!"
  echo "💡 Copy from example: cp deployments/configuration/.env.staging.example .env.staging"
  echo "   Then edit with your staging values."
  read -p "Continue without .env.staging? (y/n): " CONTINUE
  if [[ $CONTINUE != "y" && $CONTINUE != "Y" ]]; then
    exit 1
  fi
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf "${PROJECT_ROOT}/.next"

# Copy staging environment file for build
if [ -f "${PROJECT_ROOT}/.env.staging" ]; then
  # Create a temporary production env file for this build
  cp "${PROJECT_ROOT}/.env.staging" "${PROJECT_ROOT}/.env.production.tmp"
  mv "${PROJECT_ROOT}/.env.production.tmp" "${PROJECT_ROOT}/.env.production"
  echo "✅ Using staging environment variables for build"
  CLEANUP_ENV_FILE=true
else
  echo "⚠️  Building without specific staging environment variables"
  CLEANUP_ENV_FILE=false
fi

# Build Next.js application
echo "⚡ Building Next.js application for staging..."
cd "${PROJECT_ROOT}"
pnpm build
cd "${SCRIPT_DIR}"

# Check if build was successful
if [ ! -d "${PROJECT_ROOT}/.next" ]; then
  echo "❌ Error: Next.js build failed!"
  exit 1
fi

echo "✅ Next.js build completed successfully!"
echo "🔍 Checking .next directory..."
ls -la "${PROJECT_ROOT}/.next/" | head -5
echo ""

# Build Docker image for staging
echo "🐳 Building Docker image for staging (linux/amd64)..."
cd "${PROJECT_ROOT}"
docker build --platform linux/amd64 -t "${IMAGE_NAME}:${TAG}" -t "${FULL_IMAGE_NAME}" .
cd "${SCRIPT_DIR}"

if [ $? -eq 0 ]; then
  echo "✅ Staging Docker image built successfully!"
  echo ""
  
  # Test staging image locally
  echo "🧪 Testing staging image locally on port ${PORT}..."
  CONTAINER_ID=$(docker run --platform linux/amd64 -d -p ${PORT}:${PORT} "${FULL_IMAGE_NAME}")
  
  echo "⏳ Waiting for application to start (20 seconds)..."
  sleep 20
  
  if docker ps | grep -q "${CONTAINER_ID}"; then
    echo "✅ Staging container is running!"
    
    # Test endpoint
    for i in {1..6}; do
      if curl -f http://localhost:${PORT} >/dev/null 2>&1; then
        echo "✅ Staging application responding on port ${PORT}!"
        break
      else
        if [ $i -eq 6 ]; then
          echo "⚠️  Application might still be starting"
        else
          echo "⏳ Attempt $i/6: Waiting for response..."
          sleep 5
        fi
      fi
    done
    
    # Cleanup test container
    docker stop "${CONTAINER_ID}" >/dev/null 2>&1
    docker rm "${CONTAINER_ID}" >/dev/null 2>&1
    echo "🧹 Test container cleaned up"
  else
    echo "❌ Staging container failed to start"
    docker logs "${CONTAINER_ID}" 2>&1 || true
    docker rm "${CONTAINER_ID}" >/dev/null 2>&1 || true
    exit 1
  fi
  
  echo ""
  echo "🚀 Ready to push staging image to Docker Hub!"
  echo "Run: ./push-staging.sh"
  
  # Cleanup temporary environment file
  if [ "$CLEANUP_ENV_FILE" = true ] && [ -f "${PROJECT_ROOT}/.env.production" ]; then
    rm -f "${PROJECT_ROOT}/.env.production"
    echo "🧹 Cleaned up temporary environment file"
  fi
  
else
  echo "❌ Docker build failed!"
  
  # Cleanup on failure too
  if [ "$CLEANUP_ENV_FILE" = true ] && [ -f "${PROJECT_ROOT}/.env.production" ]; then
    rm -f "${PROJECT_ROOT}/.env.production"
    echo "🧹 Cleaned up temporary environment file"
  fi
  
  exit 1
fi
