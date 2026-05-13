/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { type z } from 'zod';

import { type Token, tokens } from '@atlaskit/tokens/token-metadata';

import { mergeMultiTermFuseResults } from '../../helpers';
import { cleanQuery } from '../../helpers/clean-query';

import { type searchTokensInputSchema } from './search-tokens-input-schema';

export const searchTokensTool = async ({
	terms,
	limit = 2,
}: z.infer<typeof searchTokensInputSchema>): Promise<CallToolResult> => {
	// Unique cleaned terms (order preserved) so duplicates don't concatenate into a bogus query.
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

	const fuse = new Fuse(tokens, {
		keys: [
			{
				name: 'name',
				weight: 5,
			},
			{
				name: 'path',
				weight: 2,
			},
			{
				name: 'description',
				weight: 2,
			},
			{
				name: 'usageGuidelines.usage',
				weight: 2,
			},
			{
				name: 'usageGuidelines.cssProperties',
				weight: 3,
			},
			{
				name: 'exampleValue',
				weight: 0.5,
			},
		],
		threshold: 0.4,
		distance: 80,
		minMatchCharLength: 3,
		ignoreFieldNorm: true,
		includeScore: true,
	});

	const matchedItems: Token[] = mergeMultiTermFuseResults<Token>({
		searchTerms,
		limit,
		search: (query: string) => fuse.search(query, { limit: limit * searchTerms.length }),
		searchTermsJoin: '.',
	});

	const matchedTokens = matchedItems.map((item: Token) => ({
		name: item.name,
		exampleValue: item.exampleValue,
	}));

	if (!matchedTokens.length) {
		return {
			content: [
				{
					type: 'text',
					text: `Error: No tokens found for '${terms.join(', ')}'. Available tokens: ${tokens.map((t) => t.name).join(', ')}`,
				},
			],
		};
	}

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(matchedTokens),
			},
		],
	};
};
