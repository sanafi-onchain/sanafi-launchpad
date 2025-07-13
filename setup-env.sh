#!/bin/bash
# setup-env.sh - Quick setup for environment files

set -e

echo "🔧 Setting up environment files..."
echo ""

# Create staging environment
if [ ! -f ".env.staging" ]; then
  echo "📋 Creating .env.staging from template..."
  cp deployments/configuration/.env.staging.example .env.staging
  echo "✅ .env.staging created"
else
  echo "⚠️  .env.staging already exists"
fi

# Create production environment
if [ ! -f ".env.production" ]; then
  echo "📋 Creating .env.production from template..."
  cp deployments/configuration/.env.production.example .env.production
  echo "✅ .env.production created"
else
  echo "⚠️  .env.production already exists"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.staging with your staging values"
echo "2. Edit .env.production with your production values"
echo "3. Run: ./staging.sh build (to test staging)"
echo ""
echo "🔒 Note: Environment files are automatically ignored by git"
