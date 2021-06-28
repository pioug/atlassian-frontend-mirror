import { Selection } from 'prosemirror-state';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { findDomRefAtPos } from 'prosemirror-utils';
import {
  findTable,
  getCellsInColumn,
  getSelectionRect,
  isColumnSelected,
  isTableSelected,
} from '@atlaskit/editor-tables/utils';

import { EditorView } from 'prosemirror-view';

import { maphElem } from '../../../utils/dom';
import { TableCssClassName as ClassName } from '../types';
import { tableDeleteButtonSize } from '../ui/consts';

interface CellWidthInfo {
  width: number;
  colspan: number;
  colwidth: string | undefined;
}

export const getColumnsWidths = (
  view: EditorView,
): Array<number | undefined> => {
  const { selection } = view.state;
  let widths: Array<number | undefined> = [];
  const table = findTable(selection);
  if (table) {
    const map = TableMap.get(table.node);
    const domAtPos = view.domAtPos.bind(view);

    // When there is no cell we need to fill it with undefined
    widths = Array.from({ length: map.width });
    for (let i = 0; i < map.width; i++) {
      const cells = getCellsInColumn(i)(selection)!;
      const cell = cells[0];
      if (cell) {
        const cellRef = findDomRefAtPos(cell.pos, domAtPos) as HTMLElement;
        const rect = cellRef.getBoundingClientRect();
        widths[i] = (rect ? rect.width : cellRef.offsetWidth) + 1;
        i += cell.node.attrs.colspan - 1;
      }
    }
  }
  return widths;
};

export const isColumnDeleteButtonVisible = (selection: Selection): boolean => {
  if (
    !isTableSelected(selection) &&
    selection instanceof CellSelection &&
    selection.isColSelection()
  ) {
    return true;
  }

  return false;
};

export const getColumnDeleteButtonParams = (
  columnsWidths: Array<number | undefined>,
  selection: Selection,
): { left: number; indexes: number[] } | null => {
  const rect = getSelectionRect(selection);
  if (!rect) {
    return null;
  }
  let width = 0;
  let offset = 0;
  // find the columns before the selection
  for (let i = 0; i < rect.left; i++) {
    const colWidth = columnsWidths[i];
    if (colWidth) {
      offset += colWidth - 1;
    }
  }
  // these are the selected columns widths
  const indexes: number[] = [];
  for (let i = rect.left; i < rect.right; i++) {
    const colWidth = columnsWidths[i];
    if (colWidth) {
      width += colWidth;
      indexes.push(i);
    }
  }

  const left = offset + width / 2 - tableDeleteButtonSize / 2;
  return { left, indexes };
};

export const getColumnClassNames = (
  index: number,
  selection: Selection,
  hoveredColumns: number[] = [],
  isInDanger?: boolean,
  isResizing?: boolean,
): string => {
  const classNames: string[] = [];
  if (
    isColumnSelected(index)(selection) ||
    (hoveredColumns.indexOf(index) > -1 && !isResizing)
  ) {
    classNames.push(ClassName.HOVERED_CELL_ACTIVE);
    if (isInDanger) {
      classNames.push(ClassName.HOVERED_CELL_IN_DANGER);
    }
  }
  return classNames.join(' ');
};

// give a row colspan and a colwidths
// and map to a row's colwidths
const mapTableColwidthsToRow = (
  rowColSpans: number[],
  tableColWidths: number[],
) => {
  let curColIdx = 0;
  const colWidths: number[] = [];

  rowColSpans.forEach((cellColSpan) => {
    const colWidth = tableColWidths
      .slice(curColIdx, curColIdx + cellColSpan)
      .reduce((acc, val) => acc + val, 0);

    curColIdx += cellColSpan;
    colWidths.push(colWidth);
  });

  return colWidths;
};

const getRelativeDomCellWidths = ({
  width,
  colspan,
  colwidth,
}: CellWidthInfo) => {
  // For cells with colSpan 1
  // or
  // for cells in a table with unchanged column widths,
  // these are identified by the lack of colwidth data attribute,
  // return equally partitioned total cell width in DOM for each cell.
  if (colspan <= 1 || !colwidth) {
    return new Array(colspan).fill(width / colspan);
  }

  // For cells that have colSpan > 1 and
  // are part of a table with resized columns
  // return the current total DOM width of the cell multiplied
  // by the percentage of the each individual cell's size.
  // The cell size percentage is calculated using individual colwidth of the cell,
  // from data-colwidth attribute on the cell,
  // divided by the total width of the cells from colwidths for merged cells.

  // Ex:
  // colwidth = ‘201,102’
  // Total colWidth = 303
  // returned cellWidths = [303 * (201/303), 303 * (102/303)]

  // For merged cells we get back colwidth as `201,102`
  const cellColWidths = colwidth.split(',').map((colwidth) => Number(colwidth));
  const totalCalculatedCellWidth = cellColWidths.reduce(
    (acc, cellColWidth) => acc + cellColWidth,
    0,
  );

  return cellColWidths.map(
    (cellColWidth) => width * (cellColWidth / totalCalculatedCellWidth),
  );
};

export const colWidthsForRow = (
  colGroup: HTMLTableColElement | null,
  tr: HTMLTableRowElement,
) => {
  // get the colspans
  const rowColSpans = maphElem(tr, (cell) =>
    Number(cell.getAttribute('colspan') || 1 /* default to span of 1 */),
  );

  // Chrome has trouble aligning borders with auto tables
  // and the rest of the page grid. tables with defined
  // column widths align fine.
  //
  // eg a 4x25% table might end up as 189px 190px 190px 190px
  //
  // prefer copying the widths via the DOM
  // or inferring from the next row if one exists
  const copyTarget =
    (tr.nextElementSibling as HTMLTableRowElement | null) || tr;

  if (copyTarget) {
    // either from the first row while it's still in the table
    const cellInfos = maphElem(copyTarget, (cell) => ({
      width: cell.offsetWidth,
      colspan: Number(cell.getAttribute('colspan') || 1),
      colwidth: cell.dataset.colwidth,
    }));

    // reverse engineer cell widths from table widths
    let domBasedCellWidths: number[] = [];
    cellInfos.map((cell, idx) => {
      domBasedCellWidths.push(...getRelativeDomCellWidths(cell));
    });

    if (cellInfos.reduce((acc, cell) => acc + cell.width, 0) !== 0) {
      const newWidths = mapTableColwidthsToRow(rowColSpans, domBasedCellWidths);
      return newWidths.map((px) => `${px}px`).join(' ');
    }
  }

  // as a fallback, just calculate a %, and hope that
  // it aligns perfectly in the user's browser
  const visualColCount = rowColSpans.reduce((acc, val) => acc + val, 0);

  const pctWidths = rowColSpans.map(
    (cellColSpan) => (cellColSpan / visualColCount) * 100,
  );

  return pctWidths.map((pct) => `${pct}%`).join(' ');
};
