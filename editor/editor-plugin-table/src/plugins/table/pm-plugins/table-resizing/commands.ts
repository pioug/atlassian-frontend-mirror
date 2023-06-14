import { Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { ContentNodeWithPos } from 'prosemirror-utils';

import { isTableSelected } from '@atlaskit/editor-tables/utils';
import type { Command } from '@atlaskit/editor-common/types';

import { createCommand, getPluginState } from './plugin-factory';
import { evenAllColumnsWidths, isClickNear, ResizeState } from './utils';
import { updateColumnWidths } from '../../transforms';

export const evenColumns =
  ({
    resizeState,
    table,
    start,
    event,
  }: {
    resizeState: ResizeState;
    table: PMNode;
    start: number;
    event: MouseEvent;
  }): Command =>
  (state, dispatch) => {
    if (!isTableSelected(state.selection)) {
      return false;
    }

    // double click detection logic
    // Note: ProseMirror's handleDoubleClick doesn't quite work with DOM mousedown event handler
    const { lastClick } = getPluginState(state);
    const now = Date.now();
    if (
      lastClick &&
      now - lastClick.time < 500 &&
      isClickNear(event, lastClick)
    ) {
      const newState = evenAllColumnsWidths(resizeState);
      setLastClick(null, (tr) =>
        updateColumnWidths(newState, table, start)(tr),
      )(state, dispatch);

      return true;
    }

    setLastClick({ x: event.clientX, y: event.clientY, time: now })(
      state,
      dispatch,
    );

    return false;
  };

export const distributeColumnsWidths =
  (newResizeState: ResizeState, table: ContentNodeWithPos): Command =>
  (state, dispatch) => {
    if (dispatch) {
      const tr = updateColumnWidths(
        newResizeState,
        table.node,
        table.start,
      )(state.tr);
      stopResizing(tr)(state, dispatch);
    }

    return true;
  };

export const setResizeHandlePos = (resizeHandlePos: number | null) =>
  createCommand({
    type: 'SET_RESIZE_HANDLE_POSITION',
    data: {
      resizeHandlePos,
    },
  });

export const stopResizing = (tr?: Transaction) =>
  createCommand(
    {
      type: 'STOP_RESIZING',
    },
    (originalTr) => (tr || originalTr).setMeta('scrollIntoView', false),
  );

export const setDragging = (
  dragging: { startX: number; startWidth: number } | null,
  tr?: Transaction,
) =>
  createCommand(
    {
      type: 'SET_DRAGGING',
      data: {
        dragging,
      },
    },
    (originalTr) => tr || originalTr,
  );

export const setLastClick = (
  lastClick: { x: number; y: number; time: number } | null,
  transform?: (tr: Transaction) => Transaction,
) =>
  createCommand(
    {
      type: 'SET_LAST_CLICK',
      data: {
        lastClick,
      },
    },
    transform,
  );
