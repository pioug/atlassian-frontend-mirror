/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type KeyboardEvent, type MouseEvent, useContext, useEffect, useLayoutEffect } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import MenuGroup from '@atlaskit/menu/menu-group';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled/box';
import Spinner from '@atlaskit/spinner/spinner';
import { token } from '@atlaskit/tokens';

import { type FocusableElementRef, type MenuWrapperProps } from '../../types';
import { NewSpacingContext } from '../context/spacing-context';
import isCheckboxItem from '../utils/is-checkbox-item';
import isRadioItem from '../utils/is-radio-item';
import { FocusManagerContext } from './focus-manager-context';

const styles = cssMap({
	spinnerContainer: {
		display: 'flex',
		minWidth: '160px',
		justifyContent: 'center',
		paddingBlockStart: token('space.250'),
		paddingInlineEnd: token('space.250'),
		paddingBlockEnd: token('space.250'),
		paddingInlineStart: token('space.250'),
	},
	newWrapper: {
		display: 'flex',
		position: 'static',
		flexDirection: 'column',
		overflow: 'auto',
	},
});

const semanticStyles = cssMap({
	spinnerContainer: {
		paddingBlockStart: token('space.inset.xxlarge'),
		paddingInlineEnd: token('space.inset.xxlarge'),
		paddingBlockEnd: token('space.inset.xxlarge'),
		paddingInlineStart: token('space.inset.xxlarge'),
	},
});

const LoadingIndicator = ({
	statusLabel = 'Loading',
	testId,
}: {
	statusLabel: MenuWrapperProps['statusLabel'];
	testId?: string;
}) => (
	<Box
		xcss={cx(
			styles.spinnerContainer,
			fg('platform-semantic-spacing') && semanticStyles.spinnerContainer,
		)}
		role="menuitem"
	>
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
	const newSpacing = (spacing === 'cozy' ? 'spacious' : spacing) || 'spacious';

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

	if (fg('platform-dst-new-menu')) {
		return (
			<NewSpacingContext.Provider value={newSpacing}>
				{/* eslint-disable-next-line @atlassian/a11y/click-events-have-key-events, @atlassian/a11y/interactive-supports-focus, @atlassian/a11y/interactive-element-not-keyboard-focusable -- This path is temporary until top-layer is rolled out */}
				<div
					style={{
						maxWidth,
						maxHeight,
					}}
					css={[styles.newWrapper]}
					data-testid={testId && `${testId}--menu-group`}
					role="menu"
					aria-label={menuLabel}
					onClick={closeOnMenuItemClick}
				>
					{isLoading ? (
						<LoadingIndicator
							statusLabel={statusLabel}
							testId={testId && `${testId}--loading-indicator`}
						/>
					) : (
						children
					)}
				</div>
			</NewSpacingContext.Provider>
		);
	}

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
