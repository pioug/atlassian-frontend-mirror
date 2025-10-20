import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import { tableCellMinWidth, tableNewColumnMinWidth } from '@atlaskit/editor-common/styles';
import type { GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import { calcTableColumnWidths } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Rect } from '@atlaskit/editor-tables/table-map';

import { getSelectedTableInfo } from '../../utils/analytics';

import { getColWidthFix, hasTableBeenResized, insertColgroupFromNode } from './colgroup';
import type { ColumnState } from './column-state';
import { getCellsRefsInColumn, getColumnStateFromDOM } from './column-state';
import { syncStickyRowToTable } from './dom';
import { getTableMaxWidth, getTableScalingPercent } from './misc';
import type { ResizeState, ResizeStateWithAnalytics } from './types';

export const getResizeState = ({
	minWidth,
	maxSize,
	table,
	tableRef,
	start,
	domAtPos,
	isTableScalingEnabled = false,
	shouldUseIncreasedScalingPercent = false,
	isCommentEditor = false,
}: {
	domAtPos: (pos: number) => { node: Node; offset: number };
	isCommentEditor: boolean;
	isTableScalingEnabled: boolean;
	maxSize: number;
	minWidth: number;
	shouldUseIncreasedScalingPercent: boolean;
	start: number;
	table: PMNode;
	tableRef: HTMLTableElement | null;
}): ResizeState => {
	if (
		(isTableScalingEnabled && !isCommentEditor) ||
		(isTableScalingEnabled && isCommentEditor && table.attrs?.width)
	) {
		const scalePercent = getTableScalingPercent(table, tableRef, shouldUseIncreasedScalingPercent);
		minWidth = Math.ceil(minWidth / scalePercent);
	}

	if (hasTableBeenResized(table)) {
		// If the table has been resized, we can use the column widths from the table node
		const cols = calcTableColumnWidths(table).map((width, index) => ({
			width: width === 0 ? tableNewColumnMinWidth : width,
			minWidth: width === 0 ? tableNewColumnMinWidth : minWidth,
			index,
		}));

		const widths = cols.map((col) => col.width);
		const tableWidth = widths.reduce((sum, width) => sum + width, 0);
		const overflow = tableWidth > maxSize;

		return {
			cols,
			widths,
			maxSize,
			tableWidth,
			overflow,
			isScaled: isTableScalingEnabled,
		};
	}

	const shouldReinsertColgroup = !isTableScalingEnabled;

	// Getting the resize state from DOM
	const colgroupChildren = insertColgroupFromNode(
		tableRef,
		table,
		isTableScalingEnabled,
		shouldReinsertColgroup, // don't reinsert colgroup when preserving table width - this causes widths to jump
		shouldUseIncreasedScalingPercent,
		isCommentEditor,
	);
	const cols = Array.from(colgroupChildren).map((_, index) => {
		// If the table hasn't been resized and we have a table width attribute, we can use it
		// to calculate the widths of the columns
		if (isTableScalingEnabled) {
			// isCommentEditor when table cols were not resized,
			// we want to use tableRef.parentElement.clientWidth, which is the same as maxSize
			const tableNodeWidth =
				isCommentEditor && !table.attrs?.width ? maxSize : getTableContainerWidth(table);
			return {
				index,
				width: tableNodeWidth / colgroupChildren.length,
				minWidth,
			};
		}
		const cellsRefs = getCellsRefsInColumn(index, table, start, domAtPos);
		return getColumnStateFromDOM(cellsRefs, index, minWidth);
	});

	const widths = cols.map((col) => col.width);
	const tableWidth = widths.reduce((sum, width) => sum + width, 0);

	const overflow = tableWidth > maxSize;

	return {
		cols,
		widths,
		maxSize,
		tableWidth,
		overflow,
		isScaled: isTableScalingEnabled,
	};
};

