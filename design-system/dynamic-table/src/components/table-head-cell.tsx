import React, { type FC, type Ref } from 'react';

import { HeadCell } from '../styled/table-head';
import { type SortOrderType } from '../types';

export interface TableHeadCellProps {
	colSpan?: number;
	sortKey?: string;
	isSortable?: boolean;
	sortOrder?: SortOrderType;
	isFixedSize?: boolean;
	innerRef?: Ref<HTMLTableCellElement>;
	inlineStyles?: {};
	content?: React.ReactNode;
	onClick?: () => void;
	shouldTruncate?: boolean;
	testId?: string;
	width?: number;
	isRanking?: boolean;
}

const TableHeadCell: FC<TableHeadCellProps> = ({
	content,
	inlineStyles,
	testId,
	isRanking,
	innerRef,
	isSortable,
	onClick,
	...rest
}) => {
	return (
		<HeadCell
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={inlineStyles}
			testId={testId && `${testId}--head--cell`}
			ref={typeof innerRef !== 'string' ? innerRef : null} // string refs must be discarded as LegacyRefs are not compatible with FC forwardRefs
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...rest}
			onClick={onClick}
			isSortable={isSortable}
		>
			{isSortable ? (
				<button type="button" aria-roledescription="Sort button">
					{content}
				</button>
			) : (
				content
			)}
		</HeadCell>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default TableHeadCell;
