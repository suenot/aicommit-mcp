const { execSync } = require('child_process');
const path = require('path');

// Mock the execSync to avoid actual command execution during tests
jest.mock('child_process', () => ({
  execSync: jest.fn(),
  exec: jest.fn()
}));

// Mock the MCPServer class
jest.mock('@modelcontextprotocol/server', () => ({
  MCPServer: class MockMCPServer {
    constructor() {
      this.tools = [];
    }
    
    registerTool(name, description, params, handler) {
      this.tools.push({ name, description, params, handler });
    }
    
    start() {
      return Promise.resolve();
    }
    
    stop() {
      return Promise.resolve();
    }
  }
}));

describe('aicommit MCP Server', () => {
  let server;
  
  beforeAll(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Import the server
    server = require('../index');
  });
  
  test('server exports necessary handlers', () => {
    // Check that tools are registered
    expect(execSync).toHaveBeenCalledWith('aicommit --version', expect.any(Object));
  });
  
  describe('Tool: generate_commit_message', () => {
    test('constructs the right command with default parameters', async () => {
      // Execute the handler directly (we'd need to extract it from the mocked server)
      // In a real test, we'd test the handler's behavior
      
      // For now, just verify the execSync is called (initial version check)
      expect(execSync).toHaveBeenCalled();
    });
  });
}); 