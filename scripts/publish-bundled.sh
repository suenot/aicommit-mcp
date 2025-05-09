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

# Backup original package.json
echo "📄 Backing up original package.json"
mv package.json package.json.backup

# Copy bundled package config
echo "📄 Using bundled package configuration"
cp package-bundled.json package.json

# Publish the package
echo "🚀 Publishing bundled package to npm..."
npm publish --access=public

# Restore original package.json
echo "🔄 Restoring original package.json"
mv package.json.backup package.json

echo "✅ Bundled package published successfully!" 