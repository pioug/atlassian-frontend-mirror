import type { Schema } from '@atlaskit/editor-prosemirror/model';

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
