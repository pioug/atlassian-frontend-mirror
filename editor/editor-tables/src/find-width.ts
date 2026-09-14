/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export function findWidth(table: PMNode): number {
	let width = -1;
	let hasRowSpan = false;
	for (let row = 0; row < table.childCount; row++) {
		const rowNode = table.child(row);
		let rowWidth = 0;
		if (hasRowSpan) {
			for (let j = 0; j < row; j++) {
				const prevRow = table.child(j);
				for (let i = 0; i < prevRow.childCount; i++) {
					const cell = prevRow.child(i);
					if (j + cell.attrs.rowspan > row) {
						rowWidth += cell.attrs.colspan;
					}
				}
			}
		}
		for (let i = 0; i < rowNode.childCount; i++) {
			const cell = rowNode.child(i);
			rowWidth += cell.attrs.colspan;
			if (cell.attrs.rowspan > 1) {
				hasRowSpan = true;
			}
		}
		if (width === -1) {
			width = rowWidth;
		} else if (width !== rowWidth) {
			width = Math.max(width, rowWidth);
		}
	}
	return width;
}
