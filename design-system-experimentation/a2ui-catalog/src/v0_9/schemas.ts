/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports -- Catalog schema file: one named `XxxSchema` export per component is the entire point. Splitting into 13 single-export files would lose the helper consts (e.g. `ActionSchema`, `StringBindingSchema`) that are shared across schemas and intentionally co-located. */

/**
 * Zod schemas for the v0.9 ADS catalog.
 *
 * Critical: in v0.9 the engine does NOT validate against built-in component
 * schemas. The schema you put here IS the schema. So if you include extension
 * props like `disabled`/`loading`/`helpText`, they survive end-to-end. (This
 * is the v0.9 architectural fix to the v0.8 strip bug.)
 *
 * We deliberately do NOT call `.strict()` here — unknown fields pass through
 * via Zod's default `"strip"` only after parsing through this schema, but
 * the engine never re-strips them at the wire layer the way v0.8 did.
 *
 * ## Spec vs. extension prop convention
 *
 * Each schema docstring below uses two consistent labels:
 *  - **Spec-faithful props** — match the v0.9 basic catalog
 *    (`@a2ui/web_core/v0_9/basic_catalog`) by name, type, and semantics.
 *  - **ADS extension props** — added by us to expose ADS capabilities the
 *    spec doesn't model (e.g. `disabled`, `loading`, `helpText`). They are
 *    driven by the DSP-250xx ticket attached to each component and survive
 *    end-to-end thanks to v0.9's pass-through wire schema.
 *
 * Where DSP tickets use v0.8 prop names (e.g. `usageHint`, `appearance`,
 * `multiline`, `checked`, `emphasis`), we silently translate them to the
 * v0.9 spec name (`variant`, `value`, …) — the spec is the source of truth
 * for prop naming when it speaks.
 */

import { z } from 'zod';

/**
 * v0.9 action shape, mirroring the canonical basic_catalog `action` union.
 *
 * Ideally we'd reuse upstream `ActionSchema` from `@a2ui/web_core/v0_9` so the
 * v0.9 binder's type-level resolver (`ResolveA2uiProp`) flips `action` to a
 * callable `() => void` in `props`. But adding `@a2ui/web_core` as a direct
 * dep collides with AFM's `root:*` dep-management contract, so we mirror the
 * shape locally and the adapter casts to `() => void` at call time.
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
 * v0.9 ADS Button `variant` enum. Mirrors `@atlaskit/button/new`'s
 * `ButtonAppearance` 1:1 so the adapter can pass `variant` straight through
 * as the AK `appearance` prop with no translation layer.
 *
 * The spec's basic-catalog `variant` is `default | primary | borderless`;
 * we deliberately diverge to expose the full ADS appearance surface
 * (`borderless` is not in ADS Button; `discovery`/`danger`/`warning`/`subtle`
 * are). See DSP-25066.
 */
const ButtonVariantSchema: z.ZodEnum<
	['default', 'danger', 'primary', 'subtle', 'warning', 'discovery']
> = z
	.enum(['default', 'danger', 'primary', 'subtle', 'warning', 'discovery'])
	.describe('ADS Button appearance — mirrors `@atlaskit/button/new` `ButtonAppearance`.');

/**
 * v0.9 ADS `Button` schema (DSP-25066).
 *
 * **Spec-faithful props** (from v0.9 basic_catalog): `child` (required,
 * ComponentId — the label is rendered by resolving this to a child component,
 * typically a `Text`), `action` (required), `variant` (optional).
 *
 * **Spec-deviation**: the spec's `variant` enum is `default | primary |
 * borderless`. We replace it with `@atlaskit/button/new`'s full
 * `ButtonAppearance` enum so authors can use any ADS appearance.
 *
 * **Ticket-driven additions** (spec silent): `disabled`, `loading` — mapped
 * to AK Button's `isDisabled` / `isLoading` in the adapter.
 *
 * In v0.9 the catalog author owns the schema (no engine-level shadow
 * `ButtonSchema` strips fields, unlike v0.8), so extension props survive
 * end-to-end.
 */
export const ButtonSchema: z.ZodObject<{
	child: z.ZodString;
	action: z.ZodType;
	variant: z.ZodOptional<
		z.ZodEnum<['default', 'danger', 'primary', 'subtle', 'warning', 'discovery']>
	>;
	disabled: z.ZodOptional<z.ZodBoolean>;
	loading: z.ZodOptional<z.ZodBoolean>;
}> = z.object({
	child: z
		.string()
		.describe('ID of the child component rendered as the button label (typically a `Text`).'),
	action: ActionSchema,
	variant: ButtonVariantSchema.optional(),
	disabled: z.boolean().optional(),
	loading: z.boolean().optional(),
});

/**
 * v0.9 ADS `Text` schema (DSP-25080).
 *
 * **Spec-faithful props** (from v0.9 basic_catalog): `text` (required, literal
 * string or `{ path }` data-model binding), `variant` (optional, `h1`–`h5` |
 * `body` | `caption`, default `body`).
 *
 * The v0.8 standard catalog called this prop `usageHint`; v0.9 renamed it to
 * `variant` with the same value set. We follow the v0.9 spec name.
 *
 * Adapter mapping (DSP-25080):
 *  - `h1`–`h5`  → `<Heading size="…">` rendering the matching `<hN>` tag
 *  - `body`     → `<Text>`
 *  - `caption`  → `<Text size="small">`
 *  - omitted    → defaults to `body`
 */
export const TextSchema: z.ZodObject<{
	text: z.ZodType;
	variant: z.ZodOptional<z.ZodEnum<['h1', 'h2', 'h3', 'h4', 'h5', 'body', 'caption']>>;
}> = z.object({
	// Requires a union so a `{ path }` binding resolves to the data-model value instead of rendering "[object Object]"
	text: z
		.union([z.string(), z.object({ path: z.string() })])
		.describe('Text content: a literal string OR a `{ path }` data-model binding.'),
	variant: z
		.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'body', 'caption'])
		.optional()
		.describe(
			'Style hint that selects between Heading and Text rendering. Defaults to `body` when omitted.',
		),
});

