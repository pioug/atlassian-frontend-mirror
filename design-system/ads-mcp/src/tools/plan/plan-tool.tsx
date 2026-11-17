/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { z } from 'zod';

import { validateToolArguments } from '../../helpers/validation';
import { searchAtlaskitComponentsTool } from '../search-atlaskit-components/search-atlaskit-components-tool';
import { searchComponentsTool } from '../search-components/search-components-tool';
import { searchIconsTool } from '../search-icons/search-icons-tool';
import { searchTokensTool } from '../search-tokens/search-tokens-tool';
import { planInputSchema } from './plan-input-schema';

const hasSearchTerms = (terms: string[]): boolean => terms.some((term) => term.trim().length > 0);

export const planTool = async (
	args: z.input<typeof planInputSchema>,
): Promise<
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
	const validation = validateToolArguments(planInputSchema, args);
	if (!validation.success) {
		return validation.error;
	}

	const {
		tokens: tokens_search,
		icons: icons_search,
		components: components_search,
		atlaskitComponents: atlaskit_components_search,
		limit,
	} = validation.data;
	// Require at least one category with a nonblank search term.
	if (
		!hasSearchTerms(tokens_search) &&
		!hasSearchTerms(icons_search) &&
		!hasSearchTerms(components_search) &&
		!hasSearchTerms(atlaskit_components_search)
	) {
		return {
			isError: true,
			content: [
				{
					type: 'text',
					text: 'Error: At least one search type (tokens, icons, components, or atlaskitComponents) must be provided with search terms',
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

	if (hasSearchTerms(tokens_search)) {
		searchPromises.push(
			searchTokensTool({ terms: tokens_search, limit }).then((result) => {
				results.tokens = result;
			}),
		);
	}

	if (hasSearchTerms(icons_search)) {
		searchPromises.push(
			searchIconsTool({ terms: icons_search, limit }).then((result) => {
				results.icons = result;
			}),
		);
	}

	if (hasSearchTerms(components_search)) {
		searchPromises.push(
			searchComponentsTool({ terms: components_search, limit }).then((result) => {
				results.components = result;
			}),
		);
	}

	if (hasSearchTerms(atlaskit_components_search)) {
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
