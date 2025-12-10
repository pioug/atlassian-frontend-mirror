import React, { type ReactNode, forwardRef, type Ref, isValidElement, cloneElement } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import type { CustomItemComponentProps } from '@atlaskit/menu/types';
import { Pressable } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { useToolbarDropdownMenu } from './ToolbarDropdownMenuContext';

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
		minHeight: '32px',
		minWidth: '225px',
		paddingInline: token('space.150'),
		paddingBlock: token('space.050'),
		color: token('color.text.subtle'),
		font: token('font.body'),
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
			data-toolbar-component={
				editorExperiment('platform_synced_block', true) ? 'menu-item' : undefined
			}
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
	shouldTitleWrap?: boolean;
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
	shouldTitleWrap = true,
	testId,
	ariaKeyshortcuts,
	href,
	target,
	rel,
}: ToolbarDropdownItemProps): React.JSX.Element => {
	const parentContext = useToolbarDropdownMenu();

	const injectedElemAfter = (() => {
		if (!isValidElement(elemAfter)) {
			return elemAfter;
		}

		const elementProps = elemAfter.props as Record<string, unknown>;
		if ('isDisabled' in elementProps) {
			return elemAfter;
		}

		return cloneElement(elemAfter, {
			...elementProps,
			isDisabled,
		} as typeof elemAfter.props);
	})();

	return (
		<DropdownItem
			onClick={(e) => {
				if (!hasNestedDropdownMenu) {
					parentContext?.closeMenu(e);
				}
				onClick?.(e);
			}}
			elemBefore={elemBefore}
			elemAfter={
				expValEquals('platform_editor_toolbar_aifc_patch_5', 'isEnabled', true)
					? injectedElemAfter
					: elemAfter
			}
			isSelected={isSelected}
			isDisabled={isDisabled}
			aria-haspopup={hasNestedDropdownMenu}
			aria-pressed={isSelected}
			aria-keyshortcuts={ariaKeyshortcuts}
			ref={triggerRef}
			href={href}
			target={target}
			rel={rel}
			// @ts-ignore -- This `CustomDropdownMenuItemButton` has type conflicts with the `DropdownItem` component in a way that cannot be reconciled (ignored as it fails types in Jira and should in Platform)
			component={
				href && expValEquals('platform_editor_toolbar_migrate_loom', 'isEnabled', true)
					? undefined
					: CustomDropdownMenuItemButton
			}
			testId={testId}
			data-toolbar-component="menu-item"
			shouldTitleWrap={shouldTitleWrap}
		>
			{children}
		</DropdownItem>
	);
};
