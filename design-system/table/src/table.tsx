/** @jsx jsx */
import { type ReactElement, useMemo } from 'react';

import { jsx } from '@emotion/react';

import SelectionProvider from './hooks/selection-provider';
import { useSorting } from './hooks/use-sorting';
import { type SortKey, TableProvider } from './hooks/use-table';
import { Table as TablePrimitive } from './ui';

export type TableProps<ItemType extends object = {}> = {
  /**
   * A `testId` prop is a unique string that appears as a data attribute `data-testid`
   * in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
  /**
   * default sort key to be applied. If unspecified will use default ordering
   */
  sortKey?: SortKey<keyof ItemType>;
  children: ReactElement[] | ReactElement;
} & (
  | {
      isSelectable: true;
      defaultSelected?: number;
    }
  | {
      isSelectable?: false;
    }
);

/**
 * __Table__
 *
 * A data table is used to display dynamic data.
 *
 * - [Examples](https://atlassian.design/components/table/examples)
 */
function Table<ItemType extends object = object>({
  children,
  isSelectable,
  sortKey = 'unset',
  testId,
}: TableProps<ItemType>) {
  const {
    sortKey: localSortKey,
    sortDirection,
    setSortState,
    sortFn,
  } = useSorting(sortKey);

  const tableProviderState = useMemo(
    () => ({
      isSelectable,
      sortKey: localSortKey,
      sortDirection: sortDirection,
      setSortState,
      sortFn,
    }),
    [isSelectable, localSortKey, setSortState, sortDirection, sortFn],
  );

  return (
    <TableProvider<ItemType> state={tableProviderState}>
      <TablePrimitive testId={testId}>
        {isSelectable ? (
          <SelectionProvider>{children}</SelectionProvider>
        ) : (
          children
        )}
      </TablePrimitive>
    </TableProvider>
  );
}

export default Table;
