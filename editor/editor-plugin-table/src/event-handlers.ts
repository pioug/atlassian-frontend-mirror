import rafSchedule from 'raf-schd';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { ACTION_SUBJECT, EVENT_TYPE, TABLE_ACTION } from '@atlaskit/editor-common/analytics';
import {
	browser,
	closestElement,
	isElementInTableCell,
	isLastItemMediaGroup,
	setNodeSelection,
} from '@atlaskit/editor-common/utils';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
	cellAround,
	findCellRectClosestToPos,
	findTable,
	getSelectionRect,
	removeTable,
} from '@atlaskit/editor-tables/utils';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import {
	addResizeHandleDecorations,
	clearHoverSelection,
	hideInsertColumnOrRowButton,
	hideResizeHandleLine,
	hoverCell,
	hoverColumns,
	selectColumn,
	setEditorFocus,
	setTableHovered,
	showInsertColumnButton,
	showInsertRowButton,
	showResizeHandleLine,
} from './commands';
import { getPluginState as getDragDropPluginState } from './pm-plugins/drag-and-drop/plugin-factory';
import { getPluginState } from './pm-plugins/plugin-factory';
import { getPluginState as getResizePluginState } from './pm-plugins/table-resizing/plugin-factory';
import { deleteColumns, deleteRows } from './transforms';
import { TableCssClassName as ClassName, RESIZE_HANDLE_AREA_DECORATION_GAP } from './types';
import {
	convertHTMLCellIndexToColumnIndex,
	getColumnIndexMappedToColumnIndexInFirstRow,
	getColumnOrRowIndex,
	getMousePositionHorizontalRelativeByElement,
	getMousePositionVerticalRelativeByElement,
	getSelectedCellInfo,
	hasResizeHandler,
	isCell,
	isColumnControlsDecorations,
	isCornerButton,
	isDragColumnFloatingInsertDot,
	isDragCornerButton,
	isDragRowFloatingInsertDot,
	isInsertRowButton,
	isResizeHandleDecoration,
	isRowControlsButton,
	isTableContainerOrWrapper,
	isTableControlsButton,
} from './utils';
import { getAllowAddColumnCustomStep } from './utils/get-allow-add-column-custom-step';

const isFocusingCalendar = (event: Event) =>
	event instanceof FocusEvent &&
	event.relatedTarget instanceof HTMLElement &&
	event.relatedTarget.getAttribute('aria-label') === 'calendar';

const isFocusingModal = (event: Event) =>
	event instanceof FocusEvent &&
	event.relatedTarget instanceof HTMLElement &&
	event.relatedTarget.closest('[role="dialog"]');

const isFocusingFloatingToolbar = (event: Event) =>
	event instanceof FocusEvent &&
	event.relatedTarget instanceof HTMLElement &&
	event.relatedTarget.closest('[role="toolbar"]');

const isFocusingDragHandles = (event: Event) =>
	event instanceof FocusEvent &&
	event.relatedTarget instanceof HTMLElement &&
	event.relatedTarget.closest('button') &&
	event.relatedTarget.getAttribute('draggable') === 'true';

const isFocusingDragHandlesClickableZone = (event: Event) =>
	event instanceof FocusEvent &&
	event.relatedTarget instanceof HTMLElement &&
	event.relatedTarget.closest('button') &&
	event.relatedTarget.classList.contains(ClassName.DRAG_HANDLE_BUTTON_CLICKABLE_ZONE);

export const handleBlur = (view: EditorView, event: Event): boolean => {
	const { state, dispatch } = view;
	// IE version check for ED-4665
	// Calendar focus check for ED-10466
	if (
		browser.ie_version !== 11 &&
		!isFocusingCalendar(event) &&
		!isFocusingModal(event) &&
		!isFocusingFloatingToolbar(event) &&
		!isFocusingDragHandles(event) &&
		!isFocusingDragHandlesClickableZone(event)
	) {
		setEditorFocus(false)(state, dispatch);
	}
	event.preventDefault();
	return false;
};

export const handleFocus = (view: EditorView, event: Event): boolean => {
	const { state, dispatch } = view;
	setEditorFocus(true)(state, dispatch);
	event.preventDefault();
	return false;
};

