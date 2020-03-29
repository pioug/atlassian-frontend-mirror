import React from 'react';
import { RankableTableBodyCell } from '../../styled/rankable/TableCell';
import { HeadCellType, RowCellType } from '../../types';
import withDimensions, { WithDimensionsProps } from '../../hoc/withDimensions';
import { inlineStylesIfRanking } from '../../internal/helpers';

export interface Props extends WithDimensionsProps {
  head?: HeadCellType;
  cell: RowCellType;
  isFixedSize: boolean;
  testId?: string;
}

export class RankableTableCell extends React.Component<Props, {}> {
  render() {
    const {
      cell,
      head,
      isFixedSize,
      isRanking,
      innerRef,
      refWidth,
    } = this.props;
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
        innerRef={innerRef}
        onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => e.stopPropagation()}
      >
        {content}
      </RankableTableBodyCell>
    );
  }
}

export default withDimensions<Props>(RankableTableCell);
