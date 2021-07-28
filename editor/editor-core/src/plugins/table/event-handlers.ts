import { Node as PmNode } from 'prosemirror-model';
import {
  EditorState,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
  cellAround,
  findCellRectClosestToPos,
  findTable,
  getSelectionRect,
  removeTable,
} from '@atlaskit/editor-tables/utils';
import { EditorView } from 'prosemirror-view';
import rafSchedule from 'raf-schd';

import { browser } from '@atlaskit/editor-common';

import {
  isElementInTableCell,
  isLastItemMediaGroup,
  setNodeSelection,
} from '../../utils';
import { closestElement } from '../../utils/dom';
import {
  ACTION_SUBJECT,
  addAnalytics,
  EVENT_TYPE,
  TABLE_ACTION,
} from '../analytics';

import {
  addResizeHandleDecorations,
  clearHoverSelection,
  hideInsertColumnOrRowButton,
  hideResizeHandleLine,
  hoverColumns,
  selectColumn,
  setEditorFocus,
  showInsertColumnButton,
  showInsertRowButton,
  showResizeHandleLine,
} from './commands';
import { getPluginState } from './pm-plugins/plugin-factory';
import { getPluginState as getResizePluginState } from './pm-plugins/table-resizing/plugin-factory';
import { deleteColumns, deleteRows } from './transforms';
import {
  RESIZE_HANDLE_AREA_DECORATION_GAP,
  ElementContentRects,
} from './types';
import {
  getColumnOrRowIndex,
  getMousePositionHorizontalRelativeByElement,
  getMousePositionVerticalRelativeByElement,
  getSelectedCellInfo,
  hasResizeHandler,
  isCell,
  isColumnControlsDecorations,
  isCornerButton,
  isInsertRowButton,
  isResizeHandleDecoration,
  isRowControlsButton,
  isTableControlsButton,
  isTableContainerOrWrapper,
} from './utils';
import { getAllowAddColumnCustomStep } from './utils/get-allow-add-column-custom-step';
import { getFeatureFlags } from '../feature-flags-context';

const isFocusingCalendar = (event: Event) =>
  event instanceof FocusEvent &&
  event.relatedTarget instanceof HTMLElement &&
  event.relatedTarget.getAttribute('aria-label') === 'calendar';

const isFocusingModal = (event: Event) =>
  event instanceof FocusEvent &&
  event.relatedTarget instanceof HTMLElement &&
  event.relatedTarget.closest('[role="dialog"]');

