import { AxePuppeteer } from '@axe-core/puppeteer';
import axe from 'axe-core';
import puppeteer from 'puppeteer';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const inputSchema = z.object({
	code: z.string().describe('React component code to analyze for accessibility'),
	componentName: z.string().optional().describe('Name of the component being analyzed'),
	context: z.string().optional().describe('Additional context about the component usage'),
	includePatternAnalysis: z
		.boolean()
		.optional()
		.default(true)
		.describe('Include pattern-based analysis in addition to axe-core'),
});

export const listAnalyzeA11yTool = {
	name: 'ads_analyze_a11y',
	description: `Analyze React component code for accessibility violations using axe-core and intelligently generate Atlassian Design System specific suggestions. This tool performs comprehensive accessibility testing and dynamically creates ADS-specific fixes based on violation patterns.

Use this tool when:
- Reviewing component code for accessibility compliance
- Getting suggestions for improving accessibility
- Understanding how to use ADS components accessibly
- Identifying potential WCAG violations
- Running automated accessibility testing

The tool will analyze the code and provide:
- Comprehensive axe-core accessibility analysis results
- List of accessibility violations found (WCAG 2.1 AA compliant)
- Intelligently generated ADS-specific fix suggestions
- References to relevant fix patterns in llms-a11y.txt
- Code examples for implementing fixes
- Severity levels and impact assessment

Features:
- Uses axe-core for industry-standard accessibility testing
- Converts JSX to HTML for accurate analysis
- Intelligently maps violations to ADS-specific fixes
- References fix patterns from llms-a11y.txt documentation
- Includes fallback pattern analysis if axe-core fails
- Provides detailed violation descriptions and help text
- Dynamically generates fix suggestions based on violation type`,
	annotations: {
		title: 'Analyze Accessibility',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(inputSchema),
};

const urlInputSchema = z.object({
	url: z.string().describe('The URL to analyze for accessibility (e.g. http://localhost:9000)'),
	componentName: z.string().optional().describe('Name of the component being analyzed'),
	context: z.string().optional().describe('Additional context about the component usage'),
	selector: z
		.string()
		.optional()
		.describe(
			'CSS selector to target a specific element for analysis (e.g. "#my-form", ".component-class")',
		),
});

export const listAnalyzeLocalhostA11yTool = {
	name: 'ads_analyze_localhost_a11y',
	description: `Analyze a live web page (e.g. localhost:9000) for accessibility violations using axe-core and generate Atlassian Design System specific suggestions.

Use this tool to:
- Analyze running local dev servers or deployed URLs
- Get comprehensive accessibility reports for any web page
- Receive ADS-specific fix suggestions and code examples
- Target specific elements using CSS selectors for focused analysis

Parameters:
- url: The URL to analyze (must be accessible from the server)
- componentName: (optional) Name of the component/page
- context: (optional) Additional context about the usage
- selector: (optional) CSS selector to target a specific element (e.g. "#my-form", ".component-class")

Returns:
- Accessibility violations, suggestions, and ADS-specific fixes
- References to relevant fix patterns in llms-a11y.txt
- Code examples for implementing fixes
- Severity levels and impact assessment
`,
	annotations: {
		title: 'Analyze Localhost Accessibility',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(urlInputSchema),
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

export const analyzeA11yTool = async (params: {
	code: string;
	componentName?: string;
	context?: string;
	includePatternAnalysis?: boolean;
}) => {
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
	} catch (error) {
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

export const analyzeLocalhostA11yTool = async (params: {
	url: string;
	componentName?: string;
	context?: string;
	selector?: string;
}) => {
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
