import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

import type { Rect } from '../rect';
import { TableMap } from '../table-map';
import { findCellClosestToPos } from './find-cell-closest-to-pos';
import { findTableClosestToPos } from './find-table-closest-to-pos';

// Returns the rectangle spanning a cell closest to a given `$pos`.
export const findCellRectClosestToPos = ($pos: ResolvedPos): Rect | undefined => {
	const cell = findCellClosestToPos($pos);
	if (cell) {
		const table = findTableClosestToPos($pos);
		if (table) {
			const map = TableMap.get(table.node);
			const cellPos = cell.pos - table.start;

			return map.rectBetween(cellPos, cellPos);
		}
	}
};
