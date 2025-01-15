// Delete this file when cleaning up platform-component-visual-refresh FG
import React from 'react';

import withDimensions, { type WithDimensionsProps } from '../../hoc/with-dimensions';
import { inlineStylesIfRanking } from '../../internal/helpers';
import HeadCell, { type TableHeadCellProps } from '../table-head-cell-old';

class RankableTableHeadCellComponentOld extends React.Component<
	WithDimensionsProps & TableHeadCellProps,
	{}
> {
	render() {
		const { isRanking, refHeight, refWidth, ...restProps } = this.props;
		const inlineStyles = inlineStylesIfRanking(isRanking, refWidth);
		return <HeadCell inlineStyles={inlineStyles} {...restProps} />;
	}
}
const RankableTableHeadCellOld = withDimensions<WithDimensionsProps & TableHeadCellProps>(
	RankableTableHeadCellComponentOld,
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default RankableTableHeadCellOld;
