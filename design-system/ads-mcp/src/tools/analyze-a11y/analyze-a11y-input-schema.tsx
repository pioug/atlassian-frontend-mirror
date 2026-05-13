import { z } from 'zod';

export const analyzeA11yInputSchema: z.ZodObject<
	{
		code: z.ZodString;
		componentName: z.ZodOptional<z.ZodString>;
		context: z.ZodOptional<z.ZodString>;
		includePatternAnalysis: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
	},
	'strip',
	z.ZodTypeAny,
	{
		code: string;
		componentName?: string | undefined;
		context?: string | undefined;
		includePatternAnalysis?: boolean | undefined;
	},
	{
		code: string;
		componentName?: string | undefined;
		context?: string | undefined;
		includePatternAnalysis?: boolean | undefined;
	}
> = z.object({
	code: z
		.string()
		.describe(
			'Source code of a React component or JSX snippet to analyze (string content only—no file path).',
		),
	componentName: z
		.string()
		.optional()
		.describe('Optional label for the component under review (for summaries and reports).'),
	context: z
		.string()
		.optional()
		.describe(
			'Optional: how the component is used (e.g. in a form, modal) to improve suggestions.',
		),
	includePatternAnalysis: z
		.boolean()
		.default(true)
		.describe(
			'When true (default), runs regex-based heuristics on the code string (e.g. unlabeled buttons, missing alt) in addition to other analysis.',
		)
		.optional(),
});
