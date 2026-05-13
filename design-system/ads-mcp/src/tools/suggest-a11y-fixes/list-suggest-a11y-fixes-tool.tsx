/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { suggestA11yFixesInputSchema } from './suggest-a11y-fixes-input-schema';

export const listSuggestA11yFixesTool: Tool = {
	name: 'ads_suggest_a11y_fixes',
	description: `Suggests remediation steps for an accessibility issue described in natural language (often pasted from **axe-core**, ESLint, or review).

WHAT YOU GET (varies by match):
- **Curated hit:** ADS-biased examples and patterns from this server’s recipe map (components, tokens, common fixes).
- **No strong match:** Generic guidance (e.g. “use ADS components”, labeling, testing)—still useful, but **not** guaranteed to be ADS-specific. May reference axe/atlassian.design resources.

WHEN TO USE:
After \`ads_analyze_a11y\` or \`ads_analyze_localhost_a11y\`, or whenever you have a violation string. For **topic-level** Atlassian Design System accessibility guidance, call \`ads_get_a11y_guidelines\` (this tool is fix-oriented, not a full guideline browse).

Does not replace manual testing with assistive technologies or keyboard-only navigation.`,
	annotations: {
		title: 'Suggest accessibility fixes',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(suggestA11yFixesInputSchema),
};
