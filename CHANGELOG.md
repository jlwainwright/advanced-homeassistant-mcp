# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Full MCP protocol compliance (spec 2024-11-05)
- Proper JSON Schema conversion for all tool parameters using `zod-to-json-schema`
- MCP-compliant tool result format with `content` array and `isError` flag
- Comprehensive schema conversion utility (`src/mcp/utils/schema-converter.ts`)
- Tool result formatting utility (`src/mcp/utils/tool-result.ts`)
- Unit tests for schema conversion and tool result formatting
- Client setup instructions for Claude Desktop, Cursor, and VS Code

### Fixed
- Fixed missing logger import in `list-devices.tool.ts` causing runtime errors
- Fixed missing logger import in `subscribe-events.tool.ts` causing runtime errors
- Fixed incorrect config import in `index.ts` - now uses `config.ts` instead of `config.js` to properly access camelCase properties
- Fixed timeout middleware showing "undefinedms" in error messages due to config property mismatch
- **Fixed empty tool schemas**: All tools now properly expose complete `inputSchema` definitions
- **Fixed tool execution format**: Tools now return MCP-compliant format instead of raw objects
- **Fixed protocol version**: Updated to MCP spec 2024-11-05 with proper capabilities
- All Home Assistant MCP tools now execute successfully and work with any MCP-compliant client

### Changed
- Updated config import to use TypeScript version with proper type validation
- Improved error handling in tool execution following MCP specification
- Updated all entry points to prefer `stdio-server.js` over `index.js --stdio`
- Standardized on `dist/stdio-server.js` as the recommended entry point for MCP clients
- Updated all documentation to reflect current MCP-compliant implementation
- Removed legacy commented-out imports and deprecated configurations

### Removed
- Removed temporary `fix-env.js` file
- Removed deprecated `index.js --stdio` references from documentation
- Cleaned up duplicate README sections

## [1.0.0] - 2025-01-XX

### Added
- Initial release of Home Assistant MCP Server
- Support for controlling lights, climate, and other Home Assistant devices
- JSON-RPC 2.0 stdio transport for AI assistant integration
- HTTP/REST API with Server-Sent Events support
- WebSocket support for real-time state updates
- JWT-based authentication
- Docker support with optional speech features
- Integration with Claude Desktop and Cursor
- Comprehensive documentation and examples
