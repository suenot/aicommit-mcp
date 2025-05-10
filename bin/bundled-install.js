#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function installBundled() {
  console.log('🚀 Installing aicommit-mcp with bundled aicommit...');
  
  let installMethod = 'npm';
  
  try {
    // Check if npm or cargo is available
    const hasNpm = checkCommandExists('npm --version');
    const hasCargo = checkCommandExists('cargo --version');
    
    if (hasNpm && hasCargo) {
      const answer = await askQuestion('Which installation method do you prefer? [npm/cargo]: ');
      installMethod = answer.toLowerCase().startsWith('c') ? 'cargo' : 'npm';
    } else if (hasCargo) {
      installMethod = 'cargo';
    } else if (!hasNpm) {
      console.error('❌ Neither npm nor cargo is available. Please install one of them first.');
      process.exit(1);
    }
    
    // Install aicommit
    console.log(`📦 Installing aicommit using ${installMethod}...`);
    if (installMethod === 'npm') {
      console.log('Installing aicommit via npm...');
      try {
        execSync('npm install -g @suenot/aicommit', { stdio: 'inherit' });
        return true;
      } catch (error) {
        console.error('❌ Installation failed:', error.message);
        process.exit(1);
      }
    } else {
      execSync('cargo install aicommit', { stdio: 'inherit' });
    }
    
    // Configure aicommit
    console.log('🔧 Setting up aicommit provider...');
    try {
      execSync('aicommit --add-provider', { stdio: 'inherit' });
    } catch (error) {
      console.warn('⚠️ Warning: Could not set up aicommit provider automatically.');
      console.warn('Please run `aicommit --add-provider` manually after installation.');
    }
    
    console.log('✅ Installation complete!');
    console.log('\n🔍 To use aicommit-mcp with Claude:');
    console.log('1. Add this to your Claude configuration:');
    console.log(`
{
  "mcpServers": {
    "aicommit": {
      "command": "npx",
      "args": ["-y", "@suenot/aicommit-mcp-bundled"]
    }
  }
}
    `);
    
  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

function checkCommandExists(command) {
  try {
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

installBundled(); 