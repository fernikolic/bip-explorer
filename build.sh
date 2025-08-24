#!/bin/bash
# Build script for Cloudflare Pages deployment
set -e

echo "Running Node.js build script..."
node deploy-build.js

echo "Verifying build output..."
if [ ! -d "client/dist" ]; then
  echo "Build failed - no client/dist directory"
  exit 1
fi

echo "Build successful! Contents:"
ls -la client/dist/