/**
 * v0.9 ADS `Row` schema (DSP-25084).
 *
 * **Spec-faithful props** (from v0.9 basic_catalog `RowApi`): `children`
 * (required, array of component IDs), `justify` (default `start`, 7-value
 * enum), `align` (default `stretch`, 4-value enum).
 *
 * **Spec deviation:** the spec's `children` is `ChildListSchema` (array
 * OR a template object that iterates over a data-bound list). We only
 * accept the plain array form — template/data-binding support is not
 * currently exercised by any DSP ticket and adding it requires wiring the
 * engine's iteration semantics through the adapter.
 *
 * **ADS extension props** (DSP-25084): `gap`, `wrap`. The ticket requires
 * `gap` (ADS space token) and `wrap → shouldWrap`; neither exists in the
 * basic catalog Row schema, so we add them as extensions.
 *
 * Renders as `@atlaskit/primitives` `Inline`.
 */
export const RowSchema: z.ZodObject<{
	children: z.ZodArray<z.ZodString>;
	gap: z.ZodOptional<z.ZodNumber>;
	justify: z.ZodOptional<
		z.ZodEnum<['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch']>
	>;
	align: z.ZodOptional<z.ZodEnum<['start', 'center', 'end', 'stretch']>>;
	wrap: z.ZodOptional<z.ZodBoolean>;
}> = z.object({
	children: z.array(z.string()).describe('Child component IDs to render in a horizontal stack.'),
	gap: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Spacing between children in px (mapped to nearest ADS space token).'),
	justify: z
		.enum(['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch'])
		.optional()
		.describe(
			'Main-axis (horizontal) arrangement of children. Defaults to `start`. `spaceBetween` pushes items to the edges.',
		),
	align: z
		.enum(['start', 'center', 'end', 'stretch'])
		.optional()
		.describe(
			'Cross-axis (vertical) alignment of children. Defaults to `stretch` (CSS `align-items`).',
		),
	wrap: z
		.boolean()
		.optional()
		.describe('If true, children wrap onto multiple lines when they overflow. Defaults to false.'),
});

/**
 * v0.9 ADS `Column` schema (DSP-25084).
 *
 * **Spec-faithful props** (from v0.9 basic_catalog `ColumnApi`): `children`
 * (required, array of component IDs), `justify` (default `start`, 7-value
 * enum), `align` (default `stretch`, 4-value enum).
 *
 * **Spec deviation:** same as Row — `children` is `array(string)` only,
 * not the spec's `ChildListSchema` template-or-array union.
 *
 * **ADS extension props** (DSP-25084): `gap`, `wrap`. The ticket requires
 * `gap` (ADS space token) and `wrap → shouldWrap`; neither exists in the
 * basic catalog Column schema, so we add them as extensions.
 *
 * Renders as `@atlaskit/primitives` `Stack`.
 */
export const ColumnSchema: z.ZodObject<{
	children: z.ZodArray<z.ZodString>;
	gap: z.ZodOptional<z.ZodNumber>;
	justify: z.ZodOptional<
		z.ZodEnum<['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch']>
	>;
	align: z.ZodOptional<z.ZodEnum<['start', 'center', 'end', 'stretch']>>;
	wrap: z.ZodOptional<z.ZodBoolean>;
}> = z.object({
	children: z.array(z.string()).describe('Child component IDs to render in a vertical stack.'),
	gap: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Spacing between children in px (mapped to nearest ADS space token).'),
	justify: z
		.enum(['start', 'center', 'end', 'spaceBetween', 'spaceAround', 'spaceEvenly', 'stretch'])
		.optional()
		.describe(
			'Main-axis (vertical) arrangement of children. Defaults to `start`. Use `spaceBetween` for header/footer layouts.',
		),
	align: z
		.enum(['start', 'center', 'end', 'stretch'])
		.optional()
		.describe(
			'Cross-axis (horizontal) alignment of children. Defaults to `stretch` (CSS `align-items`).',
		),
	wrap: z
		.boolean()
		.optional()
		.describe(
			'If true, children wrap onto multiple columns when they overflow vertically. Defaults to false. Rarely useful for Column.',
		),
});

/**
 * Wire-level shape for a `DynamicValue` that resolves to a boolean.
 *
 * v0.9 binding: bindable fields accept either a literal value (`true`/`false`)
 * or a `{ path }` reference into the surface's `DataModel`. The engine's
 * generic binder (`createComponentImplementation`) resolves either form to a
 * concrete `boolean` before calling the adapter, so `props.value` is always
 * the resolved literal.
 *
 * We mirror the shape locally rather than importing
 * `DynamicValueSchema` from `@a2ui/web_core/v0_9` so the catalog package
 * stays runtime-decoupled from web_core (parity with `ActionSchema` above).
 */
const BooleanDynamicValueSchema: z.ZodType = z
	.union([z.boolean(), z.object({ path: z.string() })])
	.describe('A literal boolean OR a `{ path }` JSON-pointer binding into the surface data model.');

/**
 * v0.9 ADS `Card` family (DSP-25083) — faithful mapping of the `Card` root and
 * granular subpath components from `@atlassian/card`.
 *
 * The container (`Card`) maps to the ADS Card root; its slots are exposed as
 * separate sibling components (`CardMedia`, `CardContent`, `CardLeading`,
 * `CardPrimaryContent`, `CardHeader`, `CardTitle`, `CardDescription`,
 * `CardBody`, `CardFooter`) that the agent composes as children. Each component
 * maps to its corresponding `@atlassian/card/<component>` entry point.
 *
 * Faithful structure:
 *   Card
 *     ├─ CardMedia?            (direct child of Card)
 *     └─ CardContent
 *          ├─ CardLeading?
 *          └─ CardPrimaryContent
 *               ├─ CardHeader? (CardTitle, CardDescription?)
 *               ├─ CardBody?
 *               └─ CardFooter?
 */
