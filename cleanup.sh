#!/bin/bash

# This script cleans up the project structure by removing duplicated files

# Remove any src directory at the root level
if [ -d "./src" ]; then
  echo "Removing duplicated src directory at root level..."
  rm -rf ./src
fi

# Remove any extraneous files outside of frontend and backend directories
echo "Removing extraneous files..."
find . -maxdepth 1 -type f -not -name "README.md" -not -name "package.json" -not -name "cleanup.sh" -not -name ".gitignore" -exec rm -f {} \;

# Ensure frontend directory has all necessary files
echo "Checking frontend directory structure..."
if [ ! -d "./frontend/src" ]; then
  echo "ERROR: frontend/src directory is missing!"
  exit 1
fi

echo "Cleanup complete!"
