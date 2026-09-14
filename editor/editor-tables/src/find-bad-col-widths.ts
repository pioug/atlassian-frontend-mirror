/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { type TableMap, TableProblemTypes } from './table-map';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function freshColWidth(attrs: { [key: string]: any }) {
	if (attrs.colwidth) {
		return attrs.colwidth.slice();
	}
	const result: number[] = [];
	for (let i = 0; i < attrs.colspan; i++) {
		result.push(0);
	}
	return result;
}

export function findBadColWidths(map: TableMap, colWidths: number[], table: PMNode): void {
	if (!map.problems) {
		map.problems = [];
	}
	const seen: { [key: number]: boolean } = {};
	for (let i = 0; i < map.map.length; i++) {
		const pos = map.map[i];
		if (seen[pos]) {
			continue;
		}
		seen[pos] = true;
		const node = table.nodeAt(pos) as PMNode;
		let updated = null;
		for (let j = 0; j < node.attrs.colspan; j++) {
			const col = (i + j) % map.width,
				colWidth = colWidths[col * 2];
			if (colWidth != null && (!node.attrs.colwidth || node.attrs.colwidth[j] !== colWidth)) {
				(updated || (updated = freshColWidth(node.attrs)))[j] = colWidth;
			}
		}
		if (updated) {
			map.problems.unshift({
				type: TableProblemTypes.COLWIDTH_MISMATCH,
				pos,
				colwidth: updated,
			});
		}
	}
}
