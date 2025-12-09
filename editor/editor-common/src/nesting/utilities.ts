import type { NodeType, ResolvedPos, Schema } from '@atlaskit/editor-prosemirror/model';
import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { findTable } from '@atlaskit/editor-tables';

/*
 * Returns the level of nesting of a given `nodeType` in the current position.
 * eg. table > table is nested 1 level, table > table > table is nested 2 levels.
 *
 * ```typescript
 * const nestingLevel = getParentOfTypeCount(schema.nodes.table)(position);
 * ```
 */
export const getParentOfTypeCount =
	(nodeType: NodeType) =>
	($pos: ResolvedPos): number => {
		let count = 0;
		// Loop through parent nodes from bottom to top
		for (let depth = $pos.depth; depth > 0; depth--) {
			const node = $pos.node(depth);
			// Count the table nodes
			if (node.type === nodeType) {
				count++;
			}
		}
		return count;
	};

/*
 * Returns the (absolute) position directly after the top parent node of a given `nodeType` in the current position.
 *
 * ```typescript
 * const nestingLevel = getEndTopParentNodeOfType(schema.nodes.table)(position);
 * ```
 */
export const getPositionAfterTopParentNodeOfType =
	(nodeType: NodeType) =>
	($pos: ResolvedPos): number | undefined => {
		// Loop through parent nodes from top to bottom
		for (let depth = 1; depth <= $pos.depth; depth++) {
			const node = $pos.node(depth);
			// Count the table nodes
			if (node.type === nodeType) {
				return $pos.after(depth);
			}
		}
	};

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

/*
 * Returns true if the schema supports nesting tables inside table cells.
 * This is determined by checking if table cells can contain table nodes in their content model.
 *
 * ```typescript
 * const supportsNestedTables = isNestedTablesSupported(state.schema);
 * ```
 */
export const isNestedTablesSupported = (schema: Schema): boolean => {
	const { table, tableCell, tableHeader } = schema.nodes;

	if (!table || !tableCell || !tableHeader) {
		return false;
	}

	// Check if table cells can contain table nodes by testing their content match
	const tableCellCanContainTable = tableCell.contentMatch.matchType(table)?.validEnd === true;

	const tableHeaderCanContainTable = tableHeader.contentMatch.matchType(table)?.validEnd === true;

	return tableCellCanContainTable || tableHeaderCanContainTable;
};
