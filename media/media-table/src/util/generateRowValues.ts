import {
  RowType,
  HeadCellType,
  RowCellType,
} from '@atlaskit/dynamic-table/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import memoizeOne from 'memoize-one';

function generateEmptyRows(
  emptyCells: RowCellType[],
  length: number,
): RowType[] {
  const itemsArray = Array.from({ length });
  return itemsArray.map(() => ({
    cells: emptyCells,
  }));
}

export const generateEmptyRow = memoizeOne(
  (headerCells: HeadCellType[]): RowCellType[] => {
    return headerCells.map((cell) => ({
      key: cell.key,
      content: '',
    }));
  },
);

export const prependRows = memoizeOne(
  (
    emptyCells: RowCellType[],
    itemsPerPage?: number,
    pageNumber?: number,
  ): RowType[] => {
    if (!itemsPerPage || !pageNumber) {
      return [];
    }

    const itemsCount = (pageNumber - 1) * itemsPerPage;
    return generateEmptyRows(emptyCells, itemsCount);
  },
);

export const appendRows = memoizeOne(
  (
    emptyCells: RowCellType[],
    rowsLength: number,
    itemsPerPage?: number,
    pageNumber?: number,
    totalItems?: number,
  ): RowType[] => {
    if (!itemsPerPage || !pageNumber || !totalItems) {
      return [];
    }

    const rowsDiff = rowsLength > itemsPerPage ? rowsLength - itemsPerPage : 0;
    const itemsCount =
      (Math.ceil(totalItems / itemsPerPage) - pageNumber) * itemsPerPage -
      rowsDiff;

    return generateEmptyRows(emptyCells, itemsCount);
  },
);

export default function generateRowValues({
  itemsPerPage,
  pageNumber,
  totalItems,
  rowValues,
  headerCells,
}: {
  itemsPerPage?: number;
  pageNumber?: number;
  totalItems?: number;
  rowValues: RowType[];
  headerCells: HeadCellType[];
}): RowType[] {
  const emptyCells = generateEmptyRow(headerCells);

  return [
    ...prependRows(emptyCells, itemsPerPage, pageNumber),
    ...rowValues,
    ...appendRows(
      emptyCells,
      rowValues.length,
      itemsPerPage,
      pageNumber,
      totalItems,
    ),
  ];
}
