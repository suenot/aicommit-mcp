#!/usr/bin/env node

/**
 * This is an example of how to use the aicommit MCP server from a client.
 * 
 * To run this example:
 * 1. Start the aicommit MCP server in another terminal: `npx @suenot/aicommit-mcp`
 * 2. Run this file: `node client-example.js`
 */

const { MCPClient } = require('@modelcontextprotocol/client');
const path = require('path');

async function main() {
  console.log('Connecting to aicommit MCP server...');
  
  // Create a client that connects to the server (assuming it's running on the default port)
  const client = new MCPClient({
    transport: 'stdio', // or 'http'
    serverCommand: 'npx',
    serverArgs: ['-y', '@suenot/aicommit-mcp']
  });
  
  try {
    // Connect to the server
    await client.connect();
    console.log('Connected to server!');
    
    // Get the tools available from the server
    const tools = client.tools;
    
    // 1. Check git status
    console.log('\n📋 Checking git status...');
    const statusResult = await tools.get_git_status({ verbose: true });
    console.log(statusResult.status);
    
    // 2. Generate a commit message
    console.log('\n🤖 Generating commit message...');
    const messageResult = await tools.generate_commit_message({ 
      staged_only: false,
      max_tokens: 100
    });
    
    if (messageResult.error) {
      console.error('Error generating commit message:', messageResult.error);
      return;
    }
    
    const commitMessage = messageResult.commit_message;
    console.log(`Generated commit message: "${commitMessage}"`);
    
    if (messageResult.tokens) {
      console.log(`Tokens: ${messageResult.tokens.input}↑ ${messageResult.tokens.output}↓`);
    }
    
    if (messageResult.cost) {
      console.log(`API Cost: $${messageResult.cost}`);
    }
    
    // 3. Ask user if they want to commit with this message
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('\n✅ Do you want to commit with this message? (y/n) ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('\n📝 Committing changes...');
        
        // Execute aicommit to actually create the commit
        const commitResult = await tools.execute_aicommit({
          add: true
        });
        
        if (commitResult.success) {
          console.log('Commit successful!');
          if (commitResult.commit_message) {
            console.log(`Final commit message: "${commitResult.commit_message}"`);
          }
        } else {
          console.error('Commit failed:', commitResult.error);
        }
      } else {
        console.log('Commit cancelled.');
      }
      
      rl.close();
      await client.disconnect();
      console.log('Disconnected from server.');
    });
    
  } catch (error) {
    console.error('Error:', error);
    await client.disconnect();
  }
}

main(); 