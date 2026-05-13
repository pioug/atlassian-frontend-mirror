/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { z } from 'zod';

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
