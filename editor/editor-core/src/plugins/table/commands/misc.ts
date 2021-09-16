// #region Imports
import { Node as PMNode, Schema, Slice } from 'prosemirror-model';
import { Selection, TextSelection, Transaction } from 'prosemirror-state';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import {
  selectionCell,
  findCellClosestToPos,
  findTable,
  getCellsInColumn,
  getCellsInRow,
  getSelectionRect,
  isSelectionType,
  removeTable,
  selectColumn as selectColumnTransform,
  selectRow as selectRowTransform,
  setCellAttrs,
  isTableSelected,
} from '@atlaskit/editor-tables/utils';
import { ContentNodeWithPos } from 'prosemirror-utils';

import { EditorView } from 'prosemirror-view';

import { CellAttributes } from '@atlaskit/adf-schema';

import { Command } from '../../../types';
import { isParagraph, isTextSelection } from '../../../utils';
import { closestElement } from '../../../utils/dom';
import { mapSlice } from '../../../utils/slice';
import { outdentList } from '../../list/commands';
import { getDecorations } from '../pm-plugins/decorations/plugin';
import { buildColumnResizingDecorations } from '../pm-plugins/decorations/utils';
import { createCommand, getPluginState } from '../pm-plugins/plugin-factory';
import { fixAutoSizedTable } from '../transforms';
import { TableCssClassName as ClassName, TableDecorations } from '../types';
import {
  createColumnControlsDecoration,
  createColumnSelectedDecoration,
} from '../utils/decoration';
import {
  checkIfHeaderColumnEnabled,
  checkIfHeaderRowEnabled,
  isIsolating,
} from '../utils/nodes';
import { updatePluginStateDecorations } from '../utils/update-plugin-state-decorations';
// #endregion

// #endregion

// #region Commands
export const setEditorFocus = (editorHasFocus: boolean) =>
  createCommand({
    type: 'SET_EDITOR_FOCUS',
    data: {
      editorHasFocus,
    },
  });

export const setTableRef = (ref?: HTMLTableElement) =>
  createCommand(
    (state) => {
      const tableRef = ref;
      const foundTable = findTable(state.selection);
      const tableNode = ref && foundTable ? foundTable.node : undefined;
      const tablePos = ref && foundTable ? foundTable.pos : undefined;
      const tableWrapperTarget =
        closestElement(tableRef, `.${ClassName.TABLE_NODE_WRAPPER}`) ||
        undefined;
      const layout = tableNode ? tableNode.attrs.layout : undefined;
      const decorationSet = updatePluginStateDecorations(
        state,
        createColumnControlsDecoration(state.selection),
        TableDecorations.COLUMN_CONTROLS_DECORATIONS,
      );

      return {
        type: 'SET_TABLE_REF',
        data: {
          tableRef,
          tableNode,
          tablePos,
          tableWrapperTarget,
          layout: layout || 'default',
          isHeaderRowEnabled: checkIfHeaderRowEnabled(state),
          isHeaderColumnEnabled: checkIfHeaderColumnEnabled(state),
          decorationSet,
          resizeHandleColumnIndex: undefined,
        },
      };
    },
    (tr) => tr.setMeta('addToHistory', false),
  );

export const setCellAttr = (name: string, value: any): Command => (
  state,
  dispatch,
) => {
  const { tr, selection } = state;
  if (selection instanceof CellSelection) {
    let updated = false;
    selection.forEachCell((cell, pos) => {
      if (cell.attrs[name] !== value) {
        tr.setNodeMarkup(pos, cell.type, { ...cell.attrs, [name]: value });
        updated = true;
      }
    });
    if (updated) {
      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }
  } else {
    const cell = selectionCell(state.selection);
    if (cell) {
      if (dispatch) {
        dispatch(
          tr.setNodeMarkup(cell.pos, cell.nodeAfter?.type, {
            ...cell.nodeAfter?.attrs,
            [name]: value,
          }),
        );
      }
      return true;
    }
  }
  return false;
};

export const triggerUnlessTableHeader = (command: Command): Command => (
  state,
  dispatch,
  view,
) => {
  const {
    selection,
    schema: {
      nodes: { tableHeader },
    },
  } = state;

  if (selection instanceof TextSelection) {
    const cell = findCellClosestToPos(selection.$from);
    if (cell && cell.node.type !== tableHeader) {
      return command(state, dispatch, view);
    }
  }

  if (selection instanceof CellSelection) {
    const rect = getSelectionRect(selection);
    if (!checkIfHeaderRowEnabled(state) || (rect && rect.top > 0)) {
      return command(state, dispatch, view);
    }
  }

  return false;
};

export const transformSliceRemoveCellBackgroundColor = (
  slice: Slice,
  schema: Schema,
): Slice => {
  const { tableCell, tableHeader } = schema.nodes;
  return mapSlice(slice, (maybeCell) => {
    if (maybeCell.type === tableCell || maybeCell.type === tableHeader) {
      const cellAttrs: CellAttributes = { ...maybeCell.attrs };
      cellAttrs.background = undefined;
      return maybeCell.type.createChecked(
        cellAttrs,
        maybeCell.content,
        maybeCell.marks,
      );
    }
    return maybeCell;
  });
};

