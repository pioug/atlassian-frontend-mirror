import React, { type ReactNode, forwardRef, type Ref, isValidElement, cloneElement } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import type { CustomItemComponentProps } from '@atlaskit/menu/types';
import { Anchor, Pressable } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import type { DataAttributes } from '../types';

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
	anchor: {
		textDecoration: 'none',
		'&:hover': {
			color: token('color.text.subtle'),
			textDecoration: 'none',
		},
		'&:visited': {
			color: token('color.text.subtle'),
		}
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
	title?: string;
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
			title,
		},
		ref,
	) => (
		<Pressable
			role={
				expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
					? 'menuitem'
					: undefined
			}
			testId={testId as string}
			xcss={cx(
				styles.toolbarDropdownItem,
				ariaDisabled ? styles.disabled : ariaPressed ? styles.selected : styles.enabled,
			)}
			onClick={onClick}
			tabIndex={tabIndex}
			aria-haspopup={ariaHasPopup}
			aria-expanded={ariaHasPopup ? (ariaPressed ? true : false) : undefined}
			// platform_editor_enghealth_a11y_jan_fixes: menuitem roles cannot have aria-pressed attribute
			aria-pressed={
				expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
					? undefined
					: ariaPressed
			}
			aria-disabled={ariaDisabled}
			aria-keyshortcuts={ariaKeyshortcuts}
			data-toolbar-component={
				editorExperiment('platform_synced_block', true) ? 'menu-item' : undefined
			}
			ref={ref}
			title={expValEquals('platform_editor_renderer_toolbar_updates', 'isEnabled', true) ? title : undefined}
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
	title?: string;
	triggerRef?: Ref<HTMLButtonElement>;
} & DataAttributes;

type CustomDropdownMenuItemAnchorProps = CustomItemComponentProps & {
	'aria-disabled'?: boolean;
	'aria-haspopup'?: boolean;
	'aria-keyshortcuts'?: string;
	'aria-pressed'?: boolean;
	href: string;
	rel?: string;
	target?: string;
	title?: string;
} & DataAttributes;

const CustomDropdownMenuItemAnchor = forwardRef<
	HTMLAnchorElement,
	CustomDropdownMenuItemAnchorProps
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
			href,
			target,
			rel,
			title,
			...dataAttributes
		},
		ref,
	) => (
		<Anchor
			role={
				expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
					? 'menuitem'
					: undefined
			}	
			testId={testId as string}
			xcss={cx(
				styles.toolbarDropdownItem,
				styles.anchor,
				ariaDisabled ? styles.disabled : ariaPressed ? styles.selected : styles.enabled,
			)}
			onClick={onClick}
			tabIndex={tabIndex}
			aria-haspopup={ariaHasPopup}
			aria-expanded={ariaHasPopup ? (ariaPressed ? true : false) : undefined}
			// platform_editor_enghealth_a11y_jan_fixes: menuitem roles cannot have aria-pressed attribute
			aria-pressed={
				expValEquals('platform_editor_enghealth_a11y_jan_fixes', 'isEnabled', true)
					? undefined
					: ariaPressed
			}
			aria-disabled={ariaDisabled}
			aria-keyshortcuts={ariaKeyshortcuts}
			data-toolbar-component="menu-item"
			ref={ref}
			href={href}
			target={target}
			rel={rel}
			title={title}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...dataAttributes}
		>
			{children}
		</Anchor>
	),
);

export const ToolbarDropdownItem = ({
	onClick,
	elemBefore,
	elemAfter,
	isSelected,
	children,
	isDisabled,
	hasNestedDropdownMenu,
	triggerRef,
	title,
	shouldTitleWrap = true,
	testId,
	ariaKeyshortcuts,
	href,
	target,
	rel,
	...dataAttributes
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
			elemAfter={injectedElemAfter}
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
				href
					? expValEquals('platform_editor_renderer_toolbar_updates', 'isEnabled', true)
						? CustomDropdownMenuItemAnchor
						: undefined
					: CustomDropdownMenuItemButton
			}
			testId={testId}
			data-toolbar-component="menu-item"
			title={title}
			shouldTitleWrap={shouldTitleWrap}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...(expValEquals('platform_editor_renderer_toolbar_updates', 'isEnabled', true) ? dataAttributes : {})}
		>
			{children}
		</DropdownItem>
	);
};
