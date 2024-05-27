/* eslint-disable @repo/internal/react/no-clone-element */
/** @jsx jsx */
import { Children, type ReactElement, useEffect, useMemo } from 'react';

import { jsx } from '@emotion/react';

import { useSelection } from './hooks/selection-provider';
import { RowProvider } from './hooks/use-row-id';
import { useTable } from './hooks/use-table';
import { TableBodyProvider } from './hooks/use-table-body';
import { TBody as TBodyPrimitive } from './ui';

export type BodyProps<Item extends object> =
  | {
      rows: Item[];
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
  const { sortFn } = useTable<ObjectType>();
  const [_state, { removeAll, setMax }] = useSelection();
  // TODO: this seems like something the user should control or opt into.
  useEffect(() => {
    removeAll?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- When the rows change, we [currently] want to call removeAll.
  }, [rows]);

  const childrenCount = Children.count(children);
  const rowsLength = rows?.length;

  // Set data length (via setMax) whenever data changes
  useEffect(() => {
    const numRows = rowsLength ?? childrenCount;

    setMax?.(numRows);
  }, [rowsLength, childrenCount, setMax]);

  const sortedRows = useMemo(
    () => rows?.map((row, idx) => ({ ...row, idx })).sort(sortFn),
    [rows, sortFn],
  );

  return (
    <TableBodyProvider value={true}>
      <TBodyPrimitive>
        {typeof children === 'function' && sortedRows
          ? sortedRows.map(({ idx, ...row }) => (
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
      </TBodyPrimitive>
    </TableBodyProvider>
  );
}

export default TBody;
