/**
 * Zod schemas for the Agentic Forge v0.9 catalog
 * (`com.atlassian.agentic-forge/v0_9/v1`).
 *
 * `ResultPanel` is a completed result: a heading and a summary. Both values
 * are literals. There is no action prop. The host's tool-result envelope
 * (`text`, `ui`, `completed`) stays outside this schema.
 */

import { z } from 'zod';

/**
 * Agentic Forge v0.9 `ResultPanel` schema.
 *
 * `title` is the heading. `summary` is the body and keeps authored line
 * breaks. Unknown keys, including actions, are rejected.
 */
export const ResultPanelSchema: z.ZodObject<
	{
		summary: z.ZodString;
		title: z.ZodString;
	},
	'strict'
> = z
	.object({
		summary: z.string().min(1).describe('Result body. Line breaks are shown as authored.'),
		title: z.string().min(1).describe('Heading for the completed result.'),
	})
	.strict();
