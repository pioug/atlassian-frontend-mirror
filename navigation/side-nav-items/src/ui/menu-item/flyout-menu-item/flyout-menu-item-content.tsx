/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react';

import { cssMap as cssMapUnbound, jsx } from '@compiled/react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { cssMap } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { fg } from '@atlaskit/platform-feature-flags';
import { PopupContent } from '@atlaskit/popup/experimental';
import { token } from '@atlaskit/tokens';

import {
	OnCloseContext,
	SetIsOpenContext,
	TitleIdContextProvider,
} from './flyout-menu-item-context';

export type FlyoutCloseSource = 'close-button' | 'escape-key' | 'outside-click' | 'other';

/**
 * The vertical offset in px to ensure the flyout container does not exceed the bounds of
 * the window. This matches the padding of the content container, and it's position within
 * the viewport.
 *
 * - FlyoutMenuItemContent: paddingBlock: token('space.100'); – 8px top, 8px bottom
 * - Position: 5px top, 5px bottom
 *
 * Total vertical padding:
 * 		(8px [content top] + 8px [content bottom]) +
 * 		(5px [position top] + 5px [position bottom]) = 26px
 */
const FLYOUT_MENU_VERTICAL_OFFSET_PX = 26;

/**
 * The maximum height of the flyout menu in pixels, following the Confluence standard maximum
 * height of 760px.
 */
const FLYOUT_MENU_MAX_HEIGHT_PX = 760;

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

const flyoutMenuItemContentContainerStyles = cssMapUnbound({
	container: {
		display: 'flex',
		height: '100%',
		flexDirection: 'column',
	},
});

export type FlyoutMenuItemContentProps = {
	/**
	 * Whether the flyout menu should be focused when opened.
	 * @default true
	 */
	autoFocus?: boolean;

	/**
	 * The contents of the flyout menu.
	 */
	children: React.ReactNode;

	/**
	 * A `testId` that is applied to the container element as the `data-testid` attribute.
	 */
	containerTestId?: string;

	/**
	 * The maximum height of the flyout menu in pixels.
	 *
	 * If not provided, defaults to 760px.
	 */
	maxHeight?: number;

	/**
	 * Called when the flyout menu is closed.
	 *
	 * If you are controlling the open state of the flyout menu, use this to update your state.
	 */
	onClose?: () => void;
};

/**
 * __FlyoutMenuItemContent__
 *
 * The content that appears when the flyout menu is open.
 */
export const FlyoutMenuItemContent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<FlyoutMenuItemContentProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, FlyoutMenuItemContentProps>(
	(
		{ children, containerTestId, onClose, autoFocus, maxHeight = FLYOUT_MENU_MAX_HEIGHT_PX },
		forwardedRef,
	) => {
		const setIsOpen = useContext(SetIsOpenContext);
		const onCloseRef = useContext(OnCloseContext);
		const { createAnalyticsEvent } = useAnalyticsEvents();

		// The source of the close is not accessible to the consumer, it is determined within the
		// handleClose function, or passed in as a parameter in FlyoutMenuItemTrigger (outside-click),
		// or FlyoutHeader (close-button).
		const handleClose = useCallback(
			(
				event: Event | React.MouseEvent<HTMLButtonElement> | KeyboardEvent | MouseEvent | null,
				source?: FlyoutCloseSource,
			) => {
				if (fg('platform_dst_nav4_flyout_menu_slots_close_button')) {
					// Use the passed source if provided, otherwise determine from event
					let determinedSource: FlyoutCloseSource = source || 'other';

					if (!source) {
						if (event instanceof KeyboardEvent) {
							const keyboardEvent = event as KeyboardEvent;
							if (keyboardEvent.key === 'Escape' || keyboardEvent.key === 'Esc') {
								determinedSource = 'escape-key';
							}
						} else if (event instanceof MouseEvent) {
							if (event && 'type' in event && event.type === 'click') {
								determinedSource = 'outside-click';
							}
						}
					}

					// When flyout menu is closed, fire analytics event
					const navigationAnalyticsEvent = createAnalyticsEvent({
						source: 'sideNav',
						actionSubject: 'flyoutMenu',
						action: 'closed',
						attributes: {
							closeSource: determinedSource,
						},
					});

					navigationAnalyticsEvent.fire('navigation');
				}

				onClose?.();
				setIsOpen(false);
			},
			[setIsOpen, onClose, createAnalyticsEvent],
		);

		// Register handleClose in the ref to allow the FlyoutMenuItemTrigger to access it
		useEffect(() => {
			onCloseRef.current = handleClose;
		}, [handleClose, onCloseRef]);

		const titleId = useId();

		const computedMaxHeight = useMemo(
			() =>
				/**
				 * The max height of the flyout menu needs to factor in the top nav and banner, as it will be layered
				 * beneath them and would otherwise be clipped.
				 *
				 * We can remove these navigation variables once layering has been addressed holistically (e.g. using Top Layer).
				 *
				 * Not using the UNSAFE_MAIN_BLOCK_START_FOR_LEGACY_PAGES_ONLY variable from `@atlaskit/navigation-system`
				 * to avoid a circular dependency, as that package imports this one for re-exporting components.
				 */
				fg('platform-dst-side-nav-layering-fixes')
					? `min(calc(100vh - ${FLYOUT_MENU_VERTICAL_OFFSET_PX}px - var(--n_tNvM, 0px) - var(--n_bnrM, 0px)), ${maxHeight}px)`
					: `min(calc(100vh - ${FLYOUT_MENU_VERTICAL_OFFSET_PX}px), ${maxHeight}px)`,
			[maxHeight],
		);

		return (
			<PopupContent
				appearance="UNSAFE_modal-below-sm"
				onClose={handleClose}
				placement="right-start"
				// Using a capture event listener so that we are more resilient against
				// code that stops events. We _really_ want to close the flyout whenever
				// user user clicks outside the flyout content
				shouldUseCaptureOnOutsideClick
				shouldFitViewport
				testId={containerTestId}
				xcss={flyoutMenuItemContentStyles.root}
				autoFocus={autoFocus}
				role={fg('platform_dst_nav4_flyout_menu_slots_close_button') ? 'dialog' : undefined}
				titleId={fg('platform_dst_nav4_flyout_menu_slots_close_button') ? titleId : undefined}
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
				shouldRenderToParent={fg('platform_dst_nav4_flyoutmenuitem_render_to_parent')}
			>
				{({ update }) => (
					<UpdatePopperOnContentResize ref={forwardedRef} update={update}>
						{fg('platform_dst_nav4_flyout_menu_slots_close_button') ? (
							<TitleIdContextProvider value={titleId}>
								<div
									css={flyoutMenuItemContentContainerStyles.container}
									style={{ maxHeight: computedMaxHeight }}
									data-testid={containerTestId ? `${containerTestId}--container` : undefined}
								>
									{children}
								</div>
							</TitleIdContextProvider>
						) : (
							children
						)}
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
const UpdatePopperOnContentResize: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<{ children: React.ReactNode; update: () => void }> &
	React.RefAttributes<HTMLDivElement>
> = forwardRef(
	(
		{ update, children }: { children: React.ReactNode; update: () => void },
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
