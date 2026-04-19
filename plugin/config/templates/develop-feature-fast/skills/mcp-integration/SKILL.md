---
name: mcp-integration
description: >-
  Discover, configure, and test MCP server integrations and tool connections. Triggers on
  "add MCP server", "configure MCP", "list MCP tools", "connect to MCP", "test MCP integration".
  NOT for general API integration — use implementation.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
---

## When to Use

- Adding a new MCP server to the project configuration
- Discovering available MCP tools and their capabilities
- Testing MCP server connections and tool invocations
- Troubleshooting MCP integration issues
- Configuring tool filtering or permissions

## When NOT to Use

- Building a REST API or general integration — use `implementation`
- Researching MCP options — use `research`
- Debugging non-MCP issues — use `debugging`

## Instructions

### 1. Discover Available MCP Tools

Check the current MCP configuration:
- Read `.claude/settings.json` or equivalent MCP config file
- List available MCP servers and their status
- Use Grep to find MCP-related configuration across the project

### 2. Configure MCP Server

To add a new MCP server:

1. Read the server's documentation or README for configuration requirements
2. Identify required environment variables, API keys, or auth tokens
3. Add the server configuration to the appropriate config file:
   ```json
   {
     "mcpServers": {
       "server-name": {
         "command": "npx",
         "args": ["-y", "@scope/mcp-server"],
         "env": {
           "API_KEY": "..."
         }
       }
     }
   }
   ```
4. Verify the configuration syntax is valid JSON

### 3. Test the Connection

After configuration:
- Check that the MCP server process starts without errors
- List available tools from the server to verify connectivity
- Test a simple tool invocation to confirm end-to-end functionality

### 4. Configure Tool Filtering

If specific tools should be enabled or disabled:
- Review the full tool list from the server
- Configure allowed/blocked tools in the settings
- Document which tools are enabled and why

### 5. Document the Integration

Record in project docs:
- Server name and purpose
- Required environment variables
- Available tools and their use cases
- Any known limitations

## Output

```
## MCP Integration: [server-name]

### Configuration
- **Server:** [name and package]
- **Status:** Connected | Failed
- **Tools Available:** [count]

### Tools
| Tool | Description | Status |
|------|-------------|--------|
| tool_name | What it does | OK / Error |

### Setup Notes
[Environment variables, auth requirements, known issues]
```
