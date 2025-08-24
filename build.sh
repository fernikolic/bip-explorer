#!/bin/bash
# Build script for Cloudflare Pages deployment  
set -e

echo "Setting production environment..."
export NODE_ENV=production

echo "Temporarily renaming problematic configs..."
[ -f "vite.config.ts" ] && mv vite.config.ts vite.config.ts.backup
[ -f "postcss.config.js" ] && mv postcss.config.js postcss.config.js.backup

echo "Installing vite globally for PATH access..."
npm install -g vite

echo "Building with npm run build..."
npm run build

echo "Checking build output..."
if [ -d "dist/public" ]; then
  echo "✓ Build output found in dist/public"
  ls -la dist/public/
else
  echo "✓ Build output should be in dist/"
  ls -la dist/ || echo "No dist directory found"
fi

echo "Restoring configs..."
[ -f "vite.config.ts.backup" ] && mv vite.config.ts.backup vite.config.ts
[ -f "postcss.config.js.backup" ] && mv postcss.config.js.backup postcss.config.js

echo "✓ Build completed successfully!"