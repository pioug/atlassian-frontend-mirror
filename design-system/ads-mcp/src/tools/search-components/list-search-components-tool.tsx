/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { searchComponentsInputSchema } from './search-components-input-schema';

export const listSearchComponentsTool: Tool = {
	name: 'ads_search_components',
	description: `Searches the bundled Atlassian Design System (ADS) component catalog. Returns JSON objects with **name**, **package**, **examples**, and **props** for each match (trimmed payload).

WHEN TO USE:
**Selecting which canonical ADS component to use**—package name, examples, and props—before implementation. Use when composing a new view or swapping a primitive. Prefer \`ads_plan\` when you also need token and icon discovery in one shot.

If you are looking for a public \`@atlaskit/*\` scoped package that is not part of the ADS component catalog, use \`atlaskit_search_components\` for fallback research instead of this ADS-only search.`,
	annotations: {
		title: 'Search ADS components',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchComponentsInputSchema),
};
