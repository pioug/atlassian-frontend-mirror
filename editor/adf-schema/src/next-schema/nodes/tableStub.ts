import type { ADFNode } from '@atlaskit/adf-schema-generator/adfNode';
import { adfNode } from '@atlaskit/adf-schema-generator/adfNode';
import type { ADFCommonNodeSpec } from '@atlaskit/adf-schema-generator/types/ADFNodeSpec';

// A bare `table` node stub, declared in an import-cycle-free leaf module so that other node
// modules (e.g. `panel`) can reference `table` in their content WITHOUT importing the heavy
// `tableNodes.ts` definition module. Importing `tableNodes.ts` from `panel.ts` would form a
// module import cycle (panel -> tableNodes -> nestedExpand / tableCellContentPseudoGroup ->
// panel) and crash at module-eval time.
//
// `tableNodes.ts` imports this same stub and calls `.define()` / `.variant()` on it, so the
// object here is the one and only `table` node. Spec resolution is deferred to codegen traversal,
// which is cycle-aware, so referencing this stub before it is defined is safe.
export const table: ADFNode<[string], ADFCommonNodeSpec> = adfNode('table');
