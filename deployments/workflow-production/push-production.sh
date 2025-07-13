#!/bin/bash
# push-production.sh - Push production image to Docker Hub

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
ENVIRONMENT="production"
TAG="${ENVIRONMENT}"
FULL_IMAGE_NAME="${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${TAG}"

echo "🚀 === Pushing Production Image to Docker Hub ==="
echo "Target: ${FULL_IMAGE_NAME}"
echo ""

# Check if image exists locally
if ! docker image inspect "${FULL_IMAGE_NAME}" >/dev/null 2>&1; then
  echo "❌ Error: Production image ${FULL_IMAGE_NAME} not found locally!"
  echo "Run './build-production.sh' first to build the production image."
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

# Push production image
echo "📤 Pushing production image to Docker Hub..."
docker push "${FULL_IMAGE_NAME}"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed ${FULL_IMAGE_NAME} to Docker Hub!"
  echo ""
  echo "🖥️  To deploy PRODUCTION on your VPS:"
  echo "  docker pull ${FULL_IMAGE_NAME}"
  echo "  docker stop ${PRODUCTION_CONTAINER_NAME} 2>/dev/null || true"
  echo "  docker rm ${PRODUCTION_CONTAINER_NAME} 2>/dev/null || true"
  echo "  docker run -d \\"
  echo "    --name ${PRODUCTION_CONTAINER_NAME} \\"
  echo "    --restart ${RESTART_POLICY} \\"
  echo "    --platform linux/amd64 \\"
  echo "    -p ${PRODUCTION_PORT}:${PRODUCTION_PORT} \\"
  echo "    --health-cmd=\"curl -f http://localhost:${PRODUCTION_PORT} || exit 1\" \\"
  echo "    --health-interval=${HEALTH_CHECK_INTERVAL} \\"
  echo "    --health-timeout=${HEALTH_CHECK_TIMEOUT} \\"
  echo "    --health-start-period=${HEALTH_CHECK_START_PERIOD} \\"
  echo "    --health-retries=${HEALTH_CHECK_RETRIES} \\"
  echo "    ${FULL_IMAGE_NAME}"
  echo ""
  echo "🌐 Production will be available at: http://your-vps-ip:${PRODUCTION_PORT}"
else
  echo "❌ Failed to push production image to Docker Hub!"
  exit 1
fi
