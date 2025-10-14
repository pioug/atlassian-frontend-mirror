import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { accessibilityFixes } from './fixes';
import { violationKeywords } from './keywords';

const inputSchema = z.object({
	violation: z.string().describe('Description of the accessibility violation'),
	code: z.string().describe('The problematic code that needs fixing'),
	component: z.string().optional().describe('Component name or type'),
	context: z.string().optional().describe('Additional context about the usage'),
});

export const listSuggestA11yFixesTool = {
	name: 'ads_suggest_a11y_fixes',
	description: `Suggests specific accessibility fixes using Atlassian Design System components and patterns.`,
	annotations: {
		title: 'Suggest Accessibility Fixes',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(inputSchema),
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

export const suggestA11yFixesTool = async (params: {
	violation: string;
	code: string;
	component?: string;
	context?: string;
}) => {
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
						recommendation: 'Try the get_a11y_guidelines tool for component-specific guidance',
					},
					null,
					2,
				),
			},
		],
	};
};
