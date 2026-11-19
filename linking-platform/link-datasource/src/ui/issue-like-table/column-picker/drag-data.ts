export const COLUMN_PICKER_DRAG_TYPE = 'column-picker-option';

export type ColumnPickerDropZone = 'selected' | 'unselected';

export const isColumnPickerDragDataFor = (
	data: Record<string | symbol, unknown>,
	pickerId: symbol | null,
): boolean =>
	pickerId !== null && data.type === COLUMN_PICKER_DRAG_TYPE && data.pickerId === pickerId;
