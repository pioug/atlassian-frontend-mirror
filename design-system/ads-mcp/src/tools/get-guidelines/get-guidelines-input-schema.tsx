import { z } from 'zod';

export const getGuidelinesInputSchema: z.ZodObject<{
	terms: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>>;
	limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}> = z.object({
	terms: z
		.array(z.string())
		.default([])
		.describe(
			'Search terms matched against guideline keywords and body (fuzzy). Examples: `["empty state", "voice tone"]`, `["color tokens", "spacing"]`, `["elevation", "grid"]`. Omit or use an empty array to return **all** guidelines as Markdown.',
		)
		.optional(),
	limit: z
		.number()
		.default(1)
		.describe(
			'Max matches **per term** when `terms` is non-empty (default 1). Ignored when returning all guidelines.',
		)
		.optional(),
});
