/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { type z } from 'zod';

import { cleanQuery, mergeMultiTermFuseResults } from '../../helpers';
import { atlaskitUtilities } from '../get-atlaskit-utilities/atlaskit-utilities.codegen';
import type { UtilityMcpPayload } from '../get-atlaskit-utilities/types';

import type { searchAtlaskitUtilitiesInputSchema } from './search-atlaskit-utilities-input-schema';

const buildUtilityResult = (result: UtilityMcpPayload) => {
	return {
		name: result.name,
		package: result.package,
		description: result.description,
		usageGuidelines: result.usageGuidelines,
		keywords: result.keywords,
		category: result.category,
		kind: result.kind,
		...(result.kind === 'function' ? { signature: result.signature } : {}),
	};
};

export const searchAtlaskitUtilitiesTool = async ({
	terms,
	limit = 2,
}: z.infer<typeof searchAtlaskitUtilitiesInputSchema>): Promise<CallToolResult> => {
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

	const utilities: UtilityMcpPayload[] = atlaskitUtilities;

	const fuse = new Fuse(utilities, {
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

	const matchedItems = mergeMultiTermFuseResults<UtilityMcpPayload>({
		searchTerms,
		limit,
		search: (query: string) => fuse.search(query, { limit: limit * searchTerms.length }),
	});

	if (!matchedItems.length) {
		return {
			content: [
				{
					type: 'text',
					text: `Error: No Atlaskit utilities found for '${terms.join(', ')}'.`,
				},
			],
		};
	}

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(matchedItems.map(buildUtilityResult)),
			},
		],
	};
};
