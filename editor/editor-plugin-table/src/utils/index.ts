export { getSelectedColumnIndexes, getSelectedRowIndexes } from './selection';
export {
	findControlsHoverDecoration,
	createControlsHoverDecoration,
	createCellHoverDecoration,
	updateDecorations,
	createColumnInsertLine,
	createColumnLineResize,
	createRowInsertLine,
} from './decoration';
export {
	containsHeaderColumn,
	containsHeaderRow,
	checkIfHeaderColumnEnabled,
	checkIfHeaderRowEnabled,
	checkIfNumberColumnEnabled,
	getTableWidth,
	tablesHaveDifferentColumnWidths,
	tablesHaveDifferentNoOfColumns,
	tablesHaveDifferentNoOfRows,
	isTableNested,
	isTableNestedInMoreThanOneNode,
} from './nodes';
export {
	transformSliceToRemoveOpenTable,
	transformSliceToCorrectEmptyTableCells,
	transformSliceToFixHardBreakProblemOnCopyFromCell,
} from './paste';
export {
	isCell,
	isCornerButton,
	isInsertRowButton,
	isColumnControlsDecorations,
	isTableControlsButton,
	isTableContainerOrWrapper,
	isRowControlsButton,
	isDragColumnFloatingInsertDot,
	isDragRowFloatingInsertDot,
	isDragCornerButton,
	getColumnOrRowIndex,
	getMousePositionHorizontalRelativeByElement,
	getMousePositionVerticalRelativeByElement,
	isResizeHandleDecoration,
	hasResizeHandler,
	findNearestCellIndexToPoint,
} from './dom';
export {
	convertHTMLCellIndexToColumnIndex,
	getColumnsWidths,
	getColumnDeleteButtonParams,
	getColumnIndexMappedToColumnIndexInFirstRow,
} from './column-controls';
export {
	getRowHeights,
	getRowDeleteButtonParams,
	getRowsParams,
	getRowClassNames,
	copyPreviousRow,
} from './row-controls';
export type { RowParams } from './row-controls';
export { getSelectedTableInfo, getSelectedCellInfo } from './analytics';
export { getMergedCellsPositions, getAssistiveMessage } from './table';
export { updatePluginStateDecorations } from './update-plugin-state-decorations';
export {
	hasMergedCellsInBetween,
	hasMergedCellsInSelection,
	findDuplicatePosition,
} from './merged-cells';
export { createTableWithWidth } from './create';
