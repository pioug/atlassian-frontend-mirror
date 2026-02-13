/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { zodToJsonSchema } from '../../helpers';

import { i18nConversionGuide } from './guide';

export const i18nConversionInputSchema: z.ZodObject<
	{
		guide: z.ZodEnum<['hardcoded-string-to-formatmessage']>;
	},
	'strip',
	z.ZodTypeAny,
	{
		guide: 'hardcoded-string-to-formatmessage';
	},
	{
		guide: 'hardcoded-string-to-formatmessage';
	}
> = z.object({
	guide: z
		.enum(['hardcoded-string-to-formatmessage'])
		.describe('The i18n conversion guide to retrieve.'),
});

export const listI18nConversionTool: Tool = {
	name: 'ads_i18n_conversion_guide',
	description: `Provides comprehensive guide for converting hardcoded strings to use formatMessage from @atlassian/jira-intl or react-intl-next.

**TRIGGER**: Use this tool when you encounter:
- "fix hardcoded string" / "fix hardcoded strings" / "fix hardcoded string in [file]"
- "convert hardcoded string" / "convert to i18n" / "convert to formatMessage"
- "translate string" / "internationalize string" / "i18n this string"
- "use formatMessage" / "use FormattedMessage" / "wrap in formatMessage"
- "literal string" / "fix literal string" / "convert literal string"
- ESLint errors: "Literal string in JSX content should be internationalized. Use FormattedMessage or intl.formatMessage()"
- ESLint errors: "@atlassian/i18n/no-literal-string-in-jsx"
- Requests to convert hardcoded strings to i18n messages

This tool helps LLM agents systematically convert hardcoded strings while respecting scope limitations and following best practices for message constants, placeholders, and descriptions.`,
	annotations: {
		title: 'i18n Conversion Guide',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: false,
	},
	inputSchema: zodToJsonSchema(i18nConversionInputSchema),
};

export const i18nConversionTool: (_params: z.infer<typeof i18nConversionInputSchema>) => Promise<{
	content: {
		type: string;
		text: string;
	}[];
}> = async (_params: z.infer<typeof i18nConversionInputSchema>) => {
	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(i18nConversionGuide, null, 2),
			},
		],
	};
};
