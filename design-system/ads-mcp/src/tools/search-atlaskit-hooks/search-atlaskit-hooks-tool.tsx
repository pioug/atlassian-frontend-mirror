/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { type z } from 'zod';

import { cleanQuery, mergeMultiTermFuseResults } from '../../helpers';
import { atlaskitHooks } from '../get-atlaskit-hooks/atlaskit-hooks.codegen';
import type { HookMcpPayload } from '../get-atlaskit-hooks/types';

import type { searchAtlaskitHooksInputSchema } from './search-atlaskit-hooks-input-schema';

const buildHookResult = (result: HookMcpPayload) => {
	return {
		name: result.name,
		package: result.package,
		description: result.description,
		usageGuidelines: result.usageGuidelines,
		keywords: result.keywords,
		category: result.category,
		parameters: result.parameters,
		returns: result.returns,
	};
};

export const searchAtlaskitHooksTool = async ({
	terms,
	limit = 2,
}: z.infer<typeof searchAtlaskitHooksInputSchema>): Promise<CallToolResult> => {
	const searchTerms = [...new Set(terms.filter(Boolean).map(cleanQuery))];

	if (!searchTerms.length) {
		return {
			content: [
				{
					type: 'text',
					text: '[]',
				},
			],
		};
	}

	const hooks: HookMcpPayload[] = atlaskitHooks;

	const fuse = new Fuse(hooks, {
		keys: [
			{ name: 'name', weight: 5 },
			{ name: 'package', weight: 3 },
			{ name: 'category', weight: 2 },
			{ name: 'description', weight: 2 },
			{ name: 'keywords', weight: 2 },
			{ name: 'usageGuidelines', weight: 2 },
		],
		threshold: 0.4,
		distance: 80,
		minMatchCharLength: 3,
		ignoreFieldNorm: true,
		includeScore: true,
	});

	const matchedItems = mergeMultiTermFuseResults<HookMcpPayload>({
		searchTerms,
		limit,
		search: (query: string) => fuse.search(query, { limit: limit * searchTerms.length }),
	});

	if (!matchedItems.length) {
		return {
			content: [
				{
					type: 'text',
					text: `Error: No Atlaskit hooks found for '${terms.join(', ')}'.`,
				},
			],
		};
	}

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(matchedItems.map(buildHookResult)),
			},
		],
	};
};
