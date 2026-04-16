import React from 'react';

import type { WithDimensionsProps } from '../../hoc/with-dimensions';
import { inlineStylesIfRanking } from '../../internal/inline-styles-if-ranking';
import { RankableTableBodyCell } from '../../styled/rankable/table-cell';
import { type HeadCellType, type RowCellType } from '../../types';

export interface RankableTableCellProps extends WithDimensionsProps {
	head?: HeadCellType;
	cell: RowCellType;
	isFixedSize: boolean;
	testId?: string;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class RankableTableCell extends React.Component<RankableTableCellProps, {}> {
	render(): React.JSX.Element {
		const { cell, head, isFixedSize, isRanking, refWidth, innerRef, testId } = this.props;
		const { content, testId: cellTestId, ...restCellProps } = cell;
		const { shouldTruncate, width }: HeadCellType = head || ({} as HeadCellType);
		const inlineStyles = inlineStylesIfRanking(isRanking, refWidth);

		return (
			<RankableTableBodyCell
				{...restCellProps}
				isFixedSize={isFixedSize}
				shouldTruncate={shouldTruncate}
				width={width}
				isRanking={isRanking}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={inlineStyles}
				onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => e.stopPropagation()}
				innerRef={innerRef}
				data-testid={cellTestId || (testId && `${testId}--rankable--table--body--cell`)}
			>
				{content}
			</RankableTableBodyCell>
		);
	}
}
