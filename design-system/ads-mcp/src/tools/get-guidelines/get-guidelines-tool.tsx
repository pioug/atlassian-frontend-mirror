/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import Fuse from 'fuse.js';
import { type z } from 'zod';

import { cleanQuery } from '../../helpers/clean-query';

import { type getGuidelinesInputSchema } from './get-guidelines-input-schema';
import {
	guidelinesStructuredContent,
	type GuidelineStructuredContent,
} from './guidelines-structured-content.codegen';

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
