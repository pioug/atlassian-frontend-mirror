import React from 'react';

import withDimensions, { type WithDimensionsProps } from '../../hoc/with-dimensions';
import { inlineStylesIfRanking } from '../../internal/helpers';
import HeadCell, { type TableHeadCellProps } from '../table-head-cell';

// eslint-disable-next-line @repo/internal/react/no-class-components
class RankableTableHeadCellComponent extends React.Component<
	WithDimensionsProps & TableHeadCellProps,
	{}
> {
	render() {
		const { isRanking, refHeight, refWidth, ...restProps } = this.props;
		const inlineStyles = inlineStylesIfRanking(isRanking, refWidth);
		return <HeadCell inlineStyles={inlineStyles} {...restProps} />;
	}
}
const RankableTableHeadCell = withDimensions<WithDimensionsProps & TableHeadCellProps>(
	RankableTableHeadCellComponent,
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default RankableTableHeadCell;
