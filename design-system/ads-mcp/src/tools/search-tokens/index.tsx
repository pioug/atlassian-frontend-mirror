import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import Fuse from 'fuse.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { type Token, tokens } from '@atlaskit/tokens/token-metadata';

import { cleanQuery } from '../../helpers';

export const searchTokensInputSchema = z.object({
	terms: z
		.array(z.string())
		.describe(
			'An array of search terms to find tokens by name or description, eg. `["spacing", "inverted text", "background primary"]`',
		),
	limit: z
		.number()
		.default(1)
		.describe('Maximum number of results per search term in the array (default: 1)')
		.optional(),
	exactName: z
		.boolean()
		.default(false)
		.describe(
			'Enable to explicitly search tokens by the exact name match (when you know the name, but need more details)',
		)
		.optional(),
});

export const listSearchTokensTool = {
	name: 'ads_search_tokens',
	description: `Search for Atlassian Design System tokens.

Example token usage:
\`\`\`tsx
import { token } from '@atlaskit/tokens';
const styles = css({ color: token('color.text'), padding: token('space.100') });
\`\`\``,
	annotations: {
		title: 'Search ADS tokens',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchTokensInputSchema),
};

export const searchTokensTool = async (
	params: z.infer<typeof searchTokensInputSchema>,
): Promise<CallToolResult> => {
	const { terms, limit = 1, exactName = false } = params;
	const searchTerms = terms.filter(Boolean).map(cleanQuery);

	if (exactName) {
		// for each search term, search for the exact match
		const exactNameMatches = searchTerms
			.map((term) => {
				return tokens.find((token) => token.name.toLowerCase() === term.toLowerCase());
			})
			.filter(Boolean) as Token[];

		if (exactNameMatches.length > 0) {
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(
							exactNameMatches.map((token) => ({
								name: token.name,
								exampleValue: token.exampleValue,
							})),
						),
					},
				],
			};
		}
	}

	// use Fuse.js to fuzzy-search for the tokens
	const fuse = new Fuse(tokens, {
		keys: [
			{
				name: 'name',
				weight: 3,
			},
			{
				name: 'description',
				weight: 2,
			},
			{
				name: 'exampleValue',
				weight: 1,
			},
		],
		threshold: 0.4,
	});

	const results = searchTerms
		.map((term) => {
			return fuse.search(term).slice(0, limit);
		})
		.flat();

	// Remove duplicates based on token name
	const uniqueResults = results.filter((result, index, arr) => {
		return arr.findIndex((r) => r.item.name === result.item.name) === index;
	});

	const matchedTokens = uniqueResults.map((result) => {
		return {
			name: result.item.name,
			exampleValue: result.item.exampleValue,
		};
	});
	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(matchedTokens),
			},
		],
	};
};
