export {
  getSelectedColumnIndexes,
  getSelectedRowIndexes,
  normalizeSelection,
  isSelectionUpdated,
} from './selection';
export {
  findControlsHoverDecoration,
  createControlsHoverDecoration,
  createColumnControlsDecoration,
  createColumnSelectedDecoration,
  createCellHoverDecoration,
  updateDecorations,
  createResizeHandleDecoration,
  createColumnInsertLine,
  createColumnLineResize,
  createRowInsertLine,
} from './decoration';
export {
  isIsolating,
  containsHeaderColumn,
  containsHeaderRow,
  checkIfHeaderColumnEnabled,
  checkIfHeaderRowEnabled,
  checkIfNumberColumnEnabled,
  isLayoutSupported,
  getTableWidth,
  tablesHaveDifferentColumnWidths,
  tablesHaveDifferentNoOfColumns,
  isTableNested,
  anyChildCellMergedAcrossRow,
  supportedHeaderRow,
} from './nodes';
export {
  unwrapContentFromTable,
  removeTableFromFirstChild,
  removeTableFromLastChild,
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
  isDragRowControlsButton,
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
  isColumnDeleteButtonVisible,
  getColumnDeleteButtonParams,
  getColumnClassNames,
  getColumnIndexMappedToColumnIndexInFirstRow,
} from './column-controls';
export {
  getRowHeights,
  isRowDeleteButtonVisible,
  getRowDeleteButtonParams,
  getRowsParams,
  getRowClassNames,
  copyPreviousRow,
} from './row-controls';
export type { RowParams } from './row-controls';
export { getSelectedTableInfo, getSelectedCellInfo } from './analytics';
export { getMergedCellsPositions } from './table';
export { updatePluginStateDecorations } from './update-plugin-state-decorations';
export {
  hasMergedCellsInColumn,
  hasMergedCellsInRow,
  hasMergedCellsInBetween,
  hasMergedCellsInSelection,
  findDuplicatePosition,
  checkEdgeHasMergedCells,
} from './merged-cells';
export { createTableWithWidth } from './create';
