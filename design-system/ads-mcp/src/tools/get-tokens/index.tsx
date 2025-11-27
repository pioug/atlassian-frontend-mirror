import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import Fuse from 'fuse.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { tokens } from '@atlaskit/tokens/token-metadata';

import { cleanQuery } from '../../helpers';
import { tokenToMarkdown } from '../../structured-content/formatters/token';
import type { TokenSchema } from '../../structured-content/types';

// Transform Token[] from token-metadata to TokenSchema[] format
function transformTokensToSchemas(): TokenSchema[] {
	return tokens.map((token) => ({
		contentType: 'token',
		name: token.name,
		path: token.path,
		description: token.description,
		exampleValue: String(token.exampleValue ?? ''),
	}));
}

export const getTokensInputSchema = z.object({
	terms: z
		.array(z.string())
		.default([])
		.describe(
			'An array of search terms to find tokens by name or description, eg. `["spacing", "inverted text", "background primary"]`. If empty or not provided, returns all tokens.',
		)
		.optional(),
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

export const listGetTokensTool = {
	name: 'ads_get_tokens',
	description: `Get Atlassian Design System tokens with optional search functionality.

- If search parameters are provided, searches for tokens matching the criteria.
- If no search parameters are provided, returns all tokens.

Example token usage:
\`\`\`tsx
import { token } from '@atlaskit/tokens';
const styles = css({ color: token('color.text'), padding: token('space.100') });
\`\`\``,
	annotations: {
		title: 'Get ADS tokens',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(getTokensInputSchema),
};

export const getTokensTool = async (
	params: z.infer<typeof getTokensInputSchema>,
): Promise<CallToolResult> => {
	const { terms = [], limit = 1, exactName = false } = params;
	const searchTerms = terms.filter(Boolean).map(cleanQuery);
	const tokenDocs = transformTokensToSchemas();

	// If no search terms provided, return all tokens formatted as Markdown
	if (searchTerms.length === 0) {
		const allTokensMarkdown = tokenDocs.map(tokenToMarkdown).join('\n\n');
		return {
			content: [
				{
					type: 'text',
					text: allTokensMarkdown,
				},
			],
		};
	}

	// Search logic (same as search-tokens)
	if (exactName) {
		// for each search term, search for the exact match
		const exactNameMatches = searchTerms
			.map((term) => {
				return tokenDocs.find((token) => token.name.toLowerCase() === term.toLowerCase());
			})
			.filter(Boolean) as TokenSchema[];

		if (exactNameMatches.length > 0) {
			const formattedTokens = exactNameMatches.map(tokenToMarkdown).join('\n\n');
			return {
				content: [
					{
						type: 'text',
						text: formattedTokens,
					},
				],
			};
		}
	}

	// use Fuse.js to fuzzy-search for the tokens
	const fuse = new Fuse(tokenDocs, {
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

	const matchedTokens = uniqueResults.map((result) => result.item);
	const formattedTokens = matchedTokens.map(tokenToMarkdown).join('\n\n');

	return {
		content: [
			{
				type: 'text',
				text: formattedTokens,
			},
		],
	};
};
