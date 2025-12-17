import type { Tool } from '@modelcontextprotocol/sdk/types';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

import { accessibilityGuidelines } from './guidelines';

const topics = Object.keys(accessibilityGuidelines) as (keyof typeof accessibilityGuidelines)[];

export const getA11yGuidelinesInputSchema: z.ZodObject<{
    topic: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    topic?: string | undefined;
}, {
    topic?: string | undefined;
}> = z.object({
	topic: z
		.string()
		.optional()
		.describe('Select the topic to get the accessibility guidelines for: ' + topics.join(', ')),
});

export const listGetA11yGuidelinesTool: Tool = {
	name: 'ads_get_a11y_guidelines',
	description: 'Get accessibility guidelines and best practices from the Atlassian Design System.',
	annotations: {
		title: 'Get Accessibility Guidelines',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: true,
	},
	inputSchema: zodToJsonSchema(getA11yGuidelinesInputSchema),
};

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
