import { Node as PmNode } from 'prosemirror-model';
import { Selection, Transaction, ReadonlyTransaction } from 'prosemirror-state';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { ContentNodeWithPos } from 'prosemirror-utils';
import {
  findTable,
  getCellsInRow,
  getSelectionRect,
} from '@atlaskit/editor-tables/utils';

import { Decoration, DecorationSet } from 'prosemirror-view';

import { CellAttributes } from '@atlaskit/adf-schema';

import { nonNullable } from '@atlaskit/editor-common/utils';
import {
  Cell,
  CellColumnPositioning,
  TableCssClassName as ClassName,
  TableDecorations,
} from '../types';

const filterDecorationByKey = (
  key: TableDecorations,
  decorationSet: DecorationSet,
): Decoration[] =>
  decorationSet.find(
    undefined,
    undefined,
    (spec) => spec.key.indexOf(key) > -1,
  );

export const findColumnControlSelectedDecoration = (
  decorationSet: DecorationSet,
): Decoration[] =>
  filterDecorationByKey(TableDecorations.COLUMN_SELECTED, decorationSet);

export const findControlsHoverDecoration = (
  decorationSet: DecorationSet,
): Decoration[] =>
  filterDecorationByKey(TableDecorations.ALL_CONTROLS_HOVER, decorationSet);

export const createCellHoverDecoration = (
  cells: Cell[],
  type: 'warning',
): Decoration[] =>
  cells.map((cell) =>
    Decoration.node(
      cell.pos,
      cell.pos + cell.node.nodeSize,
      {
        class: ClassName.HOVERED_CELL_WARNING,
      },
      {
        key: TableDecorations.CELL_CONTROLS_HOVER,
      },
    ),
  );

export const createControlsHoverDecoration = (
  cells: Cell[],
  type: 'row' | 'column' | 'table',
  tr: Transaction | ReadonlyTransaction,
  danger?: boolean,
  selected?: boolean,
): Decoration[] => {
  const table = findTable(tr.selection);
  if (!table) {
    return [];
  }

  const map = TableMap.get(table.node);
  const [min, max] = cells.reduce<[number | null, number | null]>(
    ([min, max], cell) => {
      if (min === null || cell.pos < min) {
        min = cell.pos;
      }
      if (max === null || cell.pos > max) {
        max = cell.pos;
      }

      return [min, max];
    },
    [null, null],
  );

  if (min === null || max === null) {
    return [];
  }

  let updatedCells: number[] = cells.map((x) => x.pos);

  // ED-15246 fixed trello card table overflow issue
  // If columns / rows have been merged the hovered selection is different to the actual selection
  // So If the table cells are in danger we want to create a "rectangle" selection
  // to match the "clicked" selection

  if (danger) {
    const rect = map.rectBetween(min - table.start, max - table.start);
    updatedCells = map.cellsInRect(rect).map((x) => x + table.start);
  }

  return updatedCells.map((pos) => {
    const cell = tr.doc.nodeAt(pos);

    const classes = [ClassName.HOVERED_CELL];
    if (danger) {
      classes.push(ClassName.HOVERED_CELL_IN_DANGER);
    }
    if (selected) {
      classes.push(ClassName.SELECTED_CELL);
    }

    classes.push(
      type === 'column'
        ? ClassName.HOVERED_COLUMN
        : type === 'row'
        ? ClassName.HOVERED_ROW
        : ClassName.HOVERED_TABLE,
    );

    let key: TableDecorations;
    switch (type) {
      case 'row':
        key = TableDecorations.ROW_CONTROLS_HOVER;
        break;

      case 'column':
        key = TableDecorations.COLUMN_CONTROLS_HOVER;
        break;

      default:
        key = TableDecorations.TABLE_CONTROLS_HOVER;
        break;
    }

    return Decoration.node(
      pos,
      pos + cell!.nodeSize,
      {
        class: classes.join(' '),
      },
      { key },
    );
  });
};

