/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { z } from 'zod';

export const planInputSchema: z.ZodObject<
	{
		tokens: z.ZodArray<z.ZodString, 'many'>;
		icons: z.ZodArray<z.ZodString, 'many'>;
		components: z.ZodArray<z.ZodString, 'many'>;
		atlaskitComponents: z.ZodArray<z.ZodString, 'many'>;
		limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
	},
	'strip',
	z.ZodTypeAny,
	{
		tokens: string[];
		icons: string[];
		components: string[];
		atlaskitComponents: string[];
		limit?: number | undefined;
	},
	{
		tokens: string[];
		icons: string[];
		components: string[];
		atlaskitComponents: string[];
		limit?: number | undefined;
	}
> = z.object({
	tokens: z
		.array(z.string())
		.describe(
			'Search terms for ADS design tokens (fuzzy by default). Use `[]` if you only need icons or components. Prefer **at least two** terms per non-empty list when you know what you need.',
		),
	icons: z
		.array(z.string())
		.describe(
			'Search terms for ADS icons. Use `[]` if you only need tokens or components. Prefer **at least two** terms per non-empty list when known.',
		),
	components: z
		.array(z.string())
		.describe(
			'Search terms for canonical ADS components. Use `[]` if you only need tokens, icons, or explicit Atlaskit fallback research. Prefer **at least two** terms per non-empty list when known.',
		),
	atlaskitComponents: z
		.array(z.string())
		.describe(
			'Search terms for public `@atlaskit/*` components outside the ADS catalog. Use only as explicit fallback research when ADS component search is not enough; this is not auto-populated from `components`. Use `[]` if you only need canonical ADS components. Prefer **at least two** terms per non-empty list when known.',
		),
	limit: z
		.number()
		.default(2)
		.describe(
			'Max matches **per term** for each non-empty list (default 2). Same limit applies to tokens, icons, ADS components, and explicit Atlaskit component fallback searches.',
		)
		.optional(),
});