export const CardSchema: z.ZodObject<{
	children: z.ZodArray<z.ZodString>;
	appearance: z.ZodOptional<z.ZodEnum<['flat', 'raised']>>;
	spacing: z.ZodOptional<z.ZodEnum<['comfy', 'compact']>>;
	isSelected: z.ZodOptional<z.ZodType>;
	isDisabled: z.ZodOptional<z.ZodType>;
	onClick: z.ZodOptional<z.ZodType>;
}> = z.object({
	children: z
		.array(z.string())
		.describe(
			'IDs of the Card slot children (typically a `CardMedia` and/or a `CardContent`). Compose the ADS Card structure with the Card* family components.',
		),
	appearance: z
		.enum(['flat', 'raised'])
		.optional()
		.describe('ADS Card appearance. Defaults to `flat` in `@atlassian/card`.'),
	spacing: z
		.enum(['comfy', 'compact'])
		.optional()
		.describe('ADS Card density. Defaults to the comfy Card variant.'),
	isSelected: BooleanDynamicValueSchema.optional().describe(
		'If true, renders the Card selected state. For clickable Cards this maps to `aria-pressed`; for static Cards it maps to ADS selected styling.',
	),
	isDisabled: BooleanDynamicValueSchema.optional().describe(
		'If true, renders the Card disabled state and suppresses `onClick` dispatch.',
	),
	onClick: ActionSchema.optional().describe('Optional action dispatched when the Card is clicked.'),
});

/**
 * `CardMedia` — maps to `CardMedia` from `@atlassian/card/card-media` (a direct
 * child of `Card`, above or below the content). Holds a single media child
 * (image, illustration, etc).
 */
export const CardMediaSchema: z.ZodObject<{
	child: z.ZodString;
	position: z.ZodOptional<z.ZodEnum<['top', 'bottom']>>;
}> = z.object({
	child: z.string().describe('ID of the media child to render inside the Card media slot.'),
	position: z
		.enum(['top', 'bottom'])
		.optional()
		.describe('Media placement relative to the Card content. Defaults to `top`.'),
});

/**
 * `CardContent` — maps to `CardContent` from `@atlassian/card/card-content`, the
 * horizontal container that holds an optional `CardLeading` plus the
 * `CardPrimaryContent`.
 */
export const CardContentSchema: z.ZodObject<{
	children: z.ZodArray<z.ZodString>;
}> = z.object({
	children: z
		.array(z.string())
		.describe(
			'IDs of the content children (an optional `CardLeading` and a `CardPrimaryContent`).',
		),
});

/**
 * `CardLeading` — maps to `CardLeading` from `@atlassian/card/card-leading`, the
 * leading visual (e.g. an avatar or icon tile) shown beside the primary
 * content.
 */
export const CardLeadingSchema: z.ZodObject<{
	child: z.ZodString;
}> = z.object({
	child: z.string().describe('ID of the leading visual child (e.g. an avatar/icon).'),
});

/**
 * `CardPrimaryContent` — maps to `CardPrimaryContent` from
 * `@atlassian/card/card-primary-content`, the vertical stack that holds
 * `CardHeader`, `CardBody`, and `CardFooter`.
 */
export const CardPrimaryContentSchema: z.ZodObject<{
	children: z.ZodArray<z.ZodString>;
}> = z.object({
	children: z
		.array(z.string())
		.describe('IDs of the primary content children (`CardHeader`, `CardBody`, `CardFooter`).'),
});

/**
 * `CardHeader` — maps to `CardHeader` from `@atlassian/card/card-header`. Holds
 * the `CardTitle`/`CardDescription` children and an optional `leading` visual
 * (e.g. an avatar) shown beside them.
 */
export const CardHeaderSchema: z.ZodObject<{
	children: z.ZodArray<z.ZodString>;
	leading: z.ZodOptional<z.ZodString>;
}> = z.object({
	children: z
		.array(z.string())
		.describe(
			'IDs of the header children (typically a `CardTitle` and optional `CardDescription`).',
		),
	leading: z
		.string()
		.optional()
		.describe('Optional ID of a leading visual (e.g. an avatar) rendered inside the header.'),
});

/**
 * `CardTitle` — maps to `CardTitle` from `@atlassian/card/card-title`. Renders
 * title text via ADS Heading/Text. Agents pass the title as a `text` string
 * (per catalog convention) rather than React children.
 */
export const CardTitleSchema: z.ZodObject<{
	text: z.ZodString;
	as: z.ZodOptional<z.ZodEnum<['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span']>>;
}> = z.object({
	text: z.string().describe('The Card title text.'),
	as: z
		.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'])
		.optional()
		.describe(
			'Semantic element for the title. Omit to let ADS infer the heading level; use `span` for non-heading title text.',
		),
});

/**
 * `CardDescription` — maps to `CardDescription` from
 * `@atlassian/card/card-description`. Renders subtle description text. Agents
 * pass it as a `text` string.
 */
export const CardDescriptionSchema: z.ZodObject<{
	text: z.ZodString;
}> = z.object({
	text: z.string().describe('The Card description text.'),
});

/**
 * `CardBody` — maps to `CardBody` from `@atlassian/card/card-body`. Holds the
 * main body child of the Card.
 */
export const CardBodySchema: z.ZodObject<{
	child: z.ZodString;
}> = z.object({
	child: z.string().describe('ID of the Card body child.'),
});

/**
 * `CardFooter` — maps to `CardFooter` from `@atlassian/card/card-footer`. Holds
 * the footer child of the Card.
 */
