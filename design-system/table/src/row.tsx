/** @jsx jsx */
import { FC, memo } from 'react';

import { jsx } from '@emotion/react';

import { useSelection } from './hooks/selection-provider';
import { useRowId } from './hooks/use-row-id';
import { useTable } from './hooks/use-table';
import { useTableBody } from './hooks/use-table-body';
import SelectableCell from './selectable-cell';
import * as Primitives from './ui';

export type RowProps = {
  testId?: string;
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
  const table = useTable();
  const [selectionState] = useSelection();
  const rowId = useRowId();

  if (!table.isSelectable) {
    return <Primitives.TR testId={testId}>{children}</Primitives.TR>;
  }

  const isChecked =
    selectionState.allChecked || selectionState.checked.includes(rowId!);
  return (
    <Primitives.TR isSelected={!!isChecked} testId={testId}>
      <SelectableCell />
      {children}
    </Primitives.TR>
  );
});

export default Row;
