/** @jsx jsx */
import { ReactElement } from 'react';

import { jsx } from '@emotion/react';

import SelectionProvider from './hooks/selection-provider';
import { useSorting } from './hooks/use-sorting';
import { SortKey, TableProvider } from './hooks/use-table';
import * as Primitives from './ui';

export type TableProps<ItemType extends object = {}> = {
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
  } = useSorting(sortKey);

  return (
    <TableProvider<ItemType>
      state={{
        isSelectable,
        sortKey: localSortKey,
        sortDirection: sortDirection,
        setSortState,
      }}
    >
      <Primitives.Table testId={testId}>
        {isSelectable ? (
          <SelectionProvider>{children}</SelectionProvider>
        ) : (
          children
        )}
      </Primitives.Table>
    </TableProvider>
  );
}

export default Table;
