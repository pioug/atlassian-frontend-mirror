/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { z } from 'zod';

export const searchIconsInputSchema: z.ZodObject<
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
			'Required: one or more terms; fuzzy match on icon **componentName**, **iconName**, **keywords**, **categorization**, **type**, and **usage**. Example: `["search", "folder", "user"]`.',
		),
	limit: z.number().default(2).describe('Max matches **per term** (default 2).').optional(),
});
