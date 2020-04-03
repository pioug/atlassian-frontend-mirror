import {
  getSelectionRect,
  isRowSelected,
  isTableSelected,
  findTable,
  safeInsert,
} from 'prosemirror-utils';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { Selection, Transaction } from 'prosemirror-state';
import { CellSelection, TableMap } from 'prosemirror-tables';
import { tableDeleteButtonSize } from '../ui/styles';
import { TableCssClassName as ClassName } from '../types';

export interface RowParams {
  startIndex: number;
  endIndex: number;
  height: number;
}

export const getRowHeights = (tableRef: HTMLTableElement): number[] => {
  const heights: number[] = [];
  if (tableRef.lastChild) {
    const rows = tableRef.lastChild.childNodes;
    for (let i = 0, count = rows.length; i < count; i++) {
      const cell = rows[i] as HTMLTableCellElement;
      const rect = cell.getBoundingClientRect();
      heights[i] = (rect ? rect.height : cell.offsetHeight) + 1;
    }
  }
  return heights;
};

export const isRowDeleteButtonVisible = (selection: Selection): boolean => {
  if (
    !isTableSelected(selection) &&
    selection instanceof CellSelection &&
    selection.isRowSelection()
  ) {
    return true;
  }

  return false;
};

export const getRowDeleteButtonParams = (
  rowsHeights: Array<number | undefined>,
  selection: Selection,
): { top: number; indexes: number[] } | null => {
  const rect = getSelectionRect(selection);
  if (!rect) {
    return null;
  }
  let height = 0;
  let offset = 0;
  // find the rows before the selection
  for (let i = 0; i < rect.top; i++) {
    const rowHeight = rowsHeights[i];
    if (rowHeight) {
      offset += rowHeight - 1;
    }
  }
  // these are the selected rows widths
  const indexes: number[] = [];
  for (let i = rect.top; i < rect.bottom; i++) {
    const rowHeight = rowsHeights[i];
    if (rowHeight) {
      height += rowHeight - 1;
      indexes.push(i);
    }
  }

  const top = offset + height / 2 - tableDeleteButtonSize / 2;
  return { top, indexes };
};

export const getRowsParams = (
  rowsHeights: Array<number | undefined>,
): RowParams[] => {
  const rows: RowParams[] = [];
  for (let i = 0, count = rowsHeights.length; i < count; i++) {
    const height = rowsHeights[i];
    if (!height) {
      continue;
    }
    let endIndex = rowsHeights.length;
    for (let k = i + 1, count = rowsHeights.length; k < count; k++) {
      if (rowsHeights[k]) {
        endIndex = k;
        break;
      }
    }
    rows.push({ startIndex: i, endIndex, height });
  }
  return rows;
};

export const getRowClassNames = (
  index: number,
  selection: Selection,
  hoveredRows: number[] = [],
  isInDanger?: boolean,
  isResizing?: boolean,
): string => {
  const classNames: string[] = [];
  if (
    isRowSelected(index)(selection) ||
    (hoveredRows.indexOf(index) > -1 && !isResizing)
  ) {
    classNames.push(ClassName.HOVERED_CELL_ACTIVE);
    if (isInDanger) {
      classNames.push(ClassName.HOVERED_CELL_IN_DANGER);
    }
  }
  return classNames.join(' ');
};

export const copyPreviousRow = (schema: Schema) => (
  insertNewRowIndex: number,
) => (tr: Transaction) => {
  const table = findTable(tr.selection);
  if (!table) {
    return tr;
  }

  const map = TableMap.get(table.node);
  const copyPreviousRowIndex = insertNewRowIndex - 1;

  if (insertNewRowIndex <= 0) {
    throw Error(
      `Row Index less or equal 0 isn't not allowed since there is not a previous to copy`,
    );
  }

  if (insertNewRowIndex > map.height) {
    return tr;
  }

  const tableNode = table.node;
  const {
    nodes: { tableRow },
  } = schema;

  const cellsInRow = map.cellsInRect({
    left: 0,
    right: map.width,
    top: copyPreviousRowIndex,
    bottom: copyPreviousRowIndex + 1,
  });
  const offsetIndexPosition = copyPreviousRowIndex * map.width;
  const offsetNextLineIndexPosition = insertNewRowIndex * map.width;
  const cellsPositionsInOriginalRow = map.map.slice(
    offsetIndexPosition,
    offsetIndexPosition + map.width,
  );

  const cellsPositionsInNextRow = map.map.slice(
    offsetNextLineIndexPosition,
    offsetNextLineIndexPosition + map.width,
  );

  let cells = [] as PMNode[];
  let fixRowspans = [];
  for (let i = 0; i < cellsPositionsInOriginalRow.length; ) {
    const pos = cellsPositionsInOriginalRow[i];
    const documentCellPos = pos + table.start;
    const node = tr.doc.nodeAt(documentCellPos);
    if (!node) {
      continue;
    }

    const attributes = {
      ...node.attrs,
      colspan: 1,
      rowspan: 1,
    };

    const newCell = node.type.createAndFill(attributes);

    if (!newCell) {
      return tr;
    }

    if (cellsPositionsInNextRow.indexOf(pos) > -1) {
      fixRowspans.push({ pos: documentCellPos, node });
    } else if (cellsInRow.indexOf(pos) > -1) {
      if (node.attrs.colspan > 1) {
        const newCellWithColspanFixed = node.type.createAndFill({
          ...attributes,
          colspan: node.attrs.colspan,
        });

        if (!newCellWithColspanFixed) {
          return tr;
        }

        cells.push(newCellWithColspanFixed);
        i = i + node.attrs.colspan;

        continue;
      }
      cells.push(newCell);
    } else {
      cells.push(newCell);
    }

    i++;
  }

  fixRowspans.forEach(cell => {
    tr.setNodeMarkup(cell.pos, undefined, {
      ...cell.node.attrs,
      rowspan: cell.node.attrs.rowspan + 1,
    });
  });

  const cloneRow = tableNode.child(copyPreviousRowIndex);
  let rowPos = table.start;
  for (let i = 0; i < insertNewRowIndex; i++) {
    rowPos += tableNode.child(i).nodeSize;
  }

  return safeInsert(
    tableRow.createChecked(cloneRow.attrs, cells, cloneRow.marks),
    rowPos,
  )(tr);
};
