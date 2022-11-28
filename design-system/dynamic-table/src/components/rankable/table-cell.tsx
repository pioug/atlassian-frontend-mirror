import React from 'react';

import withDimensions, { WithDimensionsProps } from '../../hoc/with-dimensions';
import { inlineStylesIfRanking } from '../../internal/helpers';
import { RankableTableBodyCell } from '../../styled/rankable/table-cell';
import { HeadCellType, RowCellType } from '../../types';

export interface RankableTableCellProps extends WithDimensionsProps {
  head?: HeadCellType;
  cell: RowCellType;
  isFixedSize: boolean;
  testId?: string;
}

export class RankableTableCell extends React.Component<
  RankableTableCellProps,
  {}
> {
  render() {
    const { cell, head, isFixedSize, isRanking, refWidth, innerRef } =
      this.props;
    const { content, ...restCellProps } = cell;
    const { shouldTruncate, width }: HeadCellType =
      head || ({} as HeadCellType);
    const inlineStyles = inlineStylesIfRanking(isRanking, refWidth);

    return (
      <RankableTableBodyCell
        {...restCellProps}
        isFixedSize={isFixedSize}
        shouldTruncate={shouldTruncate}
        width={width}
        isRanking={isRanking}
        style={inlineStyles}
        onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => e.stopPropagation()}
        innerRef={innerRef}
      >
        {content}
      </RankableTableBodyCell>
    );
  }
}

export default withDimensions<RankableTableCellProps>(RankableTableCell);
