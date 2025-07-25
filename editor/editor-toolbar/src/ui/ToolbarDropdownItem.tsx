import React, { type ReactNode, forwardRef, type Ref } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import type { CustomItemComponentProps } from '@atlaskit/menu/types';
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

export type CustomDropdownMenuItemButtonProps = CustomItemComponentProps & {
	'aria-haspopup'?: boolean;
	'aria-disabled'?: boolean;
	'aria-pressed'?: boolean;
};

const CustomDropdownMenuItemButton = forwardRef<
	HTMLButtonElement,
	CustomDropdownMenuItemButtonProps
>(
	(
		{
			children,
			'data-testid': testId,
			'aria-haspopup': ariaHasPopup,
			'aria-disabled': ariaDisabled,
			'aria-pressed': ariaPressed,
			onClick,
			tabIndex,
		},
		ref,
	) => (
		<Pressable
			testId={testId}
			xcss={cx(
				styles.toolbarDropdownItem,
				ariaDisabled ? styles.disabled : ariaPressed ? styles.selected : styles.enabled,
			)}
			onClick={onClick}
			tabIndex={tabIndex}
			aria-haspopup={ariaHasPopup}
			aria-expanded={ariaHasPopup ? (ariaPressed ? true : false) : undefined}
			aria-pressed={ariaPressed}
			aria-disabled={ariaDisabled}
			ref={ref}
		>
			{children}
		</Pressable>
	),
);

type ToolbarDropdownItemProps = {
	onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
	elemBefore?: ReactNode;
	elemAfter?: ReactNode;
	isSelected?: boolean;
	children?: React.ReactNode;
	textStyle?: TextStyle;
	isDisabled?: boolean;
	hasNestedDropdownMenu?: boolean;
	triggerRef?: Ref<HTMLButtonElement>;
	testId?: string;
};

export const ToolbarDropdownItem = ({
	onClick,
	elemBefore,
	elemAfter,
	isSelected,
	children,
	textStyle = 'normal',
	isDisabled,
	hasNestedDropdownMenu,
	triggerRef,
	testId,
}: ToolbarDropdownItemProps) => (
	<DropdownItem
		onClick={onClick}
		elemBefore={elemBefore}
		elemAfter={elemAfter}
		isSelected={isSelected}
		isDisabled={isDisabled}
		aria-haspopup={hasNestedDropdownMenu}
		aria-pressed={isSelected}
		ref={triggerRef}
		component={CustomDropdownMenuItemButton}
		testId={testId}
	>
		<Box xcss={styles[textStyle]}>{children}</Box>
	</DropdownItem>
);
