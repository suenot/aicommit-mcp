#!/usr/bin/env node
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { execSync, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { z } = require('zod');

const execAsync = util.promisify(exec);

// Read environment variables for Smithery compatibility
const envMaxTokens = process.env.MAX_TOKENS ? parseInt(process.env.MAX_TOKENS, 10) : 50;
const envStagedOnly = process.env.STAGED_ONLY === 'false' ? false : true;
const envVerbose = process.env.VERBOSE === 'true' ? true : false;
const envAutoInstall = process.env.AUTO_INSTALL === 'true' ? true : false;

/**
 * IMPORTANT NOTE FOR SMITHERY DEPLOYMENT:
 * 
 * This implementation uses a "lazy loading" approach to check for aicommit installation.
 * We DO NOT check for aicommit during server initialization, only when tools are actually called.
 * 
 * This design choice enables:
 * 1. Proper tool listing in Smithery without requiring authentication/configuration
 * 2. The ability to display tools on the Smithery web interface
 * 3. Better user experience by only requiring tools when they are used
 * 
 * For more details, see: https://smithery.ai/docs/config
 */

// Check if aicommit is installed and try to install it if configured
async function checkAndInstallAicommit() {
  try {
    execSync('aicommit --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    if (envAutoInstall) {
      console.log('aicommit not found. Attempting to install automatically...');
      try {
        execSync('npm install -g @suenot/aicommit', { stdio: 'inherit' });
        return true;
      } catch (installError) {
        console.error('Failed to install @suenot/aicommit:', installError.message);
        return false;
      }
    }
    return false;
  }
}

// Create a new MCP server instance
const server = new McpServer({
  name: 'aicommit',
  version: '0.1.0',
  capabilities: {
    tools: {}
  }
});

// Register tools with the server
server.tool(
  'generate_commit_message',
  {
    staged_only: z.boolean().optional().default(envStagedOnly),
    verbose: z.boolean().optional().default(envVerbose),
    max_tokens: z.number().optional().default(envMaxTokens)
  },
  async ({ staged_only = envStagedOnly, verbose = envVerbose, max_tokens = envMaxTokens }) => {
    try {
      // Lazy-loading: Check if aicommit is installed only when tool is called, not during initialization
      const aicommitInstalled = await checkAndInstallAicommit();
      if (!aicommitInstalled) {
        return {
          content: [{
            type: 'text',
            text: 'aicommit CLI is not installed. Please run "npm install -g @suenot/aicommit" or "cargo install aicommit" to install it.'
          }],
          isError: true
        };
      }
      
      // Construct the command
      let command = 'aicommit --dry-run';
      
      if (!staged_only) {
        command += ' --add';
      }
      
      if (verbose) {
        command += ' --verbose';
      }
      
      if (max_tokens) {
        command += ` --max-tokens ${max_tokens}`;
      }
      
      // Execute the command
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr) {
        console.error('aicommit error:', stderr);
        return {
          content: [{
            type: 'text',
            text: stderr
          }],
          isError: true
        };
      }
      
      // Extract the commit message from the output
      const messageMatch = stdout.match(/Generated commit message: (.+)/);
      const tokenMatch = stdout.match(/Tokens: (\d+)↑ (\d+)↓/);
      const costMatch = stdout.match(/API Cost: \$([0-9.]+)/);
      
      let resultText = messageMatch ? messageMatch[1] : 'No commit message generated';
      
      if (tokenMatch) {
        resultText += `\n\nTokens: ${tokenMatch[1]}↑ ${tokenMatch[2]}↓`;
      }
      
      if (costMatch) {
        resultText += `\nAPI Cost: $${costMatch[1]}`;
      }
      
      return {
        content: [{
          type: 'text',
          text: resultText
        }]
      };
    } catch (error) {
      console.error('Error executing aicommit:', error);
      return {
        content: [{
          type: 'text',
          text: error.message || 'Unknown error'
        }],
        isError: true
      };
    }
  }
);

server.tool(
  'execute_aicommit',
  {
    add: z.boolean().optional().default(false),
    push: z.boolean().optional().default(false),
    pull: z.boolean().optional().default(false),
    verbose: z.boolean().optional().default(envVerbose),
    max_tokens: z.number().optional().default(envMaxTokens)
  },
  async ({ add = false, push = false, pull = false, verbose = envVerbose, max_tokens = envMaxTokens }) => {
    try {
      // Lazy-loading: Check if aicommit is installed only when tool is called, not during initialization
      const aicommitInstalled = await checkAndInstallAicommit();
      if (!aicommitInstalled) {
        return {
          content: [{
            type: 'text',
            text: 'aicommit CLI is not installed. Please run "npm install -g @suenot/aicommit" or "cargo install aicommit" to install it.'
          }],
          isError: true
        };
      }
      
      // Construct the command
      let command = 'aicommit';
      
      if (add) {
        command += ' --add';
      }
      
      if (push) {
        command += ' --push';
      }
      
      if (pull) {
        command += ' --pull';
      }
      
      if (verbose) {
        command += ' --verbose';
      }
      
      if (max_tokens) {
        command += ` --max-tokens ${max_tokens}`;
      }
      
      // Execute the command
      const { stdout, stderr } = await execAsync(command);
      
      // Format the output
      let resultText = stdout;
      if (stderr && stderr.trim()) {
        resultText += `\n\nWarnings:\n${stderr}`;
      }
      
      return {
        content: [{
          type: 'text',
          text: resultText
        }]
      };
    } catch (error) {
      console.error('Error executing aicommit:', error);
      return {
        content: [{
          type: 'text',
          text: error.message || 'Unknown error'
        }],
        isError: true
      };
    }
  }
);

server.tool(
  'get_git_status',
  {
    verbose: z.boolean().optional().default(false)
  },
  async ({ verbose = false }) => {
    try {
      const command = verbose ? 'git status' : 'git status --short';
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr) {
        console.error('Git status error:', stderr);
        return {
          content: [{
            type: 'text',
            text: stderr
          }],
          isError: true
        };
      }
      
      return {
        content: [{
          type: 'text',
          text: stdout.trim()
        }]
      };
    } catch (error) {
      console.error('Error getting git status:', error);
      return {
        content: [{
          type: 'text',
          text: error.message || 'Unknown error'
        }],
        isError: true
      };
    }
  }
);

server.tool(
  'list_aicommit_providers',
  {},
  async () => {
    try {
      const { stdout, stderr } = await execAsync('aicommit --list');
      
      if (stderr) {
        console.error('aicommit list error:', stderr);
        return {
          content: [{
            type: 'text',
            text: stderr
          }],
          isError: true
        };
      }
      
      return {
        content: [{
          type: 'text',
          text: stdout.trim()
        }]
      };
    } catch (error) {
      console.error('Error listing aicommit providers:', error);
      return {
        content: [{
          type: 'text',
          text: error.message || 'Unknown error'
        }],
        isError: true
      };
    }
  }
);

// Start the server with stdio transport
const transport = new StdioServerTransport();
server.connect(transport).catch(err => {
  console.error('Failed to start MCP server:', err);
  process.exit(1);
});

// Handle termination signals
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`\nReceived ${signal}, shutting down...`);
    server.close().then(() => {
      process.exit(0);
    });
  });
}); 