export const CardFooterSchema: z.ZodObject<{
	child: z.ZodString;
}> = z.object({
	child: z.string().describe('ID of the Card footer child.'),
});

/**
 * v0.9 `CheckBox` schema.
 *
 * Two-way binding pattern:
 *  - Agent sends `value: { path: '/form/agreed' }`.
 *  - Engine resolves it; adapter receives the literal boolean as `props.value`.
 *  - On user toggle, adapter writes back via `context.dataContext.set(path, next)`,
 *    which propagates via the `DataModel` and re-renders.
 *  - Optional `onChange` is dispatched as a normal client action AFTER the data
 *    write so the agent can react if it wants to.
 *
 * `props.value` is always the resolved boolean — see `BooleanDynamicValueSchema`
 * for why.
 */
/**
 * v0.9 ADS `CheckBox` schema (DSP-25086).
 *
 * **Spec-faithful props** (from v0.9 basic_catalog `CheckBoxApi`): `label`
 * (DynamicString), `value` (DynamicBoolean).
 *
 * **Spec deviations:**
 *  - We make `label` **optional** to match `@atlaskit/checkbox`'s API
 *    (where `label?: React.ReactChild`). Note: a checkbox without `label`
 *    or `aria-label` is a WCAG violation — agents are expected to provide
 *    one or the other. Tracked separately.
 *  - We widen `value` to a union of `boolean | string[] | { path }` so the
 *    same schema supports two render modes (see below). The spec only
 *    allows `DynamicBoolean`.
 *
 * **ADS extension props** (DSP-25086): `disabled`, `indeterminate`,
 * `invalid`, `helpText`, `options` (group mode), `onChange`. None exist
 * in the basic catalog; the ticket calls out `checked` (we use spec name
 * `value`), `indeterminate`, `disabled`, `helpText`, `group`, `onChange`.
 *
 * Two render modes:
 *  - `group` omitted → single AK `Checkbox` with `value: boolean`.
 *  - `group` provided → a checkbox **group**: one AK `Checkbox` per
 *    option. `value` is then expected to be `string[]` (a list of picked
 *    option `value`s). Group mode is our answer to the ticket's "renders
 *    multiple checkboxes as a group" requirement without forcing the
 *    agent to emit N separate CheckBox nodes. (The upstream spec would
 *    handle this via `ChoicePicker` with `displayStyle: 'checkbox'`, but
 *    that lives behind a different component name.)
 */
export const CheckBoxSchema: z.ZodObject<{
	value: z.ZodType;
	label: z.ZodOptional<z.ZodType>;
	disabled: z.ZodOptional<z.ZodType>;
	indeterminate: z.ZodOptional<z.ZodType>;
	invalid: z.ZodOptional<z.ZodType>;
	helpText: z.ZodOptional<z.ZodType>;
	group: z.ZodOptional<z.ZodArray<z.ZodObject<{ label: z.ZodType; value: z.ZodString }>>>;
	onChange: z.ZodOptional<z.ZodType>;
}> = z.object({
	value: z
		.union([z.boolean(), z.array(z.string()), z.object({ path: z.string() })])
		.describe(
			'Current state. In single mode this is a `boolean` (or `{ path }` two-way binding). In group mode (`group` provided) this is a `string[]` of picked values.',
		),
	label: z
		.union([z.string(), z.object({ path: z.string() })])
		.optional()
		.describe('Visible label next to the checkbox (single mode) or above the group.'),
	disabled: BooleanDynamicValueSchema.optional(),
	indeterminate: BooleanDynamicValueSchema.optional().describe(
		'Shows the indeterminate (mixed) state. Single mode only.',
	),
	invalid: BooleanDynamicValueSchema.optional(),
	helpText: z
		.union([z.string(), z.object({ path: z.string() })])
		.optional()
		.describe('Muted helper text rendered below the checkbox / group. Spec: DSP-25086.'),
	group: z
		.array(
			z.object({
				label: z.union([z.string(), z.object({ path: z.string() })]),
				value: z.string().describe('Stable identifier persisted to the data model.'),
			}),
		)
		.optional()
		.describe(
			'If provided, renders a checkbox group (one Checkbox per option). `value` must be a `string[]` of picked option values in this mode. Matches DSP-25086 `group` prop name.',
		),
	onChange: ActionSchema.optional().describe(
		'Optional action dispatched after the data write completes.',
	),
});

/**
 * Wire-level shape for any string prop that accepts either a literal value
 * or a `{ path }` JSON-pointer binding into the surface data model.
 *
 * Previously split into `StringBindingSchema` (read-only label-style)
 * and `StringBindingSchema` (two-way binding style), but both had
 * identical Zod runtime behaviour — Zod validates structure only, not
 * semantic intent. Collapsed into one schema; the JSDoc on each prop that
 * uses it explains the read-only vs two-way semantic at that call site.
 */
const StringBindingSchema: z.ZodType = z
	.union([z.string(), z.object({ path: z.string() })])
	.describe('A literal string OR a `{ path }` JSON-pointer binding into the surface data model.');

