[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/suenot-aicommit-mcp-badge.png)](https://mseep.ai/app/suenot-aicommit-mcp)

# aicommit-mcp
[![smithery badge](https://smithery.ai/badge/@suenot/aicommit-mcp)](https://smithery.ai/server/@suenot/aicommit-mcp)

MCP (Model Context Protocol) server for aicommit - AI-powered git commit message generation.

## Overview

This MCP server allows AI assistants (like Claude) to generate git commit messages for your code changes. It acts as a bridge between LLMs and the [aicommit](https://github.com/suenot/aicommit) tool, enabling AI-powered version control workflows.

## Available Packages

There are two versions of this package available:

### 1. Regular Version [@suenot/aicommit-mcp](./README-REGULAR.md)

The standard package that requires aicommit to be installed separately.

📦 [NPM Package: @suenot/aicommit-mcp](https://www.npmjs.com/package/@suenot/aicommit-mcp)

### 2. Bundled Version [@suenot/aicommit-mcp-bundled](./README-BUNDLED.md)

The bundled package that automatically installs aicommit for you.

📦 [NPM Package: @suenot/aicommit-mcp-bundled](https://www.npmjs.com/package/@suenot/aicommit-mcp-bundled)

## Feature Comparison

| Feature | Regular | Bundled |
|---------|---------|---------|
| Generate AI commit messages | ✅ | ✅ |
| Execute aicommit operations | ✅ | ✅ |
| Check git repository status | ✅ | ✅ |
| View aicommit providers | ✅ | ✅ |
| Automatic staging, pushing, pulling | ✅ | ✅ |
| Automatic installation of aicommit | ❌ | ✅ |

## Quick Installation Guide

### Regular Version (aicommit installed separately)

```bash
# Install aicommit first
npm install -g @suenot/aicommit
# or
cargo install aicommit

# Install the MCP server
npm install -g @suenot/aicommit-mcp
```

### Bundled Version (includes aicommit installation)

```bash
# Install the bundled MCP server
npm install -g @suenot/aicommit-mcp-bundled
```

### Docker Installation

You can also run the MCP server using Docker:

#### Regular Version
```bash
# Pull the Docker image
docker pull suenot/aicommit-mcp

# Run the container
docker run -p 8888:8888 -v $(pwd):/workspace --name aicommit-mcp suenot/aicommit-mcp
```

#### Bundled Version
```bash
# Pull the Docker image
docker pull suenot/aicommit-mcp-bundled

# Run the container
docker run -p 8888:8888 -v $(pwd):/workspace --name aicommit-mcp-bundled suenot/aicommit-mcp-bundled
```

## Smithery Deployment

This MCP server is compatible with Smithery and can be deployed to the Smithery marketplace. The server implements "lazy loading" of the aicommit tool, which means:

- Tool listing doesn't require authentication or configuration
- Authentication and dependencies are only checked when tools are actually called
- The server supports deployment and tool display in the Smithery web interface

### Setting up with Smithery

```bash
# Using the Smithery CLI
npx -y @smithery/cli@latest install @suenot/aicommit-mcp --client claude --config '{}'

# For bundled version
npx -y @smithery/cli@latest install @suenot/aicommit-mcp-bundled --client claude --config '{}'
```

### Local Installation from Smithery

Both versions of the aicommit MCP server support direct installation from the Smithery web interface:

1. Visit [Smithery](https://smithery.ai/server/@suenot/aicommit-mcp)
2. Click "Continue Anyway" when prompted
3. Select your preferred client (Claude, Cursor, etc.)
4. Click "Install Server"

The installer will guide you through the process:
- For the regular version, you'll need to install aicommit separately
- For the bundled version, aicommit will be installed automatically

### Troubleshooting Local Installation

If you encounter the "Uh oh! This server works best locally..." error:

1. Ensure you have Node.js 14+ installed
2. Install the package manually using npm:
   ```bash
   npm install -g @suenot/aicommit-mcp
   # or for bundled version
   npm install -g @suenot/aicommit-mcp-bundled
   ```
3. Configure your MCP client (Claude, Cursor, etc.) as shown in the Assistant Integration section

## Assistant Integration

### Claude Desktop

```json
{
  "mcpServers": {
    "aicommit": {
      "command": "npx",
      "args": ["-y", "@suenot/aicommit-mcp"]
      // For bundled version: "args": ["-y", "@suenot/aicommit-mcp-bundled"]
    }
  }
}
```

### With Docker

To use Docker with Claude Desktop, add this to your configuration:

```json
{
  "mcpServers": {
    "aicommit": {
      "command": "docker",
      "args": ["run", "--rm", "-v", "${workspaceFolder}:/workspace", "suenot/aicommit-mcp"]
      // For bundled version: "args": ["run", "--rm", "-v", "${workspaceFolder}:/workspace", "suenot/aicommit-mcp-bundled"]
    }
  }
}
```

### Cursor

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
# Regular version
npx -y @smithery/cli@latest install @suenot/aicommit-mcp --client claude --config '{}'

# Bundled version
npx -y @smithery/cli@latest install @suenot/aicommit-mcp-bundled --client claude --config '{}'
```

For complete documentation for each package, please refer to:
- [Regular Version Documentation](./README-REGULAR.md)
- [Bundled Version Documentation](./README-BUNDLED.md)

## License

MIT

## Related

- [aicommit](https://github.com/suenot/aicommit) - The CLI tool this MCP server uses
- [Model Context Protocol](https://modelcontextprotocol.io/) - Learn more about MCP 