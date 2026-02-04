import { type IntlShape } from 'react-intl-next/src/types';

import {
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
	TABLE_ACTION,
	TABLE_STATUS,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { tableMessages as messages } from '@atlaskit/editor-common/messages';
import type { Command } from '@atlaskit/editor-common/types';
import type { AriaLiveElementAttributes } from '@atlaskit/editor-plugin-accessibility-utils';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { findCellRectClosestToPos, getSelectionRect } from '@atlaskit/editor-tables/utils';

import type { DraggableData, DraggableType, TableDirection } from '../../types';
import { getSelectedTableInfo, withEditorAnalyticsAPI } from '../utils/analytics';
import { canMove, getTargetIndex } from '../utils/drag-menu';
import { getSelectedColumnIndexes, getSelectedRowIndexes } from '../utils/selection';

import { clearDropTarget, cloneSource, moveSource, toggleDragMenu } from './commands';
import { getPluginState } from './plugin-factory';
import type { TriggerType } from './types';

export const clearDropTargetWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(
		inputMethod: INPUT_METHOD.TABLE_CONTEXT_MENU | INPUT_METHOD.DRAG_AND_DROP,
		sourceType: DraggableType,
		sourceIndexes: number[] | undefined,
		status: TABLE_STATUS.CANCELLED | TABLE_STATUS.INVALID,
		tr?: Transaction,
	) => {
		return withEditorAnalyticsAPI(({ selection }: EditorState) => {
			const { totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);
			return {
				action: sourceType === 'table-row' ? TABLE_ACTION.MOVED_ROW : TABLE_ACTION.MOVED_COLUMN,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				attributes: {
					inputMethod,
					count: sourceIndexes?.length ?? 0,
					distance: 0,
					status,
					totalRowCount,
					totalColumnCount,
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)((state, dispatch) => {
			if (dispatch) {
				clearDropTarget(tr)(state, dispatch);
			}
			return true;
		});
	};

export const moveSourceWithAnalytics =
	(
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
		ariaNotify?: (message: string, ariaLiveElementAttributes?: AriaLiveElementAttributes) => void,
		getIntl?: () => IntlShape,
	) =>
	(
		inputMethod:
			| INPUT_METHOD.TABLE_CONTEXT_MENU
			| INPUT_METHOD.DRAG_AND_DROP
			| INPUT_METHOD.SHORTCUT,
		sourceType: DraggableType,
		sourceIndexes: number[],
		targetIndex: number,
		tr?: Transaction,
	) => {
		return withEditorAnalyticsAPI(({ selection }: EditorState) => {
			const direction = sourceIndexes[0] > targetIndex ? -1 : 1;
			const { totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);
			return {
				action: sourceType === 'table-row' ? TABLE_ACTION.MOVED_ROW : TABLE_ACTION.MOVED_COLUMN,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				attributes: {
					inputMethod,
					count: sourceIndexes.length,
					// This identifies the total amount of row/cols the move operation covered. The distance covered should be a representaion
					// of the minimum distance. This will account for large selection being moved causing a large distance travelled value.
					distance: Math.min(...sourceIndexes.map((v) => Math.abs(targetIndex - v))) * direction,
					// If a drop doesn't actually change anything then we're going to mark the event as cancelled.
					status: sourceIndexes.includes(targetIndex)
						? TABLE_STATUS.CANCELLED
						: TABLE_STATUS.SUCCESS,
					totalRowCount,
					totalColumnCount,
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)((state, dispatch) => {
			if (dispatch) {
				moveSource(sourceType, sourceIndexes, targetIndex, tr)(state, dispatch);
				// Only considering single row/column movement for screen reader as only single row/column selection is supported via keyboard atm.
				if (
					(inputMethod === INPUT_METHOD.TABLE_CONTEXT_MENU || INPUT_METHOD.SHORTCUT) &&
					sourceIndexes.length === 1 &&
					ariaNotify &&
					getIntl
				) {
					const direction = sourceIndexes[0] > targetIndex ? -1 : 1; // -1 for left/up , 1 for right/down
					const { totalRowCount, totalColumnCount } = getSelectedTableInfo(state.selection);
					ariaNotify(
						getIntl().formatMessage(
							sourceType === 'table-row'
								? direction > 0
									? messages.rowMovedDown
									: messages.rowMovedUp
								: direction > 0
									? messages.columnMovedRight
									: messages.columnMovedLeft,
							{
								index: targetIndex + 1,
								total: sourceType === 'table-row' ? totalRowCount : totalColumnCount,
							},
						),
						{
							priority: 'important',
						},
					);
				}
			}
			return true;
		});
	};

export const moveSourceWithAnalyticsViaShortcut =
	(
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null,
		ariaNotify?: (message: string, ariaLiveElementAttributes?: AriaLiveElementAttributes) => void,
		getIntl?: () => IntlShape,
	) =>
	(sourceType: DraggableType, direction: DraggableData['direction']): Command =>
	(state, dispatch) => {
		const { selection } = state;
		const isCellSelection = selection instanceof CellSelection;
		const selectionRect = isCellSelection
			? getSelectionRect(selection)
			: findCellRectClosestToPos(selection.$from);

		if (!selectionRect) {
			return false;
		}

		const isRow = sourceType === 'table-row';
		const selectedIndexes = isRow
			? getSelectedRowIndexes(selectionRect)
			: getSelectedColumnIndexes(selectionRect);
		if (selectedIndexes.length === 0) {
			return false;
		}

		const { totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);
		if (
			!canMove(
				sourceType,
				direction,
				isRow ? totalRowCount : totalColumnCount,
				selection,
				selectionRect,
			)
		) {
			return false;
		}

		const targetIndex = getTargetIndex(selectedIndexes, direction);

		return moveSourceWithAnalytics(editorAnalyticsAPI, ariaNotify, getIntl)(
			INPUT_METHOD.SHORTCUT,
			sourceType,
			selectedIndexes,
			targetIndex,
		)(state, dispatch);
	};

export const cloneSourceWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(
		inputMethod:
			| INPUT_METHOD.TABLE_CONTEXT_MENU
			| INPUT_METHOD.DRAG_AND_DROP
			| INPUT_METHOD.SHORTCUT,
		sourceType: DraggableType,
		sourceIndexes: number[],
		targetIndex: number,
		targetDirection: 'start' | 'end',
		tr?: Transaction,
	) => {
		return withEditorAnalyticsAPI(({ selection }: EditorState) => {
			const direction = sourceIndexes[0] > targetIndex ? -1 : 1;
			const { totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);
			return {
				action: sourceType === 'table-row' ? TABLE_ACTION.CLONED_ROW : TABLE_ACTION.CLONED_COLUMN,
				actionSubject: ACTION_SUBJECT.TABLE,
				actionSubjectId: null,
				attributes: {
					inputMethod,
					count: sourceIndexes.length,
					// This identifies the total amount of row/cols the move operation covered. The distance covered should be a representaion
					// of the minimum distance. This will account for large selection being moved causing a large distance travelled value.
					distance: Math.min(...sourceIndexes.map((v) => Math.abs(targetIndex - v))) * direction,
					// If a drop doesn't actually change anything then we're going to mark the event as cancelled.
					status: sourceIndexes.includes(targetIndex)
						? TABLE_STATUS.CANCELLED
						: TABLE_STATUS.SUCCESS,
					totalRowCount,
					totalColumnCount,
				},
				eventType: EVENT_TYPE.TRACK,
			};
		})(editorAnalyticsAPI)((state, dispatch) => {
			if (dispatch) {
				cloneSource(sourceType, sourceIndexes, targetIndex, targetDirection, tr)(state, dispatch);
			}
			return true;
		});
	};

export const toggleDragMenuWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
	(
		isDragMenuOpen: boolean | undefined,
		direction?: TableDirection,
		index?: number,
		trigger: TriggerType = 'mouse',
	) => {
		return withEditorAnalyticsAPI((state) => {
			const {
				isDragMenuOpen: previousOpenState,
				dragMenuDirection: previousDragMenuDirection,
				dragMenuIndex: previousDragMenuIndex,
			} = getPluginState(state);

			if (
				previousOpenState === isDragMenuOpen &&
				previousDragMenuDirection === direction &&
				previousDragMenuIndex === index
			) {
				return undefined;
			}

			let updatedMenuOpenState;
			if (isDragMenuOpen !== undefined) {
				updatedMenuOpenState = isDragMenuOpen;
			} else {
				// menu open but menu direction changed, means user clicked on drag handle of different row/column
				// menu open menu direction not changed, but index changed, means user clicked on drag handle of same row/column, different cells.
				// 2 scenarios above , menu should remain open.
				if (
					(previousOpenState === true && previousDragMenuDirection !== direction) ||
					(previousOpenState === true &&
						previousDragMenuDirection === direction &&
						previousDragMenuIndex !== index)
				) {
					updatedMenuOpenState = true;
				} else {
					updatedMenuOpenState = !previousOpenState;
				}
			}

			if (updatedMenuOpenState) {
				// We only want to fire analytics when the menu is opened
				return {
					action: TABLE_ACTION.DRAG_MENU_OPENED,
					actionSubject: ACTION_SUBJECT.TABLE,
					actionSubjectId: null,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						inputMethod: trigger === 'keyboard' ? INPUT_METHOD.KEYBOARD : INPUT_METHOD.MOUSE,
						direction: direction ?? previousDragMenuDirection ?? 'column',
					},
				};
			}

			return undefined;
		})(editorAnalyticsAPI)((state, dispatch) => {
			if (dispatch) {
				toggleDragMenu(isDragMenuOpen, direction, index, trigger)(state, dispatch);
			}
			return true;
		});
	};
