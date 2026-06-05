import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { findTable } from '@atlaskit/editor-tables';

/*
 * Returns true if the current selection is inside a table nested within a table.
 *
 * ```typescript
 * const isNestedTable = isSelectionTableNestedInTable(state);
 * ```
 */
export const isSelectionTableNestedInTable = (state: EditorState): boolean => {
	const table = findTable(state.selection);
	if (!table) {
		return false;
	}
	const parent = state.doc.resolve(table.pos).parent;
	const nodeTypes = state.schema.nodes;

	return [nodeTypes.tableHeader, nodeTypes.tableCell].includes(parent.type);
};