/**
 * v0.9 `TextField` schema (DSP-25082).
 *
 * **Spec-faithful props** (from v0.9 basic_catalog `TextFieldApi`): `label`,
 * `value`, `variant` (default `shortText`, enum
 * `shortText|longText|number|obscured`). The DSP-25082 ticket uses v0.8's
 * `multiline: true/false` shape; the v0.9 spec (and our schema) instead
 * uses `variant: shortText|longText|...` which is the same intent with
 * a richer vocabulary.
 *
 * **Spec deviation:** the upstream spec also has a `checks` field
 * (engine-evaluated validation rules) and a `validationRegexp` field
 * (client-side regex). We don't expose either:
 *
 * - `@atlaskit/textfield` has NO Textfield-level validation API. The
 *   canonical AK pattern is `@atlaskit/form`'s `<Field validate={fn}>` —
 *   a function-based validator that runs at submit and on change. In
 *   a2ui that translation lives in the agent's data-model layer or in
 *   an `onChange` action handler. The agent then drives `invalid` /
 *   `errorMessage` to show the result. See
 *   `platform/packages/design-system/form/examples/05-field-validation.tsx`.
 * - `validationRegexp` was previously exposed but only ever consumed
 *   in the adapter via `new RegExp(...)` which throws SyntaxError on
 *   malformed patterns (caught by afm-ai-pr-review-bot, PR #361479
 *   comment 2006182199). Removed entirely per skill rule "Don't
 *   invent props the AK component doesn't have" — see
 *   `.agents/skills/a2ui-component-mapper/references/gotchas.md`.
 *
 * **ADS extension props** (DSP-25082): `placeholder`, `disabled`,
 * `invalid`, `helpText`, `errorMessage`, `onChange`. None exist in the
 * basic catalog; the ticket explicitly lists each one in its prop mapping.
 *
 * Adapter routes:
 *  - `shortText` / `number` / `obscured` → `@atlaskit/textfield`
 *  - `longText` → `@atlaskit/textarea`
 *
 * `helpText` renders below the field as muted helper text. `errorMessage`
 * renders below the field in danger color *and* implicitly marks the field
 * as invalid (you can also pass `invalid: true` independently to show the
 * danger border without a message).
 */
export const TextFieldSchema: z.ZodObject<{
	label: z.ZodOptional<z.ZodType>;
	value: z.ZodOptional<z.ZodType>;
	variant: z.ZodOptional<z.ZodEnum<['shortText', 'longText', 'number', 'obscured']>>;
	placeholder: z.ZodOptional<z.ZodType>;
	disabled: z.ZodOptional<z.ZodType>;
	invalid: z.ZodOptional<z.ZodType>;
	helpText: z.ZodOptional<z.ZodType>;
	errorMessage: z.ZodOptional<z.ZodType>;
	onChange: z.ZodOptional<z.ZodType>;
}> = z.object({
	label: StringBindingSchema.optional().describe(
		'Visible label for the input field. Omit (or set to empty string) when wrapping the field in a parent `Field` that already provides a label — empty/omitted labels do NOT render an empty `<Label>` element.',
	),
	value: StringBindingSchema.optional(),
	variant: z
		.enum(['shortText', 'longText', 'number', 'obscured'])
		.optional()
		.describe(
			'Input variant. Defaults to `shortText`. `longText` renders as a textarea; `obscured` is a password input.',
		),
	placeholder: StringBindingSchema.optional(),
	disabled: BooleanDynamicValueSchema.optional(),
	invalid: BooleanDynamicValueSchema.optional(),
	helpText: StringBindingSchema.optional().describe(
		'Muted helper text rendered below the field. Hidden when `errorMessage` is shown.',
	),
	errorMessage: StringBindingSchema.optional().describe(
		'Error text rendered below the field in danger color. When present, the field is also visually marked invalid.',
	),
	onChange: ActionSchema.optional().describe(
		'Optional action dispatched after the data write completes.',
	),
});

/**
 * Wire-level shape for a `DynamicStringList` that resolves to `string[]`.
 * Pass `{ path }` for two-way state.
 */
const StringListDataBindingSchema: z.ZodType = z
	.union([z.array(z.string()), z.object({ path: z.string() })])
	.describe(
		'JSON-pointer binding to a string array, or a literal `string[]`. Two-way bound for multi-select; the adapter writes the selected values back.',
	);

/**
 * v0.9 `MultipleChoice` schema (DSP-25085).
 *
 * **No direct spec equivalent.** The v0.9 basic catalog has `ChoicePicker`
 * (`variant: mutuallyExclusive|multipleSelection` + `displayStyle:
 * checkbox|chips`), but the DSP-25085 ticket explicitly names this
 * component `MultipleChoice` and uses a different prop vocabulary
 * (`multiple: boolean`, `style: select|action`). Per project policy
 * ("ticket is source of truth when spec is silent or contested") we
 * implement the ticket's API verbatim and accept the spec divergence.
 *
 * Crucially, `style: 'action'` (a stateless menu-of-actions backed by
 * `@atlaskit/dropdown-menu`) is a render mode `ChoicePicker` cannot
 * express — it's the primary GH Copilot agent repo/branch-selection use
 * case Franco Sun called out, so adopting `ChoicePicker` instead would
 * regress functionality.
 *
 * **Ticket-mandated props** (DSP-25085): `options`, `value`, `label`,
 * `multiple`, `style`, `placeholder`, `disabled`, `onChange`.
 *
 * **ADS extension props** (spec + ticket silent): `invalid`, `filterable`.
 *
 * Three render modes:
 *  - `style` omitted / `'select'`, `multiple: false` → `@atlaskit/select` (single)
 *  - `style` omitted / `'select'`, `multiple: true`  → `@atlaskit/select` (multi)
 *  - `style: 'action'`                               → `@atlaskit/dropdown-menu`
 *
 * `style: 'action'` is the menu-of-actions affordance (no persisted
 * selection — each option fires `onChange` with its own value as the only
 * payload).
 */