export const createColumnSelectedDecoration = (
  tr: Transaction | ReadonlyTransaction,
): Decoration[] => {
  const { selection, doc } = tr;
  const table = findTable(selection);
  const rect = getSelectionRect(selection);

  if (!table || !rect) {
    return [];
  }

  const map = TableMap.get(table.node);
  const cellPositions = map.cellsInRect(rect);

  return cellPositions.map((pos, index) => {
    const cell = doc.nodeAt(pos + table.start);

    return Decoration.node(
      pos + table.start,
      pos + table.start + cell!.nodeSize,
      {
        class: ClassName.COLUMN_SELECTED,
      },
      {
        key: `${TableDecorations.COLUMN_SELECTED}_${index}`,
      },
    );
  });
};

export const createColumnControlsDecoration = (
  selection: Selection,
): Decoration[] => {
  const cells: ContentNodeWithPos[] = getCellsInRow(0)(selection) || [];
  let index = 0;
  return cells.map((cell) => {
    const colspan = (cell.node.attrs as CellAttributes).colspan || 1;
    // It's important these values are scoped locally as the widget callback could be executed anytime in the future
    // and we want to avoid value leak
    const startIndex = index;
    const endIndex = startIndex + colspan;

    // The next cell start index will commence from the current cell end index.
    index = endIndex;

    return Decoration.widget(
      cell.pos + 1,
      () => {
        const element = document.createElement('div');
        element.classList.add(ClassName.COLUMN_CONTROLS_DECORATIONS);
        element.dataset.startIndex = `${startIndex}`;
        element.dataset.endIndex = `${endIndex}`;
        return element;
      },
      {
        key: `${TableDecorations.COLUMN_CONTROLS_DECORATIONS}_${endIndex}`,
        // this decoration should be the first one, even before gap cursor.
        side: -100,
      },
    );
  });
};

export const updateDecorations = (
  node: PmNode,
  decorationSet: DecorationSet,
  decorations: Decoration[],
  key: TableDecorations,
): DecorationSet => {
  const filteredDecorations = filterDecorationByKey(key, decorationSet);
  const decorationSetFiltered = decorationSet.remove(filteredDecorations);

  return decorationSetFiltered.add(node, decorations);
};

const makeArray = (n: number) => Array.from(Array(n).keys());

/*
 * This function will create two specific decorations for each cell in a column index target,
 * for example given that table:
 *
 * ```
 *    0       1      2      3
 * _____________________ _______
 * |      |             |      |
 * |  B1  |     C1      |  A1  |
 * |______|______ ______|______|
 * |             |      |      |
 * |     B2      |      |  A2  |
 * |______ ______|      |______|
 * |      |      |  D1  |      |
 * |  B3  |  C2  |      |  A3  |
 * |______|______|______|______|
 *        ^      ^      ^      ^
 *        |      |      |      |
 *        |      |      |      |
 *        |      |      |      |
 *        0      1      3      4
 *         \     |      |     /
 *          \    |      |    /
 *           \   |      |   /
 *            \  |      |  /
 *             \ |      | /
 *         columnEndIndexTarget === CellColumnPositioning.right
 * ```
 *
 * When a user wants to resize a cell,
 * they need to grab and hold the end of that column,
 * and this will be the `columnEndIndexTarget` using
 * the CellColumnPositioning interface.
 *
 * Let's say the `columnEndIndexTarget.right` is 3,
 * so this function will return two types of decorations for each cell on that column,
 * that means 2 `resizerHandle` and 2 `lastCellElement`,
 * here is the explanation for each one of them :
 *
 * - resizerHandle:
 *
 *   Given the cell C1, this decoration will add a div to create this area
 * ```
 *    ▁▁▁▁▁▁▁▁▁▁▁▁▁
 *   |           ▒▒|
 *   |     C1    ▒▒|
 *   |           ▒▒|
 *    ▔▔▔▔▔▔▔▔▔▔▔▔▔
 * ```
 *   This ▒ represents the area where table resizing will start,
 *   and you can follow that using checking the class name `ClassName.RESIZE_HANDLE_DECORATION` on the code
 *
 * - lastCellElementDecoration
 *
 *   Given the content of the cell C1
 *    ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁
 *   |                   |
 *   |   _____________   |
 *   |  |             |  |
 *   |  |     <p>     |  |
 *   |  |_____________|  |
 *   |                   |
 *   |   _____________   |
 *   |  |             |  |
 *   |  |   <media>   |  |
 *   |  |_____________|  |
 *   |                   |
 *   |   _____________   |
 *   |  |             |  |
 *   |  |   <media>   |  |
 *   |  |_____________|  |
 *   |                   |
 *    ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
 *   Currently, we are removing the margin-bottom from the last media using this kind of CSS rule:
 *   `div:last-of-type`; This is quite unstable, and after we create the `resizerHandle` div,
 *   that logic will apply the margin in the wrong element, to avoid that,
 *   we will add a new class on the last item for each cell,
 *   hence the second media will receive this class `ClassName.LAST_ITEM_IN_CELL`
 */
