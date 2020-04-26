import React from 'react';

import withDimensions, { WithDimensionsProps } from '../../hoc/withDimensions';
import { inlineStylesIfRanking } from '../../internal/helpers';
import HeadCell, { Props as HeadCellProps } from '../TableHeadCell';

class RankableTableHeadCell extends React.Component<
  WithDimensionsProps & HeadCellProps,
  {}
> {
  render() {
    const {
      isRanking,
      refHeight,
      refWidth,
      innerRef,
      ...restProps
    } = this.props;
    const inlineStyles = inlineStylesIfRanking(isRanking, refWidth);
    return (
      <HeadCell
        inlineStyles={inlineStyles}
        innerRef={innerRef}
        {...restProps}
      />
    );
  }
}

export default withDimensions<WithDimensionsProps & HeadCellProps>(
  RankableTableHeadCell,
);
