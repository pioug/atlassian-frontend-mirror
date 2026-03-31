/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { z } from 'zod';

import { cleanQuery, mergeMultiTermFuseResults, zodToJsonSchema } from '../../helpers';
import { icons } from '../get-all-icons/icons';

export const searchIconsInputSchema: z.ZodObject<
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
			'Required: one or more terms; fuzzy match on icon **componentName**, **iconName**, **keywords**, **categorization**, **type**, and **usage**. Example: `["search", "folder", "user"]`.',
		),
	limit: z.number().default(2).describe('Max matches **per term** (default 2).').optional(),
});

type Icon = (typeof icons)[number];

const buildIconResult = (icon: Icon) => ({
	componentName: icon.componentName,
	package: icon.package,
	usage: icon.usage,
});

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

export const searchIconsTool = async ({
	terms,
	limit = 2,
}: z.infer<typeof searchIconsInputSchema>): Promise<CallToolResult> => {
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

	const fuse = new Fuse(icons, {
		keys: [
			{ name: 'componentName', weight: 5 },
			{ name: 'iconName', weight: 3 },
			{ name: 'keywords', weight: 2 },
			{ name: 'categorization', weight: 2 },
			{ name: 'type', weight: 1 },
			{ name: 'usage', weight: 2 },
		],
		threshold: 0.4,
		distance: 80,
		minMatchCharLength: 3,
		ignoreFieldNorm: true,
		includeScore: true,
	});

	const matchedItems = mergeMultiTermFuseResults<Icon>({
		searchTerms,
		limit,
		search: (query: string) => fuse.search(query, { limit: limit * searchTerms.length }),
		tokenKey: (icon) => icon.componentName,
	});

	if (!matchedItems.length) {
		return {
			content: [
				{
					type: 'text',
					text: `Error: No icons found for '${terms.join(', ')}'. Available icons: ${icons.map((i) => i.componentName).join(', ')}`,
				},
			],
		};
	}

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(matchedItems.map(buildIconResult)),
			},
		],
	};
};
