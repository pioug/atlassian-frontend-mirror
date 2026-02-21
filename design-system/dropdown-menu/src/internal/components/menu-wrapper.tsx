/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type KeyboardEvent, type MouseEvent, useContext, useEffect, useLayoutEffect } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import MenuGroup from '@atlaskit/menu/menu-group';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

import { type FocusableElementRef, type MenuWrapperProps } from '../../types';
import isCheckboxItem from '../utils/is-checkbox-item';
import isRadioItem from '../utils/is-radio-item';

import { FocusManagerContext } from './focus-manager';

const styles = cssMap({
	spinnerContainer: {
		display: 'flex',
		minWidth: '160px',
		justifyContent: 'center',
		paddingBlockStart: token('space.250', '20px'),
		paddingInlineEnd: token('space.250', '20px'),
		paddingBlockEnd: token('space.250', '20px'),
		paddingInlineStart: token('space.250', '20px'),
	},
});

const LoadingIndicator = ({
	statusLabel = 'Loading',
	testId,
}: {
	statusLabel: MenuWrapperProps['statusLabel'];
	testId?: string;
}) => (
	<Box xcss={styles.spinnerContainer} role="menuitem">
		<Spinner size="small" label={statusLabel} testId={testId} />
	</Box>
);
/**
 *
 * MenuWrapper wraps all the menu items.
 * It handles the logic to close the menu when a MenuItem is clicked, but leaves it open
 * if a CheckboxItem or RadioItem is clicked.
 * It also sets focus to the first menu item when opened.
 */
const MenuWrapper: ({
	children,
	isLoading,
	maxHeight,
	maxWidth,
	onClose,
	onUpdate,
	statusLabel,
	setInitialFocusRef,
	shouldRenderToParent,
	spacing,
	testId,
	isTriggeredUsingKeyboard,
	autoFocus,
	menuLabel,
}: MenuWrapperProps) => JSX.Element = ({
	children,
	isLoading,
	maxHeight,
	maxWidth,
	onClose,
	onUpdate,
	statusLabel,
	setInitialFocusRef,
	shouldRenderToParent,
	spacing,
	testId,
	isTriggeredUsingKeyboard,
	autoFocus,
	menuLabel,
}: MenuWrapperProps) => {
	const { menuItemRefs } = useContext(FocusManagerContext);

	const closeOnMenuItemClick = (e: MouseEvent | KeyboardEvent) => {
		const isTargetMenuItemOrDescendant = menuItemRefs.some((menuItemRef: FocusableElementRef) => {
			const { current: menuItem } = menuItemRef;
			if (!menuItem) {
				return false;
			}
			const isCheckboxOrRadio = isCheckboxItem(menuItem) || isRadioItem(menuItem);

			return menuItem.contains(e.target as Node) && !isCheckboxOrRadio;
		});

		// Close menu if the click is triggered from a MenuItem or
		// its descendant. Don't close the menu if the click is triggered
		// from a MenuItemRadio or MenuItemCheckbox so that the user can
		// select multiple items.
		if (isTargetMenuItemOrDescendant && onClose) {
			onClose(e);
		}
	};

	// Using useEffect here causes a flicker.
	// useLayoutEffect ensures that the update and render happen in the same
	// rAF tick.
	useLayoutEffect(() => {
		onUpdate();
	}, [isLoading, onUpdate]);

	useEffect(() => {
		const firstFocusableRef =
			menuItemRefs
				.map(({ current }) => current)
				.find((el) => !!el && !el.hasAttribute('disabled')) ?? null;

		if (
			(fg('platform_dst_menu_item_focus') || shouldRenderToParent) &&
			(isTriggeredUsingKeyboard || autoFocus)
		) {
			firstFocusableRef?.focus();
		}

		setInitialFocusRef?.(firstFocusableRef);
	}, [menuItemRefs, setInitialFocusRef, autoFocus, shouldRenderToParent, isTriggeredUsingKeyboard]);

	return (
		<MenuGroup
			isLoading={isLoading}
			maxHeight={maxHeight}
			maxWidth={maxWidth}
			onClick={closeOnMenuItemClick}
			role="menu"
			spacing={spacing}
			testId={testId && `${testId}--menu-group`}
			menuLabel={menuLabel}
		>
			{isLoading ? (
				<LoadingIndicator
					statusLabel={statusLabel}
					testId={testId && `${testId}--loading-indicator`}
				/>
			) : (
				children
			)}
		</MenuGroup>
	);
};

export default MenuWrapper;
