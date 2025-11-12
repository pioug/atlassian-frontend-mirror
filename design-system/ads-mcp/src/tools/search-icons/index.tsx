import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import Fuse from 'fuse.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { coreIconMetadata } from '@atlaskit/icon/metadata';

import { cleanQuery } from '../../helpers';

export const searchIconsInputSchema = z.object({
	terms: z
		.array(z.string())
		.describe(
			'An array of search terms to find icons by name, keywords, or categorization, eg. `["search", "folder", "user"]`',
		),
	limit: z
		.number()
		.default(1)
		.describe('Maximum number of results per search term in the array (default: 1)')
		.optional(),
	exactName: z
		.boolean()
		.default(false)
		.describe(
			'Enable to explicitly search icons by the exact name match (when you know the name, but need more details)',
		)
		.optional(),
});

const icons = Object.entries(coreIconMetadata)
	.map(([_key, icon]) => ({
		componentName: icon.componentName,
		package: icon.package,
		categorization: icon.categorization,
		keywords: icon.keywords,
		status: icon.status,
		usage: icon.usage,
		shouldRecommendSmallIcon: icon.shouldRecommendSmallIcon,
	}))
	.filter((icon) => icon.status === 'published');

type Icon = (typeof icons)[number];

export const listSearchIconsTool = {
	name: 'ads_search_icons',
	description: `Search for Atlassian Design System icons.

Example icon usage:
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
