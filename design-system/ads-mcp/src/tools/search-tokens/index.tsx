/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { z } from 'zod';

import { type Token, tokens } from '@atlaskit/tokens/token-metadata';

import { cleanQuery, mergeMultiTermFuseResults, zodToJsonSchema } from '../../helpers';

export const searchTokensInputSchema: z.ZodObject<
	{
		terms: z.ZodArray<z.ZodString, 'many'>;
		limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	},
	'strip',
	z.ZodTypeAny,
	{
		terms: string[];
		limit?: number | undefined;
	},
	{
		terms: string[];
		limit?: number | undefined;
	}
> = z.object({
	terms: z
		.array(z.string())
		.describe(
			'Required: one or more terms; fuzzy match on token **name**, **description**, **exampleValue**, **usageGuidelines.usage**, and **usageGuidelines.cssProperties**. Example: `["spacing", "color.text", "background"]`.',
		),
	limit: z.number().default(2).describe('Max matches **per term** (default 2).').optional(),
});

export const listSearchTokensTool: Tool = {
	name: 'ads_search_tokens',
	description: `Searches Atlassian Design System **design tokens** from bundled metadata. Returns JSON objects with **name** and **exampleValue** for each match (search also considers description, usage guidelines, and CSS property hints in metadata).

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
