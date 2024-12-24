import { INPUT_METHOD, TABLE_STATUS } from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { getCellsInRow, getSelectedCellInfo } from '@atlaskit/editor-tables/utils';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import type { DraggableSourceData } from '../../types';
import { getPluginState as getTablePluginState } from '../plugin-factory';
import { pluginKey as tablePluginKey } from '../plugin-key';
import { insertColgroupFromNode } from '../table-resizing/utils/colgroup';
import { findNearestCellIndexToPoint } from '../utils/dom';
import { hasMergedCellsInBetween } from '../utils/merged-cells';

import { DragAndDropActionType } from './actions';
import { clearDropTarget, setDropTarget, toggleDragMenu } from './commands';
import {
	clearDropTargetWithAnalytics,
	cloneSourceWithAnalytics,
	moveSourceWithAnalytics,
} from './commands-with-analytics';
import { DropTargetType } from './consts';
import { createPluginState, getPluginState } from './plugin-factory';
import { pluginKey } from './plugin-key';
import { getDraggableDataFromEvent } from './utils/monitor';

const destroyFn = (
	editorView: EditorView,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	editorAnalyticsAPI: any,
	isTableScalingEnabled: boolean,
	isTableFixedColumnWidthsOptionEnabled: boolean,
	isCommentEditor: boolean,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	const editorPageScrollContainer = document.querySelector('.fabric-editor-popup-scroll-parent');

	const rowAutoScrollers = editorPageScrollContainer
		? [
				monitorForElements({
					canMonitor({ source }) {
						const { type } = source.data as Partial<DraggableSourceData>;
						return type === 'table-row';
					},
					onDragStart() {
						// auto scroller doesn't work when scroll-behavior: smooth is set, this monitor temporarily removes it via inline styles
						// Ignored via go/ees005
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						(editorPageScrollContainer as HTMLElement).style.setProperty(
							'scroll-behavior',
							'unset',
						);
					},
					onDrop() {
						// 'null' will remove the inline style
						// Ignored via go/ees005
						// eslint-disable-next-line @atlaskit/editor/no-as-casting
						(editorPageScrollContainer as HTMLElement).style.setProperty('scroll-behavior', null);
					},
				}),
				autoScrollForElements({
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
					element: editorPageScrollContainer as HTMLElement,
					canScroll: ({ source }) => {
						const { type } = source.data as Partial<DraggableSourceData>;
						return type === 'table-row';
					},
				}),
			]
		: [];

	return combine(
		...rowAutoScrollers,
		monitorForElements({
			canMonitor({ source }) {
				const { type, localId, indexes } = source.data as Partial<DraggableSourceData>;

				// First; Perform any quick checks so we can abort early.
				if (!indexes || !localId || !(type === 'table-row' || type === 'table-column')) {
					return false;
				}

				const { tableNode } = getTablePluginState(editorView.state);
				// If the draggable localId is the same as the current selected table localId then we will allow the monitor
				// watch for changes
				return localId === tableNode?.attrs.localId;
			},
			onDragStart: ({ location }) => {
				toggleDragMenu(false)(editorView.state, editorView.dispatch);
			},
			onDrag(event) {
				const data = getDraggableDataFromEvent(event);
				// If no data can be found then it's most like we do not want to perform any drag actions
				if (!data) {
					clearDropTarget()(editorView.state, editorView.dispatch);
					return;
				}

				// TODO: as we drag an element around we are going to want to update the state to acurately reflect the current
				// insert location as to where the draggable will most likely be go. For example;
				const { sourceType, targetAdjustedIndex } = data;
				const dropTargetType =
					sourceType === 'table-row' ? DropTargetType.ROW : DropTargetType.COLUMN;

				const hasMergedCells = hasMergedCellsInBetween(
					[targetAdjustedIndex - 1, targetAdjustedIndex],
					dropTargetType,
				)(editorView.state.selection);

				setDropTarget(
					dropTargetType,
					targetAdjustedIndex,
					hasMergedCells,
				)(editorView.state, editorView.dispatch);
			},
			onDrop(event) {
				const data = getDraggableDataFromEvent(event);

				// On Drop we need to update the table main plugin hoveredCell value with the current row/col that the mouse is
				// over. This is so the drag handles update their positions to correctly align with the users mouse. Unfortunately
				// at this point in time and during the drag opertation, the drop targets are eating all the mouse events so
				// it's not possible to know what row/col the mouse is over (via mouse events). This attempts to locate the nearest cell and
				// then tries to update the main table hoveredCell value by piggy-backing the transaction onto the command
				// triggered by this on drop event.
				const { hoveredCell } = getTablePluginState(editorView.state);

				const cell = findNearestCellIndexToPoint(
					event.location.current.input.clientX,
					event.location.current.input.clientY,
				);
				const tr = editorView.state.tr;
				const action = {
					type: 'HOVER_CELL',
					data: {
						hoveredCell: {
							rowIndex: cell?.row ?? hoveredCell.rowIndex,
							colIndex: cell?.col ?? hoveredCell.colIndex,
						},
					},
				};
				tr.setMeta(tablePluginKey, action);

				// If no data can be found then it's most like we do not want to perform any drop action
				if (!data) {
					// If we're able to determine the source type of the dropped element then we should report to analytics that
					// the drop event was cancelled. Otherwise we will cancel silently.
					if (
						event?.source?.data?.type === 'table-row' ||
						event?.source?.data?.type === 'table-column'
					) {
						return clearDropTargetWithAnalytics(editorAnalyticsAPI)(
							INPUT_METHOD.DRAG_AND_DROP,
							event.source.data.type,
							event.source.data?.indexes as number[] | undefined,
							TABLE_STATUS.CANCELLED,
							tr,
						)(editorView.state, editorView.dispatch);
					}
					return clearDropTarget(tr)(editorView.state, editorView.dispatch);
				}

				const {
					sourceType,
					sourceIndexes,
					targetIndex,
					targetAdjustedIndex,
					targetDirection,
					direction,
					behaviour,
				} = data;

				// When we drop on a target we will know the targets row/col index for certain,
				if (sourceType === 'table-row') {
					action.data.hoveredCell.rowIndex = targetIndex;
				} else {
					action.data.hoveredCell.colIndex = targetIndex;
				}

				// If the drop target index contains merged cells then we should not allow the drop to occur.
				if (
					hasMergedCellsInBetween(
						[targetAdjustedIndex - 1, targetAdjustedIndex],
						sourceType === 'table-row' ? DropTargetType.ROW : DropTargetType.COLUMN,
					)(editorView.state.selection)
				) {
					clearDropTargetWithAnalytics(editorAnalyticsAPI)(
						INPUT_METHOD.DRAG_AND_DROP,
						sourceType,
						sourceIndexes,
						// This event is mrked as invalid because the user is attempting to drop an element in an area which has merged cells.
						TABLE_STATUS.INVALID,
						tr,
					)(editorView.state, editorView.dispatch);
					return;
				}

				requestAnimationFrame(() => {
					if (behaviour === 'clone') {
						cloneSourceWithAnalytics(editorAnalyticsAPI)(
							INPUT_METHOD.DRAG_AND_DROP,
							sourceType,
							sourceIndexes,
							targetIndex,
							targetDirection,
							tr,
						)(editorView.state, editorView.dispatch);
					} else {
						moveSourceWithAnalytics(editorAnalyticsAPI)(
							INPUT_METHOD.DRAG_AND_DROP,
							sourceType,
							sourceIndexes,
							targetAdjustedIndex + (direction === 1 ? -1 : 0),
							tr,
						)(editorView.state, editorView.dispatch);
					}

					// force a colgroup update here, otherwise dropped columns don't have
					// the correct width immediately after the drop
					if (sourceType === 'table-column') {
						const { tableRef, tableNode } = getTablePluginState(editorView.state);
						if (tableRef && tableNode) {
							let isTableScalingEnabledOnCurrentTable = isTableScalingEnabled;
							const isTableScalingWithFixedColumnWidthsOptionEnabled =
								isTableScalingEnabled && isTableFixedColumnWidthsOptionEnabled;
							if (isTableScalingWithFixedColumnWidthsOptionEnabled) {
								isTableScalingEnabledOnCurrentTable = tableNode.attrs.displayMode !== 'fixed';
							}

							if (isTableScalingEnabled && isCommentEditor) {
								isTableScalingEnabledOnCurrentTable = true;
							}
							const shouldUseIncreasedScalingPercent =
								isTableScalingWithFixedColumnWidthsOptionEnabled ||
								(isTableScalingEnabled && isCommentEditor);

							insertColgroupFromNode(
								tableRef,
								tableNode,
								isTableScalingEnabledOnCurrentTable,
								undefined,
								shouldUseIncreasedScalingPercent,
								isCommentEditor,
							);
						}
					}

					editorView.focus();
				});
			},
		}),
	);
};

