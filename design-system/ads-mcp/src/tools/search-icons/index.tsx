/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { z } from 'zod';

import { cleanQuery, zodToJsonSchema } from '../../helpers';
import { icons } from '../get-all-icons/icons';

export const searchIconsInputSchema: z.ZodObject<
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
			'Required: one or more terms; fuzzy match on component name, icon name, keywords, categorization, etc. Example: `["search", "folder", "user"]`.',
		),
	limit: z.number().default(1).describe('Max matches **per term** (default 1).').optional(),
	exactName: z
		.boolean()
		.default(false)
		.describe(
			'If true, match each term to an icon **componentName** only, case-insensitively. If false, fuzzy search.',
		)
		.optional(),
});

type Icon = (typeof icons)[number];

export const listSearchIconsTool: Tool = {
	name: 'ads_search_icons',
	description: `Searches the bundled Atlassian Design System **icon** catalog. Returns JSON with **componentName**, **package**, and **usage** for each match.

WHEN TO USE:
**Choosing an icon** for a control, nav item, empty state, or illustration—find \`@atlaskit/icon\` import paths and usage notes. Prefer \`ads_plan\` when you also need tokens and components together.

Example:
\`\`\`tsx
import AddIcon from '@atlaskit/icon/core/add';
<AddIcon label="Add work item" size="small" />
\`\`\``,
	annotations: {
		title: 'Search ADS icons',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(searchIconsInputSchema),
};

export const searchIconsTool = async (
	params: z.infer<typeof searchIconsInputSchema>,
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

	if (exactName) {
		// for each search term, search for the exact match
		const exactNameMatches = searchTerms
			.map((term) => {
				return icons.find((icon) => icon.componentName.toLowerCase() === term.toLowerCase());
			})
			.filter(Boolean) as Icon[];

		if (exactNameMatches.length > 0) {
			return {
				content: [
					{
						type: 'text',
						text: JSON.stringify(exactNameMatches),
					},
				],
			};
		}
	}

	// use Fuse.js to fuzzy-search through the icons
	const fuse = new Fuse(icons, {
		keys: [
			{
				name: 'componentName',
				weight: 3,
			},
			{
				name: 'iconName',
				weight: 3,
			},
			{
				name: 'keywords',
				weight: 2,
			},
			{
				name: 'categorization',
				weight: 1,
			},
			{
				name: 'type',
				weight: 1,
			},
			{
				name: 'usage',
				weight: 1,
			},
		],
		threshold: 0.4,
	});

	// every search term, search for the results
	const results = searchTerms
		.map((term) => {
			// always search exact match from the icons
			const exactNameMatch = icons.find(
				(icon) => icon.componentName.toLowerCase() === term.toLowerCase(),
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
					text: `Error: No icons found for '${terms.join(', ')}'. Available icons: ${icons.map((i) => i.componentName).join(', ')}`,
				},
			],
		};
	}

	// Remove duplicates based on componentName
	const uniqueResults = results.filter((result, index, arr) => {
		return arr.findIndex((r) => r.item.componentName === result.item.componentName) === index;
	});

	const matchedIcons = uniqueResults.map((result) => {
		return {
			componentName: result.item.componentName,
			package: result.item.package,
			usage: result.item.usage,
		};
	});
	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(matchedIcons),
			},
		],
	};
};
