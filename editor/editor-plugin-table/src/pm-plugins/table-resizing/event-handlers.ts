import type { CellAttributes } from '@atlaskit/adf-schema';
import {
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
	TABLE_ACTION,
	TABLE_OVERFLOW_CHANGE_TRIGGER,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { tableCellMinWidth } from '@atlaskit/editor-common/styles';
import type { GetEditorContainerWidth, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { getSelectionRect } from '@atlaskit/editor-tables/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { stopKeyboardColumnResizing } from '../../commands/column-resize';
import { updateResizeHandleDecorations } from '../../commands/misc';
import { updateColumnWidths } from '../../transforms';
import { getSelectedColumnIndexes } from '../../utils';
import { getPluginState as getTablePluginState } from '../plugin-factory';
import { META_KEYS } from '../table-analytics';

import { evenColumns, setDragging, stopResizing } from './commands';
import { getPluginState } from './plugin-factory';
import {
	currentColWidth,
	getResizeState,
	getTableMaxWidth,
	pointsAtCell,
	resizeColumn,
	resizeColumnAndTable,
	updateControls,
} from './utils';

export const handleMouseDown = (
	view: EditorView,
	event: MouseEvent,
	localResizeHandlePos: number,
	getEditorContainerWidth: GetEditorContainerWidth,
	getEditorFeatureFlags: GetEditorFeatureFlags,
	isTableScalingEnabled: boolean,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
): boolean => {
	const { state, dispatch } = view;
	const editorDisabled = !view.editable;
	const domAtPos = view.domAtPos.bind(view);

	if (
		editorDisabled ||
		localResizeHandlePos === null ||
		!pointsAtCell(state.doc.resolve(localResizeHandlePos))
	) {
		return false;
	}
	const { isKeyboardResize } = getTablePluginState(state);
	event.preventDefault();

	const tr = view.state.tr;
	tr.setMeta(META_KEYS.OVERFLOW_TRIGGER, {
		name: TABLE_OVERFLOW_CHANGE_TRIGGER.RESIZED_COLUMN,
	});
	dispatch(tr);

	const mouseDownTime = event.timeStamp;
	const cell = state.doc.nodeAt(localResizeHandlePos);
	const $cell = state.doc.resolve(localResizeHandlePos);
	const originalTable = $cell.node(-1);
	const start = $cell.start(-1);
	const tablePos = state.doc.resolve(start).start(-1);
	const tableDepth = state.doc.resolve(tablePos).depth;

	let dom: HTMLTableElement = domAtPos(start).node as HTMLTableElement;
	if (dom && dom.nodeName !== 'TABLE') {
		dom = dom.closest('table') as HTMLTableElement;
	}

	const maxSize = getTableMaxWidth({
		table: originalTable,
		tableStart: start,
		state,
		layout: originalTable.attrs.layout,
		getEditorContainerWidth,
	});

	let shouldScale = tableDepth === 0 && isTableScalingEnabled;
	const { tableWithFixedColumnWidthsOption = false } = getEditorFeatureFlags();

	const isTableScalingWithFixedColumnWidthsOptionEnabled =
		isTableScalingEnabled && tableWithFixedColumnWidthsOption;

	if (isTableScalingWithFixedColumnWidthsOptionEnabled) {
		shouldScale = shouldScale && originalTable.attrs.displayMode !== 'fixed';
	}

	const resizeState = getResizeState({
		minWidth: tableCellMinWidth,
		maxSize,
		table: originalTable,
		tableRef: dom,
		start,
		domAtPos,
		isTableScalingEnabled: shouldScale,
		shouldUseIncreasedScalingPercent:
			isTableScalingWithFixedColumnWidthsOptionEnabled &&
			getBooleanFF('platform.editor.table.use-increased-scaling-percent'),
	});

	if (
		evenColumns({
			resizeState,
			table: originalTable,
			start,
			event,
		})(state, dispatch)
	) {
		finish(event);
		return true;
	}

	const width = currentColWidth(view, localResizeHandlePos, cell!.attrs as CellAttributes);

	setDragging({ startX: event.clientX, startWidth: width })(state, dispatch);

	// When we start resizing a column we need to ensure the underlying tooltip is removed from the decoration to avoid
	// unnecessary tooltips being displayed during drag.
	updateResizeHandleDecorations(undefined, undefined, false)(state, dispatch);

	function finish(event: MouseEvent) {
		window.removeEventListener('mouseup', finish);
		window.removeEventListener('mousemove', move);

		const { clientX } = event;
		const { state, dispatch } = view;
		const { dragging, resizeHandlePos } = getPluginState(state);
		const { isTableHovered } = getTablePluginState(state);
		if (resizeHandlePos === null) {
			return stopResizing()(state, dispatch);
		}

		if (!pointsAtCell(state.doc.resolve(resizeHandlePos))) {
			return;
		}
		// resizeHandlePos could be remapped via a collab change.
		// Fetch a fresh reference of the table.
		const $cell = state.doc.resolve(resizeHandlePos);
		const start = $cell.start(-1);
		const table = $cell.node(-1);
		const tablePos = state.doc.resolve(start).start(-1);
		const tableDepth = state.doc.resolve(tablePos).depth;

		// If we let go in the same place we started, don't need to do anything.
		if (dragging && clientX === dragging.startX) {
			if (getBooleanFF('platform.editor.a11y-column-resizing_emcvz')) {
				if (isKeyboardResize || !isTableHovered) {
					/** if column resize had started via keyboard but continued by mouse
					 *  or mouse pointer leaves the table but mouse button still pressed
					 */
					return stopKeyboardColumnResizing({})(state, dispatch, view);
				} else {
					return stopResizing()(state, dispatch);
				}
			} else {
				return stopResizing()(state, dispatch);
			}
		}

		let { tr } = state;
		if (dragging) {
			const { startX } = dragging;

			// If the table has changed (via collab for example) don't apply column widths
			// For example, if a table col is deleted we won't be able to reliably remap the new widths
			// There may be a more elegant solution to this, to avoid a jarring experience.
			if (table.eq(originalTable)) {
				const map = TableMap.get(table);
				const colIndex =
					map.colCount($cell.pos - start) +
					($cell.nodeAfter ? $cell.nodeAfter.attrs.colspan : 1) -
					1;
				const selectionRect = getSelectionRect(state.selection);
				const selectedColumns = selectionRect ? getSelectedColumnIndexes(selectionRect) : [];
				// only selected (or selected - 1) columns should be distributed
				const resizingSelectedColumns =
					selectedColumns.indexOf(colIndex) > -1 || selectedColumns.indexOf(colIndex + 1) > -1;

				let shouldScale = tableDepth === 0 && isTableScalingEnabled;

				if (isTableScalingWithFixedColumnWidthsOptionEnabled) {
					shouldScale = shouldScale && originalTable.attrs.displayMode !== 'fixed';
				}

				const resizedDelta = clientX - startX;

				if (getBooleanFF('platform.editor.table.colum-resizing-improvements')) {
					const newResizeState = resizeColumnAndTable(
						resizeState,
						colIndex,
						clientX - startX,
						dom,
						originalTable,
						resizingSelectedColumns ? selectedColumns : undefined,
						shouldScale,
					);
					tr = updateColumnWidths(newResizeState, table, start)(tr);
					tr.setNodeAttribute(start - 1, 'width', newResizeState.tableWidth);
				} else {
					const newResizeState = resizeColumn(
						resizeState,
						colIndex,
						clientX - startX,
						dom,
						originalTable,
						resizingSelectedColumns ? selectedColumns : undefined,
						shouldScale,
						isTableScalingWithFixedColumnWidthsOptionEnabled &&
							getBooleanFF('platform.editor.table.use-increased-scaling-percent'),
					);
					tr = updateColumnWidths(newResizeState, table, start)(tr);
				}

				if (colIndex === map.width - 1) {
					const mouseUpTime = event.timeStamp;

					editorAnalyticsAPI?.attachAnalyticsEvent({
						action: TABLE_ACTION.ATTEMPTED_TABLE_WIDTH_CHANGE,
						actionSubject: ACTION_SUBJECT.TABLE,
						actionSubjectId: null,
						attributes: {
							type: 'table-border',
							position: 'right',
							duration: mouseUpTime - mouseDownTime,
							delta: Math.abs(resizedDelta),
						},
						eventType: EVENT_TYPE.UI,
					})(tr);
				}

				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: TABLE_ACTION.COLUMN_RESIZED,
					actionSubject: ACTION_SUBJECT.TABLE,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						colIndex: colIndex,
						resizedDelta,
						isLastColumn: colIndex === map.width - 1,
						tableWidth: table.attrs.width,
						inputMethod: INPUT_METHOD.MOUSE,
						totalRowCount: map.height,
						totalColumnCount: map.width,
					},
				})(tr);
			}
			if (getBooleanFF('platform.editor.a11y-column-resizing_emcvz')) {
				if (isKeyboardResize || !isTableHovered) {
					/** if column resize had started via keyboard but continued by mouse
					 *  or mouse pointer leaves the table but mouse button still pressed
					 */
					return stopKeyboardColumnResizing({ originalTr: tr })(state, dispatch, view);
				} else {
					return stopResizing(tr)(state, dispatch);
				}
			} else {
				return stopResizing(tr)(state, dispatch);
			}
		}
	}

	function move(event: MouseEvent) {
		const { clientX, which } = event;
		const { state } = view;
		const { dragging, resizeHandlePos } = getPluginState(state);
		const { isTableHovered } = getTablePluginState(state);
		if (
			!which ||
			!dragging ||
			resizeHandlePos === null ||
			!pointsAtCell(state.doc.resolve(resizeHandlePos)) ||
			(!isTableHovered && getBooleanFF('platform.editor.a11y-column-resizing_emcvz'))
		) {
			return finish(event);
		}

		const $cell = state.doc.resolve(resizeHandlePos);
		const table = $cell.node(-1);
		const tablePos = state.doc.resolve(start).start(-1);
		const tableDepth = state.doc.resolve(tablePos).depth;
		const map = TableMap.get(table);
		const colIndex = map.colCount($cell.pos - $cell.start(-1)) + $cell.nodeAfter!.attrs.colspan - 1;

		let shouldScale = tableDepth === 0 && isTableScalingEnabled;

		const shouldUseIncreasedScalingPercent =
			isTableScalingWithFixedColumnWidthsOptionEnabled &&
			getBooleanFF('platform.editor.table.use-increased-scaling-percent');
		if (isTableScalingWithFixedColumnWidthsOptionEnabled) {
			shouldScale = shouldScale && originalTable.attrs.displayMode !== 'fixed';
		}

		if (getBooleanFF('platform.editor.table.colum-resizing-improvements')) {
			resizeColumnAndTable(
				resizeState,
				colIndex,
				clientX - dragging.startX,
				dom,
				table,
				undefined,
				shouldScale,
				undefined,
				shouldUseIncreasedScalingPercent,
			);
		} else {
			resizeColumn(
				resizeState,
				colIndex,
				clientX - dragging.startX,
				dom,
				table,
				undefined,
				shouldScale,
				shouldUseIncreasedScalingPercent,
			);
		}

		updateControls()(state);
	}

	window.addEventListener('mouseup', finish);
	window.addEventListener('mousemove', move);

	return true;
};
