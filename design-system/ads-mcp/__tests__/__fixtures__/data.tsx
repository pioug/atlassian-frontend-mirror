type TestDataCase = [
	description: string,
	{
		tool: string;
		args: Record<string, any>;
		expectedLength: number;
		expectedFirstResult: any;
	},
];

export const testData: TestDataCase[] = [
	[
		'the analyze a11y tool with an a11y violation',
		{
			tool: 'ads_analyze_a11y',
			args: {
				code: '<button></button>',
			},
			expectedLength: 1,
			expectedFirstResult: {
				error: 'Axe-core analysis failed, used pattern-based analysis as fallback',
				recommendations: [
					'Use ADS components for better accessibility out of the box',
					'Reference https://atlassian.design/llms-a11y.txt for detailed guidelines',
					'Test with keyboard navigation and screen readers',
					'Use automated accessibility testing tools',
				],
				suggestions: [
					{
						description: 'Found 1 accessibility issues in your code.',
						nextSteps: [
							'Review each violation and apply the suggested fixes',
							'Use ADS components instead of custom implementations',
							'Test with screen readers and keyboard navigation',
							'Run automated accessibility tests',
						],
						title: 'Accessibility Improvements Needed',
						violations: [
							{
								adsFix: 'Use the ads_suggest_a11y_fixes tool for specific ADS component solutions',
								count: 1,
								example: 'The ads_suggest_a11y_fixes tool provides detailed code examples',
								severity: 'error',
								source: 'pattern-analysis-fallback',
								suggestion:
									'Use the ads_suggest_a11y_fixes tool for ADS Button solutions. Describe the issue as "button missing label", "empty button", or "button needs text".',
								type: 'Button without accessible text',
							},
						],
					},
				],
				summary: {
					componentName: 'Unknown component',
					context: 'No additional context provided',
					note: 'Analysis completed using pattern matching (axe-core analysis failed)',
					severityBreakdown: {
						error: 1,
						warning: 0,
					},
					totalViolations: 1,
				},
				violations: [
					{
						adsFix: 'Use the ads_suggest_a11y_fixes tool for specific ADS component solutions',
						count: 1,
						example: 'The ads_suggest_a11y_fixes tool provides detailed code examples',
						severity: 'error',
						source: 'pattern-analysis-fallback',
						suggestion:
							'Use the ads_suggest_a11y_fixes tool for ADS Button solutions. Describe the issue as "button missing label", "empty button", or "button needs text".',
						type: 'Button without accessible text',
					},
				],
			},
		},
	],
	[
		'the a11y guidelines tool with a specific topic',
		{
			tool: 'ads_get_a11y_guidelines',
			args: {
				topic: 'buttons',
			},
			expectedLength: 1,
			expectedFirstResult: {
				additionalResources: [
					'https://atlassian.design/llms-a11y.txt - Complete ADS accessibility documentation',
					'https://atlassian.design/foundations/accessibility - ADS accessibility foundation',
					'https://www.w3.org/WAI/WCAG21/quickref/ - WCAG 2.1 guidelines',
				],
				title: 'Button and Interactive Element Accessibility',
				topic: 'buttons',
				description: 'Guidelines for making buttons and interactive elements accessible',
				guidelines: [
					'Always provide accessible labels for buttons',
					'Use Button component for standard interactions',
					'Use Focusable component for custom interactive elements',
					'Avoid disabled buttons with tooltips',
					'Ensure focus indicators are visible',
					'Support keyboard navigation (Enter, Space)',
					'Use descriptive labels that explain the action',
				],
				codeExamples: [
					{
						title: 'Accessible Button with Icon',
						code: "import { Button } from '@atlaskit/button';\nimport { VisuallyHidden } from '@atlaskit/visually-hidden';\n\n<Button aria-label=\"Close dialog\" onClick={handleClose}>\n  <CloseIcon />\n</Button>",
					},
					{
						title: 'Custom Interactive Element',
						code: 'import { Focusable } from \'@atlaskit/primitives/compiled\';\n\n<Focusable as="div" onClick={handleClick} onKeyDown={handleKeyDown}>\n  Interactive content\n</Focusable>',
					},
				],
				bestPractices: [
					'Never disable buttons without providing alternatives',
					'Use VisuallyHidden for screen reader text',
					'Test with keyboard navigation only',
					'Ensure focus indicators meet contrast requirements',
				],
			},
		},
	],
	[
		'the plan tool with multiple search types',
		{
			tool: 'ads_plan',
			args: {
				tokens: ['spacing', 'color'],
				icons: ['add', 'close'],
				components: ['button', 'input'],
				limit: 1,
			},
			expectedLength: 1,
			expectedFirstResult: {
				searchResults: expect.objectContaining({
					tokens: expect.objectContaining({
						content: expect.arrayContaining([
							expect.objectContaining({
								type: 'text',
								text: expect.any(String),
							}),
						]),
					}),
					icons: expect.objectContaining({
						content: expect.arrayContaining([
							expect.objectContaining({
								type: 'text',
								text: expect.any(String),
							}),
						]),
					}),
					components: expect.objectContaining({
						content: expect.arrayContaining([
							expect.objectContaining({
								type: 'text',
								text: expect.any(String),
							}),
						]),
					}),
				}),
				summary: expect.objectContaining({
					tokensFound: expect.any(Number),
					iconsFound: expect.any(Number),
					componentsFound: expect.any(Number),
				}),
			},
		},
	],
	[
		'the suggest a11y fixes tool with a violation with a violation and some example code',
		{
			tool: 'ads_suggest_a11y_fixes',
			args: {
				violation: 'button missing label',
				code: '<button onclick="handleClick()">Click</button>',
			},
			expectedLength: 1,
			expectedFirstResult: {
				additionalResources: [
					'https://atlassian.design/llms-a11y.txt - Complete ADS accessibility documentation',
					'https://atlassian.design/foundations/accessibility - ADS accessibility foundation',
				],
				bestPractices: [
					'Always provide descriptive labels',
					'Use aria-label for icon-only buttons',
					'Use VisuallyHidden for additional context',
					'Test with screen readers',
				],
				description: 'Buttons need accessible labels for screen readers',
				fixes: [
					{
						after:
							'import { Button } from \'@atlaskit/button\';\n\n<Button aria-label=\"Close dialog\" onClick={handleClose}>\n  <CloseIcon />\n</Button>',
						before: '<button onClick={handleClose}>\n  <CloseIcon />\n</button>',
						description: 'Add aria-label for icon-only buttons',
						explanation:
							'The aria-label provides a text description for screen readers while keeping the visual design clean.',
						title: 'Use aria-label prop',
					},
					{
						after:
							"import { Button } from '@atlaskit/button';\nimport { VisuallyHidden } from '@atlaskit/visually-hidden';\n\n<Button onClick={handleSave}>\n  <SaveIcon />\n  <VisuallyHidden>Save changes</VisuallyHidden>\n</Button>",
						before: '<button onClick={handleSave}>\n  <SaveIcon />\n</button>',
						description: 'Add screen reader text while keeping visual design',
						explanation:
							'VisuallyHidden makes text available to screen readers but hides it visually.',
						title: 'Use VisuallyHidden component',
					},
				],
				matchedFixType: 'button missing label',
				nextSteps: [
					'Apply the suggested fixes to your code',
					'Test the changes with screen readers',
					'Test with keyboard navigation',
					'Run automated accessibility tests',
				],
				title: 'Button Missing Accessible Label',
				violation: 'button missing label',
			},
		},
	],
];
