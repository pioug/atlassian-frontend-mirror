import { RowType } from '@atlaskit/dynamic-table/types';
import memoizeOne from 'memoize-one';

function generateEmptyRows(length: number) {
  const itemsArray = Array.from({ length });
  return itemsArray.map(() => ({
    cells: [],
  }));
}

export const prependRows = memoizeOne(
  (itemsPerPage?: number, pageNumber?: number): RowType[] => {
    if (!itemsPerPage || !pageNumber) {
      return [];
    }

    const itemsCount = (pageNumber - 1) * itemsPerPage;
    return generateEmptyRows(itemsCount);
  },
);

export const appendRows = memoizeOne(
  (
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

    return generateEmptyRows(itemsCount);
  },
);

export default function generateRowValues(
  rowValues: RowType[],
  itemsPerPage: number,
  pageNumber: number,
  totalItems: number,
): RowType[] {
  return [
    ...prependRows(itemsPerPage, pageNumber),
    ...rowValues,
    ...appendRows(rowValues.length, itemsPerPage, pageNumber, totalItems),
  ];
}
