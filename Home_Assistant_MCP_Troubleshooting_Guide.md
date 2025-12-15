# Home Assistant MCP Server Troubleshooting Guide

> **Note**: This guide has been updated to reflect the current MCP-compliant implementation. All previous issues with tool schemas and execution have been resolved.

## Current Status

### ✅ All Issues Resolved
- **MCP Protocol Compliance**: Server is fully compliant with MCP spec 2024-11-05
- **Tool Schemas**: All tools properly expose complete JSON Schema definitions
- **Tool Execution**: Tools return MCP-compliant format with proper error handling
- **Protocol Version**: Using MCP protocol version 2024-11-05
- **Client Compatibility**: Works with all MCP-compliant clients (Claude Desktop, Cursor, VS Code, etc.)

## Recommended Entry Point

**Use `dist/stdio-server.js` for all MCP client configurations** - This is the optimized stdio-only server.

The old `dist/index.js --stdio` approach still works but is deprecated. See the [Client Setup Instructions](../README.md#client-setup-instructions) in the README for current configuration examples.

## Troubleshooting Common Issues

### Testing the Server

To verify the server is working correctly:

```bash
# Test with the recommended stdio-server.js
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"clientInfo":{"name":"test","version":"1.0.0"}}}
{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | HASS_TOKEN="your_token" HASS_HOST="https://your-home-assistant-instance.local:8123" bun run dist/stdio-server.js
```

You should receive a response with all available tools and their complete schemas.

### Updating the Server

To update to the latest version:

```bash
cd /path/to/advanced-homeassistant-mcp
git pull origin main
bun install
bun run build:all
```

### Verifying Tool Schemas

All tools should expose complete `inputSchema` definitions. If schemas appear empty:

1. Rebuild the server: `bun run build:all`
2. Verify `zod-to-json-schema` is installed: `bun install`
3. Check that tools have Zod parameter schemas defined

## Configuration Examples

### Recommended Configuration

```json
{
  "mcpServers": {
    "homeassistant": {
      "command": "bun",
      "args": ["run", "/path/to/advanced-homeassistant-mcp/dist/stdio-server.js"],
      "env": {
        "HASS_TOKEN": "your_long_lived_access_token",
        "HASS_HOST": "https://your-home-assistant-instance.local:8123",
        "USE_STDIO_TRANSPORT": "true"
      }
    }
  }
}
```

### Debug Configuration

If you need to troubleshoot issues, enable debug logging:

```json
{
  "mcpServers": {
    "homeassistant": {
      "command": "bun",
      "args": ["run", "/path/to/advanced-homeassistant-mcp/dist/stdio-server.js"],
      "env": {
        "HASS_TOKEN": "your_token",
        "HASS_HOST": "https://your-home-assistant-instance.local:8123",
        "USE_STDIO_TRANSPORT": "true",
        "DEBUG_STDIO": "true",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

## Common Issues and Solutions

### Issue: Tools not appearing in client

**Solution:**
1. Verify server builds successfully: `bun run build:all`
2. Check that `stdio-server.js` exists in `dist/` directory
3. Verify environment variables are set correctly
4. Check client logs for connection errors

### Issue: Tool execution fails

**Solution:**
1. Verify your Home Assistant token is valid and not expired
2. Check that `HASS_HOST` is accessible from your machine
3. Ensure Home Assistant API is enabled
4. Review server logs for detailed error messages

### Issue: Empty tool schemas

**Solution:**
1. Rebuild the server: `bun run build:all`
2. Verify `zod-to-json-schema` is installed: `bun install`
3. Check that all tools have Zod parameter schemas defined

## Summary

Your Home Assistant MCP server is **fully functional**:
- ✅ MCP Protocol Compliance: Fully compliant with spec 2024-11-05
- ✅ Tool Schemas: All tools expose complete JSON Schema definitions
- ✅ Tool Execution: Proper MCP-compliant format with error handling
- ✅ Client Compatibility: Works with all MCP-compliant clients

**For detailed setup instructions, see the [README.md](../README.md#client-setup-instructions).**