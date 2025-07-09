#!/bin/bash
# build-production.sh - Build for production environment

set -e

# Load configuration
if [ -f "../configuration/deploy.config" ]; then
  source ../configuration/deploy.config
else
  echo "❌ Error: deploy.config file not found!"
  echo "Expected location: deployments/configuration/deploy.config"
  exit 1
fi

# Set environment-specific variables
ENVIRONMENT="production"
PORT="${PRODUCTION_PORT}"
TAG="${ENVIRONMENT}"
FULL_IMAGE_NAME="${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "🚀 === Building Sanafi Launchpad for PRODUCTION ==="
echo "Target image: ${FULL_IMAGE_NAME}"
echo "Environment: ${ENVIRONMENT}"
echo "Port: ${PORT}"
echo "Node version: ${NODE_VERSION}"
echo ""

# Check if production environment file exists
if [ ! -f "../../.env.production" ]; then
  echo "❌ Error: .env.production not found!"
  echo "💡 Copy from example: cp ../configuration/.env.production.example ../../.env.production"
  echo "   Then edit with your production values."
  exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf ../../.next

# Production environment file should already be named correctly
echo "✅ Using production environment variables (../../.env.production)"

# Build Next.js application
echo "⚡ Building Next.js application for production..."
cd ../../
pnpm build
cd deployments/workflow-production

# Check if build was successful
if [ ! -d "../../.next" ]; then
  echo "❌ Error: Next.js build failed!"
  exit 1
fi

echo "✅ Next.js build completed successfully!"
echo "🔍 Checking .next directory..."
ls -la ../../.next/ | head -5
echo ""

# Build Docker image for production
echo "🐳 Building Docker image for production (linux/amd64)..."
cd ../../
docker build --platform linux/amd64 -t "${IMAGE_NAME}:${TAG}" -t "${FULL_IMAGE_NAME}" .
cd deployments/workflow-production

if [ $? -eq 0 ]; then
  echo "✅ Production Docker image built successfully!"
  echo ""
  
  # Test production image locally
  echo "🧪 Testing production image locally on port ${PORT}..."
  CONTAINER_ID=$(docker run --platform linux/amd64 -d -p ${PORT}:${PORT} "${FULL_IMAGE_NAME}")
  
  echo "⏳ Waiting for application to start (20 seconds)..."
  sleep 20
  
  if docker ps | grep -q "${CONTAINER_ID}"; then
    echo "✅ Production container is running!"
    
    # Test endpoint
    for i in {1..6}; do
      if curl -f http://localhost:${PORT} >/dev/null 2>&1; then
        echo "✅ Production application responding on port ${PORT}!"
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
    echo "❌ Production container failed to start"
    docker logs "${CONTAINER_ID}" 2>&1 || true
    docker rm "${CONTAINER_ID}" >/dev/null 2>&1 || true
    exit 1
  fi
  
  echo ""
  echo "🚀 Ready to push production image to Docker Hub!"
  echo "Run: ./push-production.sh"
  
else
  echo "❌ Docker build failed!"
  exit 1
fi
