#!/bin/bash
# push-staging.sh - Push staging image to Docker Hub

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
ENVIRONMENT="staging"
TAG="${ENVIRONMENT}"
FULL_IMAGE_NAME="${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "🚀 === Pushing Staging Image to Docker Hub ==="
echo "Target: ${FULL_IMAGE_NAME}"
echo ""

# Check if image exists locally
if ! docker image inspect "${FULL_IMAGE_NAME}" >/dev/null 2>&1; then
  echo "❌ Error: Staging image ${FULL_IMAGE_NAME} not found locally!"
  echo "Run './build-staging.sh' first to build the staging image."
  exit 1
fi

# Login to Docker Hub if needed
echo "🔐 Checking Docker Hub authentication..."
if ! docker info | grep -q "Username:"; then
  echo "Please log in to Docker Hub:"
  docker login
else
  echo "✅ Already authenticated to Docker Hub"
fi

# Push staging image
echo "📤 Pushing staging image to Docker Hub..."
docker push "${FULL_IMAGE_NAME}"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed ${FULL_IMAGE_NAME} to Docker Hub!"
  echo ""
  echo "🖥️  To deploy STAGING on your VPS:"
  echo "  docker pull ${FULL_IMAGE_NAME}"
  echo "  docker stop ${STAGING_CONTAINER_NAME} 2>/dev/null || true"
  echo "  docker rm ${STAGING_CONTAINER_NAME} 2>/dev/null || true"
  echo "  docker run -d \\"
  echo "    --name ${STAGING_CONTAINER_NAME} \\"
  echo "    --restart ${RESTART_POLICY} \\"
  echo "    --platform linux/amd64 \\"
  echo "    -p ${STAGING_PORT}:${STAGING_PORT} \\"
  echo "    --health-cmd=\"curl -f http://localhost:${STAGING_PORT} || exit 1\" \\"
  echo "    --health-interval=${HEALTH_CHECK_INTERVAL} \\"
  echo "    --health-timeout=${HEALTH_CHECK_TIMEOUT} \\"
  echo "    --health-start-period=${HEALTH_CHECK_START_PERIOD} \\"
  echo "    --health-retries=${HEALTH_CHECK_RETRIES} \\"
  echo "    ${FULL_IMAGE_NAME}"
  echo ""
  echo "🌐 Staging will be available at: http://your-vps-ip:${STAGING_PORT}"
else
  echo "❌ Failed to push staging image to Docker Hub!"
  exit 1
fi
