import React from 'react';

import withSortedPageRows, {
  WithSortedPageRowsProps,
} from '../hoc/withSortedPageRows';
import { HeadType } from '../types';

import TableRow from './TableRow';

interface Props extends WithSortedPageRowsProps {
  head?: HeadType;
  highlightedRowIndex?: number | number[];
  isFixedSize: boolean;
  testId?: string;
}

class Body extends React.Component<Props, {}> {
  render() {
    const {
      pageRows,
      head,
      isFixedSize,
      highlightedRowIndex,
      testId,
    } = this.props;

    return (
      <tbody data-testid={testId && `${testId}--body`}>
        {pageRows.map((row, rowIndex) => (
          <TableRow
            head={head}
            isFixedSize={isFixedSize}
            key={row.key || rowIndex}
            row={row}
            isHighlighted={
              !!highlightedRowIndex &&
              (typeof highlightedRowIndex === 'number'
                ? highlightedRowIndex === rowIndex
                : highlightedRowIndex.indexOf(rowIndex) > -1)
            }
            testId={testId}
          />
        ))}
      </tbody>
    );
  }
}

export default withSortedPageRows<Props>(Body);
