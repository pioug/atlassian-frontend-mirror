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
			'Search terms matched against guideline keywords and body (fuzzy). Examples: `["empty state", "voice tone"]`, `["color tokens", "spacing"]`, `["elevation", "grid"]`. Omit or use an empty array to return **all** guidelines as Markdown.',
		)
		.optional(),
	limit: z
		.number()
		.default(1)
		.describe(
			'Max matches **per term** when `terms` is non-empty (default 1). Ignored when returning all guidelines.',
		)
		.optional(),
});

export const listGetGuidelinesTool: Tool = {
	name: 'ads_get_guidelines',
	description: `Returns Atlassian Design System (ADS) **foundations** guidelines as Markdown: the bundled design-system-docs foundations set (not component API docs).

TOPIC COVERAGE:
- **Content & UX writing**: messaging types (empty state, error, success, warning, info, feature discovery), voice and tone, inclusive language, grammar and style, date/time copy handoff, vocabulary pointers.
- **Visual foundations**: color (roles, accents, palette, charts, pickers), borders and radius, elevation and z-index, spacing and layout primitives (box/inline/stack), grid, iconography, logos.
- **Design tokens**: concepts, themes, migration, using tokens in code and in Figma.
- **Typography**: typefaces, scale, applying text styles and tokens.
- **Accessibility overview**: building accessible apps and related foundations pages bundled here.

When working with content, use this tool alongside the Context Engine MCP tool \`get_content_standards_docs\` for Atlassian-wide content standards (CDSTD/BAIT-style org guidance); this tool supplies ADS-specific foundations.

WHAT YOU GET:
- With \`terms\`: fuzzy search over keywords and content; concatenated Markdown for matches.
- Without \`terms\` (or empty): the full guideline set as Markdown.

WHEN TO USE:
Use this when you are **building or updating a visual interface**, **writing or reviewing user-facing copy**, or need to **answer foundations questions** about ADS: content patterns, visual appearance, design tokens, typography, spacing, color, grid, motion, and related topics shipped in this bundle.

It is **not** for picking a component’s props or package (use \`ads_plan\` / \`ads_search_components\`) or for interactive accessibility rules and patterns (use \`ads_get_a11y_guidelines\`, with Context Engine \`get_accessibility_docs\` for org-wide a11y standards).`,
	annotations: {
		title: 'Get ADS guidelines (content, a11y, visual design, design tokens, typography)',
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
