/** @jsx jsx */
import { FC, memo, ReactNode, useMemo } from 'react';

import { jsx } from '@emotion/react';

import { useSelection } from './hooks/selection-provider';
import { useRowId } from './hooks/use-row-id';
import { useTable } from './hooks/use-table';
import { useTableBody } from './hooks/use-table-body';
import SelectableCell from './selectable-cell';
import * as Primitives from './ui';

export type RowProps = {
  /**
   * A `testId` prop is a unique string that appears as a data attribute `data-testid`
   * in the rendered code, serving as a hook for automated tests.
   */
  testId?: string;
  /**
   * Content of the row.
   */
  children?: ReactNode;
};

/**
 * __Row__
 *
 * A table row.
 *
 * - [Examples](https://atlassian.design/components/table/examples)
 */
const Row: FC<RowProps> = memo(({ children, testId }) => {
  // To ensure valid nesting
  useTableBody();
  // to access table state
  const { isSelectable } = useTable();
  const [{ allChecked, checked }] = useSelection();
  const rowId = useRowId();

  const isSelected = useMemo(() => {
    if (!isSelectable) {
      return undefined;
    }

    return allChecked || checked.includes(rowId!);
  }, [allChecked, checked, isSelectable, rowId]);

  return (
    <Primitives.TR isSelected={isSelected} testId={testId}>
      {isSelectable && <SelectableCell />}
      {children}
    </Primitives.TR>
  );
});

export default Row;
