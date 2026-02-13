/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { z } from 'zod';

import { cleanQuery, zodToJsonSchema } from '../../helpers';

import {
	tokenStructuredContent,
	type TokenStructuredContent,
} from './token-structured-content.codegen';

export const getTokensInputSchema: z.ZodObject<
	{
		terms: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>>;
		limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
		exactName: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	},
	'strip',
	z.ZodTypeAny,
	{
		terms?: string[] | undefined;
		limit?: number | undefined;
		exactName?: boolean | undefined;
	},
	{
		terms?: string[] | undefined;
		limit?: number | undefined;
		exactName?: boolean | undefined;
	}
> = z.object({
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

export const listGetTokensTool: {
	name: string;
	description: string;
	annotations: {
		title: string;
		readOnlyHint: boolean;
		destructiveHint: boolean;
		idempotentHint: boolean;
		openWorldHint: boolean;
	};
	inputSchema: {
		[x: string]: unknown;
		type: 'object';
		properties?:
			| {
					[x: string]: unknown;
			  }
			| undefined;
		required?: string[] | undefined;
	};
} = {
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
	const tokenDocs = tokenStructuredContent;

	// If no search terms provided, return all tokens formatted as Markdown
	if (searchTerms.length === 0) {
		const allTokensMarkdown = tokenDocs
			.map((token: TokenStructuredContent) => token.content)
			.join('\n\n');
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
				return tokenDocs.find(
					(token: TokenStructuredContent) => token.name.toLowerCase() === term.toLowerCase(),
				);
			})
			.filter((token): token is TokenStructuredContent => token !== undefined);

		if (exactNameMatches.length > 0) {
			const formattedTokens = exactNameMatches
				.map((token: TokenStructuredContent) => token.content)
				.join('\n\n');
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
		return (
			arr.findIndex(
				(r) =>
					(r.item as TokenStructuredContent).name === (result.item as TokenStructuredContent).name,
			) === index
		);
	});

	const matchedTokens = uniqueResults.map((result) => result.item as TokenStructuredContent);
	const formattedTokens = matchedTokens
		.map((token: TokenStructuredContent) => token.content)
		.join('\n\n');

	return {
		content: [
			{
				type: 'text',
				text: formattedTokens,
			},
		],
	};
};
