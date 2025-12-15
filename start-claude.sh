#!/bin/bash

# Copy the settings file and start Claude Code with bypassed permissions
echo "Setting up Claude Code environment..."

# Copy the claude settings
cp /Users/jacques/.claude/settings-claude.json /Users/jacques/.claude/settings.json

# Source MCP manager if it exists
if [ -f ~/.claude/mcp-manager/mcp.sh ]; then
    echo "Loading MCP manager..."
    source ~/.claude/mcp-manager/mcp.sh 2>/dev/null || echo "MCP manager loaded with warnings"
fi

# Start Claude Code in the current directory
echo "Starting Claude Code in: $(pwd)"
echo "Using --dangerously-skip-permissions flag"
echo ""

# Start Claude Code normally (interactive)
/opt/homebrew/bin/claude --dangerously-skip-permissions