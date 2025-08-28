#!/bin/bash
# Build script for Cloudflare Pages deployment  
set -e

echo "Setting production environment..."
export NODE_ENV=production
export REPL_ID=""

echo "Using local vite installation..."

echo "Temporarily hiding problematic config..."
[ -f "vite.config.ts" ] && mv vite.config.ts vite.config.ts.backup

echo "Building with minimal production config..."
npx vite build --config vite.production.config.js

echo "Restoring config file..."
[ -f "vite.config.ts.backup" ] && mv vite.config.ts.backup vite.config.ts

echo "Copying security files..."
cp _headers dist/_headers 2>/dev/null || true
cp _redirects dist/_redirects 2>/dev/null || true

echo "Checking build output..."
if [ -d "dist" ]; then
  echo "✓ Build output found in dist/"
  ls -la dist/
else
  echo "❌ No dist directory found"
  exit 1
fi

echo "✓ Build completed successfully!"