export const transformSliceToAddTableHeaders = (
  slice: Slice,
  schema: Schema,
): Slice => {
  const { table, tableHeader, tableRow } = schema.nodes;

  return mapSlice(slice, (maybeTable) => {
    if (maybeTable.type === table) {
      const firstRow = maybeTable.firstChild;
      if (firstRow) {
        const headerCols = [] as PMNode[];
        firstRow.forEach((oldCol) => {
          headerCols.push(
            tableHeader.createChecked(
              oldCol.attrs,
              oldCol.content,
              oldCol.marks,
            ),
          );
        });
        const headerRow = tableRow.createChecked(
          firstRow.attrs,
          headerCols,
          firstRow.marks,
        );
        return maybeTable.copy(maybeTable.content.replaceChild(0, headerRow));
      }
    }
    return maybeTable;
  });
};

export const transformSliceToRemoveColumnsWidths = (
  slice: Slice,
  schema: Schema,
): Slice => {
  const { tableHeader, tableCell } = schema.nodes;

  return mapSlice(slice, (maybeCell) => {
    if (maybeCell.type === tableCell || maybeCell.type === tableHeader) {
      if (!maybeCell.attrs.colwidth) {
        return maybeCell;
      }
      return maybeCell.type.createChecked(
        { ...maybeCell.attrs, colwidth: undefined },
        maybeCell.content,
        maybeCell.marks,
      );
    }
    return maybeCell;
  });
};

export const deleteTable: Command = (state, dispatch) => {
  if (dispatch) {
    dispatch(removeTable(state.tr));
  }
  return true;
};

export const deleteTableIfSelected: Command = (state, dispatch) => {
  if (isTableSelected(state.selection)) {
    return deleteTable(state, dispatch);
  }
  return false;
};

export const convertFirstRowToHeader = (schema: Schema) => (
  tr: Transaction,
): Transaction => {
  const table = findTable(tr.selection)!;
  const map = TableMap.get(table.node);
  for (let i = 0; i < map.width; i++) {
    const cell = table.node.child(0).child(i);
    tr.setNodeMarkup(
      table.start + map.map[i],
      schema.nodes.tableHeader,
      cell.attrs,
    );
  }
  return tr;
};

export const moveCursorBackward: Command = (state, dispatch) => {
  const { $cursor } = state.selection as TextSelection;
  // if cursor is in the middle of a text node, do nothing
  if (!$cursor || $cursor.parentOffset > 0) {
    return false;
  }

  // find the node before the cursor
  let before;
  let cut: number | undefined;
  if (!isIsolating($cursor.parent)) {
    for (let i = $cursor.depth - 1; !before && i >= 0; i--) {
      if ($cursor.index(i) > 0) {
        cut = $cursor.before(i + 1);
        before = $cursor.node(i).child($cursor.index(i) - 1);
      }
      if (isIsolating($cursor.node(i))) {
        break;
      }
    }
  }

  // if the node before is not a table node - do nothing
  if (!before || before.type !== state.schema.nodes.table) {
    return false;
  }

  /*
    ensure we're just at a top level paragraph
    otherwise, perform regular backspace behaviour
   */
  const grandparent = $cursor.node($cursor.depth - 1);
  const { listItem } = state.schema.nodes;

  if (
    $cursor.parent.type !== state.schema.nodes.paragraph ||
    (grandparent && grandparent.type !== state.schema.nodes.doc)
  ) {
    if (grandparent && grandparent.type === listItem) {
      return outdentList()(state, dispatch);
    } else {
      return false;
    }
  }

  const { tr } = state;
  const lastCellPos = (cut || 0) - 4;
  // need to move cursor inside the table to be able to calculate table's offset
  tr.setSelection(new TextSelection(state.doc.resolve(lastCellPos)));
  const { $from } = tr.selection;
  const start = $from.start(-1);
  const pos = start + $from.parent.nodeSize - 1;
  // move cursor to the last cell
  // it doesn't join node before (last cell) with node after (content after the cursor)
  // due to ridiculous amount of PM code that would have been required to overwrite
  if (dispatch) {
    dispatch(tr.setSelection(new TextSelection(state.doc.resolve(pos))));
  }

  return true;
};

export const setMultipleCellAttrs = (
  attrs: Object,
  targetCellPosition?: number,
): Command => (state, dispatch) => {
  let cursorPos: number | undefined;
  let { tr } = state;

  if (isSelectionType(tr.selection, 'cell')) {
    const selection = (tr.selection as any) as CellSelection;
    selection.forEachCell((_cell, pos) => {
      const $pos = tr.doc.resolve(tr.mapping.map(pos + 1));
      tr = setCellAttrs(findCellClosestToPos($pos)!, attrs)(tr);
    });
    cursorPos = selection.$headCell.pos;
  } else if (targetCellPosition) {
    const cell = findCellClosestToPos(tr.doc.resolve(targetCellPosition + 1))!;
    tr = setCellAttrs(cell, attrs)(tr);
    cursorPos = cell.pos;
  }

  if (tr.docChanged && cursorPos !== undefined) {
    const $pos = tr.doc.resolve(tr.mapping.map(cursorPos!));

    if (dispatch) {
      dispatch(tr.setSelection(Selection.near($pos)));
    }
    return true;
  }
  return false;
};

