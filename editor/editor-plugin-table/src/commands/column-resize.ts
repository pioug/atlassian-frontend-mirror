import type { IntlShape } from 'react-intl-next/src/types';

import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import type { Command, GetEditorContainerWidth } from '@atlaskit/editor-common/types';
import type { AriaLiveElementAttributes } from '@atlaskit/editor-plugin-accessibility-utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { TableMap } from '@atlaskit/editor-tables';
import type { CellAttributes, Direction } from '@atlaskit/editor-tables/types';
import {
	findCellClosestToPos,
	findCellRectClosestToPos,
	findTableClosestToPos,
	getSelectionRect,
	isSelectionType,
	nextCell,
} from '@atlaskit/editor-tables/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import { getDecorations } from '../pm-plugins/decorations/plugin';
import {
	buildColumnResizingDecorations,
	clearColumnResizingDecorations,
} from '../pm-plugins/decorations/utils';
import { createCommand, getPluginState } from '../pm-plugins/plugin-factory';
import {
	getPluginState as getTableResizingPluginState,
	createCommand as tableResizingPluginCreateCommand,
} from '../pm-plugins/table-resizing/plugin-factory';
import { pluginKey as tableResizingPK } from '../pm-plugins/table-resizing/plugin-key';
import {
	currentColWidth,
	getResizeState,
	getTableMaxWidth,
	resizeColumn,
	updateControls,
} from '../pm-plugins/table-resizing/utils';
import { updateColumnWidths } from '../transforms';
import { TableDecorations } from '../types';
import type { PluginInjectionAPI, TablePluginAction } from '../types';
import { createColumnLineResize, getSelectedColumnIndexes, updateDecorations } from '../utils';

const getTablePluginCommand = (
	actionPayload: TablePluginAction,
	originalTr?: Transaction,
): Command => {
	return createCommand(
		() => actionPayload,
		(tr) => (originalTr || tr).setMeta('addToHistory', false),
	);
};

const updateResizeHandleAndStatePosition =
	(rowIndex: number, columnIndex: number, nextResizeHandlePos: number): Command =>
	(state, dispatch) => {
		let customTr = state.tr;
		const {
			pluginConfig: { allowColumnResizing },
			getIntl,
		} = getPluginState(state);

		const fakeDispatch = (tr: Transaction) => {
			customTr = tr;
		};

		if (!allowColumnResizing) {
			return false;
		}

		const decorationsWithWidget = buildColumnResizingDecorations(
			rowIndex,
			columnIndex,
			true,
			getIntl,
		)({
			tr: customTr,
			decorationSet: getDecorations(state),
		});

		const decorationsWithWidgetAndHandle = updateDecorations(
			customTr.doc,
			decorationsWithWidget,
			createColumnLineResize(state.selection, {
				right: columnIndex,
			}),
			TableDecorations.COLUMN_RESIZING_HANDLE_LINE,
		);

		getTablePluginCommand(
			{
				type: 'START_KEYBOARD_COLUMN_RESIZE',
				data: {
					resizeHandleRowIndex: rowIndex,
					resizeHandleColumnIndex: columnIndex,
					resizeHandleIncludeTooltip: true,
					isKeyboardResize: true,
					decorationSet: decorationsWithWidgetAndHandle,
				},
			},
			customTr,
		)(state, fakeDispatch);

		customTr.setMeta(tableResizingPK, {
			type: 'SET_RESIZE_HANDLE_POSITION',
			data: {
				resizeHandlePos: nextResizeHandlePos,
			},
		});

		if (dispatch) {
			dispatch(customTr);
			return true;
		}
		return false;
	};

export const initiateKeyboardColumnResizing =
	({
		ariaNotify,
		getIntl,
	}: {
		ariaNotify?: (message: string, ariaLiveElementAttributes?: AriaLiveElementAttributes) => void;
		getIntl?: () => IntlShape;
	}): Command =>
	(state, dispatch, view) => {
		const { selection } = state;
		const selectionRect = isSelectionType(selection, 'cell')
			? getSelectionRect(selection)!
			: findCellRectClosestToPos(selection.$from);
		const cell = findCellClosestToPos(selection.$from);

		if (ariaNotify && getIntl) {
			ariaNotify(getIntl().formatMessage(messages.startedColumnResize), {
				priority: 'important',
			});
		}

		if (selectionRect && cell && view) {
			return updateResizeHandleAndStatePosition(
				selectionRect.top,
				selectionRect.right,
				cell.pos,
			)(state, dispatch);
		}
		return false;
	};

