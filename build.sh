#!/bin/bash
# Build script for Cloudflare Pages deployment
set -e

echo "Setting environment for production..."
export NODE_ENV=production

echo "Temporarily renaming problematic config files..."
if [ -f "vite.config.ts" ]; then
  mv vite.config.ts vite.config.ts.backup
fi
if [ -f "postcss.config.js" ]; then
  mv postcss.config.js postcss.config.js.backup
fi

echo "Building frontend with no config dependencies..."
cd client
npx vite build --outDir ../client/dist --emptyOutDir --css-target=es2022
cd ..

echo "Restoring config files..."
if [ -f "vite.config.ts.backup" ]; then
  mv vite.config.ts.backup vite.config.ts
fi
if [ -f "postcss.config.js.backup" ]; then
  mv postcss.config.js.backup postcss.config.js
fi

echo "Checking build output..."
if [ ! -d "client/dist" ]; then
  echo "Build failed - no output directory found"
  exit 1
fi

echo "Build completed successfully!"
echo "Files in client/dist:"
ls -la client/dist/