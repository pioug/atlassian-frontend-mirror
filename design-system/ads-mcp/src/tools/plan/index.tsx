import type { CallToolResult, Tool } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';
import { searchComponentsTool } from '../search-components';
import { searchIconsTool } from '../search-icons';
import { searchTokensTool } from '../search-tokens';

export const planInputSchema = z.object({
	tokens: z
		.array(z.string())
		.describe(
			'Array of terms to search for tokens, eg. `["spacing", "inverted text", "background primary"]`. Provide a minimum of 2 terms when known.',
		),
	icons: z
		.array(z.string())
		.describe(
			'Array of terms to search for icons, eg. `["search", "folder", "user"]`. Provide a minimum of 2 terms when known.',
		),
	components: z
		.array(z.string())
		.describe(
			'Array of terms to search for components, eg. `["button", "input", "select"]`. Provide a minimum of 2 terms when known.',
		),
	limit: z
		.number()
		.default(1)
		.describe('Maximum number of results per search term in the provided arrays (default: 1)')
		.optional(),
	exactName: z
		.boolean()
		.default(false)
		.describe(
			'Search tokens, icons, and components by their exact name match (use when you explicitly know the name and need more details)',
		)
		.optional(),
});

export const listPlanTool: Tool = {
	name: 'ads_plan',
	description: `Search how to use the Atlassian Design System offerings and get guidance on \`tokens\`, \`icons\`, and \`components\`.

YOU MUST ALWAYS call this tool with known parameters and include a minimum of 2 search terms per parameter when known, eg.
\`\`\`json
{
	"tokens": ["spacing", "inverted text", "background primary", "animation"],
	"icons": ["search", "folder", "user"],
	"components": ["button", "input", "select", "heading"]
}
\`\`\`

Please note, there may not be results for everything as there are minor gaps in offerings or how we describe them.

Example token usage:
\`\`\`tsx
import { token } from '@atlaskit/tokens';
const styles = css({ color: token('color.text'), padding: token('space.100') });
\`\`\`

Example icon usage:
\`\`\`tsx
import AddIcon from '@atlaskit/icon/core/add';
<AddIcon label="Add work item" size="small" />
\`\`\``,
	annotations: {
		title: 'Plan ADS resources',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(planInputSchema),
};

export const planTool = async (params: z.infer<typeof planInputSchema>) => {
	const {
		tokens: tokens_search,
		icons: icons_search,
		components: components_search,
		limit = 1,
		exactName = false,
	} = params;

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
			}),
		);
	}

	if (icons_search?.length) {
		searchPromises.push(
			searchIconsTool({ terms: icons_search, limit, exactName }).then((result) => {
				results.icons = result;
			}),
		);
	}

	if (components_search?.length) {
		searchPromises.push(
			searchComponentsTool({ terms: components_search, limit, exactName }).then((result) => {
				results.components = result;
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