export const activateNextResizeArea =
	({
		direction,
		ariaNotify,
		getIntl,
	}: {
		direction: Direction;
		ariaNotify?: (message: string, ariaLiveElementAttributes?: AriaLiveElementAttributes) => void;
		getIntl?: () => IntlShape;
	}): Command =>
	(state, dispatch, view) => {
		const { resizeHandlePos } = getTableResizingPluginState(state) || {};
		// If No resizing has initiated, skip to regular handler
		if (!resizeHandlePos) {
			return false;
		}

		const { selection } = state;
		const cell = findCellClosestToPos(selection.$from);
		if (!cell) {
			// cursor position may be changed by mouse to be outside of table;
			return false;
		}

		const $currentCell = state.doc.resolve(resizeHandlePos);
		if (!$currentCell) {
			return false;
		}

		const tableNode = $currentCell.node(-1);
		const closestTable = findTableClosestToPos($currentCell);
		const tableMap = TableMap.get(tableNode);

		if (!tableNode || !closestTable || !tableMap) {
			return false;
		}

		const currentCellRect = tableMap.findCell($currentCell.pos - $currentCell.start(-1));

		const $nextCell = nextCell($currentCell, 'horiz', direction);

		if (ariaNotify && getIntl) {
			if (direction === 1) {
				ariaNotify(
					getIntl().formatMessage(messages.focusedOtherResize, {
						direction: 'right',
					}),
					{ priority: 'important' },
				);
			}

			if (direction === -1) {
				ariaNotify(
					getIntl().formatMessage(messages.focusedOtherResize, {
						direction: 'left',
					}),
					{ priority: 'important' },
				);
			}
		}

		if ($nextCell) {
			// we are somewhere in between the side columns of the table
			const offset = $nextCell.pos - $nextCell.start(-1);
			const rectForNextCell = tableMap.findCell(offset);
			return updateResizeHandleAndStatePosition(
				rectForNextCell.top,
				rectForNextCell.right,
				$nextCell.pos,
			)(state, dispatch, view);
		} else {
			// current position is in the one of the side columns of the table(left or right)
			if (currentCellRect.left === 0) {
				const lastCellInCurrentRow =
					tableMap.positionAt(currentCellRect.top, tableMap.width - 1, tableNode) +
					closestTable.start;
				const $lastCell = state.doc.resolve(lastCellInCurrentRow);

				return updateResizeHandleAndStatePosition(
					currentCellRect.top,
					tableMap.width,
					$lastCell.pos,
				)(state, dispatch, view);
			} else if (tableMap.width === currentCellRect.right) {
				const firsCellInCurrentRow =
					tableMap.positionAt(currentCellRect.top, 0, tableNode) + closestTable.start;
				const $nextCell = state.doc.resolve(firsCellInCurrentRow);

				return updateResizeHandleAndStatePosition(
					currentCellRect.top,
					1,
					$nextCell.pos,
				)(state, dispatch);
			}
		}

		return false;
	};

