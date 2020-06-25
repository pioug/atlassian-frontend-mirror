import { EditorView } from 'prosemirror-view';
import {
  findTable,
  getCellsInColumn,
  findDomRefAtPos,
  getSelectionRect,
  isColumnSelected,
  isTableSelected,
} from 'prosemirror-utils';

import { Selection } from 'prosemirror-state';
import { TableMap, CellSelection } from 'prosemirror-tables';
import { tableDeleteButtonSize } from '../ui/styles';
import { TableCssClassName as ClassName } from '../types';

import { maphElem, parsePx } from '../../../utils/dom';

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

  rowColSpans.forEach(cellColSpan => {
    const colWidth = tableColWidths
      .slice(curColIdx, curColIdx + cellColSpan)
      .reduce((acc, val) => acc + val, 0);

    curColIdx += cellColSpan;
    colWidths.push(colWidth);
  });

  return colWidths;
};

export const colWidthsForRow = (
  colGroup: HTMLTableColElement | null,
  tr: HTMLTableRowElement,
) => {
  // get the column widths, using the <colgroup> as a source of truth
  const tableColWidths = colGroup
    ? maphElem(colGroup, col => parsePx(col.style.width || '')).map(
        width => width || 0,
      ) /* normalised undefined to 0 */
    : [];

  // get the colspans
  const rowColSpans = maphElem(tr, cell =>
    Number(cell.getAttribute('colspan') || 1 /* default to span of 1 */),
  );

  const totalWidth = tableColWidths.reduce((prev, acc) => prev + acc, 0);
  const useColgroup = totalWidth !== 0;

  if (useColgroup) {
    // take px widths directly from colgroup, keeping in mind colspan
    const colWidths = mapTableColwidthsToRow(rowColSpans, tableColWidths);
    return colWidths.map(px => `${px}px`).join(' ');
  } else {
    // unsized table

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
      const cellInfos = maphElem(copyTarget, cell => ({
        width: cell.offsetWidth,
        colspan: Number(cell.getAttribute('colspan') || 1),
      }));

      // reverse engineer cell widths from table widths
      let equalCellWidths: number[] = [];
      cellInfos.map((cell, idx) => {
        equalCellWidths.push(
          ...new Array(cell.colspan).fill(cell.width / cell.colspan),
        );
      });

      if (cellInfos.reduce((acc, cell) => acc + cell.width, 0) !== 0) {
        const newWidths = mapTableColwidthsToRow(rowColSpans, equalCellWidths);
        return newWidths.map(px => `${px}px`).join(' ');
      }
    }

    // as a fallback, just calculate a %, and hope that
    // it aligns perfectly in the user's browser
    const visualColCount = rowColSpans.reduce((acc, val) => acc + val, 0);

    const pctWidths = rowColSpans.map(
      cellColSpan => (cellColSpan / visualColCount) * 100,
    );

    return pctWidths.map(pct => `${pct}%`).join(' ');
  }
};