export const MultipleChoiceSchema: z.ZodObject<{
	options: z.ZodArray<z.ZodObject<{ label: z.ZodType; value: z.ZodString }>>;
	value: z.ZodType;
	label: z.ZodOptional<z.ZodType>;
	multiple: z.ZodOptional<z.ZodBoolean>;
	style: z.ZodOptional<z.ZodEnum<['select', 'action']>>;
	placeholder: z.ZodOptional<z.ZodType>;
	disabled: z.ZodOptional<z.ZodType>;
	invalid: z.ZodOptional<z.ZodType>;
	filterable: z.ZodOptional<z.ZodBoolean>;
	onChange: z.ZodOptional<z.ZodType>;
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
		'Selected values. Always modelled as a string array so single- and multi-select share one wire shape. Written by the adapter when the user makes a selection (in both `style: select` and `style: action` modes — selection IS persisted in both). To know which option was just selected, agents either read this binding or encode per-option context into the `onChange` action JSON (see `onChange` description).',
	),
	label: StringBindingSchema.optional().describe('Visible group label.'),
	multiple: z
		.boolean()
		.optional()
		.describe(
			'If true, allow multiple selections (renders as AK Select with `isMulti`). Defaults to `false`. Ignored when `style: action` (action menus only fire one option at a time).',
		),
	style: z
		.enum(['select', 'action'])
		.optional()
		.describe(
			"Render style. `select` (default) renders as `@atlaskit/select`. `action` renders as `@atlaskit/dropdown-menu` — a menu of actions where picking an item writes the value to `value`'s binding AND fires `onChange`. Use `action` when you want a button-triggered menu UI; use `select` for the standard combobox.",
		),
	placeholder: StringBindingSchema.optional(),
	disabled: BooleanDynamicValueSchema.optional(),
	invalid: BooleanDynamicValueSchema.optional(),
	filterable: z
		.boolean()
		.optional()
		.describe('Show a typeahead filter. Defaults to true for AK Select. Ignored for action style.'),
	onChange: ActionSchema.optional().describe(
		"Action dispatched after the picked value is written to the bound `value` path. The runtime always invokes onChange with zero arguments (per the upstream @a2ui binder contract); to know WHICH option was picked, the agent either reads the binding directly or encodes per-option context into the action JSON, e.g. `onChange: { event: { name: 'picked', context: { from: 'fruit-menu' } } }` — then inspects `context` in the surface's `onAction` callback. There is no way to receive the option value as a function argument; that is a fundamental constraint of how Actions cross the JSON wire.",
	),
});

/**
 * v0.9 ADS `Form` schema.
 *
 * **Spec status:** no equivalent in v0.9 basic_catalog (ADS-only layout helper).
 *
 * **Mirrors:** `@atlaskit/form` → `Form` (layout only — the final-form
 * state machine is intentionally NOT mirrored; agents drive state via
 * bound `value` paths on individual inputs).
 *
 * **Props:**
 *  - `children` (required, ComponentId[]) — fields/sections/header/footer in render order.
 *  - `label` (optional) — accessible label (`aria-label` on the `<form>`).
 *
 * Renders as a native `<form>` with no internal `Stack`/gap — children
 * inherit normal flow + their own AK margins (e.g. `FormSection` has
 * `marginBlockStart: space.300`, `FormFooter` has `marginBlockStart:
 * space.300`, etc.). Submission is NOT captured here — submit buttons
 * dispatch their own `action`.
 *
 * AK Form has no `density` prop and ours doesn't either. If you need
 * denser rhythm, use a different layout primitive (e.g. raw `Stack`).
 */
export const FormSchema: z.ZodObject<{
	children: z.ZodArray<z.ZodString>;
	label: z.ZodOptional<z.ZodType>;
}> = z.object({
	children: z.array(z.string()).describe('Child component IDs rendered vertically as form rows.'),
	label: StringBindingSchema.optional().describe(
		'Accessible label for the form region (`aria-label`). Not visually rendered — use `FormHeader.title` for that.',
	),
});

/**
 * v0.9 ADS `Field` schema.
 *
 * **Spec status:** no equivalent in v0.9 basic_catalog (ADS-only).
 *
 * **Mirrors:** `@atlaskit/form` → `Field` (layout-only wrapper; bound
 * input owns the value).
 *
 * **Props:**
 *  - `child` (required, ComponentId) — input component to wrap.
 *  - `label` (optional) — label text above the control.
 *  - `helpText` (optional) — muted helper text below the control. Hidden when `errorMessage` is set.
 *  - `errorMessage` (optional) — danger-tinted text below the control. Takes precedence over `helpText`/`validMessage`.
 *  - `validMessage` (optional) — success-tinted text below the control. Hidden when `errorMessage` is set.
 *  - `required` (optional) — renders a red asterisk after the label. Does NOT enforce validation.
 *
 * **Spacing contract (the whole point of this component):**
 *  - label ↔ control          → `space.050` (4px)
 *  - control ↔ help / error   → `space.050` (4px)
 *  - between Fields in a Form → owned by `Form.density` (default 12px)
 */
export const FieldSchema: z.ZodObject<{
	child: z.ZodString;
	label: z.ZodOptional<z.ZodType>;
	helpText: z.ZodOptional<z.ZodType>;
	errorMessage: z.ZodOptional<z.ZodType>;
	validMessage: z.ZodOptional<z.ZodType>;
	required: z.ZodOptional<z.ZodBoolean>;
}> = z.object({
	child: z
		.string()
		.describe('ID of the input component to wrap (TextField, CheckBox, MultipleChoice, etc.).'),
	label: StringBindingSchema.optional().describe('Label text rendered above the wrapped control.'),
	helpText: StringBindingSchema.optional().describe(
		'Muted helper text rendered below the control. Hidden when `errorMessage` is shown.',
	),
	errorMessage: StringBindingSchema.optional().describe(
		'Danger-tinted text rendered below the control. Takes precedence over `helpText` and `validMessage`.',
	),
	validMessage: StringBindingSchema.optional().describe(
		'Success-tinted text rendered below the control. Hidden when `errorMessage` is shown.',
	),
	required: z
		.boolean()
		.optional()
		.describe('If true, renders a red asterisk after the label. Does not enforce validation.'),
});

