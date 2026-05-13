/* eslint-disable-next-line import/extensions -- MCP SDK requires .js extensions for ESM imports */
import { z } from 'zod';

export const suggestA11yFixesInputSchema: z.ZodObject<
	{
		violation: z.ZodString;
		code: z.ZodString;
		component: z.ZodOptional<z.ZodString>;
		context: z.ZodOptional<z.ZodString>;
	},
	'strip',
	z.ZodTypeAny,
	{
		code: string;
		violation: string;
		context?: string | undefined;
		component?: string | undefined;
	},
	{
		code: string;
		violation: string;
		context?: string | undefined;
		component?: string | undefined;
	}
> = z.object({
	violation: z
		.string()
		.describe(
			'Human-readable description of the issue (e.g. axe rule help text, "button has no accessible name", "missing alt"). Used to match curated recipes when possible; otherwise the tool falls back to generic guidance.',
		),
	code: z
		.string()
		.describe(
			'Snippet of the problematic code or markup so the response can be tailored (may be shown in the output for traceability).',
		),
	component: z
		.string()
		.optional()
		.describe(
			'Optional: React component name involved (e.g. `Button`, `TextField`)—may be ADS or app-specific.',
		),
	context: z
		.string()
		.optional()
		.describe('Optional: where this appears (e.g. modal, table row, page section) or constraints.'),
});
