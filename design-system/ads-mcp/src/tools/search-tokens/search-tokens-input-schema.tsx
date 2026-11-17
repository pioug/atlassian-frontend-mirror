/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */

import { z } from 'zod';

import { searchTermsSchema, type SearchTermsSchema } from '../../helpers/search-terms-schema';

export const searchTokensInputSchema: z.ZodObject<
	{
		terms: SearchTermsSchema;
		limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
		includeMetadata: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	},
	'strip',
	z.ZodTypeAny,
	{
		terms: string[];
		limit?: number | undefined;
		includeMetadata?: boolean | undefined;
	},
	{
		terms: string | string[];
		limit?: number | undefined;
		includeMetadata?: boolean | undefined;
	}
> = z.object({
	terms: searchTermsSchema.describe(
		'Required: one or more terms; fuzzy match on token **name**, **description**, **exampleValue**, **usageGuidelines.usage**, and **usageGuidelines.cssProperties**. Example: `["spacing", "color.text", "background"]`.',
	),
	limit: z.number().default(2).describe('Max matches **per term** (default 2).').optional(),
	includeMetadata: z
		.boolean()
		.default(false)
		.describe('Include the token description and usage guidelines in each result (default false).')
		.optional(),
});
