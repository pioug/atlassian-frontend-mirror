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
