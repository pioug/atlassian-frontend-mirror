import axe from 'axe-core';
import { type z } from 'zod';

import { type analyzeA11yInputSchema } from './analyze-a11y-input-schema';
import { generateADSFixForViolation } from './generate-ads-fix-for-violation';

const accessibilityPatterns = [
	{
		pattern: /<button[^>]*>(?!.*aria-label|.*>.*<\/button>)/g,
		violation: 'Button without accessible text',
		severity: 'error',
		suggestion:
			'Use the ads_suggest_a11y_fixes tool for ADS Button solutions. Describe the issue as "button missing label", "empty button", or "button needs text".',
	},
	{
		pattern: /<img[^>]*>(?!.*alt=)/g,
		violation: 'Image without alt text',
		severity: 'error',
		suggestion:
			'Use the ads_suggest_a11y_fixes tool for ADS Image solutions. Describe the issue as "image missing alt", "missing alt text", or "image accessibility".',
	},
	{
		pattern: /<div[^>]*onClick[^>]*>/g,
		violation: 'Clickable div without accessibility',
		severity: 'warning',
		suggestion:
			'Use the ads_suggest_a11y_fixes tool for ADS solutions. Describe the issue as "clickable div", "interactive div", or "div with click handler".',
	},
	{
		pattern: /color:\s*['"]#[0-9a-fA-F]{3,6}['"]/g,
		violation: 'Hardcoded color values',
		severity: 'warning',
		suggestion:
			'Use the ads_suggest_a11y_fixes tool for design token solutions. Describe the issue as "hardcoded colors", "hex colors", or "design tokens".',
	},
	{
		pattern: /<input[^>]*>(?!.*id=)/g,
		violation: 'Input without associated label',
		severity: 'error',
		suggestion:
			'Use the ads_suggest_a11y_fixes tool for ADS form solutions. Describe the issue as "input missing label", "form field without label", or "unlabeled input".',
	},
	{
		pattern: /<div[^>]*role="button"[^>]*>/g,
		violation: 'Custom button without full accessibility',
		severity: 'warning',
		suggestion:
			'Use the ads_suggest_a11y_fixes tool for ADS Button/Focusable solutions. Describe the issue as "custom button", "div with button role", or "interactive element".',
	},
	{
		pattern: /style=\{[^}]*color[^}]*\}/g,
		violation: 'Inline color styles',
		severity: 'warning',
		suggestion:
			'Use the ads_suggest_a11y_fixes tool for design token solutions. Describe the issue as "inline styles", "hardcoded colors", or "color tokens".',
	},
];
const adsGuidelines = {
	buttons: {
		title: 'Button Accessibility',
		guidelines: [
			'Always provide accessible labels for buttons',
			'Use Button component for standard interactions',
			'Use Focusable component for custom interactive elements',
			'Avoid disabled buttons with tooltips',
			'Ensure focus indicators are visible',
		],
	},
	forms: {
		title: 'Form Accessibility',
		guidelines: [
			'Use TextField component for consistent labeling',
			'Associate labels with inputs using id and htmlFor',
			'Provide clear error messages with aria-describedby',
			'Use MessageWrapper for form validation announcements',
		],
	},
	images: {
		title: 'Image Accessibility',
		guidelines: [
			'Use Image component with proper alt text',
			'Keep alt text under 125 characters',
			'Leave alt="" for decorative images',
			'Describe the purpose, not just the content',
		],
	},
	colors: {
		title: 'Color and Contrast',
		guidelines: [
			'Use design tokens for consistent contrast ratios',
			'Never rely on color alone for information',
			'Use color.text tokens for proper contrast',
			'Test with high contrast mode',
		],
	},
};
function mapAxeViolationsToADSFixes(violations: any[]): any[] {
	return violations.map((violation) => {
		const adsFix = generateADSFixForViolation(violation);
		return {
			...violation,
			type: adsFix.title, // Use the specific fix key that matches fixes.ts
			adsFix,
			severity:
				violation.impact === 'critical' || violation.impact === 'serious' ? 'error' : 'warning',
		};
	});
}

