/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type KeyboardEvent, type MouseEvent, useContext, useEffect, useLayoutEffect } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import MenuGroup from '@atlaskit/menu/menu-group';
import { Box, xcss } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';

import { type FocusableElementRef, type MenuWrapperProps } from '../../types';
import isCheckboxItem from '../utils/is-checkbox-item';
import isRadioItem from '../utils/is-radio-item';

import { FocusManagerContext } from './focus-manager';

const spinnerContainerStyles = xcss({
	display: 'flex',
	minWidth: '160px',
	padding: 'space.250',
	justifyContent: 'center',
});

const LoadingIndicator = ({
	statusLabel = 'Loading',
	testId,
}: {
	statusLabel: MenuWrapperProps['statusLabel'];
	testId?: string;
}) => (
	<Box xcss={spinnerContainerStyles} role="menuitem">
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
const MenuWrapper = ({
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

		if (shouldRenderToParent && (isTriggeredUsingKeyboard || autoFocus)) {
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
