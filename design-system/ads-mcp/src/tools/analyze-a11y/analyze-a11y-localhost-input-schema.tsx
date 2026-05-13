import { z } from 'zod';

export const analyzeA11yLocalhostInputSchema: z.ZodObject<
	{
		url: z.ZodString;
		componentName: z.ZodOptional<z.ZodString>;
		context: z.ZodOptional<z.ZodString>;
		selector: z.ZodOptional<z.ZodString>;
	},
	'strip',
	z.ZodTypeAny,
	{
		url: string;
		componentName?: string | undefined;
		context?: string | undefined;
		selector?: string | undefined;
	},
	{
		url: string;
		componentName?: string | undefined;
		context?: string | undefined;
		selector?: string | undefined;
	}
> = z.object({
	url: z
		.string()
		.describe(
			'Fully qualified page URL to load (e.g. `http://localhost:9000` or a dev URL). Must be reachable from this MCP process.',
		),
	componentName: z
		.string()
		.optional()
		.describe('Optional label for reporting (e.g. feature or component under test).'),
	context: z
		.string()
		.optional()
		.describe('Optional: route, user flow, or feature context for the analyzed page.'),
	selector: z
		.string()
		.optional()
		.describe(
			'Optional CSS selector to scope axe analysis to a subtree (e.g. `#my-form`, `[data-testid="panel"]`). Omit to analyze the whole document.',
		),
});
