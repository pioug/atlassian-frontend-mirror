import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import Fuse from 'fuse.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { type Token, tokens } from '@atlaskit/tokens/token-metadata';

import { cleanQuery } from '../../helpers';

const inputSchema = z.object({
	terms: z.array(z.string()).describe('Search term(s) to find tokens by name or description'),
	limit: z
		.number()
		.optional()
		.default(1)
		.describe('Maximum number of results per term to return (default: 1)'),
	exactName: z
		.boolean()
		.optional()
		.default(false)
		.describe('Whether to search for exact match only for the token name'),
});

export const listSearchTokensTool = {
	name: 'ads_search_tokens',
	description: `You SHOULD Search for Atlassian Design System tokens based on multiple query strings (if there's multiple candidates of token names, descriptions or example values, you SHOULD pass them in a single call). You SHOULD use default \`limit\` value of 1 first and only set a higher limit like 5 or 10 if you can't find the token you need). Fallback to \`ads_get_all_tokens\` if nothing is found). This tool searches through token names, descriptions, and example values to find the most relevant design tokens.

The search will match against:
- Token names (e.g., "color.text", "space.100", "radius.small")
- Token descriptions
- Token example values (eg. "#2898BD" -> "color.icon.accent.teal")

The results include the token's name and example value.

Usage pattern for found tokens:
\`\`\`tsx
import { token } from '@atlaskit/tokens';

const styles = css({
color: token('color.text'),
padding: token('space.100'),
borderRadius: token('radius.small'),
});
\`\`\`
`,
	annotations: {
		title: 'Search ADS tokens',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(inputSchema),
};

export const searchTokensTool = async (
	params: z.infer<typeof inputSchema>,
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
