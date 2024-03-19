import type { CellAttributes } from '@atlaskit/adf-schema';
import type { Command } from '@atlaskit/editor-common/types';
import {
  closestElement,
  isParagraph,
  isTextSelection,
  mapSlice,
} from '@atlaskit/editor-common/utils';
import type {
  Node as PMNode,
  Schema,
  Slice,
} from '@atlaskit/editor-prosemirror/model';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type {
  EditorState,
  Selection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import {
  findCellClosestToPos,
  findTable,
  getCellsInColumn,
  getCellsInRow,
  getSelectionRect,
  isSelectionType,
  isTableSelected,
  removeTable,
  selectColumns as selectColumnsTransform,
  selectColumn as selectColumnTransform,
  selectionCell,
  selectRows as selectRowsTransform,
  selectRow as selectRowTransform,
  setCellAttrs,
} from '@atlaskit/editor-tables/utils';

import { getDecorations } from '../pm-plugins/decorations/plugin';
import {
  buildColumnResizingDecorations,
  clearColumnResizingDecorations,
} from '../pm-plugins/decorations/utils';
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
  checkIfNumberColumnEnabled,
  isIsolating,
} from '../utils/nodes';
import { updatePluginStateDecorations } from '../utils/update-plugin-state-decorations';

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
      const { isDragAndDropEnabled } = getPluginState(state);

      return {
        type: 'SET_TABLE_REF',
        data: {
          tableRef,
          tableNode,
          tablePos,
          tableWrapperTarget,
          layout: layout || 'default',
          isNumberColumnEnabled: checkIfNumberColumnEnabled(state.selection),
          isHeaderRowEnabled: checkIfHeaderRowEnabled(state.selection),
          isHeaderColumnEnabled: checkIfHeaderColumnEnabled(state.selection),
          // decoration set is drawn by the decoration plugin, skip this for DnD as all controls are floating
          decorationSet: !isDragAndDropEnabled
            ? updatePluginStateDecorations(
                state,
                createColumnControlsDecoration(state.selection),
                TableDecorations.COLUMN_CONTROLS_DECORATIONS,
              )
            : undefined,
          resizeHandleRowIndex: undefined,
          resizeHandleColumnIndex: undefined,
        },
      };
    },
    (tr) => tr.setMeta('addToHistory', false),
  );

