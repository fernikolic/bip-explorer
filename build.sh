#!/bin/bash
# Build script for Cloudflare Pages deployment
set -e

echo "Setting environment for production..."
export NODE_ENV=production

echo "Building frontend with production config..."
npx vite build --config vite.production.config.ts

echo "Checking build output..."
if [ ! -d "client/dist" ]; then
  echo "Build failed - no output directory found"
  exit 1
fi

echo "Build completed successfully!"
echo "Files in client/dist:"
ls -la client/dist/