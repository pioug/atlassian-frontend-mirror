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

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import type { CellSelectionRect } from '../types';
import { removeColSpan } from './remove-col-span';

// : ({width: number, height: number, rows: [Fragment]}, number, number) → {width: number, height: number, rows: [Fragment]}
// Clip or extend (repeat) the given set of cells to cover the given
// width and height. Will clip rowspan/colspan cells at the edges when
// they stick out.
export function clipCells(
	{ width: currentWidth, height: currentHeight, rows: currentRows }: CellSelectionRect,
	newWidth: number,
	newHeight: number,
): CellSelectionRect {
	let rows = currentRows;
	let width = currentWidth;
	let height = currentHeight;

	if (width !== newWidth) {
		const added: number[] = [];
		const newRows: Fragment[] = [];
		for (let row = 0; row < rows.length; row++) {
			const frag = rows[row];
			const cells: PMNode[] = [];
			for (let col = added[row] || 0, i = 0; col < newWidth; i++) {
				let cell = frag.child(i % frag.childCount);
				if (col + cell.attrs.colspan > newWidth) {
					cell = cell.type.create(
						removeColSpan(cell.attrs, cell.attrs.colspan, col + cell.attrs.colspan - newWidth),
						cell.content,
					);
				}
				cells.push(cell);
				col += cell.attrs.colspan;
				for (let j = 1; j < cell.attrs.rowspan; j++) {
					added[row + j] = (added[row + j] || 0) + cell.attrs.colspan;
				}
			}
			newRows.push(Fragment.from(cells));
		}
		rows = newRows;
		width = newWidth;
	}

	if (height !== newHeight) {
		const newRows: Fragment[] = [];
		for (let row = 0, i = 0; row < newHeight; row++, i++) {
			const cells: PMNode[] = [];
			const source = rows[i % height];
			for (let j = 0; j < source.childCount; j++) {
				let cell = source.child(j);
				if (row + cell.attrs.rowspan > newHeight) {
					cell = cell.type.create(
						{
							...cell.attrs,
							rowspan: Math.max(1, newHeight - cell.attrs.rowspan),
						},
						cell.content,
					);
				}
				cells.push(cell);
			}
			newRows.push(Fragment.from(cells));
		}
		rows = newRows;
		height = newHeight;
	}

	return { width, height, rows };
}
