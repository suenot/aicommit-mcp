# aicommit-mcp

MCP (Model Context Protocol) server for aicommit - AI-powered git commit message generation.

## Overview

This MCP server allows AI assistants (like Claude) to generate git commit messages for your code changes. It acts as a bridge between LLMs and the [aicommit](https://github.com/suenot/aicommit) tool, enabling AI-powered version control workflows.

## Package Location

📦 [NPM Package: @suenot/aicommit-mcp](https://www.npmjs.com/package/@suenot/aicommit-mcp)

## Features

- ✅ Generate commit messages using AI based on your repository changes
- ✅ Execute aicommit operations with all available options
- ✅ Check git status to understand your repository state
- ✅ View configured LLM providers for aicommit
- ✅ Support for automatic staging, pushing, and pulling

## Installation

### Prerequisites

- Node.js 14 or higher
- aicommit CLI (installed separately)

### Option 1: Install aicommit-mcp (requires aicommit to be installed separately)

```bash
# Install aicommit first
npm install -g @suenot/aicommit
# or
cargo install aicommit

# Install the MCP server
npm install -g @suenot/aicommit-mcp
```

### Option 2: Install as a dependency in your project

```bash
npm install @suenot/aicommit-mcp
```

### Option 3: Use Docker

```bash
# Pull the Docker image
docker pull suenot/aicommit-mcp

# Run the container (mapping your current directory to the container workspace)
docker run -p 8888:8888 -v $(pwd):/workspace --name aicommit-mcp suenot/aicommit-mcp
```

#### Building your own Docker image

If you want to build the Docker image yourself:

```bash
git clone https://github.com/suenot/aicommit-mcp.git
cd aicommit-mcp
docker build -t aicommit-mcp -f Dockerfile .
docker run -p 8888:8888 -v $(pwd):/workspace --name aicommit-mcp aicommit-mcp
```

## Usage

### Starting the server

```bash
# Start using the globally installed package
mcp-server-aicommit

# Or using npx
npx @suenot/aicommit-mcp

# Or using Docker
docker run -p 8888:8888 -v $(pwd):/workspace suenot/aicommit-mcp
```

## Smithery Deployment

This MCP server can be deployed to Smithery and listed in the Smithery marketplace. The server's architecture supports proper tool listing in the web interface without requiring authentication.

### How Tool Listing Works in Smithery

In order for Smithery to display your tools on the web interface, tools must be accessible without requiring authentication or configuration. The aicommit-mcp server implements "lazy loading" of dependencies:

- Tools are registered with the server during initialization
- The existence of the aicommit tool is only checked when a tool is actually called, not during initialization
- This approach ensures that Smithery can list the tools without requiring any configuration

### Deploying to Smithery

1. Fork the repository or create your own with the required files
2. Ensure your `smithery.yaml` is properly configured:

```yaml
startCommand:
  type: stdio
  configSchema:
    type: object
    properties:
      maxTokens:
        type: number
        title: Maximum Tokens
        description: Maximum number of tokens in the generated commit message
        default: 50
      staged_only:
        type: boolean
        title: Staged Only
        description: Whether to only consider staged changes
        default: true
      verbose:
        type: boolean
        title: Verbose Output
        description: Show detailed information about the execution
        default: false
    additionalProperties: false
  commandFunction: |
    function getCommand(config) {
      return {
        command: "node",
        args: ["index.js"],
        env: {
          MAX_TOKENS: config.maxTokens?.toString() || "50",
          STAGED_ONLY: config.staged_only?.toString() || "true",
          VERBOSE: config.verbose?.toString() || "false"
        }
      };
    }

build:
  dockerfile: "Dockerfile"
  dockerBuildPath: "."
```

3. Connect your repository to Smithery
4. Deploy your server

### Using Smithery CLI

```bash
# Install via Smithery CLI
npx -y @smithery/cli@latest install @suenot/aicommit-mcp --client claude --config '{}'

# For specific clients
npx -y @smithery/cli@latest install @suenot/aicommit-mcp --client cursor --config '{}'
npx -y @smithery/cli@latest install @suenot/aicommit-mcp --client windsurf --config '{}'
```

## AI Assistant Integration

### Claude Desktop

To use this MCP server with Claude, add it to your Claude configuration:

```json
{
  "mcpServers": {
    "aicommit": {
      "command": "npx",
      "args": ["-y", "@suenot/aicommit-mcp"]
    }
  }
}
```

#### With Docker

```json
{
  "mcpServers": {
    "aicommit": {
      "command": "docker",
      "args": ["run", "--rm", "-v", "${workspaceFolder}:/workspace", "suenot/aicommit-mcp"]
    }
  }
}
```

### Cursor

Add the following to your Cursor configuration:

```json
{
  "mcpServers": {
    "aicommit": {
      "command": "npx",
      "args": ["-y", "@suenot/aicommit-mcp"]
    }
  }
}
```

#### With Docker

```json
{
  "mcpServers": {
    "aicommit": {
      "command": "docker",
      "args": ["run", "--rm", "-v", "${workspaceFolder}:/workspace", "suenot/aicommit-mcp"]
    }
  }
}
```

### Windsurf

Add the following to your Windsurf configuration:

```json
{
  "mcpServers": {
    "aicommit": {
      "command": "npx",
      "args": ["-y", "@suenot/aicommit-mcp"]
    }
  }
}
```

#### With Docker

```json
{
  "mcpServers": {
    "aicommit": {
      "command": "docker",
      "args": ["run", "--rm", "-v", "${workspaceFolder}:/workspace", "suenot/aicommit-mcp"]
    }
  }
}
```

### Cline

Add the following to your Cline configuration:

```json
{
  "mcpServers": {
    "aicommit": {
      "command": "npx",
      "args": ["-y", "@suenot/aicommit-mcp"]
    }
  }
}
```

#### With Docker

```json
{
  "mcpServers": {
    "aicommit": {
      "command": "docker",
      "args": ["run", "--rm", "-v", "${workspaceFolder}:/workspace", "suenot/aicommit-mcp"]
    }
  }
}
```

### Smithery

Install via Smithery CLI:

```bash
npx -y @smithery/cli@latest install @suenot/aicommit-mcp --client claude --config '{}'
```

You can also install for different clients by changing the `--client` parameter:

```bash
# For Cursor
npx -y @smithery/cli@latest install @suenot/aicommit-mcp --client cursor --config '{}'

# For Windsurf
npx -y @smithery/cli@latest install @suenot/aicommit-mcp --client windsurf --config '{}'
```

## Functionality

This MCP server exposes the following tools:

### 1. generate_commit_message

Generates a commit message for the current git changes (without actually creating a commit).

**Parameters:**
- `staged_only` (boolean): Whether to only consider staged changes (default: true)
- `verbose` (boolean): Show detailed information about the execution (default: false)
- `max_tokens` (integer): Maximum number of tokens in the generated commit message (default: 50)

**Example usage:**
```javascript
const result = await tools.generate_commit_message({ staged_only: false, max_tokens: 100 });
console.log(result.commit_message);
```

### 2. execute_aicommit

Executes aicommit to generate a commit message and create the commit in one step.

**Parameters:**
- `add` (boolean): Stage all changes before committing (default: false)
- `push` (boolean): Push changes after committing (default: false)
- `pull` (boolean): Pull changes before committing (default: false)
- `verbose` (boolean): Show detailed information (default: false)
- `max_tokens` (integer): Maximum number of tokens for the generated commit message (default: 50)

**Example usage:**
```javascript
const result = await tools.execute_aicommit({ 
  add: true,
  push: true
});
console.log(result.commit_message);
```

### 3. get_git_status

Get the current git status of the repository.

**Parameters:**
- `verbose` (boolean): Whether to show detailed status information (default: false)

**Example usage:**
```javascript
const result = await tools.get_git_status({ verbose: true });
console.log(result.status);
```

### 4. list_aicommit_providers

List configured LLM providers for aicommit.

**Example usage:**
```javascript
const result = await tools.list_aicommit_providers();
console.log(result.providers);
```

## License

MIT

## Related

- [aicommit](https://github.com/suenot/aicommit) - The CLI tool this MCP server uses
- [Model Context Protocol](https://modelcontextprotocol.io/) - Learn more about MCP
- [Bundled Version (@suenot/aicommit-mcp-bundled)](./README-BUNDLED.md) - Version that includes automatic aicommit installation 