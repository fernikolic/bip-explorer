#!/bin/bash
# Build script for Cloudflare Pages deployment  
set -e

echo "Setting production environment..."
export NODE_ENV=production

echo "Installing vite globally for PATH access..."
npm install -g vite

echo "Building frontend with production config..."
npx vite build --config vite.prod.config.ts

echo "Checking build output..."
if [ -d "dist" ]; then
  echo "✓ Build output found in dist/"
  ls -la dist/
else
  echo "❌ No dist directory found"
  exit 1
fi


echo "✓ Build completed successfully!"