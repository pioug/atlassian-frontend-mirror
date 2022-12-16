/* eslint-disable @repo/internal/react/no-clone-element */
/** @jsx jsx */
import { Children, ReactElement, useEffect } from 'react';

import { jsx } from '@emotion/react';

import { useSelection } from './hooks/selection-provider';
import { RowProvider } from './hooks/use-row-id';
import { useTable } from './hooks/use-table';
import { TableBodyProvider } from './hooks/use-table-body';
import * as Primitives from './ui';

export type BodyProps<Item extends object> =
  | {
      rows: Item[];
      // eslint-disable-next-line no-unused-vars
      children: (row: Item) => ReactElement;
    }
  | {
      rows?: never;
      children: ReactElement[] | ReactElement;
    };

/**
 * __Table body__
 */
function TBody<ObjectType extends object>({
  rows,
  children,
}: BodyProps<ObjectType>) {
  const { sortKey, sortDirection } = useTable<ObjectType>();
  const [_state, { removeAll, setMax }] = useSelection();

  // TODO this seems like something the user should control
  useEffect(() => {
    if (removeAll) {
      removeAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  // Set data length (via setMax) whenever data changes
  useEffect(() => {
    const numRows = rows !== undefined ? rows.length : Children.count(children);

    setMax && setMax(numRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows?.length, Children.count(children)]);

  const sortFn = (rowA: ObjectType, rowB: ObjectType) => {
    if (sortKey === 'unset') {
      return 0;
    }

    const ascendingComparator = rowA[sortKey] < rowB[sortKey] ? -1 : 1;
    return sortDirection === 'ascending'
      ? ascendingComparator
      : -ascendingComparator;
  };

  return (
    <TableBodyProvider value={true}>
      <Primitives.TBody>
        {typeof children === 'function' && rows
          ? rows
              .map((row, idx) => ({ ...row, idx }))
              .sort(sortFn)
              .map(({ idx, ...row }) => (
                <RowProvider key={idx} value={idx}>
                  {
                    // @ts-expect-error
                    children(row)
                  }
                </RowProvider>
              ))
          : Children.map(children, (row, idx) => (
              <RowProvider key={idx} value={idx}>
                {row}
              </RowProvider>
            ))}
      </Primitives.TBody>
    </TableBodyProvider>
  );
}

export default TBody;
