/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

import { accessibilityFixes } from './fixes';
import { violationKeywords } from './keywords';

export const suggestA11yFixesInputSchema: z.ZodObject<
	{
		violation: z.ZodString;
		code: z.ZodString;
		component: z.ZodOptional<z.ZodString>;
		context: z.ZodOptional<z.ZodString>;
	},
	'strip',
	z.ZodTypeAny,
	{
		code: string;
		violation: string;
		context?: string | undefined;
		component?: string | undefined;
	},
	{
		code: string;
		violation: string;
		context?: string | undefined;
		component?: string | undefined;
	}
> = z.object({
	violation: z
		.string()
		.describe(
			'Human-readable description of the issue (e.g. axe rule help text, "button has no accessible name", "missing alt"). Used to match curated recipes when possible; otherwise the tool falls back to generic guidance.',
		),
	code: z
		.string()
		.describe(
			'Snippet of the problematic code or markup so the response can be tailored (may be shown in the output for traceability).',
		),
	component: z
		.string()
		.optional()
		.describe(
			'Optional: React component name involved (e.g. `Button`, `TextField`)—may be ADS or app-specific.',
		),
	context: z
		.string()
		.optional()
		.describe('Optional: where this appears (e.g. modal, table row, page section) or constraints.'),
});

export const listSuggestA11yFixesTool: Tool = {
	name: 'ads_suggest_a11y_fixes',
	description: `Suggests remediation steps for an accessibility issue described in natural language (often pasted from **axe-core**, ESLint, or review).

WHAT YOU GET (varies by match):
- **Curated hit:** ADS-biased examples and patterns from this server’s recipe map (components, tokens, common fixes).
- **No strong match:** Generic guidance (e.g. “use ADS components”, labeling, testing)—still useful, but **not** guaranteed to be ADS-specific. May reference axe/atlassian.design resources.

WHEN TO USE:
After \`ads_analyze_a11y\` or \`ads_analyze_localhost_a11y\`, or whenever you have a violation string. For **topic-level** Atlassian Design System accessibility guidance, call \`ads_get_a11y_guidelines\` (this tool is fix-oriented, not a full guideline browse).

Does not replace manual testing with assistive technologies or keyboard-only navigation.`,
	annotations: {
		title: 'Suggest accessibility fixes',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(suggestA11yFixesInputSchema),
};

// Keyword mappings for fuzzy matching - imported from keywords.ts
// This allows flexible user input when describing accessibility violations

// Improved fuzzy matching function
function findBestMatchingFix(violation: string): [string, any] | null {
	const normalizedViolation = violation.toLowerCase();
	const violationWords = normalizedViolation.split(/\s+/);

	let bestMatch: [string, any] | null = null;
	let bestScore = 0;

	// Try exact match first
	for (const [key, fix] of Object.entries(accessibilityFixes)) {
		if (normalizedViolation === key.toLowerCase()) {
			return [key, fix];
		}
	}

	// Try keyword-based semantic matching
	for (const [key, fix] of Object.entries(accessibilityFixes)) {
		const keywords = violationKeywords[key] || [];
		let score = 0;

		// Score based on keyword matches
		for (const keyword of keywords) {
			if (normalizedViolation.includes(keyword.toLowerCase())) {
				score += 1;
			}
		}

		// Additional score for word matches
		for (const word of violationWords) {
			if (
				keywords.some(
					(keyword) => keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase()),
				)
			) {
				score += 0.5;
			}
		}

		// Boost score for exact key word matches
		if (
			normalizedViolation.includes(key.toLowerCase()) ||
			key.toLowerCase().includes(normalizedViolation)
		) {
			score += 2;
		}

		if (score > bestScore) {
			bestScore = score;
			bestMatch = [key, fix];
		}
	}

	// Return match if score is reasonable
	return bestScore >= 1 ? bestMatch : null;
}

export const suggestA11yFixesTool = async (
	params: z.infer<typeof suggestA11yFixesInputSchema>,
): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => {
	const { violation, component, context } = params;

	// Use improved matching logic
	const match = findBestMatchingFix(violation);

	if (match) {
		const [key, fix] = match;
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(
						{
							violation,
							matchedFixType: key,
							component,
							context,
							...fix,
							additionalResources: [
								'https://atlassian.design/llms-a11y.txt - Complete ADS accessibility documentation',
								'https://atlassian.design/foundations/accessibility - ADS accessibility foundation',
							],
							nextSteps: [
								'Apply the suggested fixes to your code',
								'Test the changes with screen readers',
								'Test with keyboard navigation',
								'Run automated accessibility tests',
							],
						},
						null,
						2,
					),
				},
			],
		};
	}

	// Enhanced fallback with better suggestions
	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(
					{
						violation,
						component,
						context,
						title: 'Accessibility Fix Suggestions',
						description:
							"We couldn't find a specific match for your violation, but here are general recommendations",
						searchedFor: violation,
						generalFixes: [
							{
								title: 'Use ADS Components',
								description: 'Replace custom implementations with ADS components',
								explanation:
									'ADS components are built with accessibility in mind and handle most common issues automatically',
							},
							{
								title: 'Add Proper Labels',
								description: 'Ensure all interactive elements have accessible labels',
								explanation: 'Use aria-label, VisuallyHidden, or proper label associations',
							},
							{
								title: 'Test with Assistive Technologies',
								description: 'Test with screen readers and keyboard navigation',
								explanation: 'Manual testing is essential for accessibility validation',
							},
						],
						availableFixTypes: Object.keys(accessibilityFixes),
						suggestions: [
							'Try describing the issue with keywords like: button, label, missing, text, color, contrast, focus, etc.',
							'Use axe-core violation IDs or descriptions directly',
							'Be more specific about the element type (button, input, image, etc.)',
						],
						additionalResources: [
							'https://atlassian.design/llms-a11y.txt - Complete ADS accessibility documentation',
							'https://atlassian.design/foundations/accessibility - ADS accessibility foundation',
						],
						recommendation: 'Try the ads_get_a11y_guidelines tool for component-specific guidance',
					},
					null,
					2,
				),
			},
		],
	};
};
