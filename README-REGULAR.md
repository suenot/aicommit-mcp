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
npm install -g aicommit
# or
cargo install aicommit

# Install the MCP server
npm install -g @suenot/aicommit-mcp
```

### Option 2: Install as a dependency in your project

```bash
npm install @suenot/aicommit-mcp
```

## Usage

### Starting the server

```bash
# Start using the globally installed package
mcp-server-aicommit

# Or using npx
npx @suenot/aicommit-mcp
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