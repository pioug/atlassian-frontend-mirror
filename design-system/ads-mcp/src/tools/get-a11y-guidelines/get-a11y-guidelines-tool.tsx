/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { type z } from 'zod';

import { type getA11yGuidelinesInputSchema } from './get-a11y-guidelines-input-schema';
import { accessibilityGuidelines } from './guidelines';

const topics = Object.keys(accessibilityGuidelines) as (keyof typeof accessibilityGuidelines)[];

export const getA11yGuidelinesTool = async ({
	topic,
}: z.infer<typeof getA11yGuidelinesInputSchema>): Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> => {
	if (topic && accessibilityGuidelines[topic as keyof typeof accessibilityGuidelines]) {
		const guidelines = accessibilityGuidelines[topic as keyof typeof accessibilityGuidelines];
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(
						{
							topic,
							...guidelines,
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
		};
	}

	// Return all guidelines if no specific topic requested
	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(
					{
						availableTopics: topics,
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
	};
};
