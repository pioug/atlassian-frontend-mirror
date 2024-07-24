import type { CellAttributes } from '@atlaskit/adf-schema';
import {
	ACTION_SUBJECT,
	CHANGE_ALIGNMENT_REASON,
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
import { fg } from '@atlaskit/platform-feature-flags';

import { stopKeyboardColumnResizing } from '../../commands/column-resize';
import { updateResizeHandleDecorations } from '../../commands/misc';
import { updateColumnWidths } from '../../transforms';
import { getSelectedColumnIndexes, isTableNested } from '../../utils';
import {
	ALIGN_CENTER,
	ALIGN_START,
	shouldChangeAlignmentToCenterResized,
} from '../../utils/alignment';
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
import { scaleResizeState } from './utils/resize-column';

export const handleMouseDown = (
	view: EditorView,
	event: MouseEvent,
	localResizeHandlePos: number,
	getEditorContainerWidth: GetEditorContainerWidth,
	getEditorFeatureFlags: GetEditorFeatureFlags,
	isTableScalingEnabled: boolean,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
	isNewColumnResizingEnabled?: boolean,
	isTableAlignmentEnabled?: boolean,
): boolean => {
	const { state, dispatch } = view;
	const editorDisabled = !view.editable;
	const domAtPos = view.domAtPos.bind(view);
	const { lineLength, width: editorWidth } = getEditorContainerWidth();

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

	let resizeState = getResizeState({
		minWidth: tableCellMinWidth,
		maxSize,
		table: originalTable,
		tableRef: dom,
		start,
		domAtPos,
		isTableScalingEnabled: shouldScale,
		shouldUseIncreasedScalingPercent:
			isTableScalingWithFixedColumnWidthsOptionEnabled &&
			fg('platform.editor.table.use-increased-scaling-percent'),
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

	// for new column resizing, take the current scaled version of table widths and use those as the basis for resizing
	// implication: the scaled version of the table becomes the source of truth
	if (isNewColumnResizingEnabled && shouldScale) {
		resizeState = scaleResizeState({
			resizeState,
			tableRef: dom,
			tableNode: originalTable,
			editorWidth,
		});
	}

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
			if (isKeyboardResize || !isTableHovered) {
				/** if column resize had started via keyboard but continued by mouse
				 *  or mouse pointer leaves the table but mouse button still pressed
				 */
				return stopKeyboardColumnResizing({})(state, dispatch, view);
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
				const totalRowCount = map.height;
				const totalColumnCount = map.width;
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
				const shouldUseIncreasedScalingPercent =
					isTableScalingWithFixedColumnWidthsOptionEnabled &&
					fg('platform.editor.table.use-increased-scaling-percent');

				if (isNewColumnResizingEnabled && !isTableNested(state, tablePos)) {
					const newResizeState = resizeColumnAndTable({
						resizeState,
						colIndex,
						amount: resizedDelta,
						tableRef: dom,
						tableNode: originalTable,
						width: editorWidth,
						lineLength,
						isTableAlignmentEnabled,
					});

					tr = updateColumnWidths(newResizeState, table, start)(tr);

					// If the table is aligned to the start and the table width is greater than the line length, we should change the alignment to center
					const shouldChangeAlignment = shouldChangeAlignmentToCenterResized(
						isTableAlignmentEnabled,
						originalTable,
						lineLength,
						newResizeState.maxSize,
					);

					if (shouldChangeAlignment) {
						tr = tr.setNodeMarkup(start - 1, state.schema.nodes.table, {
							...table.attrs,
							width: newResizeState.maxSize,
							layout: ALIGN_CENTER,
						});

						editorAnalyticsAPI?.attachAnalyticsEvent({
							action: TABLE_ACTION.CHANGED_ALIGNMENT,
							actionSubject: ACTION_SUBJECT.TABLE,
							actionSubjectId: null,
							attributes: {
								tableWidth: newResizeState.maxSize,
								newAlignment: ALIGN_CENTER,
								previousAlignment: ALIGN_START,
								totalRowCount: totalRowCount,
								totalColumnCount: totalColumnCount,
								inputMethod: INPUT_METHOD.AUTO,
								reason: CHANGE_ALIGNMENT_REASON.TABLE_COLUMN_RESIZED,
							},
							eventType: EVENT_TYPE.TRACK,
						})(tr);
					} else {
						tr.setNodeAttribute(start - 1, 'width', newResizeState.maxSize);
					}
				} else {
					const newResizeState = resizeColumn(
						resizeState,
						colIndex,
						resizedDelta,
						dom,
						originalTable,
						resizingSelectedColumns ? selectedColumns : undefined,
						shouldScale,
						shouldUseIncreasedScalingPercent,
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
			if (isKeyboardResize || !isTableHovered) {
				/** if column resize had started via keyboard but continued by mouse
				 *  or mouse pointer leaves the table but mouse button still pressed
				 */
				return stopKeyboardColumnResizing({ originalTr: tr })(state, dispatch, view);
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
		const tablePos = state.doc.resolve(start).start(-1);

		if (
			!which ||
			!dragging ||
			resizeHandlePos === null ||
			!pointsAtCell(state.doc.resolve(resizeHandlePos)) ||
			((!isNewColumnResizingEnabled || isTableNested(state, tablePos)) && !isTableHovered)
		) {
			return finish(event);
		}

		const $cell = state.doc.resolve(resizeHandlePos);
		const table = $cell.node(-1);
		// const tablePos = state.doc.resolve(start).start(-1);
		const tableDepth = state.doc.resolve(tablePos).depth;
		const map = TableMap.get(table);
		const colIndex = map.colCount($cell.pos - $cell.start(-1)) + $cell.nodeAfter!.attrs.colspan - 1;

		let shouldScale = tableDepth === 0 && isTableScalingEnabled;

		const shouldUseIncreasedScalingPercent =
			isTableScalingWithFixedColumnWidthsOptionEnabled &&
			fg('platform.editor.table.use-increased-scaling-percent');

		if (isTableScalingWithFixedColumnWidthsOptionEnabled) {
			shouldScale = shouldScale && originalTable.attrs.displayMode !== 'fixed';
		}

		const resizedDelta = clientX - dragging.startX;

		if (isNewColumnResizingEnabled && !isTableNested(state, tablePos)) {
			resizeColumnAndTable({
				resizeState,
				colIndex,
				amount: resizedDelta,
				tableRef: dom,
				tableNode: originalTable,
				width: editorWidth,
				lineLength,
				isTableAlignmentEnabled,
			});
		} else {
			resizeColumn(
				resizeState,
				colIndex,
				resizedDelta,
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
