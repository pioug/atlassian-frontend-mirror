/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import type { z } from 'zod';

import { i18nConversionGuide } from './guide';
import type { i18nConversionInputSchema } from './i18n-conversion-input-schema';

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
