import React, { type FC, type Ref, useCallback, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { ASC } from '../internal/constants';
import { HeadCell } from '../styled/table-head';
import { type SortOrderType } from '../types';

const styles = cssMap({
	buttonWrapper: {
		paddingLeft: token('space.100', '8px'),
		'&:hover': {
			cursor: 'pointer',
		},
	},
	buttonHiddenWrapper: {
		display: 'flex',
		opacity: 0,
		backgroundColor: 'transparent',
		padding: token('space.050', '4px'),
		'&:focus': {
			opacity: 1,
		},
	},
	buttonVisibleWrapper: {
		display: 'flex',
		opacity: 1,
		backgroundColor: 'transparent',
		padding: token('space.050', '4px'),
	},
});

const headCellStyles = cssMap({
	headCellContainer: {
		display: 'flex',
		alignItems: 'center',
	},
});

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
	headCellId: string;
	activeSortButtonId?: string | null;
	ascendingSortTooltip?: string;
	descendingSortTooltip?: string;
	buttonAriaRoleDescription?: string;
}

const TableHeadCell: FC<TableHeadCellProps> = ({
	content,
	inlineStyles,
	testId,
	isRanking,
	innerRef,
	isSortable,
	sortOrder,
	onClick,
	headCellId,
	activeSortButtonId,
	ascendingSortTooltip = 'Sort ascending',
	descendingSortTooltip = 'Sort descending',
	buttonAriaRoleDescription = 'Sort button',
	...rest
}) => {
	const [isHovered, setIsHovered] = fg('platform-component-visual-refresh')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useState(false)
		: [undefined, undefined];

	const isSortButtonVisible = fg('platform-component-visual-refresh')
		? isHovered || headCellId === activeSortButtonId || sortOrder !== undefined
		: undefined;

	const handleMouseEnter = useCallback(() => {
		// Remove check for isHovered when cleaning up platform-component-visual-refresh
		if (isHovered !== undefined && fg('platform-component-visual-refresh')) {
			setIsHovered(true);
		}
	}, [isHovered, setIsHovered]);

	const handleMouseLeave = useCallback(() => {
		// Remove check for isHovered when cleaning up platform-component-visual-refresh
		if (isHovered !== undefined && fg('platform-component-visual-refresh')) {
			setIsHovered(false);
		}
	}, [isHovered, setIsHovered]);

	const visuallyRefreshedButton = fg('platform-component-visual-refresh') ? (
		<Box
			xcss={headCellStyles.headCellContainer}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<Text size="small" color="color.text.subtle" weight="bold" maxLines={1}>
				{content}
			</Text>

			<Flex xcss={styles.buttonWrapper}>
				<Tooltip content={sortOrder === ASC ? ascendingSortTooltip : descendingSortTooltip}>
					<Pressable
						onClick={onClick}
						xcss={isSortButtonVisible ? styles.buttonVisibleWrapper : styles.buttonHiddenWrapper}
						aria-roledescription={buttonAriaRoleDescription}
					>
						{sortOrder === ASC ? (
							<ArrowUpIcon label="" color={token('color.text.subtle')} />
						) : (
							<ArrowDownIcon label="" color={token('color.text.subtle')} />
						)}
					</Pressable>
				</Tooltip>
			</Flex>
		</Box>
	) : (
		<button type="button" aria-roledescription="Sort button">
			{content}
		</button>
	);

	return (
		<HeadCell
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={inlineStyles}
			testId={testId && `${testId}--head--cell`}
			ref={typeof innerRef !== 'string' ? innerRef : null} // string refs must be discarded as LegacyRefs are not compatible with FC forwardRefs
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...rest}
			onClick={fg('platform-component-visual-refresh') ? undefined : onClick}
			isSortable={isSortable}
			sortOrder={sortOrder}
		>
			{isSortable ? visuallyRefreshedButton : content}
		</HeadCell>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default TableHeadCell;
