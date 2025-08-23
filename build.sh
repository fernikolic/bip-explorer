#!/bin/bash
# Build script for Cloudflare Pages deployment
set -e

echo "Building frontend with Vite..."
npx vite build

echo "Building backend with esbuild..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build completed successfully!"