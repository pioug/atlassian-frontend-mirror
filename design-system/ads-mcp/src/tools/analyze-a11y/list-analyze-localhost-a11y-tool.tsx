import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { analyzeA11yLocalhostInputSchema } from './analyze-a11y-localhost-input-schema';

export const listAnalyzeLocalhostA11yTool: Tool = {
	name: 'ads_analyze_localhost_a11y',
	description: `Loads a **live URL** in a headless browser, runs **axe-core**, and returns violations with follow-up hints (often suggesting \`ads_suggest_a11y_fixes\`). Output is anchored in **axe** rule text; remediation may be generic or ADS-biased depending on the violation.

**Availability:** This tool is only registered when the ADS MCP runs **on your machine** (local MCP). It is **not** available in the **remote** MCP offering—use \`ads_analyze_a11y\` on source text there instead.

WHEN TO USE:
You have a running app or storybook page and need automated accessibility results on **rendered** UI—especially local or staging URLs.

LIMITATIONS:
- Does not replace manual testing with assistive technologies or keyboard-only navigation.
- Requires network access to the URL from the environment running the MCP.`,
	annotations: {
		title: 'Analyze accessibility (live URL)',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(analyzeA11yLocalhostInputSchema),
};
