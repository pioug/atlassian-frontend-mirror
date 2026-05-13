/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { getA11yGuidelinesInputSchema } from './get-a11y-guidelines-input-schema';

export const listGetA11yGuidelinesTool: Tool = {
	name: 'ads_get_a11y_guidelines',
	description: `Returns Atlassian Design System (ADS) accessibility guidance: best practices and patterns for buttons, interactions, color contrast, forms, and other design-system topics shipped in this tool.

Use this alongside the Context Engine MCP tool \`get_accessibility_docs\` for Atlassian-wide accessibility standards (e.g. A11YKB); this tool supplies ADS-specific component and pattern guidance.

WHEN TO USE:
You MUST call this when generating or substantially changing a new interactive or visual user interface built with ADS, or when you need topic-specific ADS guidance (e.g. focus, forms, motion).

DO NOT rely on generic web accessibility advice alone—ADS conventions may differ. Use \`get_accessibility_docs\` for org-wide standards and this tool for ADS-topic guidance.`,
	annotations: {
		title: 'Get ADS accessibility guidelines',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(getA11yGuidelinesInputSchema),
};