export const changeColumnWidthByStep =
	({
		stepSize,
		getEditorContainerWidth,
		isTableScalingEnabled,
		isTableFixedColumnWidthsOptionEnabled,
		isCommentEditor,
		ariaNotify,
		api,
		getIntl,
	}: {
		stepSize: number;
		getEditorContainerWidth: GetEditorContainerWidth;
		isTableScalingEnabled: boolean;
		isTableFixedColumnWidthsOptionEnabled: boolean;
		isCommentEditor: boolean;
		api: PluginInjectionAPI | undefined | null;
		ariaNotify?: (message: string, ariaLiveElementAttributes?: AriaLiveElementAttributes) => void;
		getIntl?: () => IntlShape;
		originalTr?: Transaction;
	}): Command =>
	(state, dispatch, view) => {
		let customTr = state.tr;
		const fakeDispatch = (tr: Transaction) => {
			customTr = tr;
		};
		const { resizeHandlePos } = getTableResizingPluginState(state);
		const cell = findCellClosestToPos(state.selection.$from);
		if (!view || !resizeHandlePos || !cell) {
			return false;
		}

		const $cell = state.doc.resolve(resizeHandlePos);

		const tableStartPosition = $cell.start(-1);
		const originalTable = $cell.node(-1);
		const map = TableMap.get(originalTable);
		const domAtPos = view.domAtPos.bind(view);

		const colIndex =
			map.colCount($cell.pos - tableStartPosition) +
			($cell.nodeAfter ? $cell.nodeAfter.attrs.colspan : 1) -
			1;

		let dom: HTMLTableElement | null = null;
		const domAtPosition = domAtPos(tableStartPosition);
		dom = domAtPosition.node instanceof HTMLTableElement ? domAtPosition.node : null;

		if (dom && dom.nodeName !== 'TABLE') {
			dom = dom.closest('table');
		}

		const cellAttrs = cell?.node.attrs;
		const width = currentColWidth(view, cell?.pos, cellAttrs as CellAttributes);
		tableResizingPluginCreateCommand({
			type: 'SET_DRAGGING',
			data: {
				dragging: {
					startX: 0,
					startWidth: width,
				},
			},
		})(state, fakeDispatch);

		const maxSize = getTableMaxWidth({
			table: originalTable,
			tableStart: tableStartPosition,
			state,
			layout: originalTable.attrs.layout,
			getEditorContainerWidth,
		});

		let isTableScalingEnabledOnCurrentTable = isTableScalingEnabled;
		const isTableScalingWithFixedColumnWidthsOptionEnabled =
			isTableScalingEnabled && isTableFixedColumnWidthsOptionEnabled;
		if (isTableScalingWithFixedColumnWidthsOptionEnabled) {
			isTableScalingEnabledOnCurrentTable = originalTable.attrs.displayMode !== 'fixed';
		}

		const shouldUseIncreasedScalingPercent =
			(isTableScalingWithFixedColumnWidthsOptionEnabled &&
				fg('platform.editor.table.use-increased-scaling-percent')) ||
			// When in comment editor, we need the scaling percent to be 40% while tableWithFixedColumnWidthsOption is not visible
			(isTableScalingEnabled && isCommentEditor);

		const initialResizeState = getResizeState({
			minWidth: tableCellMinWidth,
			maxSize,
			table: originalTable,
			tableRef: dom,
			start: tableStartPosition,
			domAtPos,
			isTableScalingEnabled: isTableScalingEnabledOnCurrentTable,
			shouldUseIncreasedScalingPercent,
		});

		updateControls()(state);

		const selectionRect = getSelectionRect(state.selection);
		const selectedColumns = selectionRect ? getSelectedColumnIndexes(selectionRect) : [];
		// only selected (or selected - 1) columns should be distributed
		const resizingSelectedColumns =
			selectedColumns.indexOf(colIndex) > -1 || selectedColumns.indexOf(colIndex + 1) > -1;
		let newResizeState = resizeColumn(
			initialResizeState,
			colIndex,
			stepSize,
			dom,
			originalTable,
			resizingSelectedColumns ? selectedColumns : undefined,
			isTableScalingEnabled,
			shouldUseIncreasedScalingPercent,
		);

		customTr = updateColumnWidths(newResizeState, originalTable, tableStartPosition, api)(customTr);

		if (dispatch) {
			dispatch(customTr);
		}

		if (ariaNotify && getIntl) {
			ariaNotify(
				getIntl().formatMessage(messages.changedColumnWidth, {
					width: Math.floor(newResizeState.cols[colIndex].width),
				}),
			);

			if (newResizeState.cols.length === colIndex + 1) {
				if (newResizeState.overflow === true) {
					ariaNotify(getIntl().formatMessage(messages.columnResizeLast), {
						priority: 'important',
					});
				}
				if (newResizeState.overflow === false) {
					ariaNotify(getIntl().formatMessage(messages.columnResizeOverflow), {
						priority: 'important',
					});
				}
			}
		}

		return true;
	};

export const stopKeyboardColumnResizing =
	({
		ariaNotify,
		getIntl,
		originalTr,
	}: {
		ariaNotify?: (message: string, ariaLiveElementAttributes?: AriaLiveElementAttributes) => void;
		getIntl?: () => IntlShape;
		originalTr?: Transaction;
	}): Command =>
	(state, dispatch) => {
		let customTr = originalTr || state.tr;
		const fakeDispatch = (tr: Transaction) => {
			customTr = tr;
		};

		const decorationWithoutWidget = clearColumnResizingDecorations()({
			tr: customTr,
			decorationSet: getDecorations(state),
		});

		const decorationWithoutWidgetAndHandle = updateDecorations(
			customTr.doc,
			decorationWithoutWidget,
			[],
			TableDecorations.COLUMN_RESIZING_HANDLE_LINE,
		);
		getTablePluginCommand(
			{
				type: 'STOP_KEYBOARD_COLUMN_RESIZE',
				data: {
					decorationSet: decorationWithoutWidgetAndHandle,
				},
			},
			customTr,
		)(state, fakeDispatch);

		tableResizingPluginCreateCommand(
			{
				type: 'STOP_RESIZING',
			},
			() => customTr.setMeta('scrollIntoView', false),
		)(state, fakeDispatch);
		if (ariaNotify && getIntl) {
			ariaNotify(getIntl().formatMessage(messages.columnResizeStop), {
				priority: 'important',
			});
		}

		if (dispatch) {
			dispatch(customTr);
			return true;
		}
		return false;
	};
