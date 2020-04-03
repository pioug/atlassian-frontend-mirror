import { TableMap } from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';
import { getSelectionRect } from 'prosemirror-utils';
import {
  tableCellMinWidth,
  akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-common';
import { TableLayout, CellAttributes } from '@atlaskit/adf-schema';
import { pluginKey as editorDisabledPluginKey } from '../../../editor-disabled';
import { updateColumnWidths } from '../../transforms';
import {
  getResizeState,
  resizeColumn,
  getLayoutSize,
  currentColWidth,
  pointsAtCell,
  updateControls,
} from './utils';
import { getSelectedColumnIndexes, updateResizeHandles } from '../../utils';
import { pluginKey as widthPluginKey } from '../../../width';
import { getPluginState } from './plugin-factory';
import { setDragging, evenColumns, stopResizing } from './commands';
import { getParentNodeWidth } from '../../../../utils/node-width';

export const handleMouseDown = (
  view: EditorView,
  event: MouseEvent,
  localResizeHandlePos: number,
  dynamicTextSizing: boolean,
): boolean => {
  const { state, dispatch } = view;
  const { editorDisabled } = editorDisabledPluginKey.getState(state);
  const domAtPos = view.domAtPos.bind(view);

  if (
    editorDisabled ||
    localResizeHandlePos === null ||
    !pointsAtCell(state.doc.resolve(localResizeHandlePos))
  ) {
    return false;
  }
  event.preventDefault();
  const cell = state.doc.nodeAt(localResizeHandlePos);
  const $cell = state.doc.resolve(localResizeHandlePos);
  const originalTable = $cell.node(-1);
  const start = $cell.start(-1);

  let dom: HTMLTableElement = domAtPos(start).node as HTMLTableElement;
  while (dom.nodeName !== 'TABLE') {
    dom = dom.parentNode! as HTMLTableElement;
  }

  const containerWidth = widthPluginKey.getState(state);
  const parentWidth = getParentNodeWidth(start, state, containerWidth);

  let maxSize =
    parentWidth ||
    getLayoutSize(
      dom.getAttribute('data-layout') as TableLayout,
      containerWidth.width,
      {
        dynamicTextSizing,
      },
    );

  if (originalTable.attrs.isNumberColumnEnabled) {
    maxSize -= akEditorTableNumberColumnWidth;
  }

  const resizeState = getResizeState({
    minWidth: tableCellMinWidth,
    maxSize,
    table: originalTable,
    tableRef: dom,
    start,
    domAtPos,
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

  const width = currentColWidth(
    view,
    localResizeHandlePos,
    cell!.attrs as CellAttributes,
  );

  setDragging({ startX: event.clientX, startWidth: width })(state, dispatch);

  function finish(event: MouseEvent) {
    window.removeEventListener('mouseup', finish);
    window.removeEventListener('mousemove', move);

    const { clientX } = event;
    const { state, dispatch } = view;
    const { dragging, resizeHandlePos } = getPluginState(state);
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

    // If we let go in the same place we started, dont need to do anything.
    if (dragging && clientX === dragging.startX) {
      return stopResizing()(state, dispatch);
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
        const selectedColumns = selectionRect
          ? getSelectedColumnIndexes(selectionRect)
          : [];
        // only selected (or selected - 1) columns should be distributed
        const resizingSelectedColumns =
          selectedColumns.indexOf(colIndex) > -1 ||
          selectedColumns.indexOf(colIndex + 1) > -1;
        const newResizeState = resizeColumn(
          resizeState,
          colIndex,
          clientX - startX,
          dom,
          resizingSelectedColumns ? selectedColumns : undefined,
        );
        tr = updateColumnWidths(newResizeState, table, start)(tr);
      }

      return stopResizing(tr)(state, dispatch);
    }
  }

  function move(event: MouseEvent) {
    const { clientX, which } = event;
    const { state } = view;
    const { dragging, resizeHandlePos } = getPluginState(state);
    if (
      !which ||
      !dragging ||
      resizeHandlePos === null ||
      !pointsAtCell(state.doc.resolve(resizeHandlePos))
    ) {
      return finish(event);
    }

    const $cell = state.doc.resolve(resizeHandlePos);
    const table = $cell.node(-1);
    const map = TableMap.get(table);
    const colIndex =
      map.colCount($cell.pos - $cell.start(-1)) +
      $cell.nodeAfter!.attrs.colspan -
      1;

    resizeColumn(resizeState, colIndex, clientX - dragging.startX, dom);

    updateControls(state);
    updateResizeHandles(dom);
  }

  window.addEventListener('mouseup', finish);
  window.addEventListener('mousemove', move);

  return true;
};
