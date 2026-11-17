/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports -- Catalog schema file: one named `XxxSchema` export per component is the entire point (mirrors `../v0_9/schemas.ts`). Shared helper consts (`ActionSchema`, `PathBindingSchema`, …) are intentionally co-located. */

/**
 * Zod schemas for the Agentic Jira v0.9 catalog
 * (`com.atlassian.agentic-jira/v0_9/v1`).
 *
 * High-level agentic-workflow composites, modelled on the Jira
 * agent-session tools they package:
 *
 *  - `MultipleChoiceQuestions` — multi-question Q&A card used by agents at
 *    (pre)planning time (mirrors `@atlassian/agentic-planning`'s
 *    `MultipleChoiceQuestionsTool`).
 *  - `RepositoryPicker` — grouped repository selector with optional
 *    custom-URL entry (mirrors `@atlassian/repository-choice`'s
 *    `RepositoryChoiceForm`, without its extra-context editor).
 *  - `ToolApproval` — one Allow/Reject view per pending tool, presented
 *    as a carousel (reworked from ai-agent-sessions'
 *    `DefaultMCPActionPlan` bulk-confirm design).
 *
 * Design stance: these are deliberately COARSE components. The platform —
 * not the agent — owns composition and UX; the agent supplies data and
 * receives semantic events. This keeps generated UI stable across model
 * runs and keeps prompt contracts small.
 *
 * As with the v0.9 ADS catalog: in v0.9+ the engine does NOT validate
 * against built-in component schemas — the schema declared here IS the
 * wire contract, and extension props survive end-to-end.
 */

import { z } from 'zod';

/**
 * v0.9 action shape, mirroring the canonical basic_catalog `action` union.
 *
 * Local copy for the same reason as `../v0_9/schemas.ts`: importing the
 * upstream `ActionSchema` would add `@a2ui/web_core` coupling this
 * React-free package deliberately avoids at runtime.
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

/**
 * A `{ path }` JSON-pointer write binding for a structured record value.
 *
 * IMPORTANT: declared as a UNION with the literal record shape because the
 * engine's schema scraper (`scrapeSchemaBehavior` in `@a2ui/web_core`)
 * classifies a prop as a reactive data binding ONLY when its schema is a
 * `ZodUnion` containing a `{ path }` object option. A plain
 * `z.object({ path })` would be treated as a static literal and never
 * resolved against the data model. Always author these props as
 * `{ path: '/...' }` bindings — the literal branch exists for the scraper
 * and for read-only snapshots, not as a recommended authoring shape.
 */
const RecordBindingSchema: z.ZodType = z
	.union([z.object({ path: z.string() }), z.record(z.string(), z.unknown())])
	.describe(
		'A `{ path }` JSON-pointer binding into the surface data model (write target). Author as a binding.',
	);

/** A literal string OR a `{ path }` JSON-pointer binding (read-only use). */
const StringBindingSchema: z.ZodType = z
	.union([z.string(), z.object({ path: z.string() })])
	.describe('A literal string OR a `{ path }` JSON-pointer binding into the surface data model.');

/** A literal boolean OR a `{ path }` JSON-pointer binding. */
const BooleanDynamicValueSchema: z.ZodType = z
	.union([z.boolean(), z.object({ path: z.string() })])
	.describe('A literal boolean OR a `{ path }` JSON-pointer binding into the surface data model.');

/**
 * One selectable option inside a `MultipleChoiceQuestions` question.
 */
const MultipleChoiceQuestionOptionSchema: z.ZodObject<{
	id: z.ZodString;
	label: z.ZodString;
	description: z.ZodOptional<z.ZodString>;
}> = z.object({
	id: z.string().describe('Stable option identifier persisted into the answer record.'),
	label: z.string().describe('Visible option label.'),
	description: z.string().optional().describe('Muted secondary line under the label.'),
});

/**
 * One question inside `MultipleChoiceQuestions`.
 */
const MultipleChoiceQuestionSchema: z.ZodObject<{
	id: z.ZodString;
	question: z.ZodString;
	description: z.ZodOptional<z.ZodString>;
	options: z.ZodArray<typeof MultipleChoiceQuestionOptionSchema>;
}> = z.object({
	id: z.string().describe('Stable question identifier — the key in the bound answer record.'),
	question: z.string().describe('The question text.'),
	description: z.string().optional().describe('Muted supporting text under the question.'),
	options: z.array(MultipleChoiceQuestionOptionSchema).describe('Predefined answer options.'),
});

