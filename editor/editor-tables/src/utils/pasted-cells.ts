// Utilities used for copy/paste handling.
//
// This module handles pasting cell content into tables, or pasting
// anything into a cell selection, as replacing a block of cells with
// the content of the selection. When pasting cells into a cell, that
// involves placing the block of pasted content so that its top left
// aligns with the selection cell, optionally extending the table to
// the right or bottom to make sure it is large enough. Pasting into a
// cell selection is different, here the cells in the selection are
// clipped to the selection's rectangle, optionally repeating the
// pasted cells when they are smaller than the selection.

import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Slice } from '@atlaskit/editor-prosemirror/model';

import type { CellSelectionRect } from '../types';
import { fitSlice } from './fit-slice';
import { tableNodeTypes } from './table-node-types';

// Utilities to help with copying and pasting table cells
/**
 * Replace any header cells with table cells.
 *
 * @param schema
 * @param cells
 * @returns Fragment with header cells converted to table cells
 */
function stripHeaderType(schema: Schema, cells: Fragment): Fragment {
	const newCells: PMNode[] = [];
	cells.forEach((cell) => {
		// Convert to cell type if not already
		const cellNodeType = tableNodeTypes(schema).cell;
		const tableCell =
			cell.type === cellNodeType
				? cell
				: (cellNodeType.createAndFill(cell.attrs, cell.content, cell.marks) ?? cell);

		newCells.push(tableCell);
	});
	return Fragment.from(newCells);
}

// : (Schema, [Fragment]) → {width: number, height: number, rows: [Fragment]}
// Compute the width and height of a set of cells, and make sure each
// row has the same number of cells.
function ensureRectangular(schema: Schema, rowsFragment: Fragment[]): CellSelectionRect {
	const rows = rowsFragment;
	const widths: number[] = [];
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		for (let j = row.childCount - 1; j >= 0; j--) {
			const { rowspan, colspan } = row.child(j).attrs;
			for (let r = i; r < i + rowspan; r++) {
				widths[r] = (widths[r] || 0) + colspan;
			}
		}
	}
	let width = 0;
	for (let r = 0; r < widths.length; r++) {
		width = Math.max(width, widths[r]);
	}
	for (let r = 0; r < widths.length; r++) {
		if (r >= rows.length) {
			rows.push(Fragment.empty);
		}
		if (widths[r] < width) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const empty = tableNodeTypes(schema).cell.createAndFill()!;
			const cells: PMNode[] = [];
			for (let i = widths[r]; i < width; i++) {
				cells.push(empty);
			}
			rows[r] = rows[r].append(Fragment.from(cells));
		}
	}
	return { height: rows.length, width, rows };
}

// : (Slice) → ?{width: number, height: number, rows: [Fragment]}
// Get a rectangular area of cells from a slice, or null if the outer
// nodes of the slice aren't table cells or rows.
export function pastedCells(slice: Slice): CellSelectionRect | null {
	if (!slice.size) {
		return null;
	}
	let { content, openStart, openEnd } = slice;
	if (!content.firstChild) {
		throw new Error('pastedCells: no firstChild defined for content');
	}
	while (
		content.childCount === 1 &&
		((openStart > 0 && openEnd > 0) || content.firstChild.type.spec.tableRole === 'table')
	) {
		openStart--;
		openEnd--;
		content = content.firstChild.content;
		if (!content.firstChild) {
			throw new Error('pastedCells: no firstChild defined for content');
		}
	}
	const first = content.firstChild;
	const role = first.type.spec.tableRole;
	const { schema } = first.type;
	const rows: Fragment[] = [];
	if (role === 'row') {
		for (let i = 0; i < content.childCount; i++) {
			let cells = content.child(i).content;
			const left = i ? 0 : Math.max(0, openStart - 1);
			const right = i < content.childCount - 1 ? 0 : Math.max(0, openEnd - 1);
			if (left || right) {
				cells = fitSlice(tableNodeTypes(schema).row, new Slice(cells, left, right)).content;
			}
			rows.push(cells);
		}
	} else if (role === 'cell' || role === 'header_cell') {
		rows.push(
			openStart || openEnd
				? fitSlice(tableNodeTypes(schema).row, new Slice(content, openStart, openEnd)).content
				: content,
		);
	} else {
		return null;
	}
	const rowsWithoutHeaders = rows.map((row) => stripHeaderType(schema, row));
	return ensureRectangular(schema, rowsWithoutHeaders);
}
