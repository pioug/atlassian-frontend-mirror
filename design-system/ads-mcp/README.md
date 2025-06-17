# Atlassian Design System MCP Server

Current state: Early Access

The official Model Context Protocol (MCP) server for the Atlassian Design System. This server
provides tools to access design tokens, icons, and components/primitives programmatically.

This may expand to add accessibility, usage, and other guidance over time.

## Usage

Add an entry to your `mcp.json` (eg. `~/.cursor/mcp.json` or wherever your MCP config lives):

```json
{
	"mcpServers": {
		"ads": {
			"command": "npx",
			"args": ["-y", "@atlaskit/ads-mcp"]
		}
	}
}
```

## Development

You may automatically be served the local version of `@atlaskit/ads-mcp` depending on where you're
running it from, but you should force it like so:

```json
{
	"mcpServers": {
		"ads": {
			"command": "npx",
			"args": [
				"-y",
				"~/git/atlassian/atlassian-frontend-monorepo/platform/packages/design-system/ads-mcp"
			]
		}
	}
}
```