type HTMLElementIE9 = Omit<HTMLElement, 'matches'> & {
	matches?: HTMLElement['matches']; // WARNING: 'matches' is optional in IE9
	msMatchesSelector?: (selectors: string) => boolean;
};

export const handleClick = (view: EditorView, event: Event): boolean => {
	if (!(event.target instanceof HTMLElement)) {
		return false;
	}
	const element = event.target as HTMLElementIE9;
	const table = findTable(view.state.selection)!;

	if (event instanceof MouseEvent && isColumnControlsDecorations(element as HTMLElement)) {
		const [startIndex] = getColumnOrRowIndex(element as HTMLElement);
		const { state, dispatch } = view;

		return selectColumn(startIndex, event.shiftKey)(state, dispatch);
	}

	const matchfn = element.matches ? element.matches : element.msMatchesSelector;

	// check if the table cell with an image is clicked and its not the image itself
	if (
		!table ||
		!isElementInTableCell(element as HTMLElement) ||
		!matchfn ||
		matchfn.call(element, 'table .image, table p, table .image div')
	) {
		return false;
	}
	const map = TableMap.get(table.node);

	/** Getting the offset of current item clicked */
	const colElement = (closestElement(element as HTMLElement, 'td') ||
		closestElement(element as HTMLElement, 'th')) as HTMLTableDataCellElement;
	const colIndex = colElement && colElement.cellIndex;
	const rowElement = closestElement(element as HTMLElement, 'tr') as HTMLTableRowElement;
	const rowIndex = rowElement && rowElement.rowIndex;
	const cellIndex = map.width * rowIndex + colIndex;
	const {
		dispatch,
		state: {
			tr,
			schema: {
				nodes: { paragraph },
			},
		},
	} = view;
	const cellPos = map.map[cellIndex];
	if (isNaN(cellPos) || cellPos === undefined || typeof cellPos !== 'number') {
		return false;
	}

	const editorElement = table.node.nodeAt(cellPos) as PmNode;
	/** Only if the last item is media group, insert a paragraph */
	if (isLastItemMediaGroup(editorElement)) {
		const posInTable = map.map[cellIndex] + editorElement.nodeSize;
		tr.insert(posInTable + table.pos, paragraph.create());
		dispatch(tr);
		setNodeSelection(view, posInTable + table.pos);
	}
	return true;
};

export const handleMouseOver = (view: EditorView, mouseEvent: Event): boolean => {
	if (!(mouseEvent.target instanceof HTMLElement)) {
		return false;
	}
	const { state, dispatch } = view;
	const target = mouseEvent.target;
	const { insertColumnButtonIndex, insertRowButtonIndex, isTableHovered } = getPluginState(state);

	if (isInsertRowButton(target)) {
		const [startIndex, endIndex] = getColumnOrRowIndex(target);

		const positionRow =
			getMousePositionVerticalRelativeByElement(mouseEvent as MouseEvent) === 'bottom'
				? endIndex
				: startIndex;
		return showInsertRowButton(positionRow)(state, dispatch);
	}

	if (isColumnControlsDecorations(target)) {
		const [startIndex] = getColumnOrRowIndex(target);
		const { state, dispatch } = view;

		return hoverColumns([startIndex], false)(state, dispatch);
	}

	if (
		(isCell(target) || isCornerButton(target)) &&
		(typeof insertColumnButtonIndex === 'number' || typeof insertRowButtonIndex === 'number')
	) {
		return hideInsertColumnOrRowButton()(state, dispatch);
	}

	if (isResizeHandleDecoration(target)) {
		const [startIndex, endIndex] = getColumnOrRowIndex(target);
		return showResizeHandleLine({ left: startIndex, right: endIndex })(state, dispatch);
	}

	if (!isTableHovered) {
		return setTableHovered(true)(state, dispatch);
	}

	return false;
};

