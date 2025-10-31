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

### Cursor IDE

Add the following entry to your `mcp.json` file (located at `~/.cursor/mcp.json` for user-level or
`.cursor/mcp.json` in your workspace):

```json
{
	"mcpServers": {
		"ads-mcp": {
			"command": "npx",
			"args": ["-y", "@atlaskit/ads-mcp"],
			"env": {
				"ADSMCP_AGENT": "cursor"
			}
		}
	}
}
```

### Visual Studio Code (Github Copilot and/or Codelassian)

Add the following entry to your `mcp.json` file (located at
`~/Library/Application Support/Code/User/mcp.json` for user-level or `.vscode/mcp.json` in your
workspace):

```json
{
	"servers": {
		"ads-mcp": {
			"type": "stdio",
			"command": "npx",
			"args": ["-y", "@atlaskit/ads-mcp"]
		}
	}
}
```

### Rovodev

Add the following entry to your `mcp.json` file (located at `~/.rovodev/mcp.json` for user-level or
`mcp.json` in your workspace):

```json
{
	"mcpServers": {
		"ads-mcp": {
			"command": "npx",
			"args": ["-y", "@atlaskit/ads-mcp"]
		}
	}
}
```

> **Note:**  
> The `timeout` field is supported in the Rovodev configuration. For example, setting
> `"timeout": 300` will specify the maximum time in **seconds** that the MCP server will wait before
> terminating the process if it becomes unresponsive. Adjust this value as needed for your
> environment or workflow.

### MCP Plugin for Atlas CLI

Atlas CLI provides a plugin for managing MCP servers, including listing available servers from a
registry and installing new ones.

To install the MCP plugin, run:

```
atlas plugin install -n mcp
```

Once the plugin is installed, you can add the MCP server on Rovodev (at the user-level) with:

```
atlas mcp install --name=ads-mcp --agent=rovodev
```

> **Note:**  
> To see the list of available agents, visit:
> [Introducing the MCP plugin for Atlas CLI](https://hello.atlassian.net/wiki/spaces/~dnorton/blog/2025/10/07/5931517464/Introducing+the+MCP+plugin+for+Atlas+CLI)

### AFM-specific issues

When using the Atlassian Frontend Monorepo (AFM), there are some issues with project-level or
workspace-level MCP configuration when using `npx`. These issues typically manifest as:

- **Performance**: `npx` can be slower in AFM environments due to package resolution overhead
- **Reliability**: Network timeouts and package resolution conflicts are more common

> **Note:** These issues only affect project-level or workspace-level MCP configurations. User-level
> settings (like `~/.cursor/mcp.json` or `~/.rovodev/mcp.json`) work fine with `npx` and don't
> require the workarounds below.

#### Recommended Solution

Instead of using `npx`, `yarn dlx` provides better speed and reliability in AFM environments
because:

- **Faster execution**: Leverages AFM's existing yarn workspace configuration
- **Better caching**: Uses yarn's package cache more effectively
- **Consistent resolution**: Respects AFM's package resolution strategy

#### Simple Configuration

For most AFM users, this configuration will work reliably:

```json
{
	"mcpServers": {
		"ads-mcp": {
			"command": "yarn",
			"args": ["dlx", "-q", "@atlaskit/ads-mcp"]
		}
	}
}
```

#### Robust Configuration with Fallback

If you need maximum reliability across different environments, use this configuration that falls
back to `npm` if `yarn` is unavailable:

```json
{
	"mcpServers": {
		"ads-mcp": {
			"command": "sh",
			"args": [
				"-c",
				"which yarn &>/dev/null && [ \"$(yarn --version | cut -d. -f1)\" -ge 2 ] && yarn dlx -q @atlaskit/ads-mcp || (which ads-mcp &>/dev/null && (npm update -g @atlaskit/ads-mcp && ads-mcp) || (npm install -g @atlaskit/ads-mcp && ads-mcp))"
			]
		}
	}
}
```

This robust configuration:

1. **First tries yarn dlx** if yarn v2+ is available
2. **Falls back to npm update** if the package is already installed globally
3. **Finally installs globally** with npm if nothing else works

### Environment Variables

- `ADSMCP_AGENT` - Identifies the AI agent/platform using the MCP server. Supported values:
  - `cursor` - Cursor editor
  - `vscode` - Visual Studio Code
  - `rovodev` - Rovo Development environment
  - `codelassian` - Codelassian platform
  - `unknown` - Default value when not specified

  The `ADSMCP_AGENT` variable helps track which platforms are using the MCP server for analytics
  purposes.

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
