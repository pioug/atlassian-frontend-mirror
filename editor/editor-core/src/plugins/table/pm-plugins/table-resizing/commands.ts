import { Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';

import { isTableSelected } from '@atlaskit/editor-tables/utils';

import { Command, DomAtPos } from '../../../../types';
import { updateColumnWidths } from '../../transforms';

import { createCommand, getPluginState } from './plugin-factory';
import {
  evenAllColumnsWidths,
  hasTableBeenResized,
  isClickNear,
  insertColgroupFromNode as recreateResizeColsByNode,
  ResizeState,
  scale,
  ScaleOptions,
  scaleWithParent,
} from './utils';

import { ContentNodeWithPos } from 'prosemirror-utils';

// Scale the table to meet new requirements (col, layout change etc)
export const scaleTable = (
  tableRef: HTMLTableElement | null | undefined,
  options: ScaleOptions,
  domAtPos: DomAtPos,
): Command => (state, dispatch) => {
  if (!tableRef) {
    return false;
  }

  const { node, start, parentWidth } = options;

  // If a table has not been resized yet, columns should be auto.
  if (hasTableBeenResized(node) === false) {
    // If its not a re-sized table, we still want to re-create cols
    // To force reflow of columns upon delete.
    recreateResizeColsByNode(tableRef, node);
    return false;
  }

  let resizeState;
  if (parentWidth) {
    resizeState = scaleWithParent(tableRef, parentWidth, node, start, domAtPos);
  } else {
    resizeState = scale(tableRef, options, domAtPos);
  }

  if (resizeState) {
    let { tr } = state;
    tr = updateColumnWidths(resizeState, node, start)(tr);

    if (tr.docChanged && dispatch) {
      tr.setMeta('scrollIntoView', false);
      // TODO: ED-8995
      // We need to do this check to reduce the number of race conditions when working with tables.
      // This metadata is been used in the sendTransaction function in the Collab plugin
      tr.setMeta('scaleTable', true);
      dispatch(tr);
      return true;
    }
  }

  return false;
};

export const evenColumns = ({
  resizeState,
  table,
  start,
  event,
}: {
  resizeState: ResizeState;
  table: PMNode;
  start: number;
  event: MouseEvent;
}): Command => (state, dispatch) => {
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
    setLastClick(null, (tr) => updateColumnWidths(newState, table, start)(tr))(
      state,
      dispatch,
    );

    return true;
  }

  setLastClick({ x: event.clientX, y: event.clientY, time: now })(
    state,
    dispatch,
  );

  return false;
};

export const distributeColumnsWidths = (
  newResizeState: ResizeState,
  table: ContentNodeWithPos,
): Command => (state, dispatch) => {
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
