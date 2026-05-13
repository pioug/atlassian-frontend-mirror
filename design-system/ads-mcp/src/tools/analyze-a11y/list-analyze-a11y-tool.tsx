import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { analyzeA11yInputSchema } from './analyze-a11y-input-schema';

export const listAnalyzeA11yTool: Tool = {
	name: 'ads_analyze_a11y',
	description: `Analyzes a **string of React/JSX** code for likely accessibility issues (heuristics and/or axe-related paths) and returns hints that often **point to** \`ads_suggest_a11y_fixes\` or generic axe/WCAG-style context—not every finding maps to a specific ADS component fix.

WHEN TO USE:
You have component source as text and want automated checks or heuristics before or during a code review.

LIMITATIONS:
- Does not replace testing in a real browser with assistive technologies or full keyboard traversal.
- For rendered UI, \`ads_analyze_localhost_a11y\` (live URL + axe) is preferable when available—it is **only exposed when this MCP runs locally**, not in the remote MCP deployment.`,
	annotations: {
		title: 'Analyze accessibility (code string)',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(analyzeA11yInputSchema),
};
