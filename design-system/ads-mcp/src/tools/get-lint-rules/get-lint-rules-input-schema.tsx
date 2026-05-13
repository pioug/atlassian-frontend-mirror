/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { z } from 'zod';

export const getLintRulesInputSchema: z.ZodObject<{
	terms: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, 'many'>>>;
	limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	exactName: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}> = z.object({
	terms: z
		.array(z.string())
		.default([])
		.describe(
			'Search terms matched against rule name, description, and docs body (fuzzy unless \`exactName\` is true). Example: `["icon-label", "xcss", "design token"]`. Omit or empty: return **all** rules as JSON.',
		)
		.optional(),
	limit: z
		.number()
		.default(1)
		.describe(
			'Max matches **per term** when searching (default 1). Not used when returning all rules.',
		)
		.optional(),
	exactName: z
		.boolean()
		.default(false)
		.describe(
			'If true, resolve each term by **exact** ESLint rule name (case-insensitive). If false, fuzzy search across name, description, and content.',
		)
		.optional(),
});