export const handleMouseUp = (view: EditorView, mouseEvent: Event): boolean => {
	if (!getBooleanFF('platform.editor.table.insert-last-column-btn-stays-in-place')) {
		return false;
	}

	if (!(mouseEvent instanceof MouseEvent)) {
		return false;
	}
	const { state, dispatch } = view;
	const { insertColumnButtonIndex, tableNode, tableRef } = getPluginState(state);

	if (insertColumnButtonIndex !== undefined && tableRef && tableRef.parentElement && tableNode) {
		const { width } = TableMap.get(tableNode);
		const newInsertColumnButtonIndex = insertColumnButtonIndex + 1;
		if (width === newInsertColumnButtonIndex) {
			const tableWidth = tableRef.clientWidth;
			tableRef.parentElement.scrollTo(tableWidth, 0);

			return showInsertColumnButton(newInsertColumnButtonIndex)(state, dispatch);
		}
	}

	return false;
};

// Ignore any `mousedown` `event` from control and numbered column buttons
// PM end up changing selection during shift selection if not prevented
export const handleMouseDown = (_: EditorView, event: Event) => {
	const isControl = !!(
		event.target &&
		event.target instanceof HTMLElement &&
		(isTableContainerOrWrapper(event.target) ||
			isColumnControlsDecorations(event.target) ||
			isRowControlsButton(event.target) ||
			isDragCornerButton(event.target))
	);

	if (isControl) {
		event.preventDefault();
	}

	return isControl;
};

export const handleMouseOut = (view: EditorView, mouseEvent: Event): boolean => {
	if (!(mouseEvent instanceof MouseEvent) || !(mouseEvent.target instanceof HTMLElement)) {
		return false;
	}

	const target = mouseEvent.target;

	if (isColumnControlsDecorations(target)) {
		const { state, dispatch } = view;
		return clearHoverSelection()(state, dispatch);
	}

	const relatedTarget = mouseEvent.relatedTarget as HTMLElement | null;
	// In case the user is moving between cell at the same column
	// we don't need to hide the resize handle decoration
	if (isResizeHandleDecoration(target) && !isResizeHandleDecoration(relatedTarget)) {
		const { state, dispatch } = view;
		if (getBooleanFF('platform.editor.a11y-column-resizing_emcvz')) {
			const { isKeyboardResize } = getPluginState(state);
			if (isKeyboardResize) {
				// no need to hide decoration if column resizing started by keyboard
				return false;
			}
			return hideResizeHandleLine()(state, dispatch);
		} else {
			return hideResizeHandleLine()(state, dispatch);
		}
	}

	return false;
};

export const handleMouseEnter = (view: EditorView, mouseEvent: Event): boolean => {
	const { state, dispatch } = view;

	const { isTableHovered } = getPluginState(state);

	if (!isTableHovered) {
		return setTableHovered(true)(state, dispatch);
	}

	return false;
};

export const handleMouseLeave = (view: EditorView, event: Event): boolean => {
	if (!(event.target instanceof HTMLElement)) {
		return false;
	}

	const { state, dispatch } = view;
	const { insertColumnButtonIndex, insertRowButtonIndex, isDragAndDropEnabled, isTableHovered } =
		getPluginState(state);

	if (isTableHovered) {
		if (isDragAndDropEnabled) {
			const { isDragMenuOpen } = getDragDropPluginState(state);
			!isDragMenuOpen && setTableHovered(false)(state, dispatch);
		} else {
			setTableHovered(false)(state, dispatch);
		}
		return true;
	}

	// If this table doesn't have focus then we want to skip everything after this.
	if (!isTableInFocus(view)) {
		return false;
	}

	const target = event.target;
	if (isTableControlsButton(target)) {
		return true;
	}

	if (
		(typeof insertColumnButtonIndex !== 'undefined' ||
			typeof insertRowButtonIndex !== 'undefined') &&
		hideInsertColumnOrRowButton()(state, dispatch)
	) {
		return true;
	}

	return false;
};

