import type { Slice } from '@atlaskit/editor-prosemirror/model';

export type TableDiffMode =
	/** Add table headers, or replace whole cells. Draws one content widget per cell. */
	| { kind: 'cells' }
	/** Delete a row, or replace a whole row. Draws a row copy inside the table. */
	| { kind: 'rows' }
	/** Delete a column, or replace a whole table. Draws a table copy next to the live table. */
	| { kind: 'wholeTable' }
	/** Delete cells with no replacement. The new document has no cell to anchor to, so nothing draws. */
	| { kind: 'none' }
	/** Any change outside a table, such as a paragraph edit. Draws the generic block widget. */
	| { kind: 'generic' };

const CELL_TYPE_NAMES = ['tableCell', 'tableHeader'];

export const getTableDiffMode = ({
	slice,
	isInserted,
}: {
	isInserted: boolean;
	slice: Slice;
}): TableDiffMode => {
	const topLevelNodes = slice.content.content;

	if (topLevelNodes.some((node) => CELL_TYPE_NAMES.includes(node.type.name))) {
		return isInserted ? { kind: 'cells' } : { kind: 'none' };
	}
	if (topLevelNodes.some((node) => node.type.name === 'tableRow')) {
		return { kind: 'rows' };
	}
	if (
		topLevelNodes.length === 1 &&
		topLevelNodes[0].type.name === 'table' &&
		slice.openStart === 0 &&
		slice.openEnd === 0
	) {
		return { kind: 'wholeTable' };
	}
	return { kind: 'generic' };
};
