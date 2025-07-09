#!/bin/bash
# staging.sh - Quick access to staging workflow

echo "🚀 Sanafi Launchpad - Staging Workflow"
echo ""
echo "Available commands:"
echo "  build   - Build staging image"
echo "  push    - Push staging image to Docker Hub"
echo "  both    - Build and push staging"
echo ""

if [ "$1" = "build" ]; then
  echo "Building staging..."
  cd deployments/workflow-staging && ./build-staging.sh
elif [ "$1" = "push" ]; then
  echo "Pushing staging..."
  cd deployments/workflow-staging && ./push-staging.sh
elif [ "$1" = "both" ]; then
  echo "Building and pushing staging..."
  cd deployments/workflow-staging && ./build-staging.sh && ./push-staging.sh
else
  echo "Usage: ./staging.sh [build|push|both]"
  echo ""
  echo "Examples:"
  echo "  ./staging.sh build     # Build staging image"
  echo "  ./staging.sh push      # Push staging image"
  echo "  ./staging.sh both      # Build and push staging"
fi
