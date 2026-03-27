import { AxePuppeteer } from '@axe-core/puppeteer';
/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import axe from 'axe-core';
import puppeteer from 'puppeteer';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

export const analyzeA11yInputSchema: z.ZodObject<
	{
		code: z.ZodString;
		componentName: z.ZodOptional<z.ZodString>;
		context: z.ZodOptional<z.ZodString>;
		includePatternAnalysis: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	},
	'strip',
	z.ZodTypeAny,
	{
		code: string;
		componentName?: string | undefined;
		context?: string | undefined;
		includePatternAnalysis?: boolean | undefined;
	},
	{
		code: string;
		componentName?: string | undefined;
		context?: string | undefined;
		includePatternAnalysis?: boolean | undefined;
	}
> = z.object({
	code: z
		.string()
		.describe(
			'Source code of a React component or JSX snippet to analyze (string content only—no file path).',
		),
	componentName: z
		.string()
		.optional()
		.describe('Optional label for the component under review (for summaries and reports).'),
	context: z
		.string()
		.optional()
		.describe(
			'Optional: how the component is used (e.g. in a form, modal) to improve suggestions.',
		),
	includePatternAnalysis: z
		.boolean()
		.default(true)
		.describe(
			'When true (default), runs regex-based heuristics on the code string (e.g. unlabeled buttons, missing alt) in addition to other analysis.',
		)
		.optional(),
});

