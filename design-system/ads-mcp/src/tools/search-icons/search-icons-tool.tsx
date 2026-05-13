/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { type z } from 'zod';

import { mergeMultiTermFuseResults } from '../../helpers';
import { cleanQuery } from '../../helpers/clean-query';
import { icons } from '../get-all-icons/icons';

import { type searchIconsInputSchema } from './search-icons-input-schema';

type Icon = (typeof icons)[number];
const buildIconResult = (icon: Icon) => ({
	componentName: icon.componentName,
	package: icon.package,
	usage: icon.usage,
});

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
