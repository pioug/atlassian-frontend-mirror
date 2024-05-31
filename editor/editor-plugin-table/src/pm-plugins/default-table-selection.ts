export const defaultTableSelection = {
	hoveredColumns: [],
	hoveredRows: [],
};

/**
 * Creating a separate object for hoveredCell so it doesn't get defaulted when `handleDocOrSelectionChanged` runs.
 *
 * It is safe to persist this value as it gets removed when the mouse cursor leaves the table, so no need to remove it
 * when doc changes.
 */
export const defaultHoveredCell = {
	hoveredCell: { rowIndex: undefined, colIndex: undefined },
};
