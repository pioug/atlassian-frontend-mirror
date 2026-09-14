import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { TableContext } from '../table-map';
import { removeColSpan } from './remove-col-span';

// eslint-disable-next-line @atlaskit/editor/no-re-export -- Preserve the existing public entry-point API.
export { removeColumnAt } from './remove-column-at';
// eslint-disable-next-line @atlaskit/editor/no-re-export -- Preserve the existing public entry-point API.
export { removeSelectedColumns } from './remove-selected-columns';
// eslint-disable-next-line @atlaskit/editor/no-re-export -- Preserve the existing public entry-point API.
export { removeColumnClosestToPos } from './remove-column-closest-to-pos';

export function removeColumn(
	tr: Transaction,
	{ map, table, tableStart }: TableContext,
	columnIndex: number,
): Transaction {
	const mapStart = tr.mapping.maps.length;

	for (let row = 0; row < map.height; ) {
		const index = row * map.width + columnIndex;
		const pos = map.map[index];
		const cell = table.nodeAt(pos);
		if (!cell) {
			continue;
		}

		// If this is part of a col-spanning cell
		if (
			(columnIndex > 0 && map.map[index - 1] === pos) ||
			(columnIndex < map.width - 1 && map.map[index + 1] === pos)
		) {
			tr.setNodeMarkup(
				tr.mapping.slice(mapStart).map(tableStart + pos),
				undefined,
				removeColSpan(cell.attrs, columnIndex - map.colCount(pos)),
			);
		} else {
			const start = tr.mapping.slice(mapStart).map(tableStart + pos);
			tr.delete(start, start + cell.nodeSize);
		}

		row += cell.attrs.rowspan;
	}

	return tr;
}