export const setCellAttr =
  (name: string, value: any): Command =>
  (state, dispatch) => {
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

export const triggerUnlessTableHeader =
  (command: Command): Command =>
  (state, dispatch, view) => {
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
      if (!checkIfHeaderRowEnabled(selection) || (rect && rect.top > 0)) {
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

export const countCellsInSlice = (
  slice: Slice,
  schema: Schema,
  type?: 'row' | 'column',
) => {
  const { tableHeader, tableCell } = schema.nodes;
  let count = 0;

  if (!type) {
    return count;
  }

  slice.content.descendants((maybeCell) => {
    if (maybeCell.type === tableCell || maybeCell.type === tableHeader) {
      count +=
        type === 'row' ? maybeCell.attrs.colspan : maybeCell.attrs.rowspan;

      return false;
    }
  });

  return count;
};

export const getTableSelectionType = (selection: Selection) => {
  if (selection instanceof CellSelection) {
    return selection.isRowSelection()
      ? 'row'
      : selection.isColSelection()
      ? 'column'
      : undefined;
  }
};

export const getTableElementMoveTypeBySlice = (
  slice: Slice,
  state: EditorState,
) => {
  const {
    schema: {
      nodes: { tableRow, table },
    },
  } = state;
  const currentTable = findTable(state.tr.selection);

  // check if copied slice is a table or table row
  if (
    !slice.content.firstChild ||
    (slice.content.firstChild.type !== table &&
      slice.content.firstChild.type !== tableRow) ||
    !currentTable
  ) {
    return undefined;
  }

  // if the slice only contains one table row, assume it's a row
  if (
    slice.content.childCount === 1 &&
    slice.content.firstChild.type === tableRow
  ) {
    return 'row';
  }

  const map = TableMap.get(currentTable.node);
  const slicedMap = TableMap.get(slice.content.firstChild);

  return map.width === slicedMap.width
    ? 'row'
    : map.height === slicedMap.height
    ? 'column'
    : undefined;
};

export const isInsideFirstCellOfRowOrColumn = (
  selection: Selection,
  type?: 'row' | 'column',
) => {
  const table = findTable(selection);

  if (!table || !type) {
    return false;
  }

  const map = TableMap.get(table.node!);
  const cell = findCellClosestToPos(selection.$anchor);
  if (!cell) {
    return false;
  }
  const pos = cell.pos - table.pos - 1;
  // cell positions in table map always start at 1, as they're offsets not positions
  const index = map.map.findIndex((value) => value === pos);

  return type === 'row' ? index % map.width === 0 : index < map.width;
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

export const convertFirstRowToHeader =
  (schema: Schema) =>
  (tr: Transaction): Transaction => {
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
  if (
    $cursor.parent.type !== state.schema.nodes.paragraph ||
    (grandparent && grandparent.type !== state.schema.nodes.doc)
  ) {
    return false;
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
  tr.setSelection(new TextSelection(state.doc.resolve(pos)));

  // if we are inside an empty paragraph not at the end of the doc we delete it
  const cursorNode = $cursor.node();
  const docEnd = state.doc.content.size;
  const paragraphWrapStart = $cursor.pos - 1;
  const paragraphWrapEnd = $cursor.pos + 1;
  if (cursorNode.content.size === 0 && $cursor.pos + 1 !== docEnd) {
    tr.delete(paragraphWrapStart, paragraphWrapEnd);
  }

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

export const setMultipleCellAttrs =
  (attrs: Object, targetCellPosition?: number): Command =>
  (state, dispatch) => {
    let cursorPos: number | undefined;
    let { tr } = state;

    if (isSelectionType(tr.selection, 'cell')) {
      const selection = tr.selection as any as CellSelection;
      selection.forEachCell((_cell, pos) => {
        const $pos = tr.doc.resolve(tr.mapping.map(pos + 1));
        tr = setCellAttrs(findCellClosestToPos($pos)!, attrs)(tr);
      });
      cursorPos = selection.$headCell.pos;
    } else if (targetCellPosition) {
      const cell = findCellClosestToPos(
        tr.doc.resolve(targetCellPosition + 1),
      )!;
      tr = setCellAttrs(cell, attrs)(tr);
      cursorPos = cell.pos;
    }

    if (tr.docChanged && cursorPos !== undefined) {
      if (dispatch) {
        dispatch(tr);
      }
      return true;
    }
    return false;
  };

export const selectColumn = (
  column: number,
  expand?: boolean,
  triggeredByKeyboard = false,
) =>
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
      selectColumnTransform(column, expand)(tr)
        .setMeta('addToHistory', false)
        .setMeta('selectedColumnViaKeyboard', triggeredByKeyboard),
  );

export const selectColumns = (columnIndexes: number[]) =>
  createCommand(
    (state) => {
      if (!columnIndexes) {
        return false;
      }
      const cells = columnIndexes
        .map((column) => getCellsInColumn(column)(state.tr.selection))
        .flat();
      if (
        !cells ||
        !cells.length ||
        cells.some((cell) => cell && typeof cell.pos !== 'number')
      ) {
        return false;
      }
      const decorations = createColumnSelectedDecoration(
        selectColumnsTransform(columnIndexes)(state.tr),
      );

      const decorationSet = updatePluginStateDecorations(
        state,
        decorations,
        TableDecorations.COLUMN_SELECTED,
      );

      const cellsInFirstColumn = getCellsInColumn(Math.min(...columnIndexes))(
        state.tr.selection,
      );
      if (!cellsInFirstColumn || cellsInFirstColumn.length === 0) {
        return false;
      }
      const targetCellPosition = cellsInFirstColumn[0].pos;

      return {
        type: 'SELECT_COLUMN',
        data: { targetCellPosition, decorationSet },
      };
    },
    (tr: Transaction) => {
      return selectColumnsTransform(columnIndexes)(tr).setMeta(
        'addToHistory',
        false,
      );
    },
  );

export const selectRow = (
  row: number,
  expand?: boolean,
  triggeredByKeyboard = false,
) =>
  createCommand(
    (state) => {
      let targetCellPosition;
      const cells = getCellsInRow(row)(state.tr.selection);
      if (cells && cells.length) {
        targetCellPosition = cells[0].pos;
      }

      return { type: 'SET_TARGET_CELL_POSITION', data: { targetCellPosition } };
    },
    (tr) =>
      selectRowTransform(row, expand)(tr)
        .setMeta('addToHistory', false)
        .setMeta('selectedRowViaKeyboard', triggeredByKeyboard),
  );

export const selectRows = (rowIndexes: number[]) =>
  createCommand(
    (state) => {
      if (rowIndexes.length === 0) {
        return false;
      }
      const cells = rowIndexes
        .map((row) => getCellsInRow(row)(state.tr.selection))
        .flat();
      if (
        !cells ||
        !cells.length ||
        cells.some((cell) => cell && typeof cell.pos !== 'number')
      ) {
        return false;
      }
      const cellsInFirstRow = getCellsInRow(Math.min(...rowIndexes))(
        state.tr.selection,
      );
      if (!cellsInFirstRow || cellsInFirstRow.length === 0) {
        return false;
      }
      const targetCellPosition = cellsInFirstRow[0].pos;

      return { type: 'SET_TARGET_CELL_POSITION', data: { targetCellPosition } };
    },
    (tr) => selectRowsTransform(rowIndexes)(tr).setMeta('addToHistory', false),
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

export const addResizeHandleDecorations = (
  rowIndex: number,
  columnIndex: number,
  includeTooltip: boolean,
  isKeyboardResize?: boolean,
) =>
  createCommand(
    (state) => {
      const tableNode = findTable(state.selection);
      const {
        pluginConfig: { allowColumnResizing },
        getIntl,
      } = getPluginState(state);

      if (!tableNode || !allowColumnResizing) {
        return false;
      }

      return {
        type: 'ADD_RESIZE_HANDLE_DECORATIONS',
        data: {
          decorationSet: buildColumnResizingDecorations(
            rowIndex,
            columnIndex,
            includeTooltip,
            getIntl,
          )({
            tr: state.tr,
            decorationSet: getDecorations(state),
          }),
          resizeHandleRowIndex: rowIndex,
          resizeHandleColumnIndex: columnIndex,
          resizeHandleIncludeTooltip: includeTooltip,
          isKeyboardResize: isKeyboardResize || false,
        },
      };
    },
    (tr: Transaction) => tr.setMeta('addToHistory', false),
  );

export const updateResizeHandleDecorations = (
  rowIndex?: number,
  columnIndex?: number,
  includeTooltip?: boolean,
) =>
  createCommand(
    (state) => {
      const tableNode = findTable(state.selection);
      const {
        resizeHandleRowIndex,
        resizeHandleColumnIndex,
        resizeHandleIncludeTooltip,
        pluginConfig: { allowColumnResizing },
        getIntl,
      } = getPluginState(state);

      if (!tableNode || !allowColumnResizing) {
        return false;
      }

      const resolvedRowIndex = rowIndex ?? resizeHandleRowIndex;
      const resolvedColumnIndex = columnIndex ?? resizeHandleColumnIndex;
      const resolvedIncludeTooltip =
        includeTooltip ?? resizeHandleIncludeTooltip;

      if (
        resolvedRowIndex === undefined ||
        resolvedColumnIndex === undefined ||
        resolvedIncludeTooltip === undefined
      ) {
        return false;
      }

      return {
        type: 'UPDATE_RESIZE_HANDLE_DECORATIONS',
        data: {
          decorationSet: buildColumnResizingDecorations(
            resolvedRowIndex,
            resolvedColumnIndex,
            resolvedIncludeTooltip,
            getIntl,
          )({
            tr: state.tr,
            decorationSet: getDecorations(state),
          }),
          resizeHandleRowIndex: rowIndex,
          resizeHandleColumnIndex: columnIndex,
          resizeHandleIncludeTooltip: includeTooltip,
        },
      };
    },
    (tr: Transaction) => tr.setMeta('addToHistory', false),
  );

export const removeResizeHandleDecorations = () =>
  createCommand(
    (state) => ({
      type: 'REMOVE_RESIZE_HANDLE_DECORATIONS',
      data: {
        decorationSet: clearColumnResizingDecorations()({
          tr: state.tr,
          decorationSet: getDecorations(state),
        }),
      },
    }),
    (tr) => tr.setMeta('addToHistory', false),
  );

export const autoSizeTable = (
  view: EditorView,
  node: PMNode,
  table: HTMLTableElement,
  basePos: number | undefined,
  opts: { containerWidth: number },
) => {
  if (typeof basePos !== 'number') {
    return false;
  }

  view.dispatch(fixAutoSizedTable(view, node, table, basePos, opts));
  return true;
};

export const addBoldInEmptyHeaderCells =
  (tableCellHeader: ContentNodeWithPos): Command =>
  (state, dispatch): boolean => {
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

export const updateWidthToWidest = (widthToWidest: boolean) =>
  createCommand((state) => {
    let { widthToWidest: prevWidthToWidest } = getPluginState(state);

    if (prevWidthToWidest === widthToWidest) {
      return false;
    }

    return {
      type: 'UPDATE_TABLE_WIDTH_TO_WIDEST',
      data: {
        widthToWidest,
      },
    };
  });
