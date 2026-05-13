/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers/zod-to-json-schema';

import { searchAtlaskitComponentsInputSchema } from './search-atlaskit-components-input-schema';

export const listSearchAtlaskitComponentsTool: Tool = {
	name: 'atlaskit_search_components',
	description: `Searches the bundled Atlaskit component catalog. Returns JSON objects with **name**, **package**, **examples**, and **props** for each match (trimmed payload).

WHEN TO USE:
**Selecting which Atlaskit component to use**—package name, examples, and props—before implementation. Use when searching for specific Atlaskit components that might not be in the core ADS catalog.`,
	annotations: {
		title: 'Search Atlaskit components',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchAtlaskitComponentsInputSchema),
};
