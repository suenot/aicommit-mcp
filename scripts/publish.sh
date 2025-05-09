#!/bin/bash

# Unified script to publish both regular and bundled versions of the package to npm
# Usage: 
#   ./publish.sh         - Publishes both versions
#   ./publish.sh regular - Publishes only the regular version
#   ./publish.sh bundled - Publishes only the bundled version

set -e  # Exit immediately if a command exits with a non-zero status

PACKAGE_DIR="$(dirname "$(dirname "$0")")"
cd "$PACKAGE_DIR"

# Function to increment version
increment_version() {
  local version=$1
  local level=${2:-patch} # Default to incrementing patch level
  
  IFS='.' read -ra version_parts <<< "$version"
  local major=${version_parts[0]}
  local minor=${version_parts[1]}
  local patch=${version_parts[2]}
  
  case "$level" in
    major)
      ((major++))
      minor=0
      patch=0
      ;;
    minor)
      ((minor++))
      patch=0
      ;;
    patch)
      ((patch++))
      ;;
  esac
  
  echo "$major.$minor.$patch"
}

# Function to update version in package files
update_versions() {
  local level=${1:-patch} # Default to incrementing patch level
  local current_version=$(node -e "console.log(require('./package.json').version)")
  local new_version=$(increment_version "$current_version" "$level")
  
  echo "📝 Incrementing version: $current_version → $new_version ($level)"
  
  # Update version in package.json
  sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package.json
  
  # Update version in package-bundled.json
  sed -i '' "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/" package-bundled.json
  
  echo "✅ Version updated in both package files"
  return 0
}

# Function to backup README file
backup_readme() {
  if [ -f "README.md" ]; then
    echo "📄 Backing up original README.md"
    cp README.md README.md.backup
  else
    echo "⚠️ Warning: README.md not found!"
  fi
}

# Function to restore README file
restore_readme() {
  if [ -f "README.md.backup" ]; then
    echo "🔄 Restoring original README.md"
    mv README.md.backup README.md
  fi
}

# Function to publish regular package
publish_regular() {
  echo "📦 Publishing regular package from directory: $PACKAGE_DIR"

  # Check if package.json exists
  if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the right directory?"
    return 1
  fi

  # Backup original README and use README-REGULAR for publishing
  backup_readme
  if [ -f "README-REGULAR.md" ]; then
    echo "📄 Using README-REGULAR.md for publishing regular package"
    cp README-REGULAR.md README.md
  else
    echo "⚠️ Warning: README-REGULAR.md not found. Using existing README.md"
  fi

  # Publish the package
  echo "🚀 Publishing regular package to npm..."
  npm publish --access=public
  RESULT=$?
  
  # Restore original README
  restore_readme
  
  if [ $RESULT -eq 0 ]; then
    echo "✅ Regular package published successfully!"
  else
    echo "❌ Failed to publish regular package!"
    return 1
  fi
  
  return 0
}

# Function to publish bundled package
publish_bundled() {
  echo "📦 Publishing bundled package from directory: $PACKAGE_DIR"

  # Check if package.json exists
  if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the right directory?"
    return 1
  fi

  # Check if package-bundled.json exists
  if [ ! -f "package-bundled.json" ]; then
    echo "❌ Error: package-bundled.json not found."
    return 1
  fi

  # Backup original README and use README-BUNDLED for publishing
  backup_readme
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
  restore_readme
  
  if [ $RESULT -eq 0 ]; then
    echo "✅ Bundled package published successfully!"
  else
    echo "❌ Failed to publish bundled package!"
    return 1
  fi
  
  return 0
}

# Check if user is logged in to npm
npm whoami > /dev/null 2>&1 || {
  echo "⚠️ You are not logged in to npm. Please log in first."
  echo "Run: npm login"
  exit 1
}

# Parse command line arguments
VERSION_LEVEL="patch"
PUBLISH_TYPE="all"

# Process arguments
for arg in "$@"; do
  case "$arg" in
    major|minor|patch)
      VERSION_LEVEL="$arg"
      ;;
    regular|bundled)
      PUBLISH_TYPE="$arg"
      ;;
  esac
done

# Update version number in both package files
update_versions "$VERSION_LEVEL"

# Publish packages based on publish type
case "$PUBLISH_TYPE" in
  "regular")
    publish_regular
    ;;
  "bundled")
    publish_bundled
    ;;
  *)
    # Default: publish both versions
    echo "🔄 Publishing both regular and bundled packages..."
    
    publish_regular && publish_bundled
    
    if [ $? -eq 0 ]; then
      echo "🎉 All packages published successfully!"
    else
      echo "❌ Failed to publish one or more packages!"
      exit 1
    fi
    ;;
esac

echo "✨ Done. Version bumped to $(node -e "console.log(require('./package.json').version)")"
exit 0 