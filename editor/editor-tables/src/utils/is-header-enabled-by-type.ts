import type { SelectionRect } from './selection-rect';
import type { TableNodeCache } from './table-node-types';
import type { ToggleType } from './toggle-header';

export function isHeaderEnabledByType(
	type: ToggleType,
	rect: SelectionRect,
	types: TableNodeCache,
): boolean {
	// Get cell positions for first row or first column
	const cellPositions = rect.map.cellsInRect({
		left: 0,
		top: 0,
		right: type === 'row' ? rect.map.width : 1,
		bottom: type === 'column' ? rect.map.height : 1,
	});

	for (let i = 0; i < cellPositions.length; i++) {
		const cell = rect.table.nodeAt(cellPositions[i]);
		if (cell && cell.type !== types.header_cell) {
			return false;
		}
	}

	return true;
}
