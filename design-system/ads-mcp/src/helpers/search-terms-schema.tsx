import { z } from 'zod';

type SearchTermsInputSchema = z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, 'many'>]>;

export type SearchTermsSchema = z.ZodEffects<SearchTermsInputSchema, string[], string | string[]>;

// Treat a scalar as one array entry; preserve existing array contents and order.
export const searchTermsSchema: SearchTermsSchema = z
	.union([z.string(), z.array(z.string())])
	.transform((terms) => (typeof terms === 'string' ? [terms] : terms));
