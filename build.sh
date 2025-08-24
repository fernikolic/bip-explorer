#!/bin/bash
# Build script for Cloudflare Pages deployment
set -e

echo "Setting environment for production..."
export NODE_ENV=production

echo "Building frontend with Vite..."
npx vite build

echo "Moving build output to expected location..."
# Vite outputs to dist/public, but Cloudflare Pages expects client/dist
mkdir -p client/dist
if [ -d "dist/public" ]; then
  cp -r dist/public/* client/dist/
  echo "Moved files from dist/public to client/dist"
fi

echo "Building backend with esbuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"