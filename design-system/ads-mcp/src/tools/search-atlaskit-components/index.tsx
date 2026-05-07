/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { z } from 'zod';

import { cleanQuery, mergeMultiTermFuseResults, zodToJsonSchema } from '../../helpers';
import type { ComponentMcpPayload } from '../get-all-components/types';
import { atlaskitComponents } from '../get-atlaskit-components/atlaskit-components.codegen';

export const searchAtlaskitComponentsInputSchema: z.ZodObject<
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
			'Required: one or more search terms (fuzzy over name, package, category, description, keywords, examples). Example: `["button", "modal", "select"]`.',
		),
	limit: z.number().default(2).describe('Max matches **per term** (default 2).').optional(),
});

export const listSearchAtlaskitComponentsTool: Tool = {
	name: 'atlaskit_search_components',
	description: `Searches the bundled Atlaskit component catalog. Returns JSON objects with **name**, **package**, **examples**, and **props** for each match (trimmed payload).

WHEN TO USE:
**Selecting which Atlaskit component to use**—package name, examples, and props—before implementation. Use when searching for specific Atlaskit components that might not be in the core ADS catalog.`,
	annotations: {
		title: 'Search Atlaskit components',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchAtlaskitComponentsInputSchema),
};

const buildComponentResult = (result: ComponentMcpPayload) => {
	return {
		name: result.name,
		package: result.package,
		examples: result.examples,
		props: result.props,
	};
};

export const searchAtlaskitComponentsTool = async ({
	terms,
	limit = 2,
}: z.infer<typeof searchAtlaskitComponentsInputSchema>): Promise<CallToolResult> => {
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

	const components: ComponentMcpPayload[] = atlaskitComponents;

	const fuse = new Fuse(components, {
		keys: [
			{ name: 'name', weight: 5 },
			{ name: 'package', weight: 3 },
			{ name: 'category', weight: 2 },
			{ name: 'description', weight: 2 },
			{ name: 'keywords', weight: 2 },
			{ name: 'usageGuidelines', weight: 2 },
			{ name: 'contentGuidelines', weight: 1 },
			{ name: 'accessibilityGuidelines', weight: 1 },
			{ name: 'examples', weight: 1 },
		],
		threshold: 0.4,
		distance: 80,
		minMatchCharLength: 3,
		ignoreFieldNorm: true,
		includeScore: true,
	});

	const matchedItems = mergeMultiTermFuseResults<ComponentMcpPayload>({
		searchTerms,
		limit,
		search: (query: string) => fuse.search(query, { limit: limit * searchTerms.length }),
	});

	if (!matchedItems.length) {
		return {
			content: [
				{
					type: 'text',
					text: `Error: No Atlaskit components found for '${terms.join(', ')}'.`,
				},
			],
		};
	}

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(matchedItems.map(buildComponentResult)),
			},
		],
	};
};
