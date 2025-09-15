import { type CallToolResult } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { searchComponentsTool } from '../search-components';
import { searchIconsTool } from '../search-icons';
import { searchTokensTool } from '../search-tokens';

const inputSchema = z.object({
	tokens_search: z
		.array(z.string())
		.optional()
		.describe('Search terms to find tokens by name, description, or example values'),
	icons_search: z
		.array(z.string())
		.optional()
		.describe('Search terms to find icons by name, keywords, or categorization'),
	components_search: z
		.array(z.string())
		.optional()
		.describe('Search terms to find components by name, package name, description, or category'),
	limit: z
		.number()
		.optional()
		.default(1)
		.describe('Maximum number of results per term to return for each search type (default: 1)'),
	exactName: z
		.boolean()
		.optional()
		.default(false)
		.describe('Whether to search for exact match only for names'),
});

export const listPlanTool = {
	name: 'plan',
	description: `You SHOULD use this to plan and search for multiple Atlassian Design System resources in a single call when you need tokens, icons, and components for implementing a complete feature or UI pattern. You SHOULD use this tool instead of making separate calls to search_tokens, search_icons, and search_components when you need resources from multiple categories.

	You SHOULD use this tool when you need to find:
	- Multiple types of design system resources at once
	- Tokens, icons, and components for a specific feature or UI pattern
	- Complete design system resources for implementing a particular design

	The tool will execute searches for tokens, icons, and components in parallel and return consolidated results from all three APIs in a structured format.

	You SHOULD provide search terms for at least one category (tokens_search, icons_search, or components_search) but can include all three for comprehensive planning.

	Example usage:
	\`\`\`
	plan({
	tokens_search: ["color.text", "space.100"],
	icons_search: ["add", "edit"],
	components_search: ["Button", "TextField"]
	})
	\`\`\`
	`,
	annotations: {
		title: 'Plan ADS resources',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(inputSchema),
};

export const planTool = async (params: z.infer<typeof inputSchema>) => {
	const { tokens_search, icons_search, components_search, limit = 1, exactName = false } = params;

	// Validate that at least one search type is provided
	if (!tokens_search?.length && !icons_search?.length && !components_search?.length) {
		return {
			isError: true,
			content: [
				{
					type: 'text',
					text: 'Error: At least one search type (tokens_search, icons_search, or components_search) must be provided with search terms',
				},
			],
		};
	}

	const results: {
		tokens?: CallToolResult;
		icons?: CallToolResult;
		components?: CallToolResult;
	} = {};

	// Execute searches in parallel
	const searchPromises: Promise<void>[] = [];

	if (tokens_search?.length) {
		searchPromises.push(
			searchTokensTool({ terms: tokens_search, limit, exactName }).then((result) => {
				results.tokens = result;
			})
		);
	}

	if (icons_search?.length) {
		searchPromises.push(
			searchIconsTool({ terms: icons_search, limit, exactName }).then((result) => {
				results.icons = result;
			})
		);
	}

	if (components_search?.length) {
		searchPromises.push(
			searchComponentsTool({ terms: components_search, limit, exactName }).then((result) => {
				results.components = result;
			})
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
		},
		summary: {
			tokensFound: getResultCount(results.tokens),
			iconsFound: getResultCount(results.icons),
			componentsFound: getResultCount(results.components),
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
