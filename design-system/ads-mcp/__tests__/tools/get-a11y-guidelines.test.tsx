import { getA11yGuidelinesTool } from '../../src/tools/get-a11y-guidelines';
import { accessibilityGuidelines } from '../../src/tools/get-a11y-guidelines/guidelines';

describe('ads_get_a11y_guidelines tool', () => {
	it('gives specific guidelines if a topic is provided', async () => {
		const topic = 'buttons';
		const result = await getA11yGuidelinesTool({ topic });

		expect(result).toEqual({
			content: [
				{
					type: 'text',
					text: JSON.stringify(
						{
							topic,
							...accessibilityGuidelines.buttons,
							additionalResources: [
								'https://atlassian.design/llms-a11y.txt - Complete ADS accessibility documentation',
								'https://atlassian.design/foundations/accessibility - ADS accessibility foundation',
								'https://www.w3.org/WAI/WCAG21/quickref/ - WCAG 2.1 guidelines',
							],
						},
						null,
						2,
					),
				},
			],
		});
	});

	it('provides all guidelines if no topic is provided', async () => {
		const result = await getA11yGuidelinesTool({});

		const expectedTopics = Object.keys(accessibilityGuidelines);

		expect(result).toEqual({
			content: [
				{
					type: 'text',
					text: JSON.stringify(
						{
							availableTopics: expectedTopics,
							message: 'Specify a topic to get detailed guidelines, or use "general" for overview',
							guidelines: accessibilityGuidelines,
							additionalResources: [
								'https://atlassian.design/llms-a11y.txt - Complete ADS accessibility documentation',
								'https://atlassian.design/foundations/accessibility - ADS accessibility foundation',
							],
						},
						null,
						2,
					),
				},
			],
		});
	});
});
