import { AxePuppeteer } from '@axe-core/puppeteer';
import puppeteer from 'puppeteer';
import { type z } from 'zod';

import { type analyzeA11yLocalhostInputSchema } from './analyze-a11y-localhost-input-schema';
import { generateADSFixForViolation } from './generate-ads-fix-for-violation';

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
