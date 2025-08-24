#!/bin/bash
# Build script for Cloudflare Pages deployment  
set -e

echo "Setting production environment..."
export NODE_ENV=production
export REPL_ID=""

echo "Installing vite globally for PATH access..."
npm install -g vite

echo "Temporarily hiding problematic config..."
[ -f "vite.config.ts" ] && mv vite.config.ts vite.config.ts.backup

echo "Building with minimal production config..."
cd client && npx vite build --config ../vite.production.config.js
cd ..

echo "Restoring config file..."
[ -f "vite.config.ts.backup" ] && mv vite.config.ts.backup vite.config.ts

echo "Checking build output..."
if [ -d "dist" ]; then
  echo "✓ Build output found in dist/"
  ls -la dist/
else
  echo "❌ No dist directory found"
  exit 1
fi

echo "✓ Build completed successfully!"