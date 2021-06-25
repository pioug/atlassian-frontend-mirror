import React from 'react';

import { TableBodyCell } from '../styled/TableCell';
import { TableBodyRow } from '../styled/TableRow';
import { HeadType, RowType } from '../types';

interface Props {
  head?: HeadType;
  isFixedSize: boolean;
  isHighlighted?: boolean;
  row: RowType;
  testId?: string;
}

const Row = ({ row, head, testId, isFixedSize, isHighlighted }: Props) => {
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

export default Row;
