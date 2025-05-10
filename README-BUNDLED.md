# aicommit-mcp-bundled

MCP (Model Context Protocol) server for aicommit - AI-powered git commit message generation, bundled with aicommit.

## Overview

This MCP server allows AI assistants (like Claude) to generate git commit messages for your code changes. It acts as a bridge between LLMs and the [aicommit](https://github.com/suenot/aicommit) tool, enabling AI-powered version control workflows.

**This is the bundled version that automatically installs aicommit for you.**

## Package Location

📦 [NPM Package: @suenot/aicommit-mcp-bundled](https://www.npmjs.com/package/@suenot/aicommit-mcp-bundled)

## Features

- ✅ Generate commit messages using AI based on your repository changes
- ✅ Execute aicommit operations with all available options
- ✅ Check git status to understand your repository state
- ✅ View configured LLM providers for aicommit
- ✅ Support for automatic staging, pushing, and pulling
- ✅ **Automatic installation** of aicommit during setup

## Installation

### Prerequisites

- Node.js 14 or higher
- npm or cargo (for aicommit installation)

### Installation

```bash
# Install the bundled MCP server
npm install -g @suenot/aicommit-mcp-bundled

# During installation, you'll be prompted to choose between npm or cargo for aicommit installation
```

The installation process will:
1. Install aicommit using npm or cargo (your choice)
2. Guide you through setting up an LLM provider for aicommit
3. Configure everything needed to use the MCP server

### Using Docker

```bash
# Pull the Docker image
docker pull suenot/aicommit-mcp-bundled

# Run the container (mapping your current directory to the container workspace)
docker run -p 8888:8888 -v $(pwd):/workspace --name aicommit-mcp-bundled suenot/aicommit-mcp-bundled
```

#### Building your own Docker image

If you want to build the Docker image yourself:

```bash
git clone https://github.com/suenot/aicommit-mcp.git
cd aicommit-mcp
docker build -t aicommit-mcp-bundled -f Dockerfile-bundled .
docker run -p 8888:8888 -v $(pwd):/workspace --name aicommit-mcp-bundled aicommit-mcp-bundled
```

## Usage

### Starting the server

```bash
# Start using the globally installed package
mcp-server-aicommit

# Or using npx
npx @suenot/aicommit-mcp-bundled

# Or using Docker
docker run -p 8888:8888 -v $(pwd):/workspace suenot/aicommit-mcp-bundled
```

## Smithery Deployment

This MCP server can be deployed to Smithery and listed in the Smithery marketplace. The bundled version includes automatic installation capabilities which makes it more user-friendly.

### How Tool Listing Works in Smithery

In order for Smithery to display your tools on the web interface, tools must be accessible without requiring authentication or configuration. The aicommit-mcp-bundled server implements "lazy loading" of dependencies:

- Tools are registered with the server during initialization
- The automatic installation of aicommit is only attempted when a tool is actually called, not during initialization
- This approach ensures that Smithery can list the tools without requiring any configuration

### Deploying to Smithery

1. Fork the repository or create your own with the required files
2. Ensure your `smithery-bundled.yaml` is properly configured:

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
      auto_install:
        type: boolean
        title: Auto Install
        description: Automatically install aicommit if not found
        default: true
    additionalProperties: false
  commandFunction: |
    function getCommand(config) {
      return {
        command: "node",
        args: ["index.js"],
        env: {
          MAX_TOKENS: config.maxTokens?.toString() || "50",
          STAGED_ONLY: config.staged_only?.toString() || "true",
          VERBOSE: config.verbose?.toString() || "false",
          AUTO_INSTALL: config.auto_install?.toString() || "true"
        }
      };
    }

build:
  dockerfile: "Dockerfile-bundled"
  dockerBuildPath: "."
```

3. Connect your repository to Smithery
4. Deploy your server

### Using Smithery CLI

```bash
# Install via Smithery CLI
npx -y @smithery/cli@latest install @suenot/aicommit-mcp-bundled --client claude --config '{}'

# For specific clients
npx -y @smithery/cli@latest install @suenot/aicommit-mcp-bundled --client cursor --config '{}'
npx -y @smithery/cli@latest install @suenot/aicommit-mcp-bundled --client windsurf --config '{}'
```

## AI Assistant Integration

### Claude Desktop

To use this MCP server with Claude, add it to your Claude configuration:

```json
{
  "mcpServers": {
    "aicommit": {
      "command": "npx",
      "args": ["-y", "@suenot/aicommit-mcp-bundled"]
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
      "args": ["run", "--rm", "-v", "${workspaceFolder}:/workspace", "suenot/aicommit-mcp-bundled"]
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
      "args": ["-y", "@suenot/aicommit-mcp-bundled"]
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
      "args": ["run", "--rm", "-v", "${workspaceFolder}:/workspace", "suenot/aicommit-mcp-bundled"]
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
      "args": ["-y", "@suenot/aicommit-mcp-bundled"]
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
      "args": ["run", "--rm", "-v", "${workspaceFolder}:/workspace", "suenot/aicommit-mcp-bundled"]
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
      "args": ["-y", "@suenot/aicommit-mcp-bundled"]
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
      "args": ["run", "--rm", "-v", "${workspaceFolder}:/workspace", "suenot/aicommit-mcp-bundled"]
    }
  }
}
```

### Smithery

Install via Smithery CLI:

```bash
npx -y @smithery/cli@latest install @suenot/aicommit-mcp-bundled --client claude --config '{}'
```

You can also install for different clients by changing the `--client` parameter:

```bash
# For Cursor
npx -y @smithery/cli@latest install @suenot/aicommit-mcp-bundled --client cursor --config '{}'

# For Windsurf
npx -y @smithery/cli@latest install @suenot/aicommit-mcp-bundled --client windsurf --config '{}'
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

## Manual Configuration of aicommit

If the automatic configuration of aicommit did not work, you can configure it manually:

```bash
# Configure aicommit providers
aicommit --add-provider
```

## License

MIT

## Related

- [aicommit](https://github.com/suenot/aicommit) - The CLI tool this MCP server uses
- [@suenot/aicommit-mcp](https://www.npmjs.com/package/@suenot/aicommit-mcp) - The non-bundled version of this package ([Documentation](./README-REGULAR.md))
- [Model Context Protocol](https://modelcontextprotocol.io/) - Learn more about MCP 