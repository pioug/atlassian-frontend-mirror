import type { Schema } from '@atlaskit/editor-prosemirror/model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

/*
 * Returns true if the schema supports nesting a table inside a panel (panel_c1 variant),
 * AND the `platform_editor_nest_table_in_panel` experiment is enabled.
 *
 * ```typescript
 * const supportsTableInPanel = isPanelNestingTableSupported(state.schema);
 * ```
 */
export const isPanelNestingTableSupported = (schema: Schema): boolean => {
	const { table, panel_c1 } = schema.nodes;

	if (!table || !panel_c1) {
		return false;
	}

	// Confirm the PM schema actually allows table inside panel_c1
	const panelC1CanContainTable = panel_c1.contentMatch.matchType(table)?.validEnd === true;

	return (
		panelC1CanContainTable && expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
	);
};
