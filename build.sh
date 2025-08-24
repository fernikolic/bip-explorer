#!/bin/bash
# Build script for Cloudflare Pages deployment  
set -e

echo "Setting production environment..."
export NODE_ENV=production
export REPL_ID=""

echo "Installing vite globally for PATH access..."
npm install -g vite

echo "Building with npm script (plugins disabled by env vars)..."
npm run build

echo "Moving build output to correct location..."
if [ -d "dist/public" ]; then
  echo "✓ Moving from dist/public to dist/"
  mv dist/public/* dist/
  rmdir dist/public
  echo "✓ Build output now in dist/"
  ls -la dist/
else
  echo "❌ No dist/public directory found"
  exit 1
fi


echo "✓ Build completed successfully!"