/**
 * Agentic Jira v0.9 `MultipleChoiceQuestions` schema.
 *
 * A multi-question Q&A card: numbered option cards per question, an
 * optional "Other" free-text answer, an optional Skip, and Previous/Next
 * navigation across questions. Submit dispatches `onSubmit` after every
 * question is answered or skipped.
 *
 * **Wire contract for `value`** — the adapter writes a record keyed by
 * question id:
 *
 * ```json
 * {
 *   "q1": { "type": "PROVIDED_OPTION", "selectedOptionId": "opt-a" },
 *   "q2": { "type": "OTHER_OPTION", "customText": "something else" },
 *   "q3": { "type": "SKIP" }
 * }
 * ```
 */
export const MultipleChoiceQuestionsSchema: z.ZodObject<{
	questions: z.ZodArray<typeof MultipleChoiceQuestionSchema>;
	value: z.ZodType;
	allowOther: z.ZodOptional<z.ZodBoolean>;
	allowSkip: z.ZodOptional<z.ZodBoolean>;
	disabled: z.ZodOptional<z.ZodType>;
	submitLabel: z.ZodOptional<z.ZodString>;
	onAnswer: z.ZodOptional<z.ZodType>;
	onSubmit: z.ZodOptional<z.ZodType>;
}> = z.object({
	questions: z.array(MultipleChoiceQuestionSchema).describe('Ordered list of questions to ask.'),
	value: RecordBindingSchema.describe(
		'Write target for the answer record: `Record<questionId, ' +
			"{ type: 'PROVIDED_OPTION', selectedOptionId } | { type: 'OTHER_OPTION', customText } | { type: 'SKIP' }>`. " +
			'Author as a `{ path }` binding; written incrementally as the user answers each question.',
	),
	allowOther: z
		.boolean()
		.optional()
		.describe('Show an "Other" free-text option per question. Defaults to `true`.'),
	allowSkip: z
		.boolean()
		.optional()
		.describe('Show a "Skip" affordance per question. Defaults to `true`.'),
	disabled: BooleanDynamicValueSchema.optional(),
	submitLabel: z
		.string()
		.optional()
		.describe('Label of the final submit button. Defaults to `Submit`.'),
	onAnswer: ActionSchema.optional().describe(
		'Action dispatched after each per-question answer is written to the bound `value` path. ' +
			'Invoked with zero arguments (upstream binder contract) — read the binding to see the answers.',
	),
	onSubmit: ActionSchema.optional().describe(
		'Action dispatched when the user submits on the last question. The full answer record is ' +
			'already written to the bound `value` path when this fires.',
	),
});

/**
 * One selectable repository inside `RepositoryPicker`.
 */
const RepositoryOptionSchema: z.ZodObject<{
	name: z.ZodString;
	url: z.ZodString;
	id: z.ZodOptional<z.ZodString>;
	group: z.ZodOptional<z.ZodEnum<['suggested', 'available', 'matching']>>;
	confidenceScore: z.ZodOptional<z.ZodNumber>;
	explanation: z.ZodOptional<z.ZodString>;
}> = z.object({
	name: z.string().describe('Display name, e.g. `org/repo`.'),
	url: z.string().describe('Repository URL — the stable identifier written to the data model.'),
	id: z.string().optional().describe('Optional provider-side repository id.'),
	group: z
		.enum(['suggested', 'available', 'matching'])
		.optional()
		.describe(
			'Grouping bucket. `suggested` entries (e.g. from Teamwork Graph) render first. ' +
				'Ungrouped entries fall into `available`.',
		),
	confidenceScore: z
		.number()
		.optional()
		.describe('Optional 0–1 suggestion confidence (rendered as supporting text for `suggested`).'),
	explanation: z.string().optional().describe('Why this repository was suggested.'),
});

/**
 * Agentic Jira v0.9 `RepositoryPicker` schema.
 *
 * Grouped repository selector (Suggested / Available / Matching) with
 * optional free-typed custom URL entry. When `onSubmit` is provided a
 * primary confirm button is rendered underneath.
 *
 * **Wire contract for `value`** — the adapter writes:
 *
 * ```json
 * { "url": "https://…", "name": "org/repo", "custom": false }
 * ```
 *
 * (`custom: true` when the user typed a URL not present in
 * `repositories`.)
 */
