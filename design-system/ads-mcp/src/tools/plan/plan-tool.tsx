/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

import { searchAtlaskitComponentsTool } from '../search-atlaskit-components/search-atlaskit-components-tool';
import { searchComponentsTool } from '../search-components/search-components-tool';
import { searchIconsTool } from '../search-icons/search-icons-tool';
import { searchTokensTool } from '../search-tokens/search-tokens-tool';

import type { planInputSchema } from './plan-input-schema';

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
