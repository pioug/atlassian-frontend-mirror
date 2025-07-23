import React, { type ReactNode } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import { Box, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

type TextStyle =
	| 'normal'
	| 'heading1'
	| 'heading2'
	| 'heading3'
	| 'heading4'
	| 'heading5'
	| 'heading6';

const styles = cssMap({
	toolbarDropdownItem: {
		position: 'relative',
		backgroundColor: token('color.background.neutral.subtle'),
		width: '100%',
		minHeight: '36px',
		paddingLeft: token('space.150'),
		paddingRight: token('space.150'),
		'&:focus-visible': {
			outlineOffset: token('space.negative.025'),
			borderRadius: token('border.radius'),
		},
	},
	enabled: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
	disabled: {
		color: token('color.text.disabled'),
		cursor: 'not-allowed',
	},
	selected: {
		backgroundColor: token('color.background.selected'),
		color: token('color.text.selected'),
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
		},
	},
	normal: {
		font: token('font.body'),
	},
	heading1: {
		font: token('font.heading.xlarge'),
	},
	heading2: {
		font: token('font.heading.large'),
	},
	heading3: {
		font: token('font.heading.medium'),
	},
	heading4: {
		font: token('font.heading.small'),
	},
	heading5: {
		font: token('font.heading.xsmall'),
	},
	heading6: {
		font: token('font.heading.xxsmall'),
	},
});

type ToolbarDropdownItemProps = {
	onClick: () => void;
	elemBefore?: ReactNode;
	elemAfter?: ReactNode;
	isSelected?: boolean;
	children?: React.ReactNode;
	textStyle?: TextStyle;
	isDisabled?: boolean;
};

export const ToolbarDropdownItem = ({
	onClick,
	elemBefore,
	elemAfter,
	isSelected,
	children,
	textStyle = 'normal',
	isDisabled,
}: ToolbarDropdownItemProps) => {
	return (
		<DropdownItem
			onClick={onClick}
			elemBefore={elemBefore}
			elemAfter={elemAfter}
			isSelected={isSelected}
			component={({
				children,
				'data-testid': testId,
				draggable,
				onClick,
				onDragStart,
				onMouseDown,
				ref,
				tabIndex,
			}) => (
				<Pressable
					testId={testId}
					xcss={cx(
						styles.toolbarDropdownItem,
						isDisabled ? styles.disabled : isSelected ? styles.selected : styles.enabled,
					)}
					isDisabled={isDisabled}
					draggable={draggable}
					onClick={onClick}
					onDragStart={onDragStart}
					onMouseDown={onMouseDown}
					tabIndex={tabIndex}
					ref={ref}
				>
					{children}
				</Pressable>
			)}
		>
			<Box xcss={styles[textStyle]}>{children}</Box>
		</DropdownItem>
	);
};