export const analyzeA11yTool = async (
	params: z.infer<typeof analyzeA11yInputSchema>,
): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => {
	const { code, componentName, context, includePatternAnalysis = true } = params;
	const violations: any[] = [];
	const suggestions: any[] = [];
	const axeResults: any = {};

	try {
		// Run axe-core analysis
		const results = await axe.run({ fromFrames: ['iframe', 'html'] });

		// Process axe-core results
		if (results.violations && results.violations.length > 0) {
			const adsViolations = mapAxeViolationsToADSFixes(results.violations);
			violations.push(...adsViolations);

			axeResults.violations = results.violations;
			axeResults.passes = results.passes;
			axeResults.incomplete = results.incomplete;
		}

		// Include pattern-based analysis if requested
		if (includePatternAnalysis) {
			accessibilityPatterns.forEach((pattern) => {
				const matches = code.match(pattern.pattern);
				if (matches) {
					violations.push({
						type: pattern.violation,
						severity: pattern.severity,
						count: matches.length,
						suggestion: pattern.suggestion,
						adsFix: 'Use the ads_suggest_a11y_fixes tool for specific ADS component solutions',
						example: 'The ads_suggest_a11y_fixes tool provides detailed code examples',
						source: 'pattern-analysis',
					});
				}
			});
		}

		// Generate ADS-specific suggestions
		if (violations.length > 0) {
			suggestions.push({
				title: 'Accessibility Improvements Needed',
				description: `Found ${violations.length} accessibility issues in your code.`,
				violations,
				nextSteps: [
					'Review each violation and apply the suggested fixes',
					'Use ADS components instead of custom implementations',
					'Test with screen readers and keyboard navigation',
					'Run automated accessibility tests',
				],
			});
		}

		// Provide relevant ADS guidelines
		const relevantGuidelines = [];
		if (code.includes('button') || code.includes('onClick')) {
			relevantGuidelines.push(adsGuidelines.buttons);
		}
		if (code.includes('input') || code.includes('form')) {
			relevantGuidelines.push(adsGuidelines.forms);
		}
		if (code.includes('img') || code.includes('image')) {
			relevantGuidelines.push(adsGuidelines.images);
		}
		if (code.includes('color') || code.includes('style')) {
			relevantGuidelines.push(adsGuidelines.colors);
		}

		// Generate summary
		const summary = {
			componentName: componentName || 'Unknown component',
			totalViolations: violations.length,
			severityBreakdown: {
				error: violations.filter((v) => v.severity === 'error').length,
				warning: violations.filter((v) => v.severity === 'warning').length,
			},
			context: context || 'No additional context provided',
			axeResults: {
				violations: axeResults.violations?.length || 0,
				passes: axeResults.passes?.length || 0,
				incomplete: axeResults.incomplete?.length || 0,
			},
		};

		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(
						{
							summary,
							violations,
							suggestions,
							relevantGuidelines,
							axeResults,
							recommendations: [
								'Use ADS components for better accessibility out of the box',
								'Reference https://atlassian.design/llms-a11y.txt for detailed guidelines',
								'Test with keyboard navigation and screen readers',
								'Use automated accessibility testing tools',
							],
						},
						null,
						2,
					),
				},
			],
		};
	} catch {
		// Fallback to pattern-based analysis if axe-core fails
		// console.warn('Axe-core analysis failed, falling back to pattern analysis:', error);

		// Run pattern analysis as fallback
		accessibilityPatterns.forEach((pattern) => {
			const matches = code.match(pattern.pattern);
			if (matches) {
				violations.push({
					type: pattern.violation,
					severity: pattern.severity,
					count: matches.length,
					suggestion: pattern.suggestion,
					adsFix: 'Use the ads_suggest_a11y_fixes tool for specific ADS component solutions',
					example: 'The ads_suggest_a11y_fixes tool provides detailed code examples',
					source: 'pattern-analysis-fallback',
				});
			}
		});

		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(
						{
							summary: {
								componentName: componentName || 'Unknown component',
								totalViolations: violations.length,
								severityBreakdown: {
									error: violations.filter((v) => v.severity === 'error').length,
									warning: violations.filter((v) => v.severity === 'warning').length,
								},
								context: context || 'No additional context provided',
								note: 'Analysis completed using pattern matching (axe-core analysis failed)',
							},
							violations,
							suggestions:
								violations.length > 0
									? [
											{
												title: 'Accessibility Improvements Needed',
												description: `Found ${violations.length} accessibility issues in your code.`,
												violations,
												nextSteps: [
													'Review each violation and apply the suggested fixes',
													'Use ADS components instead of custom implementations',
													'Test with screen readers and keyboard navigation',
													'Run automated accessibility tests',
												],
											},
										]
									: [],
							error: 'Axe-core analysis failed, used pattern-based analysis as fallback',
							recommendations: [
								'Use ADS components for better accessibility out of the box',
								'Reference https://atlassian.design/llms-a11y.txt for detailed guidelines',
								'Test with keyboard navigation and screen readers',
								'Use automated accessibility testing tools',
							],
						},
						null,
						2,
					),
				},
			],
		};
	}
};
