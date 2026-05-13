/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { type z } from 'zod';

import { cleanQuery, mergeMultiTermFuseResults } from '../../helpers';
import type { ComponentMcpPayload } from '../get-all-components/types';
import { atlaskitComponents } from '../get-atlaskit-components/atlaskit-components.codegen';

import type { searchAtlaskitComponentsInputSchema } from './search-atlaskit-components-input-schema';

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
