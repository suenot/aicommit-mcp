#!/usr/bin/env node
const { MCPServer } = require('@modelcontextprotocol/server');
const { execSync, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');

const execAsync = util.promisify(exec);

// Create a new MCP server instance
const server = new MCPServer({
  name: 'aicommit',
  description: 'AI-powered git commit message generator',
  version: '0.1.0',
});

// Define tool specifications
const tools = [
  {
    name: 'generate_commit_message',
    description: 'Generate a commit message for the current git changes',
    parameters: {
      type: 'object',
      properties: {
        staged_only: {
          type: 'boolean',
          description: 'Whether to only consider staged changes (true) or all changes (false)',
          default: true
        },
        verbose: {
          type: 'boolean',
          description: 'Show detailed information about the execution',
          default: false
        },
        max_tokens: {
          type: 'integer',
          description: 'Maximum number of tokens in the generated commit message',
          default: 50
        }
      },
      required: []
    },
    handler: async (params) => {
      const { staged_only = true, verbose = false, max_tokens = 50 } = params;
      
      try {
        // Check if aicommit is installed
        try {
          execSync('aicommit --version', { stdio: 'pipe' });
        } catch (error) {
          return {
            error: 'aicommit CLI is not installed. Please run "npm install -g aicommit" or "cargo install aicommit" to install it.'
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
            error: stderr
          };
        }
        
        // Extract the commit message from the output
        const messageMatch = stdout.match(/Generated commit message: (.+)/);
        const tokenMatch = stdout.match(/Tokens: (\d+)↑ (\d+)↓/);
        const costMatch = stdout.match(/API Cost: \$([0-9.]+)/);
        
        const result = {
          commit_message: messageMatch ? messageMatch[1] : 'No commit message generated',
        };
        
        if (tokenMatch) {
          result.tokens = {
            input: parseInt(tokenMatch[1], 10),
            output: parseInt(tokenMatch[2], 10)
          };
        }
        
        if (costMatch) {
          result.cost = parseFloat(costMatch[1]);
        }
        
        return result;
      } catch (error) {
        console.error('Error executing aicommit:', error);
        return {
          error: error.message || 'Unknown error'
        };
      }
    }
  },
  {
    name: 'execute_aicommit',
    description: 'Generate AI commit message and create the commit in one step',
    parameters: {
      type: 'object',
      properties: {
        add: {
          type: 'boolean',
          description: 'Whether to stage all changes before committing',
          default: false
        },
        push: {
          type: 'boolean',
          description: 'Whether to push after committing',
          default: false
        },
        pull: {
          type: 'boolean',
          description: 'Whether to pull before committing',
          default: false
        },
        verbose: {
          type: 'boolean',
          description: 'Show detailed information',
          default: false
        },
        max_tokens: {
          type: 'integer',
          description: 'Maximum number of tokens for the generated commit message',
          default: 50
        }
      },
      required: []
    },
    handler: async (params) => {
      const { add = false, push = false, pull = false, verbose = false, max_tokens = 50 } = params;
      
      try {
        // Check if aicommit is installed
        try {
          execSync('aicommit --version', { stdio: 'pipe' });
        } catch (error) {
          return {
            error: 'aicommit CLI is not installed. Please run "npm install -g aicommit" or "cargo install aicommit" to install it.'
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
        
        // Extract useful information from the output
        const messageMatch = stdout.match(/Generated commit message: (.+)/);
        const tokenMatch = stdout.match(/Tokens: (\d+)↑ (\d+)↓/);
        const costMatch = stdout.match(/API Cost: \$([0-9.]+)/);
        
        const result = {
          success: true,
          output: stdout
        };
        
        if (messageMatch) {
          result.commit_message = messageMatch[1];
        }
        
        if (tokenMatch) {
          result.tokens = {
            input: parseInt(tokenMatch[1], 10),
            output: parseInt(tokenMatch[2], 10)
          };
        }
        
        if (costMatch) {
          result.cost = parseFloat(costMatch[1]);
        }
        
        if (stderr && stderr.trim()) {
          result.warning = stderr;
        }
        
        return result;
      } catch (error) {
        console.error('Error executing aicommit:', error);
        return {
          success: false,
          error: error.message || 'Unknown error',
          output: error.stdout || ''
        };
      }
    }
  },
  {
    name: 'get_git_status',
    description: 'Get the current git status of the repository',
    parameters: {
      type: 'object',
      properties: {
        verbose: {
          type: 'boolean',
          description: 'Whether to show detailed status information',
          default: false
        }
      },
      required: []
    },
    handler: async (params) => {
      const { verbose = false } = params;
      
      try {
        const command = verbose ? 'git status' : 'git status --short';
        const { stdout, stderr } = await execAsync(command);
        
        if (stderr) {
          console.error('Git status error:', stderr);
          return {
            error: stderr
          };
        }
        
        return {
          status: stdout.trim()
        };
      } catch (error) {
        console.error('Error getting git status:', error);
        return {
          error: error.message || 'Unknown error'
        };
      }
    }
  },
  {
    name: 'list_aicommit_providers',
    description: 'List configured LLM providers for aicommit',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    },
    handler: async () => {
      try {
        const { stdout, stderr } = await execAsync('aicommit --list');
        
        if (stderr) {
          console.error('aicommit list error:', stderr);
          return {
            error: stderr
          };
        }
        
        return {
          providers: stdout.trim()
        };
      } catch (error) {
        console.error('Error listing aicommit providers:', error);
        return {
          error: error.message || 'Unknown error'
        };
      }
    }
  }
];

// Register tools with the server
tools.forEach(tool => {
  server.registerTool(tool.name, tool.description, tool.parameters, tool.handler);
});

// Start the server
server.start().catch(err => {
  console.error('Failed to start MCP server:', err);
  process.exit(1);
});

// Handle termination signals
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`\nReceived ${signal}, shutting down...`);
    server.stop().then(() => {
      process.exit(0);
    });
  });
}); 