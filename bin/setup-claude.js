#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupClaude() {
  console.log('🔧 Setting up Claude Desktop configuration for aicommit MCP server...');
  
  // Find Claude configuration file
  const osType = os.type();
  let configPath;
  let defaultConfig = {};
  
  if (osType === 'Darwin') { // macOS
    configPath = path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'config.json');
  } else if (osType === 'Windows_NT') { // Windows
    configPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Claude', 'config.json');
  } else if (osType === 'Linux') { // Linux
    configPath = path.join(os.homedir(), '.config', 'Claude', 'config.json');
  } else {
    console.error('Unsupported operating system. Please configure Claude manually.');
    process.exit(1);
  }
  
  // Check if the config file exists and load it
  try {
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      defaultConfig = JSON.parse(configData);
      console.log('Existing Claude configuration found.');
    } else {
      console.log('No existing Claude configuration found. Creating a new one.');
      // Ensure the directory exists
      const configDir = path.dirname(configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }
    }
  } catch (error) {
    console.warn('Warning: Could not read existing Claude configuration. Starting with a fresh configuration.');
    console.error(error);
  }
  
  // Create or update MCP server configuration
  const mcpConfig = defaultConfig.mcpServers || {};
  
  // Check if the bundled version is installed
  let packageName = '@suenot/aicommit-mcp';
  try {
    execSync('npm list -g @suenot/aicommit-mcp-bundled', { stdio: 'ignore' });
    packageName = '@suenot/aicommit-mcp-bundled';
    console.log('Detected bundled version of the MCP server.');
  } catch (error) {
    // The bundled version is not installed, continue with the regular version
  }
  
  // Add the aicommit server configuration
  mcpConfig.aicommit = {
    command: 'npx',
    args: ['-y', packageName]
  };
  
  // Update the configuration
  defaultConfig.mcpServers = mcpConfig;
  
  // Save the updated configuration
  try {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log(`✅ Claude configuration updated successfully at: ${configPath}`);
    console.log('\nMCP server "aicommit" is now available in Claude Desktop.');
    console.log('Restart Claude Desktop to apply the changes.');
  } catch (error) {
    console.error('Error saving Claude configuration:', error);
    console.log('\nManual configuration instructions:');
    console.log('1. Open your Claude Desktop configuration file:');
    console.log(`   ${configPath}`);
    console.log('2. Add the following to your configuration:');
    console.log(JSON.stringify({ mcpServers: mcpConfig }, null, 2));
  }
  
  rl.close();
}

setupClaude(); 