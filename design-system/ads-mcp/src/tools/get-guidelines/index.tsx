/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { z } from 'zod';

import { cleanQuery, zodToJsonSchema } from '../../helpers';

import {
	guidelinesStructuredContent,
	type GuidelineStructuredContent,
} from './guidelines-structured-content.codegen';

export const getGuidelinesInputSchema: z.ZodObject<{
	terms: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>>;
	limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}> = z.object({
	terms: z
		.array(z.string())
		.default([])
		.describe(
			'An array of search terms to find content guidelines by keywords or content, eg. `["messages", "empty state", "voice tone"]`. If empty or not provided, returns all guidelines.',
		)
		.optional(),
	limit: z
		.number()
		.default(1)
		.describe('Maximum number of results per search term in the array (default: 1)')
		.optional(),
});

export const listGetGuidelinesTool: Tool = {
	name: 'ads_get_guidelines',
	description: `Get Atlassian Design System content guidelines (foundations content) with optional search functionality.

- If search parameters are provided, searches for guidelines matching the criteria by keywords or content.
- If no search parameters are provided, returns all guidelines.

Example: use this tool to look up content guidance for designing messages, voice and tone, date and time, inclusive writing, or language and grammar.`,
	annotations: {
		title: 'Get ADS guidelines',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(getGuidelinesInputSchema),
};

export const getGuidelinesTool = async (
	params: z.infer<typeof getGuidelinesInputSchema>,
): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => {
	const { terms = [], limit = 1 } = params;
	const searchTerms = terms.filter(Boolean).map(cleanQuery);
	const guidelineDocs = guidelinesStructuredContent;

	// If no search terms provided, return all guidelines formatted as Markdown
	if (searchTerms.length === 0) {
		const allGuidelinesMarkdown = guidelineDocs
			.map((guideline: GuidelineStructuredContent) => guideline.content)
			.join('\n\n');
		return {
			content: [
				{
					type: 'text',
					text: allGuidelinesMarkdown,
				},
			],
		};
	}

	// Use Fuse.js to fuzzy-search by keywords and content
	const fuse = new Fuse(guidelineDocs, {
		keys: [
			{
				name: 'keywords',
				weight: 3,
			},
			{
				name: 'content',
				weight: 1,
			},
		],
		threshold: 0.4,
	});

	const results = searchTerms.map((term) => fuse.search(term).slice(0, limit)).flat();

	// Remove duplicates by content (same guideline can match multiple terms)
	const seen = new Set<string>();
	const uniqueResults = results.filter((result) => {
		const text = (result.item as GuidelineStructuredContent).content;
		if (seen.has(text)) {
			return false;
		}
		seen.add(text);
		return true;
	});

	const matchedGuidelines = uniqueResults.map(
		(result) => result.item as GuidelineStructuredContent,
	);
	const formattedGuidelines = matchedGuidelines
		.map((guideline: GuidelineStructuredContent) => guideline.content)
		.join('\n\n');

	return {
		content: [
			{
				type: 'text',
				text: formattedGuidelines,
			},
		],
	};
};
