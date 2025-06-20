/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, useCallback, useContext } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { PopupContent } from '@atlaskit/popup/experimental';
import { token } from '@atlaskit/tokens';

import { SetIsOpenContext } from './flyout-menu-item-context';

const flyoutMenuItemContentStyles = cssMap({
	root: {
		// Expanding `padding` shorthand for Compiled: see eslint rule @atlaskit/platform/expand-spacing-shorthand
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		'@media (min-width: 48rem)': {
			width: '400px',
		},
	},
});

export type FlyoutMenuItemContentProps = {
	/**
	 * The contents of the flyout menu.
	 */
	children: React.ReactNode;
	/**
	 * A `testId` that is applied to the container element as the `data-testid` attribute.
	 */
	containerTestId?: string;
	/**
	 * Called when the flyout menu is closed.
	 *
	 * If you are controlling the open state of the flyout menu, use this to update your state.
	 */
	onClose?: () => void;
	/**
	 * Whether the flyout menu should be focused when opened.
	 * @default true
	 */
	autoFocus?: boolean;
};

/**
 * __FlyoutMenuItemContent__
 *
 * The content that appears when the flyout menu is open.
 */
export const FlyoutMenuItemContent = forwardRef<HTMLDivElement, FlyoutMenuItemContentProps>(
	({ children, containerTestId, onClose, autoFocus }, forwardedRef) => {
		const setIsOpen = useContext(SetIsOpenContext);

		const handleClose = useCallback(() => {
			onClose?.();
			setIsOpen(false);
		}, [setIsOpen, onClose]);

		return (
			<PopupContent
				appearance="UNSAFE_modal-below-sm"
				onClose={handleClose}
				placement="right-start"
				shouldFitViewport
				testId={containerTestId}
				xcss={flyoutMenuItemContentStyles.root}
				autoFocus={autoFocus}
				/**
				 * Disabling GPU acceleration removes the use of `transform` by popper.js for this popup.
				 *
				 * This allows makers to use popups with `shouldRenderToParent` inside the flyout.
				 *
				 * Without this, the `transform` makes the flyout the containing element for fixed positioning.
				 * Because the flyout is also a scroll container then any nested, layered element is unable to
				 * escape the flyout.
				 *
				 * Disabling the `transform` is the simplest way to resolve this layering issue,
				 * and should have negligible performance impacts, because the flyout menus should rarely
				 * need to be repositioned.
				 */
				shouldDisableGpuAcceleration
			>
				{() => <div ref={forwardedRef}>{children}</div>}
			</PopupContent>
		);
	},
);