export const RepositoryPickerSchema: z.ZodObject<{
	repositories: z.ZodArray<typeof RepositoryOptionSchema>;
	value: z.ZodType;
	label: z.ZodOptional<z.ZodType>;
	placeholder: z.ZodOptional<z.ZodType>;
	allowCustomUrl: z.ZodOptional<z.ZodBoolean>;
	disabled: z.ZodOptional<z.ZodType>;
	submitLabel: z.ZodOptional<z.ZodString>;
	onChange: z.ZodOptional<z.ZodType>;
	onSubmit: z.ZodOptional<z.ZodType>;
}> = z.object({
	repositories: z
		.array(RepositoryOptionSchema)
		.describe('Selectable repositories, bucketed by `group`.'),
	value: RecordBindingSchema.describe(
		'Write target for the selection: `{ url, name, custom? }`. Author as a `{ path }` binding; ' +
			'written on every selection change.',
	),
	label: StringBindingSchema.optional().describe('Visible label for the repository selector.'),
	placeholder: StringBindingSchema.optional(),
	allowCustomUrl: z
		.boolean()
		.optional()
		.describe(
			'Allow free-typing a repository URL not present in `repositories`. Defaults to `true`.',
		),
	disabled: BooleanDynamicValueSchema.optional(),
	submitLabel: z
		.string()
		.optional()
		.describe(
			'Label of the confirm button (rendered only when `onSubmit` is set). Defaults to `Confirm`.',
		),
	onChange: ActionSchema.optional().describe(
		'Action dispatched after the selection is written to the bound `value` path.',
	),
	onSubmit: ActionSchema.optional().describe(
		'Action dispatched when the user clicks the confirm button. Selection and context are ' +
			'already written to their bound paths when this fires.',
	),
});

/**
 * One pending tool call inside `ToolApproval`.
 */
const PendingToolSchema: z.ZodObject<{
	id: z.ZodString;
	name: z.ZodString;
	description: z.ZodOptional<z.ZodString>;
}> = z.object({
	id: z.string().describe('Stable tool-call identifier.'),
	name: z.string().describe('Tool name shown to the user.'),
	description: z.string().optional().describe('Muted description of what the tool will do.'),
});

/**
 * Agentic Jira v0.9 `ToolApproval` schema.
 *
 * One approval request per tool, presented one view at a time (same
 * carousel structure as `MultipleChoiceQuestions`): a counter + prev/next
 * navigation across tools, and per tool two pressable option cards —
 * Allow / Reject. Pressing either records the decision AND auto-advances
 * to the next tool; there is no Next/Confirm button. Revisiting a tool
 * via the navigation shows (and can change) its recorded decision.
 *
 * **Wire contract for `value`** — the adapter writes a record keyed by
 * tool id:
 *
 * ```json
 * { "tool-1": "ALLOW", "tool-2": "REJECT" }
 * ```
 *
 * `onDecide` fires after each decision write; `onSubmit` fires when the
 * last undecided tool receives its decision (the full record is already
 * written when it fires).
 */
export const ToolApprovalSchema: z.ZodObject<{
	tools: z.ZodArray<typeof PendingToolSchema>;
	value: z.ZodType;
	title: z.ZodOptional<z.ZodType>;
	allowLabel: z.ZodOptional<z.ZodString>;
	rejectLabel: z.ZodOptional<z.ZodString>;
	disabled: z.ZodOptional<z.ZodType>;
	onDecide: z.ZodOptional<z.ZodType>;
	onSubmit: z.ZodOptional<z.ZodType>;
}> = z.object({
	tools: z.array(PendingToolSchema).describe('Pending tool calls awaiting user approval.'),
	value: RecordBindingSchema.describe(
		"Write target for the decision record: `Record<toolId, 'ALLOW' | 'REJECT'>`. Author as a " +
			'`{ path }` binding; written incrementally as the user decides each tool.',
	),
	title: StringBindingSchema.optional().describe(
		'Heading above the current tool. Defaults to `Agent wants to use this tool`.',
	),
	allowLabel: z.string().optional().describe('Allow option label. Defaults to `Allow`.'),
	rejectLabel: z.string().optional().describe('Reject option label. Defaults to `Reject`.'),
	disabled: BooleanDynamicValueSchema.optional(),
	onDecide: ActionSchema.optional().describe(
		'Action dispatched after each per-tool decision is written to the bound `value` path.',
	),
	onSubmit: ActionSchema.optional().describe(
		'Action dispatched when every tool has a decision (fires on the press that completes the ' +
			'record). Read the bound `value` path for the decisions.',
	),
});
