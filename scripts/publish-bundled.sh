#!/bin/bash

# Script to publish the bundled version of the package to npm

set -e  # Exit immediately if a command exits with a non-zero status

PACKAGE_DIR="$(dirname "$(dirname "$0")")"
cd "$PACKAGE_DIR"

echo "📦 Publishing bundled package from directory: $PACKAGE_DIR"

# Check if package.json exists
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Are you in the right directory?"
  exit 1
fi

# Check if package-bundled.json exists
if [ ! -f "package-bundled.json" ]; then
  echo "❌ Error: package-bundled.json not found."
  exit 1
fi

# Check if user is logged in to npm
npm whoami > /dev/null 2>&1 || {
  echo "⚠️ You are not logged in to npm. Please log in first."
  echo "Run: npm login"
  exit 1
}

# Backup original README
if [ -f "README.md" ]; then
  echo "📄 Backing up original README.md"
  cp README.md README.md.backup
else
  echo "⚠️ Warning: README.md not found!"
fi

# Use README-BUNDLED for publishing
if [ -f "README-BUNDLED.md" ]; then
  echo "📄 Using README-BUNDLED.md for publishing bundled package"
  cp README-BUNDLED.md README.md
else
  echo "⚠️ Warning: README-BUNDLED.md not found. Using existing README.md"
fi

# Backup original package.json
echo "📄 Backing up original package.json"
mv package.json package.json.backup

# Copy bundled package config
echo "📄 Using bundled package configuration"
cp package-bundled.json package.json

# Publish the package
echo "🚀 Publishing bundled package to npm..."
npm publish --access=public
RESULT=$?

# Restore original package.json
echo "🔄 Restoring original package.json"
mv package.json.backup package.json

# Restore original README
if [ -f "README.md.backup" ]; then
  echo "🔄 Restoring original README.md"
  mv README.md.backup README.md
fi

if [ $RESULT -eq 0 ]; then
  echo "✅ Bundled package published successfully!" 
else
  echo "❌ Failed to publish bundled package!"
  exit 1
fi 