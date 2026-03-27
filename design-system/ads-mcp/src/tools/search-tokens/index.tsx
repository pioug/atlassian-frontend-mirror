/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { z } from 'zod';

import { type Token, tokens } from '@atlaskit/tokens/token-metadata';

import { cleanQuery, zodToJsonSchema } from '../../helpers';

export const searchTokensInputSchema: z.ZodObject<
	{
		terms: z.ZodArray<z.ZodString, 'many'>;
		limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
		exactName: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	},
	'strip',
	z.ZodTypeAny,
	{
		terms: string[];
		limit?: number | undefined;
		exactName?: boolean | undefined;
	},
	{
		terms: string[];
		limit?: number | undefined;
		exactName?: boolean | undefined;
	}
> = z.object({
	terms: z
		.array(z.string())
		.describe(
			'Required: one or more terms; fuzzy match on token **name**, **description**, and **exampleValue**. Example: `["spacing", "color.text", "background"]`.',
		),
	limit: z.number().default(1).describe('Max matches **per term** (default 1).').optional(),
	exactName: z
		.boolean()
		.default(false)
		.describe(
			'If true, match each term to a token **name** only, case-insensitively. If false, fuzzy search.',
		)
		.optional(),
});

export const listSearchTokensTool: Tool = {
	name: 'ads_search_tokens',
	description: `Searches Atlassian Design System **design tokens** from bundled metadata. Returns JSON objects with **name** and **exampleValue** for each match (search also considers description in metadata).

WHEN TO USE:
**Styling or theming in code**—you need the right \`token('…')\` names for colors, space, typography, etc. Use during layout and visual work when tokens must match ADS. Prefer \`ads_plan\` when you also need icons and components in the same step.

Example:
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