export const createResizeHandleDecoration = (
  tr: Transaction | ReadonlyTransaction,
  rowIndexTarget: number,
  columnEndIndexTarget: Omit<CellColumnPositioning, 'left'>,
): [Decoration[], Decoration[]] => {
  const emptyResult: [Decoration[], Decoration[]] = [[], []];
  const table = findTable(tr.selection);
  if (!table || !table.node) {
    return emptyResult;
  }

  const map = TableMap.get(table.node);
  if (!map.width) {
    return emptyResult;
  }

  const createResizerHandleDecoration = (
    cellColumnPositioning: CellColumnPositioning,
    columnIndex: number,
    rowIndex: number,
    cellPos: number,
    cellNode: PmNode,
  ): Decoration => {
    const position = cellPos + cellNode.nodeSize - 1;
    return Decoration.widget(
      position,
      () => {
        const element = document.createElement('div');
        element.classList.add(ClassName.RESIZE_HANDLE_DECORATION);
        element.dataset.startIndex = `${cellColumnPositioning.left}`;
        element.dataset.endIndex = `${cellColumnPositioning.right}`;
        return element;
      },
      {
        key: `${TableDecorations.COLUMN_RESIZING_HANDLE}_${rowIndex}_${columnIndex}`,
      },
    );
  };

  const createLastCellElementDecoration = (
    cellColumnPositioning: CellColumnPositioning,
    cellPos: number,
    cellNode: PmNode,
  ): Decoration | null => {
    let lastItemPositions: { from: number; to: number } | undefined;
    cellNode.forEach((childNode, offset, index) => {
      if (index === cellNode.childCount - 1) {
        const from = offset + cellPos + 1;
        lastItemPositions = {
          from,
          to: from + childNode.nodeSize,
        };
      }
    });

    if (!lastItemPositions) {
      return null;
    }

    return Decoration.node(
      lastItemPositions.from,
      lastItemPositions.to,
      {
        class: ClassName.LAST_ITEM_IN_CELL,
      },
      {
        key: `${TableDecorations.LAST_CELL_ELEMENT}_${cellColumnPositioning.left}_${cellColumnPositioning.right}`,
      },
    );
  };

  const resizeHandleCellDecorations: Decoration[] = [];
  const lastCellElementsDecorations: Array<Decoration | null> = [];

  for (let rowIndex = 0; rowIndex < map.height; rowIndex++) {
    const seen: { [key: number]: boolean } = {};

    if (rowIndex !== rowIndexTarget) {
      continue;
    }

    for (let columnIndex = 0; columnIndex < map.width; columnIndex++) {
      const cellPosition = map.map[map.width * rowIndex + columnIndex];
      if (seen[cellPosition]) {
        continue;
      }

      seen[cellPosition] = true;
      const cellPos = table.start + cellPosition;
      const cell = tr.doc.nodeAt(cellPos);
      if (!cell) {
        continue;
      }
      const colspan = (cell.attrs as CellAttributes).colspan || 1;
      const startIndex = columnIndex;
      const endIndex = colspan + startIndex;

      if (endIndex !== columnEndIndexTarget.right) {
        continue;
      }

      const resizerHandleDec = createResizerHandleDecoration(
        { left: startIndex, right: endIndex },
        columnIndex,
        rowIndex,
        cellPos,
        cell,
      );
      const lastCellDec = createLastCellElementDecoration(
        { left: startIndex, right: endIndex },
        cellPos,
        cell,
      );

      resizeHandleCellDecorations.push(resizerHandleDec);
      lastCellElementsDecorations.push(lastCellDec);
    }
  }

  return [
    resizeHandleCellDecorations,
    lastCellElementsDecorations.filter(nonNullable),
  ];
};

