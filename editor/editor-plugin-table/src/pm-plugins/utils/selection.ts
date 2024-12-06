import type { Rect } from '@atlaskit/editor-tables/table-map';

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
