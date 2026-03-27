/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

import { accessibilityGuidelines } from './guidelines';

const topics = Object.keys(accessibilityGuidelines) as (keyof typeof accessibilityGuidelines)[];

export const getA11yGuidelinesInputSchema: z.ZodObject<
	{
		topic: z.ZodOptional<z.ZodString>;
	},
	'strip',
	z.ZodTypeAny,
	{
		topic?: string | undefined;
	},
	{
		topic?: string | undefined;
	}
> = z.object({
	topic: z
		.string()
		.optional()
		.describe(
			'ADS accessibility topic key. Omit to receive all topics and the full guideline bundle. Pass a valid key (see response \`availableTopics\`) or \`general\` for a focused overview when supported. Known topics: ' +
				topics.join(', ') +
				'.',
		),
});

export const listGetA11yGuidelinesTool: Tool = {
	name: 'ads_get_a11y_guidelines',
	description: `Returns Atlassian Design System (ADS) accessibility guidance: best practices and patterns for buttons, interactions, color contrast, forms, and other design-system topics shipped in this tool.

Use this alongside the Context Engine MCP tool \`get_accessibility_docs\` for Atlassian-wide accessibility standards (e.g. A11YKB); this tool supplies ADS-specific component and pattern guidance.

WHEN TO USE:
You MUST call this when generating or substantially changing a new interactive or visual user interface built with ADS, or when you need topic-specific ADS guidance (e.g. focus, forms, motion).

DO NOT rely on generic web accessibility advice alone—ADS conventions may differ. Use \`get_accessibility_docs\` for org-wide standards and this tool for ADS-topic guidance.`,
	annotations: {
		title: 'Get ADS accessibility guidelines',
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
