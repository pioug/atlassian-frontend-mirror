# Atlassian Design System MCP Server

Current state: Early Access

The official Model Context Protocol (MCP) server for the Atlassian Design System. This server
provides tools to access design tokens, icons, and components/primitives programmatically.

**New: Accessibility Analysis & Guidance** The server now includes comprehensive accessibility tools
to help ensure your interfaces are accessible to all users.

## Available Tools

### Design System Tools

- `ads_get_all_tokens` - Get all available design tokens for colors, spacing, typography, etc.
- `ads_search_tokens` - Search for specific design tokens by name, description, or example values
- `ads_get_components` - Get a list of all available components with basic information
- `ads_search_components` - Search for components by name, description, category, or package name
- `ads_get_all_icons` - Get all available icons from the design system
- `ads_search_icons` - Search for specific icons by name, keywords, or categorization
- `ads_plan` - Search for multiple design system resources (tokens, icons, components) in a single
  efficient operation

#### Design System Tools Usage

```typescript
// Search for components (recommended approach)
const buttonComponents = await search_components({
	terms: ['button', 'click'],
	limit: 3,
});

// Search for specific tokens
const colorTokens = await search_tokens({
	terms: ['color.text', 'primary'],
	limit: 5,
});

// Search for icons
const addIcons = await search_icons({
	terms: ['add', 'plus', 'create'],
	limit: 2,
});

// Search for multiple resources at once (most efficient for complex UI patterns)
const designResources = await plan({
	tokens_search: ['color.text', 'space.100', 'radius.small'],
	icons_search: ['add', 'edit', 'delete'],
	components_search: ['Button', 'TextField', 'Modal'],
	limit: 2,
});

// Get all available items (fallback when search doesn't find what you need)
const allComponents = await get_components();
const allTokens = await get_all_tokens();
const allIcons = await get_all_icons();
```

### Accessibility Tools

- `ads_analyze_a11y` - Analyze React component code for accessibility violations using axe-core and
  provide ADS-specific suggestions
- `ads_analyze_localhost_a11y` - Analyze whole web pages or specific elements (localhost or deployed
  URLs) for accessibility violations
- `ads_get_a11y_guidelines` - Get specific accessibility guidelines and best practices for different
  topics
- `ads_suggest_a11y_fixes` - Get specific fix suggestions for accessibility violations with code
  examples

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
const analysis = await analyze_a11y({
	code: `<button onClick={handleClose}><CloseIcon /></button>`,
	componentName: 'CloseButton',
	includePatternAnalysis: true, // Also include pattern-based analysis
});

// Get specific accessibility guidelines
const guidelines = await get_a11y_guidelines({
	topic: 'buttons',
});

// Get fix suggestions for a violation
const fixes = await suggest_a11y_fixes({
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
			"args": ["-y", "@atlaskit/ads-mcp"],
			"env": {
				"ADSMCP_AGENT": "cursor"
			}
		}
	}
}
```

### Environment Variables

- `ADSMCP_AGENT` - Identifies the AI agent/platform using the MCP server. Supported values:
  - `cursor` - Cursor editor
  - `vscode` - Visual Studio Code
  - `rovodev` - Rovo Development environment
  - `codelassian` - Codelassian platform
  - `unknown` - Default value when not specified
  
  The `ADSMCP_AGENT` variable helps track which platforms are using the MCP server for analytics purposes.

- `ADSMCP_ANALYTICS_OPT_OUT` - Opt out of analytics collection. Set to `true` to disable:
  ```json
  {
    "mcpServers": {
      "ads": {
        "command": "npx",
        "args": ["-y", "@atlaskit/ads-mcp"],
        "env": {
          "ADSMCP_AGENT": "cursor",
          "ADSMCP_ANALYTICS_OPT_OUT": true
        }
      }
    }
  }
  ```

## Analytics

The MCP server includes built-in analytics to help improve the service. Analytics are sent to
Atlassian's internal analytics system and track:

### What We Track

- **Tool Usage**: Which tools are being called (e.g., `ads_plan`, `ads_analyze_a11y`)
- **Tool Parameters**: Arguments passed to tools (search terms, component names, etc.)
- **Success/Failure**: Whether tool calls succeed or fail, including error messages
- **Environment Context**:
  - `agent`: The platform using the MCP server (from `ADSMCP_AGENT` env var)
  - `os`: Operating system name (darwin, win32, linux)
  - `osVersion`: Operating system version (e.g., 24.6.0 for macOS)
  - `version`: The version of `@atlaskit/ads-mcp` being used
  - `staffId`: User identifier (from `STAFF_ID`, `USER`, `ATLAS_USER`, or username)
  - `timestamp`: When the event occurred

### Privacy & Error Handling

- Analytics are collected for internal Atlassian use only to improve the MCP server
- **You can opt out** by setting `ADSMCP_ANALYTICS_OPT_OUT=true` in your environment variables
- If the analytics client fails to initialize or send events, the MCP server continues to work
  normally
- All analytics errors are caught and logged, ensuring they never interrupt your workflow
- Events are batched and flushed every 5 seconds for efficiency


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
			],
			"env": {
				"ADSMCP_AGENT": "cursor"
			}
		}
	}
}
```
