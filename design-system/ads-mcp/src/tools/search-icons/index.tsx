import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import Fuse from 'fuse.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { coreIconMetadata } from '@atlaskit/icon/metadata';

import { cleanQuery } from '../../helpers';

const inputSchema = z.object({
	terms: z
		.array(z.string())
		.describe('Search term(s) to find icons by name, keywords, or categorization'),
	limit: z
		.number()
		.optional()
		.default(1)
		.describe('Maximum number of results per term to return (default: 1)'),
	exactName: z
		.boolean()
		.optional()
		.default(false)
		.describe('Whether to search for exact match only for the icon name'),
});

const icons = Object.entries(coreIconMetadata)
	.map(([_key, icon]) => ({
		componentName: icon.componentName,
		package: icon.package,
		categorization: icon.categorization,
		keywords: icon.keywords,
		status: icon.status,
		usage: icon.usage,
		type: icon.type,
		shouldRecommendSmallIcon: icon.shouldRecommendSmallIcon,
	}))
	.filter((icon) => icon.status === 'published');

type Icon = (typeof icons)[number];

export const listSearchIconsTool = {
	name: 'search_icons',
	description: `You SHOULD Search for Atlassian Design System icons based on multiple query strings (if there's multiple candidates of icon names, categorization or keywords, you SHOULD pass them in a single call). You SHOULD use default \`limit\` value of 1 first and only set a higher limit like 5 or 10 if you can't find the icon you need). Fallback to \`get_all_icons\` if nothing is found). This tool searches through component names, icon names, keywords, categorization, type and usage to find the most relevant design icons.

	The search will match against:
	- Icon component names (e.g., "AddIcon", "DeleteIcon", "EditIcon")
	- Icon keywords (descriptive terms associated with icons)
	- Icon categorization (e.g., "single-purpose", "multi-purpose", "utility")
	- Icon usage descriptions (usage guidelines for the icon)

	The results include the icon's component name, package path, and usage guidelines.

	Usage pattern for found icons:
	\`\`\`tsx
	import AddIcon from '@atlaskit/icon/core/add';

	// Usage in isolation
	<AddIcon label="Add" size="small" />

	// Usage with a button
	import Button from '@atlaskit/button/new';
	<Button iconAfter={AddIcon}>Create</Button>
	\`\`\`

	You SHOULD check proper usage (props, example usage, etc.) of the icon component using \`search_components\` tool.
	`,
	annotations: {
		title: 'Search ADS icons',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(inputSchema),
};

export const searchIconsTool = async (params: z.infer<typeof inputSchema>): Promise<CallToolResult> => {
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
		return arr.findIndex(r => r.item.componentName === result.item.componentName) === index;
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
