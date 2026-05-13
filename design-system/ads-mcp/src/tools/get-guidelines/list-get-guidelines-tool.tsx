/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { getGuidelinesInputSchema } from './get-guidelines-input-schema';

export const listGetGuidelinesTool: Tool = {
	name: 'ads_get_guidelines',
	description: `Returns Atlassian Design System (ADS) **foundations** guidelines as Markdown: the bundled design-system-docs foundations set (not component API docs).

TOPIC COVERAGE:
- **Content & UX writing**: messaging types (empty state, error, success, warning, info, feature discovery), voice and tone, inclusive language, grammar and style, date/time copy handoff, vocabulary pointers.
- **Visual foundations**: color (roles, accents, palette, charts, pickers), borders and radius, elevation and z-index, spacing and layout primitives (box/inline/stack), grid, iconography, logos.
- **Design tokens**: concepts, themes, migration, using tokens in code and in Figma.
- **Typography**: typefaces, scale, applying text styles and tokens.
- **Accessibility overview**: building accessible apps and related foundations pages bundled here.

When working with content, use this tool alongside the Context Engine MCP tool \`get_content_standards_docs\` for Atlassian-wide content standards (CDSTD/BAIT-style org guidance); this tool supplies ADS-specific foundations.

WHAT YOU GET:
- With \`terms\`: fuzzy search over keywords and content; concatenated Markdown for matches.
- Without \`terms\` (or empty): the full guideline set as Markdown.

WHEN TO USE:
Use this when you are **building or updating a visual interface**, **writing or reviewing user-facing copy**, or need to **answer foundations questions** about ADS: content patterns, visual appearance, design tokens, typography, spacing, color, grid, motion, and related topics shipped in this bundle.

It is **not** for picking a component’s props or package (use \`ads_plan\` / \`ads_search_components\`) or for interactive accessibility rules and patterns (use \`ads_get_a11y_guidelines\`, with Context Engine \`get_accessibility_docs\` for org-wide a11y standards).`,
	annotations: {
		title: 'Get ADS guidelines (content, a11y, visual design, design tokens, typography)',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(getGuidelinesInputSchema),
};