// updates Colgroup DOM node with new widths
export const updateColgroup = (
	state: ResizeState,
	tableRef: HTMLElement | null,
	tableNode?: PMNode,
	isTableScalingEnabled?: boolean,
	scalePercent?: number,
): void => {
	const cols = tableRef?.querySelectorAll(':scope > colgroup > col') as
		| NodeListOf<HTMLElement>
		| undefined;
	const columnsCount = cols?.length;
	/**
     updateColgroup will update whole table scale when click the column resize handle, this behavior will affect when table overflowed, when now resize handle been dragged and extend to make table overflowed, table will show overflow. This need to be confirmed because it conflict with how isTableScalingEnabled work.
     We don't want to scale the table when resizing columns, only when viewpoint shrinks the table.
     We need to remove !isColumnResizing if we handled auto scale table when mouseUp event.
     * */
	if (isTableScalingEnabled && tableNode) {
		state.cols
			.filter((column) => column && !!column.width) // if width is 0, we dont want to apply that.
			.forEach((column, i) => {
				const fixedColWidth = getColWidthFix(column.width, columnsCount ?? 0);
				const scaledWidth = fixedColWidth * (scalePercent || 1);
				const finalWidth = Math.max(scaledWidth, tableCellMinWidth);
				// we aren't handling the remaining pixels here when the 48px min width is reached
				if (cols?.[i]) {
					cols[i].style.width = `${finalWidth}px`;
				}
			});
	} else {
		state.cols
			.filter((column) => column && !!column.width) // if width is 0, we dont want to apply that.
			.forEach((column, i) => {
				if (cols?.[i]) {
					cols[i].style.width = `${getColWidthFix(column.width, columnsCount ?? 0)}px`;
				}
			});
	}

	// colgroup has updated, reflect new widths in sticky header
	syncStickyRowToTable(tableRef);
};

export const getTotalWidth = ({ cols }: ResizeState): number => {
	return cols.reduce((totalWidth, col) => totalWidth + col.width, 0);
};

// adjust columns to take up the total width
// difference in total columns widths vs table width happens due to the "Math.floor"
export const adjustColumnsWidths = (resizeState: ResizeState, maxSize: number): ResizeState => {
	const totalWidth = getTotalWidth(resizeState);
	const diff = maxSize - totalWidth;
	if (diff > 0 || (diff < 0 && Math.abs(diff) < tableCellMinWidth)) {
		let updated = false;
		return {
			...resizeState,
			cols: resizeState.cols.map((col) => {
				if (!updated && col.width + diff > col.minWidth) {
					updated = true;
					return { ...col, width: col.width + diff };
				}
				return col;
			}),
		};
	}

	return resizeState;
};

export const evenAllColumnsWidths = (resizeState: ResizeState): ResizeState => {
	const maxSize = getTotalWidth(resizeState);
	const evenWidth = Math.floor(maxSize / resizeState.cols.length);
	const cols = resizeState.cols.map((col) => ({ ...col, width: evenWidth }));

	return adjustColumnsWidths({ ...resizeState, cols }, maxSize);
};

const getSpace = (columns: ColumnState[], start: number, end: number) =>
	columns
		.slice(start, end)
		.map((col) => col.width)
		.reduce((sum, width) => sum + width, 0);

const evenSelectedColumnsWidths = (resizeState: ResizeState, rect: Rect): ResizeState => {
	const cols = resizeState.cols;
	const selectedSpace = getSpace(cols, rect.left, rect.right);
	const allSpace = getSpace(cols, 0, cols.length);

	const allWidth = allSpace / cols.length;
	const width = selectedSpace / (rect.right - rect.left);

	// Result equals even distribution of all columns -
	// unset widths of all columns
	if (allWidth === width) {
		return {
			...resizeState,
			widths: cols.map(() => width),
			cols: resizeState.cols.map((col) => ({
				...col,
				width: 0,
			})),
		};
	}

	return {
		...resizeState,
		widths: cols.map((col, i) => (i >= rect.left && i < rect.right ? width : col.width)),
		cols: cols.map((col, i) => ({
			...col,
			width: i >= rect.left && i < rect.right ? width : col.width,
		})),
	};
};

