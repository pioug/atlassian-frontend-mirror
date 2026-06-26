/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';

import { zodToJsonSchema } from '../../helpers';

import { searchAtlaskitHooksInputSchema } from './search-atlaskit-hooks-input-schema';

export const listSearchAtlaskitHooksTool: Tool = {
	name: 'atlaskit_search_hooks',
	description: `Search public \`@atlaskit/*\` hooks outside the Atlassian Design System (ADS) catalog by name, package, category, description, or keywords.

WHEN TO USE:
Use this for fallback research when you want to find a non-ADS \`@atlaskit/*\` hook but do not know its exact name or package.`,
	annotations: {
		title: 'Search Atlaskit hooks',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchAtlaskitHooksInputSchema),
};
