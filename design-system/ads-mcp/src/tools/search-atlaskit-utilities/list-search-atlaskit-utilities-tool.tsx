/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers';

import { searchAtlaskitUtilitiesInputSchema } from './search-atlaskit-utilities-input-schema';

export const listSearchAtlaskitUtilitiesTool: Tool = {
	name: 'atlaskit_search_utilities',
	description: `Search for atlaskit utilities (functions, constants, types) by name, package, category, description, or keywords.

WHEN TO USE:
Use this when you want to find a utility but don't know its exact name or package.`,
	annotations: {
		title: 'Search Atlaskit utilities',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchAtlaskitUtilitiesInputSchema),
};
