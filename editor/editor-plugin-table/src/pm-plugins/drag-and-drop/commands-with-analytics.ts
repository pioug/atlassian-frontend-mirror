import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
  TABLE_ACTION,
  TABLE_STATUS,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import {
  findCellRectClosestToPos,
  getSelectionRect,
} from '@atlaskit/editor-tables/utils';

import type { DraggableData, DraggableType } from '../../types';
import {
  getSelectedColumnIndexes,
  getSelectedRowIndexes,
  getSelectedTableInfo,
} from '../../utils';
import { withEditorAnalyticsAPI } from '../../utils/analytics';
import { canMove, getTargetIndex } from '../../utils/drag-menu';

import { clearDropTarget, moveSource } from './commands';

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
      const { totalRowCount, totalColumnCount } =
        getSelectedTableInfo(selection);
      return {
        action:
          sourceType === 'table-row'
            ? TABLE_ACTION.MOVED_ROW
            : TABLE_ACTION.MOVED_COLUMN,
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
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
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
      const { totalRowCount, totalColumnCount } =
        getSelectedTableInfo(selection);
      return {
        action:
          sourceType === 'table-row'
            ? TABLE_ACTION.MOVED_ROW
            : TABLE_ACTION.MOVED_COLUMN,
        actionSubject: ACTION_SUBJECT.TABLE,
        actionSubjectId: null,
        attributes: {
          inputMethod,
          count: sourceIndexes.length,
          // This identifies the total amount of row/cols the move operation covered. The distance covered should be a representaion
          // of the minimum distance. This will account for large selection being moved causing a large distance travelled value.
          distance:
            Math.min(...sourceIndexes.map((v) => Math.abs(targetIndex - v))) *
            direction,
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
      }
      return true;
    });
  };

export const moveSourceWithAnalyticsViaShortcut =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null) =>
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

    return moveSourceWithAnalytics(editorAnalyticsAPI)(
      INPUT_METHOD.SHORTCUT,
      sourceType,
      selectedIndexes,
      targetIndex,
    )(state, dispatch);
  };
