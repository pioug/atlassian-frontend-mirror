/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { searchAtlaskitComponentsInputSchema } from './search-atlaskit-components-input-schema';

export const listSearchAtlaskitComponentsTool: Tool = {
	name: 'atlaskit_search_components',
	description: `Searches the bundled public \`@atlaskit/*\` component catalog outside the Atlassian Design System (ADS) component catalog. Returns JSON objects with **name**, **package**, **examples**, and **props** for each match (trimmed payload).

WHEN TO USE:
Use this for fallback research when \`ads_search_components\` or \`ads_plan.components\` does not find a useful ADS component, or when the user asks about a specific public \`@atlaskit/*\` package that is not part of ADS. Prefer canonical ADS components first for standard UI.`,
	annotations: {
		title: 'Search Atlaskit components',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchAtlaskitComponentsInputSchema),
};
