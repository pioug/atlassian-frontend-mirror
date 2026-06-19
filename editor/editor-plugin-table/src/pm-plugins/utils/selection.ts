import type { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import type { Rect } from '@atlaskit/editor-tables/table-map';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTableClosestToPos, getSelectionRect } from '@atlaskit/editor-tables/utils';

export const getSelectedColumnIndexes = (selectionRect: Rect): number[] => {
	const columnIndexes: number[] = [];
	for (let i = selectionRect.left; i < selectionRect.right; i++) {
		columnIndexes.push(i);
	}
	return columnIndexes;
};

export const getSelectedRowIndexes = (selectionRect: Rect): number[] => {
	const rowIndexes: number[] = [];
	for (let i = selectionRect.top; i < selectionRect.bottom; i++) {
		rowIndexes.push(i);
	}
	return rowIndexes;
};

/**
 * Treats a column as fully selected when its first-row area is covered by a horizontal merge and
 * the explicit `CellSelection` starts below that merged cell. `CellSelection.isColSelection()`
 * returns `false` in this case because the selection does not include the merged first-row cell.
 */
export const isColumnSelectionWithMergedFirstRow = (selection: CellSelection): boolean => {
	const rect = getSelectionRect(selection);
	if (!rect) {
		return false;
	}
	const table = findTableClosestToPos(selection.$anchorCell);
	if (!table) {
		return false;
	}
	const map = TableMap.get(table.node);
	if (rect.bottom !== map.height || rect.top === 0) {
		return false;
	}
	for (let col = rect.left; col < rect.right; col++) {
		const topCellRect = map.findCell(map.map[col]);
		const isHorizontallyMerged = topCellRect.right - topCellRect.left > 1;
		const bridgesGapAboveSelection = topCellRect.bottom >= rect.top;
		if (!isHorizontallyMerged || !bridgesGapAboveSelection) {
			return false;
		}
	}
	return true;
};

/**
 * Treats a row as fully selected when its first-column area is covered by a vertical merge and the
 * explicit `CellSelection` starts to the right of that merged cell. `CellSelection.isRowSelection()`
 * returns `false` in this case because the selection does not include the merged first-column cell.
 */
export const isRowSelectionWithMergedFirstColumn = (selection: CellSelection): boolean => {
	const rect = getSelectionRect(selection);
	if (!rect) {
		return false;
	}
	const table = findTableClosestToPos(selection.$anchorCell);
	if (!table) {
		return false;
	}
	const map = TableMap.get(table.node);
	if (rect.right !== map.width || rect.left === 0) {
		return false;
	}
	for (let row = rect.top; row < rect.bottom; row++) {
		const leftCellRect = map.findCell(map.map[row * map.width]);
		const isVerticallyMerged = leftCellRect.bottom - leftCellRect.top > 1;
		const bridgesGapLeftOfSelection = leftCellRect.right >= rect.left;
		if (!isVerticallyMerged || !bridgesGapLeftOfSelection) {
			return false;
		}
	}
	return true;
};
