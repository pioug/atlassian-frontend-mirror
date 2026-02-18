/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { z } from 'zod';

import { cleanQuery, zodToJsonSchema } from '../../helpers';

import {
	iconMcpStructuredContent,
	type IconStructuredContent,
} from './icon-mcp-structured-content.codegen';

export const getIconsInputSchema: z.ZodObject<
	{
		terms: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>>;
		limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
		exactName: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	},
	'strip',
	z.ZodTypeAny,
	{
		terms?: string[] | undefined;
		limit?: number | undefined;
		exactName?: boolean | undefined;
	},
	{
		terms?: string[] | undefined;
		limit?: number | undefined;
		exactName?: boolean | undefined;
	}
> = z.object({
	terms: z
		.array(z.string())
		.default([])
		.describe(
			'An array of search terms to find icons by name, keywords, or categorization, eg. `["search", "folder", "user"]`. If empty or not provided, returns all icons.',
		)
		.optional(),
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

export const listGetIconsTool: {
	name: string;
	description: string;
	annotations: {
		title: string;
		readOnlyHint: boolean;
		destructiveHint: boolean;
		idempotentHint: boolean;
		openWorldHint: boolean;
	};
	inputSchema: {
		[x: string]: unknown;
		type: 'object';
		properties?:
			| {
					[x: string]: unknown;
			  }
			| undefined;
		required?: string[] | undefined;
	};
} = {
	name: 'ads_get_icons',
	description: `Get Atlassian Design System icons with optional search functionality.

- If search parameters are provided, searches for icons matching the criteria.
- If no search parameters are provided, returns all icons.

Example icon usage:
\`\`\`tsx
import AddIcon from '@atlaskit/icon/core/add';
<AddIcon label="Add work item" size="small" />
\`\`\``,
	annotations: {
		title: 'Get ADS icons',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(getIconsInputSchema),
};

export const getIconsTool = async (
	params: z.infer<typeof getIconsInputSchema>,
): Promise<CallToolResult> => {
	const { terms = [], limit = 1, exactName = false } = params;
	const searchTerms = terms.filter(Boolean).map(cleanQuery);
	const iconDocs = iconMcpStructuredContent.filter(
		(icon: IconStructuredContent) => icon.status === 'published',
	);

	// If no search terms provided, return all icons as JSON array
	if (searchTerms.length === 0) {
		const payload = iconDocs.map((icon: IconStructuredContent) => icon.content);
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(payload),
				},
			],
		};
	}

	// Search logic (similar to search-icons)
	if (exactName) {
		// for each search term, search for the exact match
		const exactNameMatches = searchTerms
			.map((term) => {
				return iconDocs.find(
					(icon: IconStructuredContent) => icon.componentName.toLowerCase() === term.toLowerCase(),
				);
			})
			.filter((icon): icon is IconStructuredContent => icon !== undefined);

		// Return exact matches if found, or empty result if exactName is true
		const payload =
			exactNameMatches.length === 1
				? exactNameMatches[0].content
				: exactNameMatches.map((icon: IconStructuredContent) => icon.content);
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(payload),
				},
			],
		};
	}

	// use Fuse.js to fuzzy-search for the icons
	const fuse = new Fuse(iconDocs, {
		keys: [
			{
				name: 'componentName',
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
				name: 'usage',
				weight: 1,
			},
		],
		threshold: 0.4,
	});

	const results = searchTerms
		.map((term) => {
			// always search exact match from the icons
			const exactNameMatch = iconDocs.find(
				(icon: IconStructuredContent) => icon.componentName.toLowerCase() === term.toLowerCase(),
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

	// Remove duplicates based on componentName
	const uniqueResults = results.filter((result, index, arr) => {
		return (
			arr.findIndex(
				(r) =>
					(r.item as IconStructuredContent).componentName ===
					(result.item as IconStructuredContent).componentName,
			) === index
		);
	});

	const matchedIcons = uniqueResults.map((result) => result.item as IconStructuredContent);
	const payload =
		matchedIcons.length === 1
			? matchedIcons[0].content
			: matchedIcons.map((icon: IconStructuredContent) => icon.content);

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(payload),
			},
		],
	};
};