// IMPORTANT: The mouse move handler has been setup with RAF schedule to avoid Reflows which will occur as some methods
// need to access the mouse event offset position and also the target clientWidth vallue.
const handleMouseMoveDebounce = rafSchedule(
	(view: EditorView, event: MouseEvent, offsetX: number) => {
		if (!(event.target instanceof HTMLElement)) {
			return false;
		}
		const element = event.target;

		if (isColumnControlsDecorations(element) || isDragColumnFloatingInsertDot(element)) {
			const { state, dispatch } = view;
			const { insertColumnButtonIndex } = getPluginState(state);
			const [startIndex, endIndex] = getColumnOrRowIndex(element);

			const positionColumn =
				getMousePositionHorizontalRelativeByElement(event, offsetX, undefined) === 'right'
					? endIndex
					: startIndex;

			if (positionColumn !== insertColumnButtonIndex) {
				return showInsertColumnButton(positionColumn)(state, dispatch);
			}
		}

		if (isRowControlsButton(element) || isDragRowFloatingInsertDot(element)) {
			const { state, dispatch } = view;
			const { insertRowButtonIndex } = getPluginState(state);
			const [startIndex, endIndex] = getColumnOrRowIndex(element);

			const positionRow =
				getMousePositionVerticalRelativeByElement(event) === 'bottom' ? endIndex : startIndex;

			if (positionRow !== insertRowButtonIndex) {
				return showInsertRowButton(positionRow)(state, dispatch);
			}
		}

		if (!isResizeHandleDecoration(element) && isCell(element)) {
			const positionColumn = getMousePositionHorizontalRelativeByElement(
				event,
				offsetX,
				RESIZE_HANDLE_AREA_DECORATION_GAP,
			);

			if (positionColumn !== null) {
				const { state, dispatch } = view;
				const { resizeHandleColumnIndex, resizeHandleRowIndex } = getPluginState(state);

				const isKeyboardResize = getBooleanFF('platform.editor.a11y-column-resizing_emcvz')
					? getPluginState(state).isKeyboardResize
					: false;
				const tableCell = closestElement(element, 'td, th') as HTMLTableCellElement;
				const cellStartPosition = view.posAtDOM(tableCell, 0);
				const rect = findCellRectClosestToPos(state.doc.resolve(cellStartPosition));

				if (rect) {
					const columnEndIndexTarget = positionColumn === 'left' ? rect.left : rect.right;

					const rowIndexTarget = rect.top;

					if (
						(columnEndIndexTarget !== resizeHandleColumnIndex ||
							rowIndexTarget !== resizeHandleRowIndex ||
							!hasResizeHandler({ target: element, columnEndIndexTarget })) &&
						!isKeyboardResize // if initiated by keyboard don't need to react on hover for other resize sliders
					) {
						return addResizeHandleDecorations(
							rowIndexTarget,
							columnEndIndexTarget,
							true,
						)(state, dispatch);
					}
				}
			}
		}

		return false;
	},
);

export const handleMouseMove = (view: EditorView, event: Event) => {
	if (!(event.target instanceof HTMLElement)) {
		return false;
	}

	// NOTE: When accessing offsetX in gecko from a deferred callback, it will return 0. However it will be non-zero if accessed
	// within the scope of it's initial mouse move handler. Also Chrome does return the correct value, however it could trigger
	// a reflow. So for now this will just grab the offsetX value immediately for gecko and chrome will calculate later
	// in the deferred callback handler.
	// Bug Tracking: https://bugzilla.mozilla.org/show_bug.cgi?id=1882903
	handleMouseMoveDebounce(
		view,
		event as MouseEvent,
		browser.gecko ? (event as MouseEvent).offsetX : NaN,
	);
	return false;
};

