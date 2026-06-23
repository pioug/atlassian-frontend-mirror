/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers';

import { searchAtlaskitHooksInputSchema } from './search-atlaskit-hooks-input-schema';

export const listSearchAtlaskitHooksTool: Tool = {
	name: 'atlaskit_search_hooks',
	description: `Search for atlaskit hooks by name, package, category, description, or keywords.

WHEN TO USE:
Use this when you want to find a hook but don't know its exact name or package.`,
	annotations: {
		title: 'Search Atlaskit hooks',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchAtlaskitHooksInputSchema),
};
