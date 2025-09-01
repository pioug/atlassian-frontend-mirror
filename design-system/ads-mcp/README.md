# Atlassian Design System MCP Server

Current state: Early Access

The official Model Context Protocol (MCP) server for the Atlassian Design System. This server
provides tools to access design tokens, icons, and components/primitives programmatically.

**New: Accessibility Analysis & Guidance** The server now includes comprehensive accessibility tools
to help ensure your interfaces are accessible to all users.

## Available Tools

### Design System Tools

- `get_tokens` - Get design tokens for colors, spacing, typography, etc.
- `get_components` - Get a list of available components
- `get_component_details` - Get detailed information about a specific component
- `get_icons` - Get a list of available icons

### Accessibility Tools

- `analyze_accessibility` - Analyze React component code for accessibility violations using axe-core
  and provide ADS-specific suggestions
- `analyze_localhost_accessibility` - Analyze whole web pages or specific elements (localhost or
  deployed URLs) for accessibility violations
- `get_accessibility_guidelines` - Get specific accessibility guidelines and best practices for
  different topics
- `suggest_accessibility_fixes` - Get specific fix suggestions for accessibility violations with
  code examples

## Accessibility Features

The ADS MCP server includes comprehensive accessibility analysis and guidance:

- **Axe-Core Analysis**: Industry-standard accessibility testing using axe-core
- **JSX to HTML Conversion**: Accurate analysis by converting React JSX to HTML
- **ADS-Specific Fixes**: Get suggestions that use Atlassian Design System components and patterns
- **WCAG 2.1 AA Compliance**: Test against WCAG 2.1 AA standards
- **Guidelines**: Access detailed accessibility guidelines for buttons, forms, images, colors, focus
  management, and more
- **Best Practices**: Learn ADS-specific accessibility best practices and patterns
- **Fallback Analysis**: Pattern-based analysis if axe-core analysis fails

### Example Usage

```typescript
// Analyze a component for accessibility issues using axe-core
const analysis = await analyze_accessibility({
	code: `<button onClick={handleClose}><CloseIcon /></button>`,
	componentName: 'CloseButton',
	includePatternAnalysis: true, // Also include pattern-based analysis
});

// Get specific accessibility guidelines
const guidelines = await get_accessibility_guidelines({
	topic: 'buttons',
});

// Get fix suggestions for a violation
const fixes = await suggest_accessibility_fixes({
	violation: 'Button missing accessible label',
	code: `<button onClick={handleClose}><CloseIcon /></button>`,
});
```

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