/**
 * v0.9 ADS `FormSection` schema.
 *
 * **Spec status:** no equivalent in v0.9 basic_catalog (ADS-only).
 *
 * **Mirrors:** `@atlaskit/form` → `FormSection`.
 *
 * **Props:**
 *  - `children` (required, ComponentId[]) — fields belonging to this section.
 *  - `title` (optional) — section heading (AK Heading `size="medium"` → `<h3>`).
 *  - `description` (optional) — supporting copy under the title.
 *
 * **Spacing:**
 *  - title ↔ description → `space.100`
 *  - description ↔ children → `space.100`
 *  - section block start → `space.300`
 *
 * Matches `@atlaskit/form`'s `FormSection` exactly; AK provides no
 * `density` knob and neither do we.
 */
export const FormSectionSchema: z.ZodObject<{
	children: z.ZodArray<z.ZodString>;
	title: z.ZodOptional<z.ZodType>;
	description: z.ZodOptional<z.ZodType>;
}> = z.object({
	children: z.array(z.string()).describe('Child component IDs grouped under the section title.'),
	title: StringBindingSchema.optional().describe('Section heading (AK Heading `size="medium"`).'),
	description: StringBindingSchema.optional().describe(
		'Supporting copy rendered between title and fields.',
	),
});

/**
 * v0.9 ADS `FormHeader` schema.
 *
 * **Spec status:** no equivalent in v0.9 basic_catalog (ADS-only).
 *
 * **Mirrors:** `@atlaskit/form` → `FormHeader`.
 *
 * **Props:**
 *  - `title` (optional) — main heading (AK Heading `size="large"` → `<h2>`).
 *  - `description` (optional) — supporting copy under the title.
 *  - `children` (optional, ComponentId[]) — extra slots below the description.
 */
export const FormHeaderSchema: z.ZodObject<{
	title: z.ZodOptional<z.ZodType>;
	description: z.ZodOptional<z.ZodType>;
	children: z.ZodOptional<z.ZodArray<z.ZodString>>;
}> = z.object({
	title: StringBindingSchema.optional().describe('Form heading (AK Heading `size="large"`).'),
	description: StringBindingSchema.optional().describe('Supporting copy under the title.'),
	children: z
		.array(z.string())
		.optional()
		.describe('Optional extra components rendered below the description.'),
});

/**
 * v0.9 ADS `FormFooter` schema.
 *
 * **Spec status:** no equivalent in v0.9 basic_catalog (ADS-only).
 *
 * **Mirrors:** `@atlaskit/form` → `FormFooter`.
 *
 * **Props:**
 *  - `children` (required, ComponentId[]) — buttons/links to render.
 *  - `align` (optional, default `end`) — flex alignment of children.
 *
 * Renders with `space.300` block-start padding (matches AK
 * `formFooterWrapperStyles`).
 */
// ── code diff ────────────────────────────────────────────────────────

const CodeDiffFileChangeTypeSchema: z.ZodEnum<['added', 'modified', 'deleted', 'renamed']> = z.enum(
	['added', 'modified', 'deleted', 'renamed'],
);

const CodeDiffCountSchema: z.ZodNumber = z.number().int().nonnegative();
const CodeDiffLineNumberSchema: z.ZodNumber = z.number().int().min(1);

const CodeDiffFileSchema: z.ZodObject<{
	path: z.ZodString;
	changeType: typeof CodeDiffFileChangeTypeSchema;
	patch: z.ZodOptional<z.ZodString>;
	oldText: z.ZodOptional<z.ZodString>;
	newText: z.ZodOptional<z.ZodString>;
	oldContentRef: z.ZodOptional<z.ZodString>;
	newContentRef: z.ZodOptional<z.ZodString>;
	additions: z.ZodOptional<z.ZodNumber>;
	deletions: z.ZodOptional<z.ZodNumber>;
	language: z.ZodOptional<z.ZodString>;
	isBinary: z.ZodOptional<z.ZodBoolean>;
	isTruncated: z.ZodOptional<z.ZodBoolean>;
	totalLines: z.ZodOptional<z.ZodNumber>;
	updatedAt: z.ZodOptional<z.ZodString>;
}> = z.object({
	path: z.string(),
	changeType: CodeDiffFileChangeTypeSchema,
	patch: z.string().optional(),
	oldText: z.string().optional(),
	newText: z.string().optional(),
	oldContentRef: z.string().optional(),
	newContentRef: z.string().optional(),
	additions: CodeDiffCountSchema.optional(),
	deletions: CodeDiffCountSchema.optional(),
	language: z.string().optional(),
	isBinary: z.boolean().optional(),
	isTruncated: z.boolean().optional(),
	totalLines: CodeDiffCountSchema.optional(),
	updatedAt: z.string().datetime().optional(),
});

const CodeDiffCommitSchema: z.ZodObject<{
	id: z.ZodString;
	label: z.ZodOptional<z.ZodString>;
	message: z.ZodOptional<z.ZodString>;
	sha: z.ZodOptional<z.ZodString>;
	authoredAt: z.ZodOptional<z.ZodString>;
	filePaths: z.ZodArray<z.ZodString>;
}> = z.object({
	id: z.string(),
	label: z.string().optional(),
	message: z.string().optional(),
	sha: z.string().optional(),
	authoredAt: z.string().datetime().optional(),
	filePaths: z.array(z.string()),
});

const CodeDiffSourceSchema: z.ZodObject<{
	sessionAri: z.ZodOptional<z.ZodString>;
	commitSha: z.ZodOptional<z.ZodString>;
	branchName: z.ZodOptional<z.ZodString>;
	repositoryUrl: z.ZodOptional<z.ZodString>;
	pullRequestUrl: z.ZodOptional<z.ZodString>;
	sandboxUrl: z.ZodOptional<z.ZodString>;
	agentType: z.ZodOptional<z.ZodString>;
	isDraft: z.ZodOptional<z.ZodBoolean>;
}> = z.object({
	sessionAri: z.string().optional(),
	commitSha: z.string().optional(),
	branchName: z.string().optional(),
	repositoryUrl: z.string().url().optional(),
	pullRequestUrl: z.string().url().optional(),
	sandboxUrl: z.string().url().optional(),
	agentType: z.string().optional(),
	isDraft: z.boolean().optional(),
});

