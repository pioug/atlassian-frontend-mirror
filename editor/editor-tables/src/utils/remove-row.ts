import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { TableContext } from '../table-map';

// eslint-disable-next-line @atlaskit/editor/no-re-export -- Preserve the existing public entry-point API.
export { removeRowAt } from './remove-row-at';
// eslint-disable-next-line @atlaskit/editor/no-re-export -- Preserve the existing public entry-point API.
export { removeSelectedRows } from './remove-selected-rows';
// eslint-disable-next-line @atlaskit/editor/no-re-export -- Preserve the existing public entry-point API.
export { removeRowClosestToPos } from './remove-row-closest-to-pos';

export function removeRow(
	tr: Transaction,
	{ map, table, tableStart }: TableContext,
	rowIndex: number,
): Transaction {
	let rowPos = 0;
	for (let i = 0; i < rowIndex; i++) {
		rowPos += table.child(i).nodeSize;
	}
	const nextRow = rowPos + table.child(rowIndex).nodeSize;

	const mapFrom = tr.mapping.maps.length;
	tr.delete(rowPos + tableStart, nextRow + tableStart);

	for (let col = 0, index = rowIndex * map.width; col < map.width; col++, index++) {
		const pos = map.map[index];
		if (rowIndex > 0 && pos === map.map[index - map.width]) {
			// If this cell starts in the row above, simply reduce its rowspan
			const cell = table.nodeAt(pos);
			if (!cell) {
				continue;
			}
			const attrs = cell.attrs;
			tr.setNodeMarkup(tr.mapping.slice(mapFrom).map(pos + tableStart), undefined, {
				...attrs,
				rowspan: attrs.rowspan - 1,
			});
			col += attrs.colspan - 1;
		} else if (rowIndex < map.width && pos === map.map[index + map.width]) {
			// Else, if it continues in the row below, it has to be moved down
			const cell = table.nodeAt(pos);
			if (!cell) {
				continue;
			}
			const copy = cell.type.create(
				{ ...cell.attrs, rowspan: cell.attrs.rowspan - 1 },
				cell.content,
			);
			const newPos = map.positionAt(rowIndex + 1, col, table);
			tr.insert(tr.mapping.slice(mapFrom).map(tableStart + newPos), copy);
			col += cell.attrs.colspan - 1;
		}
	}

	return tr;
}
