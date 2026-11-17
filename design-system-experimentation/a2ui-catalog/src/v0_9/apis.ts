/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports -- Catalog binding file: one named `XxxApi` export per component is the entire point. Splitting into 13 single-export files would obscure the catalog and break the import ergonomics the renderer relies on. */

/**
 * v0.9 `ComponentApi` definitions — bind each catalog name to its Zod
 * schema. The renderer implements these via
 * `createComponentImplementation(api, RenderFn)`.
 *
 * Each `XxxApi` is exported as a separate named const so consumer
 * adapters can `import { ButtonApi } from '…/v0_9'` and have `RenderFn`'s
 * `props` parameter narrow to the right shape. We can't replace the
 * named exports with a generic factory call site (we tried — it breaks
 * adapter prop inference).
 *
 * What we CAN do is collapse the per-component boilerplate into a tiny
 * `apiOf()` helper. That gives us:
 *   - one-line declarations instead of 4-line blocks
 *   - a name-typo guard: the `name` argument is typed
 *     `A2UIv09ComponentName`, so `apiOf('Buttn', …)` fails at compile
 *     time
 *   - zero changes at any call site — `ButtonApi` is still a named
 *     const typed `ComponentApi<typeof ButtonSchema>`.
 */

// Import from web_core (not @a2ui/react) so this package stays React-free.
import type { ComponentApi } from '@a2ui/web_core/v0_9';
import type { ZodTypeAny } from 'zod';

import {
	ButtonSchema,
	CardBodySchema,
	CardContentSchema,
	CardDescriptionSchema,
	CardFooterSchema,
	CardHeaderSchema,
	CardLeadingSchema,
	CardMediaSchema,
	CardPrimaryContentSchema,
	CardSchema,
	CardTitleSchema,
	CheckBoxSchema,
	CodeDiffSchema,
	ColumnSchema,
	FieldSchema,
	FormFooterSchema,
	FormHeaderSchema,
	FormSchema,
	FormSectionSchema,
	MultipleChoiceSchema,
	RowSchema,
	TextFieldSchema,
	TextSchema,
} from './schemas';
import type { A2UIv09ComponentName } from './types';

/**
 * Tiny factory: pairs a catalog `name` with its `schema`. The `name`
 * parameter is restricted to the `A2UIv09ComponentName` union — a
 * typo at the call site fails to compile rather than producing a
 * mis-keyed catalog entry at runtime.
 */
const apiOf = <S extends ZodTypeAny>(name: A2UIv09ComponentName, schema: S): ComponentApi<S> => ({
	name,
	schema,
});

// ── primitives ───────────────────────────────────────────────────────
export const ButtonApi: ComponentApi<typeof ButtonSchema> = apiOf('Button', ButtonSchema);
export const TextApi: ComponentApi<typeof TextSchema> = apiOf('Text', TextSchema);

// ── layout ───────────────────────────────────────────────────────────
export const RowApi: ComponentApi<typeof RowSchema> = apiOf('Row', RowSchema);
export const ColumnApi: ComponentApi<typeof ColumnSchema> = apiOf('Column', ColumnSchema);
export const CardApi: ComponentApi<typeof CardSchema> = apiOf('Card', CardSchema);
export const CardMediaApi: ComponentApi<typeof CardMediaSchema> = apiOf(
	'CardMedia',
	CardMediaSchema,
);
export const CardContentApi: ComponentApi<typeof CardContentSchema> = apiOf(
	'CardContent',
	CardContentSchema,
);
export const CardLeadingApi: ComponentApi<typeof CardLeadingSchema> = apiOf(
	'CardLeading',
	CardLeadingSchema,
);
export const CardPrimaryContentApi: ComponentApi<typeof CardPrimaryContentSchema> = apiOf(
	'CardPrimaryContent',
	CardPrimaryContentSchema,
);
export const CardHeaderApi: ComponentApi<typeof CardHeaderSchema> = apiOf(
	'CardHeader',
	CardHeaderSchema,
);
export const CardTitleApi: ComponentApi<typeof CardTitleSchema> = apiOf(
	'CardTitle',
	CardTitleSchema,
);
export const CardDescriptionApi: ComponentApi<typeof CardDescriptionSchema> = apiOf(
	'CardDescription',
	CardDescriptionSchema,
);
export const CardBodyApi: ComponentApi<typeof CardBodySchema> = apiOf('CardBody', CardBodySchema);
export const CardFooterApi: ComponentApi<typeof CardFooterSchema> = apiOf(
	'CardFooter',
	CardFooterSchema,
);

// ── inputs ───────────────────────────────────────────────────────────
export const CheckBoxApi: ComponentApi<typeof CheckBoxSchema> = apiOf('CheckBox', CheckBoxSchema);
export const TextFieldApi: ComponentApi<typeof TextFieldSchema> = apiOf(
	'TextField',
	TextFieldSchema,
);
export const MultipleChoiceApi: ComponentApi<typeof MultipleChoiceSchema> = apiOf(
	'MultipleChoice',
	MultipleChoiceSchema,
);

// ── code diff ────────────────────────────────────────────────────────
export const CodeDiffApi: ComponentApi<typeof CodeDiffSchema> = apiOf('CodeDiff', CodeDiffSchema);

// ── form structure ──────────────────────────────────────────────────
export const FormApi: ComponentApi<typeof FormSchema> = apiOf('Form', FormSchema);
export const FieldApi: ComponentApi<typeof FieldSchema> = apiOf('Field', FieldSchema);
export const FormSectionApi: ComponentApi<typeof FormSectionSchema> = apiOf(
	'FormSection',
	FormSectionSchema,
);
export const FormHeaderApi: ComponentApi<typeof FormHeaderSchema> = apiOf(
	'FormHeader',
	FormHeaderSchema,
);
export const FormFooterApi: ComponentApi<typeof FormFooterSchema> = apiOf(
	'FormFooter',
	FormFooterSchema,
);
