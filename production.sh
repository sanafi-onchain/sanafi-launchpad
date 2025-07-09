#!/bin/bash
# production.sh - Quick access to production workflow

echo "🏭 Sanafi Launchpad - Production Workflow"
echo ""
echo "Available commands:"
echo "  build   - Build production image"
echo "  push    - Push production image to Docker Hub"
echo "  both    - Build and push production"
echo ""

if [ "$1" = "build" ]; then
  echo "Building production..."
  cd deployments/workflow-production && ./build-production.sh
elif [ "$1" = "push" ]; then
  echo "Pushing production..."
  cd deployments/workflow-production && ./push-production.sh
elif [ "$1" = "both" ]; then
  echo "Building and pushing production..."
  cd deployments/workflow-production && ./build-production.sh && ./push-production.sh
else
  echo "Usage: ./production.sh [build|push|both]"
  echo ""
  echo "Examples:"
  echo "  ./production.sh build     # Build production image"
  echo "  ./production.sh push      # Push production image"
  echo "  ./production.sh both      # Build and push production"
fi