export const selectColumn = (column: number, expand?: boolean) =>
  createCommand(
    (state) => {
      const cells = getCellsInColumn(column)(state.tr.selection);
      if (!cells || !cells.length || typeof cells[0].pos !== 'number') {
        return false;
      }

      const decorations = createColumnSelectedDecoration(
        selectColumnTransform(column, expand)(state.tr),
      );
      const decorationSet = updatePluginStateDecorations(
        state,
        decorations,
        TableDecorations.COLUMN_SELECTED,
      );
      const targetCellPosition = cells[0].pos;

      return {
        type: 'SELECT_COLUMN',
        data: { targetCellPosition, decorationSet },
      };
    },
    (tr: Transaction) =>
      selectColumnTransform(column, expand)(tr).setMeta('addToHistory', false),
  );

export const selectRow = (row: number, expand?: boolean) =>
  createCommand(
    (state) => {
      let targetCellPosition;
      const cells = getCellsInRow(row)(state.tr.selection);
      if (cells && cells.length) {
        targetCellPosition = cells[0].pos;
      }

      return { type: 'SET_TARGET_CELL_POSITION', data: { targetCellPosition } };
    },
    (tr) => selectRowTransform(row, expand)(tr).setMeta('addToHistory', false),
  );

export const showInsertColumnButton = (columnIndex: number) =>
  createCommand(
    (_) =>
      columnIndex > -1
        ? {
            type: 'SHOW_INSERT_COLUMN_BUTTON',
            data: { insertColumnButtonIndex: columnIndex },
          }
        : false,
    (tr) => tr.setMeta('addToHistory', false),
  );

export const showInsertRowButton = (rowIndex: number) =>
  createCommand(
    (_) =>
      rowIndex > -1
        ? {
            type: 'SHOW_INSERT_ROW_BUTTON',
            data: { insertRowButtonIndex: rowIndex },
          }
        : false,
    (tr) => tr.setMeta('addToHistory', false),
  );

export const hideInsertColumnOrRowButton = () =>
  createCommand(
    {
      type: 'HIDE_INSERT_COLUMN_OR_ROW_BUTTON',
    },
    (tr) => tr.setMeta('addToHistory', false),
  );

export const addResizeHandleDecorations = (columnIndex: number) =>
  createCommand(
    (state) => {
      const tableNode = findTable(state.selection);
      const {
        pluginConfig: { allowColumnResizing },
      } = getPluginState(state);

      if (!tableNode || !allowColumnResizing) {
        return false;
      }

      return {
        type: 'ADD_RESIZE_HANDLE_DECORATIONS',
        data: {
          decorationSet: buildColumnResizingDecorations(columnIndex)({
            tr: state.tr,
            decorationSet: getDecorations(state),
          }),
          resizeHandleColumnIndex: columnIndex,
        },
      };
    },
    (tr: Transaction) => tr.setMeta('addToHistory', false),
  );

export const setTableSize = (
  tableHeight: number,
  tableWidth: number,
): Command =>
  createCommand(
    {
      type: 'SET_TABLE_SIZE',
      data: { tableHeight, tableWidth },
    },
    (tr: Transaction) => tr.setMeta('addToHistory', false),
  );

export const autoSizeTable = (
  view: EditorView,
  node: PMNode,
  table: HTMLTableElement,
  basePos: number,
  opts: { dynamicTextSizing: boolean; containerWidth: number },
) => {
  view.dispatch(fixAutoSizedTable(view, node, table, basePos, opts));
  return true;
};

export const addBoldInEmptyHeaderCells = (
  tableCellHeader: ContentNodeWithPos,
): Command => (state, dispatch): boolean => {
  const { tr } = state;
  if (
    // Avoid infinite loop when the current selection is not a TextSelection
    isTextSelection(tr.selection) &&
    tr.selection.$cursor &&
    // When storedMark is null that means this is the initial state
    // if the user press to remove the mark storedMark will be an empty array
    // and we shouldn't apply the strong mark
    tr.storedMarks == null &&
    // Check if the current node is a direct child from paragraph
    tr.selection.$from.depth === tableCellHeader.depth + 1 &&
    // this logic is applied only for empty paragraph
    tableCellHeader.node.nodeSize === 4 &&
    isParagraph(tableCellHeader.node.firstChild, state.schema)
  ) {
    const { strong } = state.schema.marks;
    tr.setStoredMarks([strong.create()]).setMeta('addToHistory', false);

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  }

  return false;
};
// #endregion
