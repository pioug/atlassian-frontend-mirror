/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';
import { searchAtlaskitComponentsTool } from '../search-atlaskit-components';
import { searchComponentsTool } from '../search-components';
import { searchIconsTool } from '../search-icons';
import { searchTokensTool } from '../search-tokens';

export const planInputSchema: z.ZodObject<
	{
		tokens: z.ZodArray<z.ZodString, 'many'>;
		icons: z.ZodArray<z.ZodString, 'many'>;
		components: z.ZodArray<z.ZodString, 'many'>;
		atlaskitComponents: z.ZodArray<z.ZodString, 'many'>;
		limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	},
	'strip',
	z.ZodTypeAny,
	{
		tokens: string[];
		icons: string[];
		components: string[];
		atlaskitComponents: string[];
		limit?: number | undefined;
	},
	{
		tokens: string[];
		icons: string[];
		components: string[];
		atlaskitComponents: string[];
		limit?: number | undefined;
	}
> = z.object({
	tokens: z
		.array(z.string())
		.describe(
			'Search terms for ADS design tokens (fuzzy by default). Use `[]` if you only need icons or components. Prefer **at least two** terms per non-empty list when you know what you need.',
		),
	icons: z
		.array(z.string())
		.describe(
			'Search terms for ADS icons. Use `[]` if you only need tokens or components. Prefer **at least two** terms per non-empty list when known.',
		),
	components: z
		.array(z.string())
		.describe(
			'Search terms for ADS components. Use `[]` if you only need tokens or icons. Prefer **at least two** terms per non-empty list when known.',
		),
	atlaskitComponents: z
		.array(z.string())
		.describe(
			'Search terms for Atlaskit components. Use `[]` if you only need core ADS components. Prefer **at least two** terms per non-empty list when known.',
		),
	limit: z
		.number()
		.default(2)
		.describe(
			'Max matches **per term** for each non-empty list (default 2). Same limit applies to tokens, icons, and both ADS and atlaskit component searches.',
		)
		.optional(),
});

export const listPlanTool: Tool = {
	name: 'ads_plan',
	description: `Runs **ads_search_tokens**, **ads_search_icons**, **ads_search_components**, and **ads_search_atlaskit_components** in one call and returns a single JSON payload (each section only if that list was non-empty). Use this as the default way to discover ADS **tokens**, **icons**, and **components** (including legacy/broader Atlaskit) for a UI task.

WHEN TO USE:
**Implementing or iterating on a UI**—new screen, feature, or polish—and you need candidate **token** names, **icon** imports, and **component** packages/props in one pass. Also use when exploring ADS building blocks before you write code.

At least one of \`tokens\`, \`icons\`, \`components\`, or \`atlaskitComponents\` must contain search terms (use \`[]\` for lists you do not need).

Prefer supplying **multiple** terms per non-empty array when you know them—broader queries improve recall. Some queries return no rows where metadata is thin; try alternate wording.

This is equivalent to calling the individual search tools; there are no extra merge semantics beyond concatenating results.

Example request:
\`\`\`json
{
	"tokens": ["spacing", "inverted text", "background primary", "animation"],
	"icons": ["search", "folder", "user"],
	"components": ["button", "input", "select", "heading"],
	"atlaskitComponents": ["inline-dialog", "onboarding", "page-layout"]
}
\`\`\`

Example token usage:
\`\`\`tsx
import { token } from '@atlaskit/tokens';
const styles = css({ color: token('color.text'), padding: token('space.100') });
\`\`\`

Example icon usage:
\`\`\`tsx
import AddIcon from '@atlaskit/icon/core/add';
<AddIcon label="Add work item" size="small" />
\`\`\``,
	annotations: {
		title: 'Search ADS tokens, icons, and components to plan what to build',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(planInputSchema),
};

export const planTool = async ({
	tokens: tokens_search,
	icons: icons_search,
	components: components_search,
	atlaskitComponents: atlaskit_components_search,
	limit,
}: z.infer<typeof planInputSchema>): Promise<
	| {
			isError: boolean;
			content: {
				type: string;
				text: string;
			}[];
	  }
	| {
			content: {
				type: string;
				text: string;
			}[];
			isError?: undefined;
	  }
> => {
	// Validate that at least one search type is provided
	if (
		!tokens_search?.length &&
		!icons_search?.length &&
		!components_search?.length &&
		!atlaskit_components_search?.length
	) {
		return {
			isError: true,
			content: [
				{
					type: 'text',
					text: 'Error: At least one search type (tokens_search, icons_search, components_search, or atlaskit_components_search) must be provided with search terms',
				},
			],
		};
	}

	const results: {
		tokens?: CallToolResult;
		icons?: CallToolResult;
		components?: CallToolResult;
		atlaskitComponents?: CallToolResult;
	} = {};

	// Execute searches in parallel
	const searchPromises: Promise<void>[] = [];

	if (tokens_search?.length) {
		searchPromises.push(
			searchTokensTool({ terms: tokens_search, limit }).then((result) => {
				results.tokens = result;
			}),
		);
	}

	if (icons_search?.length) {
		searchPromises.push(
			searchIconsTool({ terms: icons_search, limit }).then((result) => {
				results.icons = result;
			}),
		);
	}

	if (components_search?.length) {
		searchPromises.push(
			searchComponentsTool({ terms: components_search, limit }).then((result) => {
				results.components = result;
			}),
		);
	}

	if (atlaskit_components_search?.length) {
		searchPromises.push(
			searchAtlaskitComponentsTool({ terms: atlaskit_components_search, limit }).then((result) => {
				results.atlaskitComponents = result;
			}),
		);
	}

	// Wait for all searches to complete
	await Promise.all(searchPromises);

	// Helper function to safely count results
	const getResultCount = (result?: CallToolResult): number => {
		if (!result || result.isError || !result.content?.[0]) {
			return 0;
		}

		const firstContent = result.content[0];
		if (firstContent.type !== 'text') {
			return 0;
		}

		try {
			const parsed = JSON.parse(firstContent.text);
			return Array.isArray(parsed) ? parsed.length : 0;
		} catch {
			return 0;
		}
	};

	// Format the consolidated results
	const consolidatedResult = {
		searchResults: {
			...(results.tokens && { tokens: results.tokens }),
			...(results.icons && { icons: results.icons }),
			...(results.components && { components: results.components }),
			...(results.atlaskitComponents && { atlaskitComponents: results.atlaskitComponents }),
		},
		summary: {
			tokensFound: getResultCount(results.tokens),
			iconsFound: getResultCount(results.icons),
			componentsFound: getResultCount(results.components),
			atlaskitComponentsFound: getResultCount(results.atlaskitComponents),
		},
	};

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(consolidatedResult, null, 2),
			},
		],
	};
};
