import React from 'react';

import { TableBodyCell } from '../styled/table-cell';
import { TableBodyRow } from '../styled/table-row';
import { HeadType, RowType } from '../types';

interface RowProps {
  head?: HeadType;
  isFixedSize: boolean;
  isHighlighted?: boolean;
  row: RowType;
  testId?: string;
}

const Row = ({ row, head, testId, isFixedSize, isHighlighted }: RowProps) => {
  const { cells, ...restRowProps } = row;

  return (
    <TableBodyRow
      {...restRowProps}
      isHighlighted={isHighlighted}
      {...(isHighlighted
        ? { 'data-ts--dynamic-table--table-row--highlighted': true }
        : null)}
      data-testid={testId && `${testId}--row-${restRowProps.key}`}
    >
      {cells.map((cell, cellIndex) => {
        const { content, ...restCellProps } = cell;
        const { shouldTruncate, width } =
          (head || { cells: [] }).cells[cellIndex] || ({} as any);
        return (
          <TableBodyCell
            data-testid={testId && `${testId}--cell-${cellIndex}`}
            {...restCellProps}
            isFixedSize={isFixedSize}
            key={cellIndex} // eslint-disable-line react/no-array-index-key
            shouldTruncate={shouldTruncate}
            width={width}
          >
            {content}
          </TableBodyCell>
        );
      })}
    </TableBodyRow>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Row;
