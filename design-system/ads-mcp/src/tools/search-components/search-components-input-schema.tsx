/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */

import { z } from 'zod';

import { searchTermsSchema, type SearchTermsSchema } from '../../helpers/search-terms-schema';

export const searchComponentsInputSchema: z.ZodObject<
	{
		terms: SearchTermsSchema;
		limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	},
	'strip',
	z.ZodTypeAny,
	{
		terms: string[];
		limit?: number | undefined;
	},
	{
		terms: string | string[];
		limit?: number | undefined;
	}
> = z.object({
	terms: searchTermsSchema.describe(
		'Required: one or more search terms (fuzzy over name, package, category, description, keywords, examples). Example: `["button", "modal", "select"]`.',
	),
	limit: z.number().default(2).describe('Max matches **per term** (default 2).').optional(),
});
