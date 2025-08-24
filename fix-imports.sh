#!/bin/bash

# Fix @ alias imports in client/src directory
echo "Fixing @ alias imports..."

# Go to client/src directory
cd client/src

# Find all TypeScript/JavaScript files and replace @ aliases
find . -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | while read file; do
  echo "Processing $file..."
  
  # Calculate relative path to src from current file location
  depth=$(echo "$file" | tr -cd '/' | wc -c)
  if [ $depth -eq 1 ]; then
    # File is in pages/ or components/ - one level deep
    prefix="../"
  elif [ $depth -eq 2 ]; then
    # File is in components/ui/ - two levels deep  
    prefix="../../"
  else
    # File is in src/ root
    prefix="./"
  fi
  
  # Replace @ aliases with relative paths
  sed -i.bak "s|@/|${prefix}|g" "$file"
  
  # Remove backup file
  rm "${file}.bak" 2>/dev/null || true
done

echo "Fixed all @ alias imports!"