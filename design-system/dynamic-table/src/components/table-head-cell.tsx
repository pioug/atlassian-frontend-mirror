import React, { type FC, type Ref, useCallback, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import ArrowDownIcon from '@atlaskit/icon/core/arrow-down';
import ArrowUpIcon from '@atlaskit/icon/core/arrow-up';
import { Box, Flex, Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { ASC } from '../internal/constants';
import { HeadCell } from '../styled/table-head';
import { type SortOrderType } from '../types';

const styles = cssMap({
	buttonWrapper: {
		display: 'flex',
		backgroundColor: 'transparent',
		alignItems: 'center',
		padding: token('space.0'),
		'&:hover': {
			cursor: 'pointer',
		},
	},
	sortIconHiddenWrapper: {
		display: 'flex',
		opacity: 0,
		backgroundColor: 'transparent',
		padding: token('space.050'),
		'&:focus': {
			opacity: 1,
		},
	},
	sortIconVisibleWrapper: {
		display: 'flex',
		opacity: 1,
		backgroundColor: 'transparent',
		padding: token('space.050'),
	},
	hideIconHeaderWrapper: {
		opacity: 0,
		marginLeft: token('space.negative.300', '-24px'),
	},
	visibleHeaderWrapper: {
		opacity: 1,
		paddingRight: token('space.050', '4px'),
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
	isIconOnlyHeader?: boolean;
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
	isIconOnlyHeader,
	...rest
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	const isActive = headCellId === activeSortButtonId || sortOrder !== undefined;
	const isSortIconVisible = isHovered || isActive || isFocused;
	const isVisibleIconOnlyHeader = isSortIconVisible && isIconOnlyHeader;
	const shouldRenderSortIcon =
		!isIconOnlyHeader || isSortIconVisible || (isIconOnlyHeader && !isFocused);

	const handleFocus = useCallback(() => {
		setIsFocused?.(true);
	}, [setIsFocused]);

	const handleBlur = useCallback(() => {
		setIsFocused?.(false);
	}, [setIsFocused]);

	const handleMouseEnter = useCallback(() => {
		setIsHovered(true);
	}, [setIsHovered]);

	const handleMouseLeave = useCallback(() => {
		setIsHovered(false);
	}, [setIsHovered]);

	const visuallyRefreshedButton = (
		<Box
			xcss={headCellStyles.headCellContainer}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}
		>
			<Tooltip content={sortOrder === ASC ? ascendingSortTooltip : descendingSortTooltip}>
				<Pressable
					onClick={onClick}
					xcss={styles.buttonWrapper}
					aria-roledescription={buttonAriaRoleDescription}
				>
					<Flex
						xcss={
							isVisibleIconOnlyHeader ? styles.hideIconHeaderWrapper : styles.visibleHeaderWrapper
						}
					>
						<Text size="small" color="color.text.subtle" weight="bold" maxLines={1}>
							{content}
						</Text>
					</Flex>
					{shouldRenderSortIcon && (
						<Flex
							xcss={
								isSortIconVisible ? styles.sortIconVisibleWrapper : styles.sortIconHiddenWrapper
							}
						>
							{sortOrder === ASC ? (
								<ArrowUpIcon
									label=""
									color={token('color.text.subtle')}
									testId={testId && `${testId}--up--icon`}
								/>
							) : (
								<ArrowDownIcon
									label=""
									color={token('color.text.subtle')}
									testId={testId && `${testId}--down--icon`}
								/>
							)}
						</Flex>
					)}
				</Pressable>
			</Tooltip>
		</Box>
	);

	return (
		<HeadCell
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={inlineStyles}
			testId={testId && `${testId}--head--cell`}
			ref={typeof innerRef !== 'string' ? innerRef : null} // string refs must be discarded as LegacyRefs are not compatible with FC forwardRefs
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...rest}
			isSortable={isSortable}
			sortOrder={sortOrder}
		>
			{isSortable ? visuallyRefreshedButton : content}
		</HeadCell>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default TableHeadCell;
