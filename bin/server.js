#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Path to the main script
const scriptPath = path.join(__dirname, '..', 'index.js');

// Check if aicommit is installed
try {
  const aicommitVersion = execSync('aicommit --version', { stdio: 'pipe' }).toString().trim();
  console.log(`Found aicommit version: ${aicommitVersion}`);
} catch (error) {
  console.warn('Warning: aicommit CLI is not installed. Some features may not work correctly.');
  console.warn('To install aicommit, run: npm install -g aicommit or cargo install aicommit');
}

// Start the server
require(scriptPath); 