export const handleBlur = (view: EditorView, event: Event): boolean => {
  const { state, dispatch } = view;
  // IE version check for ED-4665
  // Calendar focus check for ED-10466
  if (
    browser.ie_version !== 11 &&
    !isFocusingCalendar(event) &&
    !isFocusingModal(event)
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

  if (
    event instanceof MouseEvent &&
    isColumnControlsDecorations(element as HTMLElement)
  ) {
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
  const rowElement = closestElement(
    element as HTMLElement,
    'tr',
  ) as HTMLTableRowElement;
  const rowIndex = rowElement && rowElement.rowIndex;
  const cellIndex = map.width * rowIndex + colIndex;
  const posInTable = map.map[cellIndex + 1];

  const {
    dispatch,
    state: {
      tr,
      schema: {
        nodes: { paragraph },
      },
    },
  } = view;
  const editorElement = table.node.nodeAt(map.map[cellIndex]) as PmNode;

  /** Only if the last item is media group, insert a paragraph */
  if (isLastItemMediaGroup(editorElement)) {
    tr.insert(posInTable + table.pos, paragraph.create());
    dispatch(tr);
    setNodeSelection(view, posInTable + table.pos);
  }
  return true;
};

export const handleMouseOver = (
  view: EditorView,
  mouseEvent: Event,
): boolean => {
  if (!(mouseEvent.target instanceof HTMLElement)) {
    return false;
  }
  const { state, dispatch } = view;
  const target = mouseEvent.target;
  const { insertColumnButtonIndex, insertRowButtonIndex } = getPluginState(
    state,
  );

  if (isInsertRowButton(target)) {
    const [startIndex, endIndex] = getColumnOrRowIndex(target);

    const positionRow =
      getMousePositionVerticalRelativeByElement(mouseEvent as MouseEvent) ===
      'bottom'
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
    (typeof insertColumnButtonIndex === 'number' ||
      typeof insertRowButtonIndex === 'number')
  ) {
    return hideInsertColumnOrRowButton()(state, dispatch);
  }

  if (isResizeHandleDecoration(target)) {
    const [startIndex, endIndex] = getColumnOrRowIndex(target);
    return showResizeHandleLine({ left: startIndex, right: endIndex })(
      state,
      dispatch,
    );
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
      isRowControlsButton(event.target))
  );

  if (isControl) {
    event.preventDefault();
  }

  return isControl;
};

export const handleMouseOut = (
  view: EditorView,
  mouseEvent: Event,
): boolean => {
  if (
    !(mouseEvent instanceof MouseEvent) ||
    !(mouseEvent.target instanceof HTMLElement)
  ) {
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
  if (
    isResizeHandleDecoration(target) &&
    !isResizeHandleDecoration(relatedTarget)
  ) {
    const { state, dispatch } = view;
    return hideResizeHandleLine()(state, dispatch);
  }

  return false;
};

export const handleMouseLeave = (view: EditorView, event: Event): boolean => {
  if (!(event.target instanceof HTMLElement)) {
    return false;
  }

  const { state, dispatch } = view;
  const { insertColumnButtonIndex, insertRowButtonIndex } = getPluginState(
    state,
  );

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

export const handleMouseMove = (
  view: EditorView,
  event: Event,
  tableCellOptimization?: boolean,
  elementContentRects?: ElementContentRects,
) => {
  if (!(event.target instanceof HTMLElement)) {
    return false;
  }
  const element = event.target;

  if (isColumnControlsDecorations(element)) {
    const { state, dispatch } = view;
    const { insertColumnButtonIndex } = getPluginState(state);
    const [startIndex, endIndex] = getColumnOrRowIndex(element);

    const positionColumn =
      getMousePositionHorizontalRelativeByElement(
        event as MouseEvent,
        tableCellOptimization,
        elementContentRects,
      ) === 'right'
        ? endIndex
        : startIndex;

    if (positionColumn !== insertColumnButtonIndex) {
      return showInsertColumnButton(positionColumn)(state, dispatch);
    }
  }

  if (isRowControlsButton(element)) {
    const { state, dispatch } = view;
    const { insertRowButtonIndex } = getPluginState(state);
    const [startIndex, endIndex] = getColumnOrRowIndex(element);

    const positionRow =
      getMousePositionVerticalRelativeByElement(event as MouseEvent) ===
      'bottom'
        ? endIndex
        : startIndex;

    if (positionRow !== insertRowButtonIndex) {
      return showInsertRowButton(positionRow)(state, dispatch);
    }
  }

  const { mouseMoveOptimization } = getFeatureFlags(view.state) || {};
  // we only want to allow mouseMoveOptimisation when tableCellOptimization is enabled
  // because it relies on tableCell node view that is added  via tableCellOptimization
  const useMouseMoveOptimisation =
    tableCellOptimization && mouseMoveOptimization;

  if (!isResizeHandleDecoration(element) && isCell(element)) {
    const positionColumn = getMousePositionHorizontalRelativeByElement(
      event as MouseEvent,
      useMouseMoveOptimisation,
      elementContentRects,
      RESIZE_HANDLE_AREA_DECORATION_GAP,
    );

    if (positionColumn !== null) {
      const { state, dispatch } = view;
      const { resizeHandleColumnIndex } = getPluginState(state);
      const tableCell = closestElement(
        element,
        'td, th',
      ) as HTMLTableCellElement;
      const cellStartPosition = view.posAtDOM(tableCell, 0);
      const rect = findCellRectClosestToPos(
        state.doc.resolve(cellStartPosition),
      );

      if (rect) {
        const columnEndIndexTarget =
          positionColumn === 'left' ? rect.left : rect.right;

        if (
          columnEndIndexTarget !== resizeHandleColumnIndex ||
          !hasResizeHandler({ target: element, columnEndIndexTarget })
        ) {
          return addResizeHandleDecorations(columnEndIndexTarget)(
            state,
            dispatch,
          );
        }
      }
    }
  }

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
    const selTo = Selection.findFrom(
      state.doc.resolve($cellPos.pos + cell.nodeSize),
      -1,
      true,
    );
    if (selFrom && selTo) {
      dispatch(
        state.tr.setSelection(new TextSelection(selFrom.$from, selTo.$to)),
      );
      return true;
    }
  }

  return false;
}
export const handleCut = (
  oldTr: Transaction,
  oldState: EditorState,
  newState: EditorState,
): Transaction => {
  const oldSelection = oldState.tr.selection;
  let { tr } = newState;
  if (oldSelection instanceof CellSelection) {
    const $anchorCell = oldTr.doc.resolve(
      oldTr.mapping.map(oldSelection.$anchorCell.pos),
    );
    const $headCell = oldTr.doc.resolve(
      oldTr.mapping.map(oldSelection.$headCell.pos),
    );

    const cellSelection = new CellSelection($anchorCell, $headCell);
    tr.setSelection(cellSelection);

    if (tr.selection instanceof CellSelection) {
      const rect = getSelectionRect(cellSelection);
      if (rect) {
        const {
          verticalCells,
          horizontalCells,
          totalCells,
          totalRowCount,
          totalColumnCount,
        } = getSelectedCellInfo(tr.selection);

        // Reassigning to make it more obvious and consistent
        tr = addAnalytics(newState, tr, {
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
        });

        // Need this check again since we are overriding the tr in previous statement
        if (tr.selection instanceof CellSelection) {
          const isTableSelected =
            tr.selection.isRowSelection() && tr.selection.isColSelection();
          if (isTableSelected) {
            tr = removeTable(tr);
          } else if (tr.selection.isRowSelection()) {
            const {
              pluginConfig: { isHeaderRowRequired },
            } = getPluginState(newState);
            tr = deleteRows(rect, isHeaderRowRequired)(tr);
          } else if (tr.selection.isColSelection()) {
            tr = deleteColumns(rect, getAllowAddColumnCustomStep(oldState))(tr);
          }
        }
      }
    }
  }

  return tr;
};

export const whenTableInFocus = (
  eventHandler: (
    view: EditorView,
    mouseEvent: Event,
    tableCellOptimization?: boolean,
    elementContentRects?: ElementContentRects,
  ) => boolean,
  elementContentRects?: ElementContentRects,
) => (view: EditorView, mouseEvent: Event): boolean => {
  const tableResizePluginState = getResizePluginState(view.state);
  const tablePluginState = getPluginState(view.state);
  const isDragging =
    tableResizePluginState && !!tableResizePluginState.dragging;
  const hasTableNode = tablePluginState && tablePluginState.tableNode;
  const tableCellOptimization =
    tablePluginState?.pluginConfig?.tableCellOptimization;

  if (!hasTableNode || isDragging) {
    return false;
  }

  // debounce event handler
  return rafSchedule(
    eventHandler(view, mouseEvent, tableCellOptimization, elementContentRects),
  );
};
