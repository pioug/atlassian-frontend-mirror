/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports -- Catalog schema file: one named `XxxSchema` export per component. Shared binding helpers stay co-located. */

/**
 * Zod schemas for the Agentic Forge v0.9 catalog
 * (`com.atlassian.agentic-forge/v0_9/v1`).
 *
 * `ResultPanel` is a completed result: a heading and a summary. Both values
 * are literals. There is no action prop. The host's tool-result envelope
 * (`text`, `ui`, `completed`) stays outside this schema.
 *
 * `MultipleChoice` is a copy of the ADS v0.9 `MultipleChoice` contract so a
 * Forge surface can ask for a selection without loading the ADS catalog.
 */

import { z } from 'zod';

/**
 * Action shape mirrored from the ADS catalog. The adapter casts a resolved
 * action to `() => void` at call time.
 */
const ActionSchema: z.ZodType = z
	.union([
		z.object({
			event: z.object({
				name: z.string(),
				context: z.record(z.string(), z.unknown()).optional(),
			}),
		}),
		z.object({
			functionCall: z.object({
				call: z.string(),
				args: z.record(z.string(), z.unknown()),
				returnType: z.string().optional(),
			}),
		}),
	])
	.describe('Action payload dispatched when the component is interacted with.');

const BooleanDynamicValueSchema: z.ZodType = z
	.union([z.boolean(), z.object({ path: z.string() })])
	.describe('A literal boolean OR a `{ path }` JSON-pointer binding into the surface data model.');

const StringBindingSchema: z.ZodType = z
	.union([z.string(), z.object({ path: z.string() })])
	.describe('A literal string OR a `{ path }` JSON-pointer binding into the surface data model.');

/**
 * Wire-level shape for a value that resolves to `string[]`.
 * Pass `{ path }` for two-way state.
 */
const StringListDataBindingSchema: z.ZodType = z
	.union([z.array(z.string()), z.object({ path: z.string() })])
	.describe(
		'JSON-pointer binding to a string array, or a literal `string[]`. Two-way bound for multi-select; the adapter writes the selected values back.',
	);

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

/**
 * Agentic Forge v0.9 `MultipleChoice` schema.
 *
 * Copied from the ADS v0.9 `MultipleChoice` contract (DSP-25085):
 *  - `style` omitted / `'select'`, `multiple: false` → single select
 *  - `style` omitted / `'select'`, `multiple: true`  → multi select
 *  - `style: 'action'`                               → menu of actions
 *
 * `value` is always a string array, either as a literal or a `{ path }`
 * binding. The adapter writes the selection back when `value` is bound.
 */
export const MultipleChoiceSchema: z.ZodObject<{
	disabled: z.ZodOptional<z.ZodType>;
	filterable: z.ZodOptional<z.ZodBoolean>;
	invalid: z.ZodOptional<z.ZodType>;
	label: z.ZodOptional<z.ZodType>;
	multiple: z.ZodOptional<z.ZodBoolean>;
	onChange: z.ZodOptional<z.ZodType>;
	options: z.ZodArray<z.ZodObject<{ label: z.ZodType; value: z.ZodString }>>;
	placeholder: z.ZodOptional<z.ZodType>;
	style: z.ZodOptional<z.ZodEnum<['select', 'action']>>;
	value: z.ZodType;
}> = z.object({
	options: z
		.array(
			z.object({
				label: StringBindingSchema,
				value: z.string().describe('Stable identifier persisted to the data model.'),
			}),
		)
		.describe('Available options.'),
	value: StringListDataBindingSchema.describe(
		'Selected values. A string array, or { "path": "/pointer" } so the selection is written back. Read that path to see what was picked.',
	),
	label: StringBindingSchema.optional().describe('Visible group label.'),
	multiple: z
		.boolean()
		.optional()
		.describe('Allow more than one selection. Defaults to false. Ignored when style is "action".'),
	style: z
		.enum(['select', 'action'])
		.optional()
		.describe(
			'"select" (default) is a dropdown. "action" is a menu. Picking an item writes value and fires onChange.',
		),
	placeholder: StringBindingSchema.optional(),
	disabled: BooleanDynamicValueSchema.optional(),
	invalid: BooleanDynamicValueSchema.optional(),
	filterable: z
		.boolean()
		.optional()
		.describe(
			'Show a search box in the dropdown. Defaults to true. Ignored when style is "action".',
		),
	onChange: ActionSchema.optional().describe(
		'Fired after the selection is written to value. It has no arguments. Read the value path to see the choice, or put context on the action, for example { "event": { "name": "picked", "context": { "from": "fruit-menu" } } }.',
	),
});