export const createPlugin = (
	dispatch: Dispatch,
	editorAnalyticsAPI?: EditorAnalyticsAPI,
	isTableScalingEnabled = false,
	isTableFixedColumnWidthsOptionEnabled = false,
	isCommentEditor = false,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
) => {
	return new SafePlugin({
		state: createPluginState(dispatch, (state) => ({
			decorationSet: DecorationSet.empty,
			dropTargetType: DropTargetType.NONE,
			dropTargetIndex: 0,
			isDragMenuOpen: false,
			dragMenuIndex: 0,
			isDragging: false,
			isKeyboardModeActive: false,
		})),
		key: pluginKey,
		appendTransaction: (transactions, oldState, newState) => {
			const { targetCellPosition: oldTargetCellPosition } = getTablePluginState(oldState);
			const { targetCellPosition: newTargetCellPosition } = getTablePluginState(newState);
			const { isDragMenuOpen = false, dragMenuIndex } = getPluginState(newState);

			transactions.forEach((transaction) => {
				if (transaction.getMeta('selectedRowViaKeyboard')) {
					const button = document.querySelector('#drag-handle-button-row');
					if (button) {
						(button as HTMLButtonElement).focus();
					}
				}
				if (transaction.getMeta('selectedColumnViaKeyboard')) {
					const button = document.querySelector('#drag-handle-button-column');
					if (button) {
						(button as HTMLButtonElement).focus();
					}
				}
			});

			// What's happening here? you asked... In a nutshell;
			// If the target cell position changes while the drag menu is open then we want to close the drag menu if it has been opened.
			// This will stop the drag menu from moving around the screen to different row/cols. Too achieve this we need
			// to check if the new target cell position is pointed at a different cell than what the drag menu was opened on.
			if (oldTargetCellPosition !== newTargetCellPosition) {
				if (isDragMenuOpen) {
					const tr = newState.tr;
					const action = {
						type: DragAndDropActionType.TOGGLE_DRAG_MENU,
						data: {
							isDragMenuOpen: false,
							direction: undefined,
						},
					};

					if (newTargetCellPosition !== undefined) {
						const cells = getCellsInRow(dragMenuIndex)(tr.selection);
						// ED-20673 check if it is a cell selection,
						// when true, a drag handle is clicked and isDragMenuOpen is true here
						// should not close the drag menu.
						const isCellSelection = tr.selection instanceof CellSelection;
						if (
							cells &&
							cells.length &&
							cells[0].node !== tr.doc.nodeAt(newTargetCellPosition) &&
							!isCellSelection
						) {
							return tr.setMeta(pluginKey, action);
						} // else NOP
					} else {
						return tr.setMeta(pluginKey, action);
					}
				}
			}
		},
		view: (editorView: EditorView) => {
			return {
				destroy: destroyFn(
					editorView,
					editorAnalyticsAPI,
					isTableScalingEnabled,
					isTableFixedColumnWidthsOptionEnabled,
					isCommentEditor,
				),
			};
		},
		props: {
			decorations: (state) => {
				const { decorationSet } = getPluginState(state);
				return decorationSet;
			},
			handleKeyDown: (view, event) => {
				const {
					state: { tr },
				} = view;

				const keysToTrapWhen = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

				/** fix for NCS spam update where the user is holding down the move column / row keyboard shortcut
				 * if the user is holding down shortcut (ctrl + shift + alt + arrowKey), we want to move the selection only once
				 * See ticket ED-22154 https://product-fabric.atlassian.net/browse/ED-22154
				 */

				// Do early check for the keys we want to trap here so we can abort early
				if (event.ctrlKey && event.shiftKey && event.altKey) {
					const { verticalCells, horizontalCells, totalRowCount, totalColumnCount } =
						getSelectedCellInfo(tr.selection);

					const isRowOrColumnSelected =
						horizontalCells === totalColumnCount || verticalCells === totalRowCount;
					if (isRowOrColumnSelected && keysToTrapWhen.includes(event.key) && event.repeat) {
						return true;
					}
				}

				const isDragHandleFocused = [
					'drag-handle-button-row',
					'drag-handle-button-column',
					// Ignored via go/ees005
					// eslint-disable-next-line @atlaskit/editor/no-as-casting
				].includes(((event.target as HTMLElement) || null)?.id);
				const keysToTrap = ['Enter', ' '];

				const { isDragMenuOpen = false } = getPluginState(view.state);

				// drag handle is focused, and user presses any key return them back to editing
				if (isDragHandleFocused && !isDragMenuOpen && !keysToTrap.includes(event.key)) {
					view.dom.focus();
					return true;
				}

				if (
					(isDragHandleFocused && keysToTrap.includes(event.key)) ||
					(isDragMenuOpen && keysToTrapWhen.includes(event.key))
				) {
					return true;
				}
			},
		},
	});
};
