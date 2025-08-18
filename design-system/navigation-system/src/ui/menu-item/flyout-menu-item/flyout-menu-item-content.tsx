/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { fg } from '@atlaskit/platform-feature-flags';
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
				// Using a capture event listener so that we are more resilient against
				// code that stops events. We _really_ want to close the flyout whenever
				// user user clicks outside the flyout content
				shouldUseCaptureOnOutsideClick={fg('platform_dst_nav4_flyout_use_capture_outside')}
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
				{({ update }) => (
					<UpdatePopperOnContentResize ref={forwardedRef} update={update}>
						{children}
					</UpdatePopperOnContentResize>
				)}
			</PopupContent>
		);
	},
);

function createResizeObserver(update: ResizeObserverCallback) {
	return new ResizeObserver(update);
}

/**
 * Will call the Popper.js `update()` method to recalculate positioning, when the flyout menu changes size.
 * This is the size of the scroll container, NOT the scroll content.
 *
 * We could potentially bake this into `@atlaskit/popup` or `@atlaskit/popper` but there are a few
 * reasons to keep it scoped to flyout menus for now:
 *
 * 1. It's easier to unwind
 * 2. We've only had bug reports for flyout menus
 * 3. Popup exposes the `update` function so consumers can already do this themselves if necessary
 * 4. Flyout menus are a lot more restricted to other popups, it might not make sense more generally
 */
const UpdatePopperOnContentResize = forwardRef(
	(
		{ update, children }: { update: () => void; children: React.ReactNode },
		forwardedRef: React.ForwardedRef<HTMLDivElement>,
	) => {
		/**
		 * Storing our `update` function in a ref so that we have a stable reference to it.
		 * We need this because our `ResizeObserver` callback cannot be changed after creating it.
		 */
		const updateRef = useRef(update);

		useEffect(() => {
			updateRef.current = update;
		}, [update]);

		/**
		 * Stable function that calls the latest `update` function by calling it through the stable ref.
		 */
		const triggerUpdate: ResizeObserverCallback = useCallback(() => {
			updateRef.current?.();
		}, []);

		const [resizeObserver] = useState(() => createResizeObserver(triggerUpdate));

		/**
		 * This is a callback ref that will update which `HTMLElement` we are observing,
		 * if or when the underlying `HTMLElement` changes or unmounts.
		 */
		const observeCallbackRef = useCallback(
			(element: HTMLElement | null) => {
				/**
				 * Unobserves all observed elements.
				 * Allows us to cleanup without needing to store a reference to the previous element.
				 */
				resizeObserver.disconnect();

				if (!element) {
					return;
				}

				resizeObserver.observe(element);
			},
			[resizeObserver],
		);

		/**
		 * We need to memoize the ref otherwise `triggerUpdate` is repeatedly called.
		 *
		 * This stems from ResizeObserver firing once after calling `.observe()` even if there
		 * was no resize.
		 *
		 * Without memoizing the ref, the update causes a rerender, which causes the ref to
		 * get recreated, which triggers an update and so on in a loop.
		 */
		const ref = useMemo(() => {
			return mergeRefs([forwardedRef, observeCallbackRef]);
		}, [forwardedRef, observeCallbackRef]);

		return <div ref={ref}>{children}</div>;
	},
);
