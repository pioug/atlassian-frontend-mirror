import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

// TODO: ED-26961 - move to prosemirror-utils
export const replaceCells = (
	tr: Transaction,
	table: PMNode,
	tablePos: number,
	modifyCell: (cell: PMNode, rowIndex: number, colIndex: number) => PMNode,
): Transaction => {
	const rows: PMNode[] = [];
	let modifiedCells = 0;
	for (let rowIndex = 0; rowIndex < table.childCount; rowIndex++) {
		const row = table.child(rowIndex);
		const cells: PMNode[] = [];

		for (let colIndex = 0; colIndex < row.childCount; colIndex++) {
			const cell = row.child(colIndex);

			// TODO: ED-26961 - The rowIndex and colIndex are not accurate in a merged cell scenario
			// e.g. table with 5 columns might have only one cell in a row, colIndex will be 1, where it should be 4
			const node = modifyCell(cell, rowIndex, colIndex);
			if (node.sameMarkup(cell) === false) {
				modifiedCells++;
			}
			cells.push(node);
		}

		if (cells.length) {
			rows.push(row.type.createChecked(row.attrs, cells, row.marks));
		}
	}

	// Check if the table has changed before replacing.
	// If no cells are modified our counter will be zero.
	if (rows.length && modifiedCells !== 0) {
		const newTable = table.type.createChecked(table.attrs, rows, table.marks);
		return tr.replaceWith(tablePos, tablePos + table.nodeSize, newTable);
	}

	return tr;
};

/**
 * Position-preserving alternative to `replaceCells`.
 *
 * Uses `setNodeMarkup` per cell instead of rebuilding the whole table with
 * `replaceWith`, so document positions inside cells are never invalidated.
 * This preserves any existing selection through `tr.mapping`.
 */
export const updateCellsMarkup = (
	tr: Transaction,
	table: PMNode,
	tablePos: number,
	modifyCell: (cell: PMNode, rowIndex: number, colIndex: number) => PMNode,
): Transaction => {
	let rowOffset = tablePos + 1;

	for (let rowIndex = 0; rowIndex < table.childCount; rowIndex++) {
		const row = table.child(rowIndex);
		let cellOffset = rowOffset + 1;

		for (let colIndex = 0; colIndex < row.childCount; colIndex++) {
			const cell = row.child(colIndex);
			const modified = modifyCell(cell, rowIndex, colIndex);

			if (!modified.sameMarkup(cell)) {
				tr.setNodeMarkup(cellOffset, modified.type, modified.attrs, modified.marks);
			}

			cellOffset += cell.nodeSize;
		}

		rowOffset += row.nodeSize;
	}

	return tr;
};