export const bulkColumnsResize = (
	resizeState: ResizeState,
	columnsIndexes: number[],
	sourceColumnIndex: number,
) => {
	const currentTableWidth = getTotalWidth(resizeState);
	const colIndex =
		columnsIndexes.indexOf(sourceColumnIndex) > -1 ? sourceColumnIndex : sourceColumnIndex + 1;
	const sourceCol = resizeState.cols[colIndex];
	const seenColumns: {
		[key: number]: { index: number; minWidth: number; width: number };
	} = {};
	const widthsDiffs: number[] = [];
	const cols = resizeState.cols.map((col) => {
		if (columnsIndexes.indexOf(col.index) > -1) {
			const diff = col.width - sourceCol.width;
			if (diff !== 0) {
				widthsDiffs.push(diff);
			}
			return { ...col, width: sourceCol.width };
		}
		return col;
	});

	let newState = {
		...resizeState,
		cols: cols.map((col) => {
			if (
				columnsIndexes.indexOf(col.index) > -1 ||
				// take from prev columns only if dragging the first handle to the left
				(columnsIndexes.indexOf(sourceColumnIndex) > -1 && col.index < colIndex)
			) {
				return col;
			}
			while (widthsDiffs.length) {
				const diff = widthsDiffs.shift() || 0;
				const column = seenColumns[col.index] || col;
				const maybeWidth = column.width + diff;

				if (maybeWidth > column.minWidth) {
					seenColumns[column.index] = { ...column, width: maybeWidth };
				} else {
					widthsDiffs.push(maybeWidth - column.minWidth);
					seenColumns[column.index] = { ...column, width: column.minWidth };
					break;
				}
			}
			return seenColumns[col.index] || col;
		}),
	};

	// minimum possible table widths at the current layout
	const minTableWidth = resizeState.maxSize;
	// new table widths after bulk resize
	const newTotalWidth = getTotalWidth(newState);
	// when all columns are selected, what do we do when sum of columns widths is lower than min possible table widths?
	if (columnsIndexes.length === resizeState.cols.length && newTotalWidth < minTableWidth) {
		// table is not in overflow -> normal resize of a single column
		if (currentTableWidth === minTableWidth) {
			return resizeState;
		}
		// table is in overflow: keep the dragged column at its widths and evenly distribute columns
		// to recover from overflow state
		else {
			const columnWidth = Math.floor(
				(minTableWidth - sourceCol.width) / (newState.cols.length - 1),
			);
			newState = {
				...resizeState,
				cols: newState.cols.map((col) => {
					if (col.index === sourceCol.index) {
						return col;
					}

					return { ...col, width: columnWidth };
				}),
			};
		}
	}

	// fixes total table widths by adding missing pixels to columns widths here and there
	return adjustColumnsWidths(newState, resizeState.maxSize);
};

// Get the layout
const normaliseTableLayout = (input: string | undefined | null) => {
	switch (input) {
		case 'wide':
			return input;
		case 'full-width':
			return input;
		default:
			return 'default';
	}
};

export const getNewResizeStateFromSelectedColumns = (
	rect: Rect,
	state: EditorState,
	domAtPos: (pos: number) => { node: Node; offset: number },
	getEditorContainerWidth: GetEditorContainerWidth,
	isTableScalingEnabled = false,
	isTableFixedColumnWidthsOptionEnabled = false,
	isCommentEditor = false,
): ResizeStateWithAnalytics | undefined => {
	// Fail early so that we don't do complex calculations for no reason
	const numColumnsSelected = rect.right - rect.left;
	if (numColumnsSelected <= 1) {
		return;
	}

	const { totalRowCount, totalColumnCount, table } = getSelectedTableInfo(state.selection);

	if (!table) {
		return;
	}

	// Fail early so that we don't do complex calculations for no reason
	if (!hasTableBeenResized(table.node)) {
		return;
	}

	const maybeTable = domAtPos(table.start).node;

	const maybeTableElement = maybeTable instanceof HTMLElement ? maybeTable : null;
	const tableRef = maybeTableElement?.closest('table');

	if (!tableRef) {
		return;
	}

	const layout = normaliseTableLayout(tableRef?.dataset.layout);

	const maxSize = getTableMaxWidth({
		table: table.node,
		tableStart: table.start,
		state,
		layout,
		getEditorContainerWidth,
	});

	let isTableScalingEnabledOnCurrentTable = isTableScalingEnabled;
	const isTableScalingWithFixedColumnWidthsOptionEnabled =
		isTableScalingEnabled && isTableFixedColumnWidthsOptionEnabled;
	if (isTableScalingWithFixedColumnWidthsOptionEnabled) {
		isTableScalingEnabledOnCurrentTable = table.node.attrs.displayMode !== 'fixed';
	}

	let shouldUseIncreasedScalingPercent = isTableScalingWithFixedColumnWidthsOptionEnabled;

	if (isTableScalingEnabled && isCommentEditor) {
		isTableScalingEnabledOnCurrentTable = true;
		shouldUseIncreasedScalingPercent = true;
	}

	const resizeState = getResizeState({
		minWidth: tableCellMinWidth,
		maxSize,
		table: table.node,
		tableRef,
		start: table.start,
		domAtPos,
		isTableScalingEnabled: isTableScalingEnabledOnCurrentTable,
		shouldUseIncreasedScalingPercent,
		isCommentEditor,
	});

	const newResizeState = evenSelectedColumnsWidths(resizeState, rect);

	const widthsBefore = resizeState.widths;
	const widthsAfter = newResizeState.widths;

	const changed = resizeState.widths.some(
		(widthBefore, index) => widthBefore !== widthsAfter[index],
	);

	return {
		resizeState: newResizeState,
		table,
		changed,
		attributes: {
			position: rect.left,
			count: rect.right - rect.left,
			totalRowCount,
			totalColumnCount,
			widthsBefore,
			widthsAfter,
		},
	};
};
