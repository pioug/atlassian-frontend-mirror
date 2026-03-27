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
		.describe(
			'Which bundled guide to return. Currently only `hardcoded-string-to-formatmessage` (JSX literals → `formatMessage` / intl patterns).',
		),
});

export const listI18nConversionTool: Tool = {
	name: 'ads_i18n_conversion_guide',
	description: `Returns a **bundled** step-by-step guide for replacing hardcoded UI strings with \`formatMessage\` (and related patterns) using @atlassian/jira-intl or react-intl-next: message constants, placeholders, descriptions, and scope/limitations for systematic refactors.

When working with i18n or hardcoded UI strings, use this tool alongside the Context Engine MCP tool \`get_i18n_docs\` for Atlassian-wide Traduki / i18n standards (message definition, extraction, pluralisation, formatting, workflow); this tool supplies the concrete hardcoded-string → \`formatMessage\` playbook bundled in ADS MCP.

WHEN TO USE / TYPICAL TRIGGERS:
- Refactoring JSX or TS literals to i18n; "fix hardcoded string(s)", "convert hardcoded string in [file]", "literal string in JSX".
- "Convert to i18n", "convert to formatMessage", "translate this string", "internationalize this string", "i18n this string".
- "Use formatMessage", "use FormattedMessage", "wrap in formatMessage", "fix literal string".
- ESLint: \`Literal string in JSX content should be internationalized. Use FormattedMessage or intl.formatMessage()\`.
- ESLint: \`@atlassian/i18n/no-literal-string-in-jsx\`.`,
	annotations: {
		title: 'i18n conversion guide',
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
