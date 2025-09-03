import React, { type ReactNode, forwardRef, type Ref } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import type { CustomItemComponentProps } from '@atlaskit/menu/types';
import { Pressable } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { useToolbarDropdownMenuNew } from './ToolbarDropdownMenuContext';

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
		display: 'flex',
		position: 'relative',
		backgroundColor: token('color.background.neutral.subtle'),
		width: '100%',
		minHeight: '36px',
		minWidth: '230px',
		paddingInline: token('space.200'),
		paddingBlock: token('space.100'),
		'&:focus-visible': {
			outlineOffset: token('space.negative.025'),
			borderRadius: token('radius.small'),
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
});

export type CustomDropdownMenuItemButtonProps = CustomItemComponentProps & {
	'aria-disabled'?: boolean;
	'aria-haspopup'?: boolean;
	'aria-keyshortcuts'?: string;
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
			'aria-keyshortcuts': ariaKeyshortcuts,
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
			aria-keyshortcuts={ariaKeyshortcuts}
			ref={ref}
		>
			{children}
		</Pressable>
	),
);

type ToolbarDropdownItemProps = {
	ariaKeyshortcuts?: string;
	children?: React.ReactNode;
	elemAfter?: ReactNode;
	elemBefore?: ReactNode;
	hasNestedDropdownMenu?: boolean;
	href?: string;
	isDisabled?: boolean;
	isSelected?: boolean;
	onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
	rel?: string;
	target?: string;
	testId?: string;
	textStyle?: TextStyle;
	triggerRef?: Ref<HTMLButtonElement>;
};

export const ToolbarDropdownItem = ({
	onClick,
	elemBefore,
	elemAfter,
	isSelected,
	children,
	isDisabled,
	hasNestedDropdownMenu,
	triggerRef,
	testId,
	ariaKeyshortcuts,
	href,
	target,
	rel,
}: ToolbarDropdownItemProps) => {
	const parentContext = useToolbarDropdownMenuNew();

	return (
		<DropdownItem
			onClick={
				expValEquals('platform_editor_toolbar_aifc_patch_1', 'isEnabled', true)
					? (e) => {
							if (!hasNestedDropdownMenu) {
								parentContext?.closeMenu();
							}
							onClick?.(e);
						}
					: onClick
			}
			elemBefore={elemBefore}
			elemAfter={elemAfter}
			isSelected={isSelected}
			isDisabled={isDisabled}
			aria-haspopup={hasNestedDropdownMenu}
			aria-pressed={isSelected}
			aria-keyshortcuts={ariaKeyshortcuts}
			ref={triggerRef}
			href={href}
			target={target}
			rel={rel}
			component={
				href && expValEquals('platform_editor_toolbar_migrate_loom', 'isEnabled', true)
					? undefined
					: CustomDropdownMenuItemButton
			}
			testId={testId}
		>
			{children}
		</DropdownItem>
	);
};
