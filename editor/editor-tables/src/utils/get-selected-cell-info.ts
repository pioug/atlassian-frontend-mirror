import type { Selection } from '@atlaskit/editor-prosemirror/state';

import { getSelectedTableInfo } from './get-selected-table-info';
import { getSelectionRect } from './get-selection-rect';

export function getSelectedCellInfo(selection: Selection): {
	horizontalCells: number;
	totalCells: number;
	totalColumnCount: number;
	totalRowCount: number;
	verticalCells: number;
} {
	let horizontalCells = 1;
	let verticalCells = 1;
	let totalCells = 1;

	const { table, map, totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);

	if (table && map) {
		const rect = getSelectionRect(selection);
		if (rect) {
			totalCells = map.cellsInRect(rect).length;
			horizontalCells = rect.right - rect.left;
			verticalCells = rect.bottom - rect.top;
		}
	}

	return {
		totalRowCount,
		totalColumnCount,
		horizontalCells,
		verticalCells,
		totalCells,
	};
}
