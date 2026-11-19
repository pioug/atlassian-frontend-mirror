/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports -- Catalog binding file: one named `XxxApi` export per component is the entire point (mirrors `../v0_9/apis.ts`). */

/**
 * `ComponentApi` definitions for the Agentic Forge v0.9 catalog — bind each
 * catalog name to its Zod schema. The renderer implements these via
 * `createComponentImplementation(api, RenderFn)`.
 */

// Import from web_core (not @a2ui/react) so this package stays React-free.
import type { ComponentApi } from '@a2ui/web_core/v0_9';
import type { ZodTypeAny } from 'zod';

import { ResultPanelSchema } from './schemas';
import type { AgenticForgeV09ComponentName } from './types';

/**
 * Tiny factory: pairs a catalog `name` with its `schema`. The `name`
 * parameter is restricted to the `AgenticForgeV09ComponentName` union — a
 * typo at the call site fails to compile rather than producing a
 * mis-keyed catalog entry at runtime.
 */
const apiOf = <S extends ZodTypeAny>(
	name: AgenticForgeV09ComponentName,
	schema: S,
): ComponentApi<S> => ({
	name,
	schema,
});

export const ResultPanelApi: ComponentApi<typeof ResultPanelSchema> = apiOf(
	'ResultPanel',
	ResultPanelSchema,
);
