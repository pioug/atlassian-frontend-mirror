/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { z } from 'zod';

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
