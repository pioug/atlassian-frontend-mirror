import React from 'react';

import withDimensions, {
	// @ts-ignore -- This import is required for default export
	type State,
	type WithDimensionsProps,
} from '../../hoc/with-dimensions';
import { inlineStylesIfRanking } from '../../internal/helpers';
import HeadCell, { type TableHeadCellProps } from '../table-head-cell';

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