export const listAnalyzeA11yTool: Tool = {
	name: 'ads_analyze_a11y',
	description: `Analyzes a **string of React/JSX** code for likely accessibility issues (heuristics and/or axe-related paths) and returns hints that often **point to** \`ads_suggest_a11y_fixes\` or generic axe/WCAG-style context—not every finding maps to a specific ADS component fix.

WHEN TO USE:
You have component source as text and want automated checks or heuristics before or during a code review.

LIMITATIONS:
- Does not replace testing in a real browser with assistive technologies or full keyboard traversal.
- For rendered UI, \`ads_analyze_localhost_a11y\` (live URL + axe) is preferable when available—it is **only exposed when this MCP runs locally**, not in the remote MCP deployment.`,
	annotations: {
		title: 'Analyze accessibility (code string)',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(analyzeA11yInputSchema),
};

export const analyzeA11yLocalhostInputSchema: z.ZodObject<
	{
		url: z.ZodString;
		componentName: z.ZodOptional<z.ZodString>;
		context: z.ZodOptional<z.ZodString>;
		selector: z.ZodOptional<z.ZodString>;
	},
	'strip',
	z.ZodTypeAny,
	{
		url: string;
		componentName?: string | undefined;
		context?: string | undefined;
		selector?: string | undefined;
	},
	{
		url: string;
		componentName?: string | undefined;
		context?: string | undefined;
		selector?: string | undefined;
	}
> = z.object({
	url: z
		.string()
		.describe(
			'Fully qualified page URL to load (e.g. `http://localhost:9000` or a dev URL). Must be reachable from this MCP process.',
		),
	componentName: z
		.string()
		.optional()
		.describe('Optional label for reporting (e.g. feature or component under test).'),
	context: z
		.string()
		.optional()
		.describe('Optional: route, user flow, or feature context for the analyzed page.'),
	selector: z
		.string()
		.optional()
		.describe(
			'Optional CSS selector to scope axe analysis to a subtree (e.g. `#my-form`, `[data-testid="panel"]`). Omit to analyze the whole document.',
		),
});

export const listAnalyzeLocalhostA11yTool: Tool = {
	name: 'ads_analyze_localhost_a11y',
	description: `Loads a **live URL** in a headless browser, runs **axe-core**, and returns violations with follow-up hints (often suggesting \`ads_suggest_a11y_fixes\`). Output is anchored in **axe** rule text; remediation may be generic or ADS-biased depending on the violation.

**Availability:** This tool is only registered when the ADS MCP runs **on your machine** (local MCP). It is **not** available in the **remote** MCP offering—use \`ads_analyze_a11y\` on source text there instead.

WHEN TO USE:
You have a running app or storybook page and need automated accessibility results on **rendered** UI—especially local or staging URLs.

LIMITATIONS:
- Does not replace manual testing with assistive technologies or keyboard-only navigation.
- Requires network access to the URL from the environment running the MCP.`,
	annotations: {
		title: 'Analyze accessibility (live URL)',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(analyzeA11yLocalhostInputSchema),
};

// Common accessibility patterns to detect in code
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

// ADS accessibility guidelines reference
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

// Helper function to map axe-core violations to ADS-specific fixes
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

// Helper function to provide ADS-specific guidance for axe-core violations
function generateADSFixForViolation(violation: any): any {
	const { id, description, help, tags } = violation;

	// Provide general guidance without trying to map to specific fixes.ts keys
	const adsFix = `Use the ads_suggest_a11y_fixes tool to get specific ADS component solutions. Describe the issue using the violation details: "${help}" or in your own words (e.g., "button has no text", "missing alt text", "form field needs label").`;

	return {
		title: help, // Use axe-core's human-readable description
		description: description,
		adsFix,
		example:
			'The ads_suggest_a11y_fixes tool provides detailed code examples and ADS component solutions',
		violationId: id,
		axeHelp: help,
		tags,
		wcagTags: tags.filter((tag: string) => tag.startsWith('wcag')), // Extract WCAG compliance info
		reference: `https://atlassian.design/llms-a11y.txt`,
		recommendations: [
			'Use ADS components for better accessibility out of the box',
			'Reference the ads_suggest_a11y_fixes tool for specific solutions',
			'Test with keyboard navigation and screen readers',
			'Use automated accessibility testing tools',
		],
	};
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

export const analyzeLocalhostA11yTool = async (
	params: z.infer<typeof analyzeA11yLocalhostInputSchema>,
): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => {
	const { url, componentName, context, selector } = params;
	const violations: any[] = [];
	const suggestions: any[] = [];
	const axeResults: any = {};

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	try {
		await page.goto(url, { waitUntil: 'networkidle0' });

		// If a selector is provided, check if the element exists
		if (selector) {
			const elementExists = await page.$(selector);
			if (!elementExists) {
				// Get list of available elements with IDs for helpful error message
				const availableElements = await page.evaluate(() => {
					const elements = Array.from(document.querySelectorAll('[id]'));
					return elements.map((el) => `#${el.id}`);
				});

				throw new Error(
					`Element with selector "${selector}" not found on the page after waiting. Available elements: ${availableElements.join(', ')}`,
				);
			}
		}

		// Run axe-core accessibility analysis
		const axePuppeteer = new AxePuppeteer(page);

		// If selector is provided, analyze only that element
		if (selector) {
			axePuppeteer.include(selector);
		}

		const results = await axePuppeteer.analyze();
		if (results.violations && results.violations.length > 0) {
			const adsViolations = mapAxeViolationsToADSFixes(results.violations);
			violations.push(...adsViolations);
			axeResults.violations = results.violations;
			axeResults.passes = results.passes;
			axeResults.incomplete = results.incomplete;
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
		if (url.includes('button') || url.includes('onClick')) {
			relevantGuidelines.push(adsGuidelines.buttons);
		}
		if (url.includes('input') || url.includes('form')) {
			relevantGuidelines.push(adsGuidelines.forms);
		}
		if (url.includes('img') || url.includes('image')) {
			relevantGuidelines.push(adsGuidelines.images);
		}
		if (url.includes('color') || url.includes('style')) {
			relevantGuidelines.push(adsGuidelines.colors);
		}

		// Generate summary
		const summary = {
			url,
			selector: selector || 'Entire page analyzed',
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

		await browser.close();
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
	} catch (error) {
		await browser.close();
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(
						{
							summary: {
								url,
								selector: selector || 'Entire page analyzed',
								componentName: componentName || 'Unknown component',
								totalViolations: violations.length,
								severityBreakdown: {
									error: violations.filter((v) => v.severity === 'error').length,
									warning: violations.filter((v) => v.severity === 'warning').length,
								},
								context: context || 'No additional context provided',
								note: 'Analysis failed to run on the provided URL',
							},
							violations,
							suggestions: [],
							error: String(error),
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
