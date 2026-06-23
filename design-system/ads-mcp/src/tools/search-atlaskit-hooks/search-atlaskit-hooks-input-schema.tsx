import { z } from 'zod';

export const searchAtlaskitHooksInputSchema: z.ZodObject<
	{
		terms: z.ZodArray<z.ZodString, 'many'>;
		limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	},
	'strip',
	z.ZodTypeAny,
	{
		terms: string[];
		limit?: number | undefined;
	},
	{
		terms: string[];
		limit?: number | undefined;
	}
> = z.object({
	terms: z
		.array(z.string())
		.describe(
			'Required: one or more search terms (fuzzy over name, package, category, description, keywords, usageGuidelines). Example: `["analytics", "storage", "layering"]`.',
		),
	limit: z.number().default(2).describe('Max matches **per term** (default 2).').optional(),
});
