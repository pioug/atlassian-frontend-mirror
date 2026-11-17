import { z } from 'zod';

import { searchTermsSchema, type SearchTermsSchema } from '../../helpers/search-terms-schema';

export const searchAtlaskitUtilitiesInputSchema: z.ZodObject<
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
		'Required: one or more search terms (fuzzy over name, package, category, description, keywords, usageGuidelines). Example: `["debounce", "a11y", "storage"]`.',
	),
	limit: z.number().default(2).describe('Max matches **per term** (default 2).').optional(),
});
