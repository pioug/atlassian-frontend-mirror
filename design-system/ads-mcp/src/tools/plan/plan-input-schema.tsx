/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */

import { z } from 'zod';

import { searchTermsSchema, type SearchTermsSchema } from '../../helpers/search-terms-schema';

type SearchTerms = z.ZodDefault<SearchTermsSchema>;

type PlanInputShape = {
	tokens: SearchTerms;
	icons: SearchTerms;
	components: SearchTerms;
	atlaskitComponents: SearchTerms;
	limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
};

export const planInputSchema: z.ZodObject<PlanInputShape> = z.object({
	tokens: searchTermsSchema
		.default([])
		.describe(
			'A search term or array of terms for ADS design tokens (fuzzy by default). Omit or use `[]` if you only need icons or components. Prefer **at least two** terms per non-empty list when you know what you need.',
		),
	icons: searchTermsSchema
		.default([])
		.describe(
			'A search term or array of terms for ADS icons. Omit or use `[]` if you only need tokens or components. Prefer **at least two** terms per non-empty list when known.',
		),
	components: searchTermsSchema
		.default([])
		.describe(
			'A search term or array of terms for canonical ADS components. Omit or use `[]` if you only need tokens, icons, or explicit Atlaskit fallback research. Prefer **at least two** terms per non-empty list when known.',
		),
	atlaskitComponents: searchTermsSchema
		.default([])
		.describe(
			'A search term or array of terms for public `@atlaskit/*` components outside the ADS catalog. Use only as explicit fallback research when ADS component search is not enough; this is not auto-populated from `components`. Omit or use `[]` if you only need canonical ADS components. Prefer **at least two** terms per non-empty list when known.',
		),
	limit: z
		.number()
		.default(2)
		.describe(
			'Max matches **per term** for each non-empty list (default 2). Same limit applies to tokens, icons, ADS components, and explicit Atlaskit component fallback searches.',
		)
		.optional(),
});