export function handleTripleClick(view: EditorView, pos: number) {
	const { state, dispatch } = view;
	const $cellPos = cellAround(state.doc.resolve(pos));
	if (!$cellPos) {
		return false;
	}

	const cell = state.doc.nodeAt($cellPos.pos);
	if (cell) {
		const selFrom = Selection.findFrom($cellPos, 1, true);
		const selTo = Selection.findFrom(state.doc.resolve($cellPos.pos + cell.nodeSize), -1, true);
		if (selFrom && selTo) {
			dispatch(state.tr.setSelection(new TextSelection(selFrom.$from, selTo.$to)));
			return true;
		}
	}

	return false;
}
export const handleCut = (
	oldTr: Transaction,
	oldState: EditorState,
	newState: EditorState,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
	editorView?: EditorView,
	isTableScalingEnabled = false,
	shouldUseIncreasedScalingPercent = false,
): Transaction => {
	const oldSelection = oldState.tr.selection;
	let { tr } = newState;
	if (oldSelection instanceof CellSelection) {
		const $anchorCell = oldTr.doc.resolve(oldTr.mapping.map(oldSelection.$anchorCell.pos));
		const $headCell = oldTr.doc.resolve(oldTr.mapping.map(oldSelection.$headCell.pos));

		const cellSelection = new CellSelection($anchorCell, $headCell);
		tr.setSelection(cellSelection);

		if (tr.selection instanceof CellSelection) {
			const rect = getSelectionRect(cellSelection);
			if (rect) {
				const { verticalCells, horizontalCells, totalCells, totalRowCount, totalColumnCount } =
					getSelectedCellInfo(tr.selection);

				// Reassigning to make it more obvious and consistent
				editorAnalyticsAPI?.attachAnalyticsEvent({
					action: TABLE_ACTION.CUT,
					actionSubject: ACTION_SUBJECT.TABLE,
					actionSubjectId: null,
					attributes: {
						verticalCells,
						horizontalCells,
						totalCells,
						totalRowCount,
						totalColumnCount,
					},
					eventType: EVENT_TYPE.TRACK,
				})(tr);

				// Need this check again since we are overriding the tr in previous statement
				if (tr.selection instanceof CellSelection) {
					const isTableSelected = tr.selection.isRowSelection() && tr.selection.isColSelection();
					if (isTableSelected) {
						tr = removeTable(tr);
					} else if (tr.selection.isRowSelection()) {
						const {
							pluginConfig: { isHeaderRowRequired },
						} = getPluginState(newState);
						tr = deleteRows(rect, isHeaderRowRequired)(tr);
					} else if (tr.selection.isColSelection()) {
						tr = deleteColumns(
							rect,
							getAllowAddColumnCustomStep(oldState),
							editorView,
							isTableScalingEnabled,
							shouldUseIncreasedScalingPercent,
						)(tr);
					}
				}
			}
		}
	}

	return tr;
};

export const isTableInFocus = (view: EditorView) => {
	return !!getPluginState(view.state)?.tableNode && !getResizePluginState(view.state)?.dragging;
};

export const whenTableInFocus =
	(eventHandler: (view: EditorView, mouseEvent: Event) => boolean) =>
	(view: EditorView, mouseEvent: Event): boolean => {
		if (!isTableInFocus(view)) {
			return false;
		}

		return eventHandler(view, mouseEvent);
	};

const trackCellLocation = (view: EditorView, mouseEvent: Event) => {
	const target = mouseEvent.target;
	const maybeTableCell = isElementInTableCell(target as HTMLElement) as HTMLTableCellElement | null;
	const { tableNode, tableRef } = getPluginState(view.state);

	const tableElement = closestElement(target as HTMLElement, 'table') as HTMLTableElement;

	// hover will only trigger if target localId is the same with selected localId
	if (
		tableElement?.dataset?.tableLocalId &&
		tableElement.dataset.tableLocalId !== tableNode?.attrs.localId
	) {
		return;
	}

	if (!maybeTableCell || !tableRef) {
		return;
	}

	const htmlColIndex = maybeTableCell.cellIndex;
	const rowElement = closestElement(target as HTMLElement, 'tr') as HTMLTableRowElement;
	const htmlRowIndex = rowElement && rowElement.rowIndex;

	const tableMap = tableNode && TableMap.get(tableNode);
	let colIndex = htmlColIndex;
	if (tableMap) {
		const convertedColIndex = convertHTMLCellIndexToColumnIndex(
			htmlColIndex,
			htmlRowIndex,
			tableMap,
		);

		colIndex = getColumnIndexMappedToColumnIndexInFirstRow(
			convertedColIndex,
			htmlRowIndex,
			tableMap,
		);
	}

	hoverCell(htmlRowIndex, colIndex)(view.state, view.dispatch);
};

export const withCellTracking =
	(eventHandler: (view: EditorView, mouseEvent: Event) => boolean) =>
	(view: EditorView, mouseEvent: Event): boolean => {
		if (
			getPluginState(view.state).isDragAndDropEnabled &&
			!getDragDropPluginState(view.state).isDragging
		) {
			trackCellLocation(view, mouseEvent);
		}
		return eventHandler(view, mouseEvent);
	};