/*
 * This function will create a decoration for each cell using the right position on the CellColumnPositioning
 * for example given that table:
 *
 * ```
 *    0       1      2      3   <--- column indexes
 * _____________________ _______
 * |      |             |      |
 * |  B1  |     C1      |  A1  |
 * |______|______ ______|______|
 * |             |      |      |
 * |     B2      |  D1  |  A2  |
 * |______ ______|______|______|
 * |      |      |             |
 * |  B3  |  C2  |      D2     |
 * |______|______|_____________|
 * ```
 *
 * and given the left and right represents the C1 cell:
 *
 * ```
 *      left          right
 *        1             3
 *        |             |
 *        |             |
 *        |             |
 * _______∨_____________∨_______
 * |      |             |      |
 * |  B1  |     C1      |  A1  |
 * |______|______ ______|______|
 * |             |      |      |
 * |     B2      |  D1  |  A2  |
 * |______ ______|______|______|
 * |      |      |             |
 * |  B3  |  C2  |      D2     |
 * |______|______|_____________|
 * ```
 *
 * Taking that table, and the right as parameters,
 * this function will return two decorations applying a new class `ClassName.WITH_RESIZE_LINE`
 * only on the cells: `C1` and `D1`.
 */
export const createColumnLineResize = (
  selection: Selection,
  cellColumnPositioning: Omit<CellColumnPositioning, 'left'>,
): Decoration[] => {
  const table = findTable(selection);
  if (!table || cellColumnPositioning.right === null) {
    return [];
  }

  let columnIndex = cellColumnPositioning.right;
  const map = TableMap.get(table.node);

  const isLastColumn = columnIndex === map.width;
  if (isLastColumn) {
    columnIndex -= 1;
  }
  const decorationClassName = isLastColumn
    ? ClassName.WITH_RESIZE_LINE_LAST_COLUMN
    : ClassName.WITH_RESIZE_LINE;

  const cellPositions = makeArray(map.height)
    .map((rowIndex) => map.map[map.width * rowIndex + columnIndex])
    .filter((cellPosition, rowIndex) => {
      if (isLastColumn) {
        return true; // If is the last column no filter applied
      }
      const nextPosition = map.map[map.width * rowIndex + columnIndex - 1];
      return cellPosition !== nextPosition; // Removed it if next position is merged
    });

  const cells = cellPositions.map((pos) => ({
    pos: pos + table.start,
    node: table.node.nodeAt(pos),
  }));

  return cells
    .map((cell, index) => {
      if (!cell || !cell.node) {
        return;
      }

      return Decoration.node(
        cell.pos,
        cell.pos + cell.node.nodeSize,
        {
          class: decorationClassName,
        },
        {
          key: `${TableDecorations.COLUMN_RESIZING_HANDLE_LINE}_${cellColumnPositioning.right}_${index}`,
        },
      );
    })
    .filter(nonNullable);
};
