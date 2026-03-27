/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { z } from 'zod';

import { cleanQuery, zodToJsonSchema } from '../../helpers';
import { loadAllComponents } from '../get-all-components/load-all-components';
import type { ComponentMcpPayload } from '../get-all-components/types';

export const searchComponentsInputSchema: z.ZodObject<
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
			'Required: one or more search terms (fuzzy over name, package, category, description, examples). Example: `["button", "modal", "select"]`.',
		),
	limit: z.number().default(1).describe('Max matches **per term** (default 1).').optional(),
	exactName: z
		.boolean()
		.default(false)
		.describe(
			'If true, match each term to a component **name** only, case-insensitively. If false, fuzzy search.',
		)
		.optional(),
});

export const listSearchComponentsTool: Tool = {
	name: 'ads_search_components',
	description: `Searches the bundled Atlassian Design System (ADS) component catalog. Returns JSON objects with **name**, **package**, **examples**, and **props** for each match (trimmed payload).

WHEN TO USE:
**Selecting which ADS component to use**—package name, examples, and props—before implementation. Use when composing a new view or swapping a primitive.Prefer \`ads_plan\` when you also need token and icon discovery in one shot.

Requires non-empty \`terms\`.`,
	annotations: {
		title: 'Search ADS components',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchComponentsInputSchema),
};

// Clean component result to only return name, package name, example, and props
const cleanComponentResult = (result: ComponentMcpPayload) => {
	return {
		name: result.name,
		package: result.package,
		examples: result.examples,
		props: result.props,
	};
};

export const searchComponentsTool = async (
	params: z.infer<typeof searchComponentsInputSchema>,
): Promise<CallToolResult> => {
	const { terms, limit = 1, exactName = false } = params;
	const searchTerms = terms.filter(Boolean).map(cleanQuery);

	if (!searchTerms.length) {
		return {
			isError: true,
			content: [
				{
					type: 'text',
					text: `Error: Required parameter 'terms' is missing or empty`,
				},
			],
		};
	}

	const components: ComponentMcpPayload[] = loadAllComponents();

	if (exactName) {
		// for each search term, search for the exact match
		const exactNameMatches: ComponentMcpPayload[] = searchTerms
			.map((term) => {
				return components.find((component) => component.name.toLowerCase() === term.toLowerCase());
			})
			.filter(Boolean) as ComponentMcpPayload[];

		if (exactNameMatches.length > 0) {
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(exactNameMatches.map(cleanComponentResult)),
					},
				],
			};
		}
	}

	// use Fuse.js to fuzzy-search through the components
	const fuse = new Fuse(components, {
		keys: [
			{
				name: 'name',
				weight: 3,
			},
			{
				name: 'package',
				weight: 3,
			},
			{
				name: 'category',
				weight: 2,
			},
			{
				name: 'description',
				weight: 2,
			},
			{
				name: 'examples',
				weight: 1,
			},
		],
		threshold: 0.4,
	});

	// every search term, search for the results
	const results = searchTerms
		.map((term) => {
			// always search exact match from the components first
			const exactNameMatch = components.find(
				(component) => component.name.toLowerCase() === term.toLowerCase(),
			);
			if (exactNameMatch) {
				return [
					{
						item: exactNameMatch,
					},
				];
			}

			return fuse.search(term).slice(0, limit);
		})
		.flat();

	if (!results.length) {
		return {
			isError: true,
			content: [
				{
					type: 'text',
					text: `Error: No components found for '${terms.join(', ')}'. Available components: ${components.map((c) => c.name).join(', ')}`,
				},
			],
		};
	}

	// Remove duplicates based on component name
	const uniqueResults = results.filter((result, index, arr) => {
		return arr.findIndex((r) => r.item.name === result.item.name) === index;
	});

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(uniqueResults.map((result) => result.item).map(cleanComponentResult)),
			},
		],
	};
};