const CodeDiffTotalsSchema: z.ZodObject<{
	additions: z.ZodNumber;
	deletions: z.ZodNumber;
	files: z.ZodNumber;
}> = z.object({
	additions: CodeDiffCountSchema,
	deletions: CodeDiffCountSchema,
	files: CodeDiffCountSchema,
});

const CodeDiffRiskSchema: z.ZodObject<{
	severity: z.ZodEnum<['low', 'medium', 'high']>;
	description: z.ZodString;
}> = z.object({
	severity: z.enum(['low', 'medium', 'high']),
	description: z.string(),
});

const CodeDiffTestResultsSchema: z.ZodObject<{
	passed: z.ZodNumber;
	failed: z.ZodNumber;
	skipped: z.ZodNumber;
}> = z.object({
	passed: CodeDiffCountSchema,
	failed: CodeDiffCountSchema,
	skipped: CodeDiffCountSchema,
});

const CodeDiffSummarySchema: z.ZodObject<{
	description: z.ZodOptional<z.ZodString>;
	risks: z.ZodOptional<z.ZodArray<typeof CodeDiffRiskSchema>>;
	testResults: z.ZodOptional<typeof CodeDiffTestResultsSchema>;
	agentReasoning: z.ZodOptional<z.ZodString>;
}> = z.object({
	description: z.string().optional(),
	risks: z.array(CodeDiffRiskSchema).optional(),
	testResults: CodeDiffTestResultsSchema.optional(),
	agentReasoning: z.string().optional(),
});

const CodeDiffAnnotationSchema: z.ZodObject<{
	side: z.ZodEnum<['additions', 'deletions']>;
	line: z.ZodNumber;
	content: z.ZodString;
	author: z.ZodOptional<z.ZodString>;
	authorType: z.ZodOptional<z.ZodEnum<['user', 'agent']>>;
	createdAt: z.ZodOptional<z.ZodString>;
}> = z.object({
	side: z.enum(['additions', 'deletions']),
	line: CodeDiffLineNumberSchema,
	content: z.string(),
	author: z.string().optional(),
	authorType: z.enum(['user', 'agent']).optional(),
	createdAt: z.string().datetime().optional(),
});

export const CodeDiffSchema: z.ZodObject<{
	files: z.ZodArray<typeof CodeDiffFileSchema>;
	source: z.ZodOptional<typeof CodeDiffSourceSchema>;
	totals: z.ZodOptional<typeof CodeDiffTotalsSchema>;
	summary: z.ZodOptional<typeof CodeDiffSummarySchema>;
	commits: z.ZodOptional<z.ZodArray<typeof CodeDiffCommitSchema>>;
	createPullRequestUrl: z.ZodOptional<z.ZodString>;
	openPullRequestUrl: z.ZodOptional<z.ZodString>;
	mode: z.ZodOptional<z.ZodEnum<['compact', 'full']>>;
	maxVisibleFiles: z.ZodOptional<z.ZodNumber>;
	onOpenSandbox: z.ZodOptional<z.ZodType>;
	onOpenPR: z.ZodOptional<z.ZodType>;
	onOpenFullScreen: z.ZodOptional<z.ZodType>;
	onCloseFullScreen: z.ZodOptional<z.ZodType>;
	onToggleHeader: z.ZodOptional<z.ZodType>;
	onToggleFile: z.ZodOptional<z.ZodType>;
	onChangeViewMode: z.ZodOptional<z.ZodType>;
	onToggleHighlights: z.ZodOptional<z.ZodType>;
	onToggleWrapText: z.ZodOptional<z.ZodType>;
	onChangeFileSort: z.ZodOptional<z.ZodType>;
	onSelectCommit: z.ZodOptional<z.ZodType>;
	onSearchFiles: z.ZodOptional<z.ZodType>;
	onSubmitSelectedLinesFeedback: z.ZodOptional<z.ZodType>;
	annotations: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<typeof CodeDiffAnnotationSchema>>>;
}> = z.object({
	files: z.array(CodeDiffFileSchema),
	source: CodeDiffSourceSchema.optional(),
	totals: CodeDiffTotalsSchema.optional(),
	summary: CodeDiffSummarySchema.optional(),
	commits: z.array(CodeDiffCommitSchema).optional(),
	createPullRequestUrl: z.string().url().optional(),
	openPullRequestUrl: z.string().url().optional(),
	mode: z.enum(['compact', 'full']).optional(),
	maxVisibleFiles: CodeDiffCountSchema.optional(),
	onOpenSandbox: ActionSchema.optional(),
	onOpenPR: ActionSchema.optional(),
	onOpenFullScreen: ActionSchema.optional(),
	onCloseFullScreen: ActionSchema.optional(),
	onToggleHeader: ActionSchema.optional(),
	onToggleFile: ActionSchema.optional(),
	onChangeViewMode: ActionSchema.optional(),
	onToggleHighlights: ActionSchema.optional(),
	onToggleWrapText: ActionSchema.optional(),
	onChangeFileSort: ActionSchema.optional(),
	onSelectCommit: ActionSchema.optional(),
	onSearchFiles: ActionSchema.optional(),
	onSubmitSelectedLinesFeedback: ActionSchema.optional(),
	annotations: z.record(z.string(), z.array(CodeDiffAnnotationSchema)).optional(),
});

export const FormFooterSchema: z.ZodObject<{
	children: z.ZodArray<z.ZodString>;
	align: z.ZodOptional<z.ZodEnum<['start', 'end']>>;
}> = z.object({
	children: z.array(z.string()).describe('Footer content IDs (typically Buttons).'),
	align: z
		.enum(['start', 'end'])
		.optional()
		.describe(
			'Horizontal alignment of footer children. Defaults to `end` (matches AK FormFooter).',
		),
});
