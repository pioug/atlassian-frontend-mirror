/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';
import { flushSync } from 'react-dom';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import {
	OpenLayerObserverNamespaceProvider,
	useOpenLayerObserver,
} from '@atlaskit/layering/experimental/open-layer-observer';
import { fg } from '@atlaskit/platform-feature-flags';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { media } from '@atlaskit/primitives/responsive';
import { token } from '@atlaskit/tokens';

import { useSkipLinkInternal } from '../../../context/skip-links/skip-links-context';
import { TopNavStartElement } from '../../../context/top-nav-start/top-nav-start-context';
import {
	contentHeightWhenFixed,
	contentInsetBlockStart,
	localSlotLayers,
	sideNavLiveWidthVar,
	sideNavPanelSplitterId,
	sideNavVar,
	UNSAFE_sideNavLayoutVar,
} from '../constants';
import { DangerouslyHoistSlotSizes } from '../hoist-slot-sizes-context';
import { DangerouslyHoistCssVarToDocumentRoot } from '../hoist-utils';
import { useLayoutId } from '../id-utils';
import { PanelSplitterProvider } from '../panel-splitter/provider';
import type { ResizeBounds } from '../panel-splitter/types';
import type { CommonSlotProps } from '../types';
import { useResizingWidthCssVarOnRootElement } from '../use-resizing-width-css-var-on-root-element';

import { useSideNavRef } from './element-context';
import { sideNavFlyoutCloseDelayMs } from './flyout-close-delay-ms';
import { SideNavToggleButtonElement } from './toggle-button-context';
import { useExpandSideNav } from './use-expand-side-nav';
import { useSideNavVisibility } from './use-side-nav-visibility';
import {
	useSideNavVisibilityCallbacks,
	type VisibilityCallback,
} from './use-side-nav-visibility-callbacks';
import { useToggleSideNav } from './use-toggle-side-nav';
import { SetSideNavVisibilityState, SideNavVisibilityState } from './visibility-context';

const panelSplitterResizingVar = '--n_snvRsz';

const widthResizeBounds: ResizeBounds = { min: '240px', max: '50vw' };

function getResizeBounds() {
	return widthResizeBounds;
}

const openLayerObserverSideNavNamespace = 'side-nav';

type FlyoutState =
	| { type: 'open' }
	| { type: 'is-dragging-from-flyout' }
	| { type: 'waiting-for-close'; abort: () => void }
	| { type: 'ready-to-close' }
	| { type: 'not-active' };

const styles = cssMap({
	root: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		boxSizing: 'border-box',
		gridArea: 'main / aside / aside / aside',
		// Height is set so it takes up all of the available viewport space minus top bar + banner.
		// Since the side nav is always rendered ontop of other grid items across all viewports height is
		// always set.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		height: contentHeightWhenFixed,
		// This sets the sticky point to be just below top bar + banner. It's needed to ensure the stick
		// point is exactly where this element is rendered to with no wiggle room. Unfortunately the CSS
		// spec for sticky doesn't support "stick to where I'm initially rendered" so we need to tell it.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetBlockStart: contentInsetBlockStart,
		position: 'sticky',
		// For mobile viewports, the side nav will take up 90% of the screen width, up to a maximum of 320px (the default SideNav width)
		width: 'min(90%, 320px)',
		// On small viewports the side nav is displayed above other slots so we create a stacking context.
		// We keep the side nav with a stacking context always so it is rendered above main content.
		// This comes with a caveat that main is rendered underneath the side nav content so for any
		// menu dialogs rendered with "shouldRenderToParent" they could be cut off unintentionally.
		// Unfortunately this is the best of bad solutions.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		zIndex: localSlotLayers.sideNav,
		'@media (min-width: 48rem)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `var(${panelSplitterResizingVar}, var(${sideNavVar}))`,
		},
		'@media (min-width: 64rem)': {
			backgroundColor: token('elevation.surface'),
			boxShadow: 'initial',
			gridArea: 'side-nav',
		},
	},
	oldBorder: {
		borderInlineEnd: `1px solid ${token('color.border')}`,
	},
	newBorder: {
		// Not required, but declaring explicitly because we really don't want a border at small sizes
		// Previously we had a transparent border to maintain width, but this unintentionally acted as padding
		borderInlineStart: 'none',
		borderInlineEnd: 'none',
		'@media (min-width: 64rem)': {
			// We only want the border to be visible when it is not an overlay
			borderInlineEnd: `1px solid ${token('color.border')}`,
		},
	},
	newBorderFlyoutOpen: {
		'@media (min-width: 64rem)': {
			// Hide the border for the flyout, because it has a shadow
			borderInlineEnd: 'none',
		},
	},
	flyoutOpen: {
		'@media (min-width: 64rem)': {
			// These styles are in a media query to override the `styles.root` media query styles
			backgroundColor: token('elevation.surface.overlay'),
			boxShadow: token('elevation.shadow.overlay'),
			gridArea: 'main',
		},
		/**
		 * Disabling animations for Firefox, as it doesn't support animating the `display` property:
		 * https://caniuse.com/mdn-css_properties_display_is_transitionable
		 *
		 * Additionally, it doesn't support the `@starting-style` rule:
		 * https://bugzilla.mozilla.org/show_bug.cgi?id=1892191
		 *
		 * We are using `@supports` to target browsers that are not Firefox:
		 * https://www.bram.us/2021/06/23/css-at-supports-rules-to-target-only-firefox-safari-chromium/#not-firefox
		 *
		 * Unfortunately we cannot use `@supports` to target the support of `transition-behavior: allow-discrete` specifically
		 * for the `display` property. And `@supports at-rule(@starting-style)` is also not ready for browser use yet.
		 */
		'@supports not (-moz-appearance: none)': {
			// Disabling animations if user has opted for reduced motion
			'@media (prefers-reduced-motion: no-preference)': {
				transitionProperty: 'transform, display',
				transitionDuration: '0.2s',
				transitionBehavior: 'allow-discrete',

				/**
				 * Because we're transitioning from display: none, we need to define the
				 * starting values for when the element is first displayed, so the
				 * transition animation knows where to start from.
				 */
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
				'@starting-style': {
					transform: 'translateX(-100%)',
				},
			},
		},
	},
	flyoutAnimateClosed: {
		display: 'none',
		'@media (min-width: 64rem)': {
			// These styles are in a media query to override the `styles.root` media query styles
			gridArea: 'main',
		},
		// Disabling animations for Firefox, as it doesn't support the close animation. See comment block in `styles.flyoutOpen` for more details.
		'@supports not (-moz-appearance: none)': {
			// Disabling animations if user has opted for reduced motion
			'@media (prefers-reduced-motion: no-preference)': {
				transitionProperty: 'transform, display',
				transitionDuration: '0.2s',
				transitionBehavior: 'allow-discrete',
				transform: 'translateX(-100%)',
			},
		},
	},
	flexContainer: {
		// This element controls the flex layout to position the slot elements correctly.
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	hiddenMobileAndDesktop: {
		display: 'none',
	},
	hiddenMobileOnly: {
		display: 'none',
		'@media (min-width: 64rem)': {
			display: 'initial',
		},
	},
	hiddenDesktopOnly: {
		'@media (min-width: 64rem)': {
			display: 'none',
		},
	},
});

type SideNavProps = CommonSlotProps & {
	/**
	 * The content of the layout area.
	 * Should include side nav layout areas as required: `SideNavHeader`, `SideNavContent`, `SideNavFooter`.
	 * Within these, you can use side nav menu items.
	 */
	children: React.ReactNode;
	/**
	 * The accessible name of the slot, announced by screen readers.
	 */
	label?: string;
	/**
	 * Whether the side nav should be collapsed by default __on desktop screens__.
	 *
	 * It is always collapsed by default for mobile screens.
	 *
	 * This value is used when the side nav is first mounted, but you should continuously update your
	 * persisted state using the `onCollapse` and `onExpand` callbacks, to ensure it is up to date
	 * when the app is reloaded.
	 *
	 * __Note:__ If using this prop, ensure that it is also provided to the `SideNavToggleButton`.
	 * This is to ensure the state is in sync before post-SSR hydration.
	 */
	defaultCollapsed?: boolean;
	/**
	 * The default width of the side nav layout area.
	 * It should be between the resize bounds - the minimum is 240px and the maximum is 50% of the viewport width.
	 *
	 * It is only used when the side nav is first mounted, but you should continuously update your
	 * persisted state using the `onResizeEnd` callback of `PanelSplitter`, to ensure it is up to date
	 * when the app is reloaded.
	 */
	defaultWidth?: number;
	/**
	 * Called when the side nav is expanded.
	 */
	onExpand?: VisibilityCallback;
	/**
	 * Called when the side nav is collapsed.
	 */
	onCollapse?: VisibilityCallback;
};

/**
 * We need an additional component layer so we can wrap the side nav in a `OpenLayerObserver` and have access to the
 * context value.
 */
function SideNavInternal({
	children,
	defaultCollapsed,
	defaultWidth = 320,
	testId,
	label = 'Sidebar',
	skipLinkLabel = label,
	onExpand,
	onCollapse,
	id: providedId,
}: SideNavProps) {
	const id = useLayoutId({ providedId });
	const expandSideNav = useExpandSideNav();
	/**
	 * Called after clicking on the side nav skip link, and ensures the side nav is expanded so that it is focusable.
	 *
	 * We need to update the DOM synchronously because `.focus()` is called synchronously after this state update.
	 */
	const synchronouslyExpandSideNav = useCallback(() => {
		flushSync(() => {
			/**
			 * Calling this unconditionally and relying on it to avoid no-op renders.
			 *
			 * We _could_ call it conditionally, but we'd be duplicating the screen size checks `expandSideNav` makes.
			 */
			expandSideNav();
		});
	}, [expandSideNav]);

	useSkipLinkInternal({
		id,
		label: skipLinkLabel,
		onBeforeNavigate: synchronouslyExpandSideNav,
	});

	const sideNavState = useContext(SideNavVisibilityState);
	const setSideNavState = useContext(SetSideNavVisibilityState);
	const { isExpandedOnDesktop, isExpandedOnMobile } = useSideNavVisibility({
		defaultCollapsed,
	});
	// We are placing `defaultCollapsed` into a state container so we can have a stable reference to the initial value.
	// This is so we can use it in an effect _that only runs once_, after the initial render on the client,
	// to sync the side nav context (provided in `<Root>`) with the `defaultCollapsed` prop provided to `<SideNav>`.
	const [initialDefaultCollapsed] = useState(defaultCollapsed);

	const [width, setWidth] = useState(defaultWidth);
	const clampedWidth = `clamp(${widthResizeBounds.min}, ${width}px, ${widthResizeBounds.max})`;
	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);

	const navRef = useRef<HTMLDivElement | null>(null);
	/**
	 * Used to share the side nav element with the `Panel`,
	 * which observes the side nav to determine its maximum width.
	 */
	const sharedRef = useSideNavRef();
	const mergedRef = mergeRefs([navRef, sharedRef]);

	const toggleButtonElement = useContext(SideNavToggleButtonElement);
	const topNavStartElement = useContext(TopNavStartElement);
	const devTimeOnlyAttributes: Record<string, string | boolean> = {};
	const openLayerObserver = useOpenLayerObserver();
	const flyoutStateRef = useRef<FlyoutState>({ type: 'not-active' });
	const isFlyoutVisible = sideNavState?.flyout === 'open';

	const updateFlyoutState = useMemo(() => {
		function tryAbortPendingClose() {
			if (flyoutStateRef.current.type === 'waiting-for-close') {
				flyoutStateRef.current.abort();
			}
		}

		function open() {
			tryAbortPendingClose();
			flyoutStateRef.current = { type: 'open' };
			setSideNavState((currentState) => {
				if (currentState?.desktop === 'collapsed' && currentState?.flyout !== 'open') {
					return {
						desktop: currentState.desktop,
						mobile: currentState.mobile,
						flyout: 'open',
					};
				}

				return currentState;
			});
		}

		function close() {
			tryAbortPendingClose();
			flyoutStateRef.current = { type: 'not-active' };
			setSideNavState((currentState) => {
				if (currentState?.desktop === 'collapsed' && currentState?.flyout === 'open') {
					return {
						desktop: currentState.desktop,
						mobile: currentState.mobile,
						flyout: 'triggered-animate-close',
					};
				}

				return currentState;
			});
		}

		return function onAction(
			action:
				| 'open'
				| 'drag-from-flyout-started'
				| 'drag-from-flyout-finished'
				| 'waiting-for-close'
				| 'ready-to-close'
				| 'force-close',
		) {
			if (action === 'drag-from-flyout-started') {
				open();
				flyoutStateRef.current = { type: 'is-dragging-from-flyout' };
				return;
			}

			if (action === 'drag-from-flyout-finished') {
				open();
				return;
			}

			// ignoring all actions until the drag is finished
			if (flyoutStateRef.current.type === 'is-dragging-from-flyout') {
				return;
			}

			if (action === 'open') {
				open();
				return;
			}

			if (action === 'waiting-for-close') {
				if (flyoutStateRef.current.type === 'waiting-for-close') {
					return;
				}

				// A timeout is used to close the flyout after a delay when the user mouses out of the flyout area, and to allow
				// us to cancel the close if the user mouses back in.
				const timeout = setTimeout(() => {
					updateFlyoutState('ready-to-close');
				}, sideNavFlyoutCloseDelayMs);

				flyoutStateRef.current = {
					type: 'waiting-for-close',
					abort() {
						clearTimeout(timeout);
					},
				};

				return;
			}

			if (action === 'ready-to-close') {
				// If there are no open layers, we can close the flyout.
				if (openLayerObserver.getCount({ namespace: openLayerObserverSideNavNamespace }) === 0) {
					close();
					return;
				}

				flyoutStateRef.current = { type: 'ready-to-close' };
				return;
			}

			if (action === 'force-close') {
				close();
				return;
			}
		};
	}, [openLayerObserver, setSideNavState]);

	const toggleVisibility = useToggleSideNav();

	useEffect(() => {
		// Sync the visibility in context (provided in `<Root>`) with the local `defaultCollapsed` prop provided to `SideNav`
		// after SSR hydration. This should only run once, after the initial render on the client.
		setSideNavState({
			desktop: initialDefaultCollapsed ? 'collapsed' : 'expanded',
			mobile: 'collapsed',
			flyout: 'closed',
		});
	}, [initialDefaultCollapsed, setSideNavState]);

	const handleExpand = useCallback<VisibilityCallback>(
		({ screen }) => {
			onExpand?.({ screen });

			// When the side nav gets expanded, we close the flyout to reset it.
			// This prevents the flyout from staying open and ensures we are respecting the user's intent to expand.
			updateFlyoutState('force-close');
		},
		[onExpand, updateFlyoutState],
	);

	const handleCollapse = useCallback<VisibilityCallback>(
		({ screen }) => {
			onCollapse?.({ screen });

			// When the side nav gets collapsed, we close the flyout to reset it.
			// This prevents the flyout from staying open and ensures we are respecting the user's intent to collapse.
			updateFlyoutState('force-close');
		},
		[onCollapse, updateFlyoutState],
	);

	useSideNavVisibilityCallbacks({
		onExpand: handleExpand,
		onCollapse: handleCollapse,
		isExpandedOnDesktop,
		isExpandedOnMobile,
	});

	useEffect(() => {
		const mediaQueryList = window.matchMedia('(min-width: 64rem)');
		return bind(mediaQueryList, {
			type: 'change',
			listener() {
				if (mediaQueryList.matches) {
					// We're transitioning from tablet to desktop viewport size.
					// We forcibly show the side nav if it was shown on mobile.
					if (isExpandedOnMobile && !isExpandedOnDesktop) {
						toggleVisibility();
					}
				}
			},
		});
	}, [toggleVisibility, isExpandedOnDesktop, isExpandedOnMobile]);

	/**
	 * Close the mobile side nav if there is a click outside.
	 *
	 * Binding/unbinding on changes to `isExpandedOnMobile` instead of window size changes for simplicity.
	 * If we listened to window size changes we'd need nested `bind()` calls.
	 */
	useEffect(() => {
		if (!isExpandedOnMobile) {
			return;
		}

		/**
		 * The expected URL fragment used by the side nav skip link.
		 */
		const skipLinkUrlFragment = `#${id}`;

		return bind(window, {
			type: 'click',
			listener(event) {
				if (window.matchMedia('(min-width: 64rem)').matches) {
					// Clicks on desktop should do nothing
					return;
				}

				const sideNav = navRef.current;
				if (!sideNav || !(event.target instanceof Node)) {
					// Ignore if our element references are invalid
					return;
				}

				if (sideNav.contains(event.target)) {
					// Clicks inside the side nav should not close it
					return;
				}

				if (toggleButtonElement?.contains(event.target)) {
					// Clicks on the toggle button will already toggle the side nav,
					// so we need to ignore it or we end up doing a double toggle
					return;
				}

				if (
					event.target instanceof HTMLAnchorElement &&
					/**
					 * Intentionally using `.getAttribute()` for simplicity to match exactly what we expect
					 * for skip links.
					 *
					 * Alternatives considered:
					 *
					 * - Using `.href` returns a full URL, which would then require extra parsing.
					 * - Using `.hash` could incorrectly capture `<a href="/another-page#skip-link-id>` so we'd need extra checks.
					 *
					 * This approach has an edge case of `<a href="/same-page#skip-link-id>` not being captured,
					 * but we are okay with that trade-off.
					 */
					event.target.getAttribute('href') === skipLinkUrlFragment
				) {
					// This was a click on a link to the side nav, so we shouldn't try to collapse the SideNav.
					// It was most likely the skip link, although anyone can render a link with the ID.
					// In either case keeping the SideNav expanded makes sense.
					return;
				}

				toggleVisibility();
			},
		});
	}, [id, isExpandedOnMobile, toggleButtonElement, toggleVisibility]);

	useEffect(() => {
		if (!toggleButtonElement) {
			return;
		}

		return bind(toggleButtonElement, {
			type: 'mouseenter',
			listener() {
				// Only flyout the side nav if the user hovered while the side nav was collapsed
				if (isExpandedOnDesktop) {
					return;
				}

				// Only flyout the side nav on desktop viewports
				const { matches } = window.matchMedia('(min-width: 64rem)');
				if (matches) {
					updateFlyoutState('open');
				}
			},
		});
	}, [updateFlyoutState, toggleButtonElement, isExpandedOnDesktop]);

	useEffect(() => {
		if (!toggleButtonElement) {
			return;
		}

		return bind(toggleButtonElement, {
			type: 'mouseleave',
			listener() {
				// If the side nav is not in flyout mode, we don't need to do anything
				if (!isFlyoutVisible) {
					return;
				}

				updateFlyoutState('waiting-for-close');
			},
		});
	}, [isFlyoutVisible, toggleButtonElement, updateFlyoutState]);

	useEffect(() => {
		if (!navRef.current) {
			return;
		}

		return bind(navRef.current, {
			type: 'mouseenter',
			listener() {
				// If the side nav is not in flyout mode, we don't need to do anything
				if (isExpandedOnDesktop || !isFlyoutVisible) {
					return;
				}

				// The user mouses has moused back over the side nav
				updateFlyoutState('open');
			},
		});
	}, [isFlyoutVisible, updateFlyoutState, isExpandedOnDesktop]);

	useEffect(() => {
		if (!navRef.current) {
			return;
		}

		return bind(navRef.current, {
			type: 'mouseleave',
			listener() {
				// If the side nav is not in flyout mode, we don't need to do anything
				if (!isFlyoutVisible) {
					return;
				}

				updateFlyoutState('waiting-for-close');
			},
		});
	}, [isFlyoutVisible, updateFlyoutState]);

	useEffect(() => {
		const nav = navRef.current;

		if (!nav) {
			return;
		}

		if (!isFlyoutVisible) {
			return;
		}

		// Using a monitor rather than a drop target. Rationale:
		// - We are not creating a drop target for the users to drop on,
		//   we are just interested in listening to events within an element
		// - We do not want to impact `location.{*}.dropTargets` in events
		return monitorForElements({
			canMonitor({ source }) {
				return nav.contains(source.element);
			},
			onGenerateDragPreview() {
				updateFlyoutState('drag-from-flyout-started');
			},
			onDrop({ location }) {
				// Always marking the drag and done
				updateFlyoutState('drag-from-flyout-finished');

				// If the user dropped outside of the flyout, we will close the flyout
				const underUsersPointer = document.elementFromPoint(
					location.current.input.clientX,
					location.current.input.clientY,
				);

				if (!nav.contains(underUsersPointer)) {
					updateFlyoutState('waiting-for-close');
				}
			},
		});
	}, [isFlyoutVisible, updateFlyoutState]);

	useEffect(() => {
		if (!topNavStartElement || !toggleButtonElement) {
			return;
		}

		return bind(topNavStartElement, {
			type: 'mouseover',
			listener(event) {
				// If the side nav is not in flyout mode, we don't need to do anything
				if (isExpandedOnDesktop || !isFlyoutVisible) {
					return;
				}

				if (event.target === topNavStartElement) {
					// The mouse is directly over the TopNavStart element, so cancel any pending flyout closes.
					updateFlyoutState('open');
					return;
				}

				if (event.target instanceof Element && toggleButtonElement.contains(event.target)) {
					// The mouse is over the toggle button or any of its children, so we don't want to close the flyout.
					// We also don't need to cancel any pending closes, as we have separate event listeners for the toggle button mouse events.
					return;
				}

				// The user has moused over a child element of the TopNavStart element that isn't the toggle button, e.g. the app switcher or nav logo,
				// so we should close the flyout (with a delay).
				updateFlyoutState('waiting-for-close');
			},
		});
	}, [
		topNavStartElement,
		isFlyoutVisible,
		toggleButtonElement,
		isExpandedOnDesktop,
		updateFlyoutState,
	]);

	useEffect(() => {
		if (!topNavStartElement) {
			return;
		}

		return bind(topNavStartElement, {
			type: 'mouseleave',
			listener() {
				// If the side nav is not in flyout mode, we don't need to do anything
				if (!isFlyoutVisible) {
					return;
				}

				// The mouse has left the TopNavStart element, so we should close the flyout with a delay.
				updateFlyoutState('waiting-for-close');
			},
		});
	}, [topNavStartElement, isFlyoutVisible, updateFlyoutState]);

	useEffect(() => {
		// Close the flyout if there are no more layers open and the user is not mousing over the
		// flyout areas (side nav, TopNavStart element)

		return openLayerObserver.onChange(
			({ count }) => {
				if (flyoutStateRef.current.type === 'ready-to-close' && count === 0) {
					updateFlyoutState('force-close');
				}
			},
			{ namespace: openLayerObserverSideNavNamespace },
		);
	}, [openLayerObserver, updateFlyoutState]);

	useEffect(() => {
		// Clear flyout close timer if being unmounted
		return function cleanupPendingFlyoutClose() {
			if (flyoutStateRef.current.type === 'waiting-for-close') {
				flyoutStateRef.current.abort();
			}
		};
	}, []);

	if (process.env.NODE_ENV !== 'production') {
		const visible: string[] = [];
		if (isExpandedOnMobile) {
			visible.push('small');
		}
		if (isExpandedOnDesktop) {
			visible.push('large');
		}
		if (isFlyoutVisible) {
			visible.push('flyout');
		}
		devTimeOnlyAttributes['data-visible'] = visible.length ? visible.join(',') : 'false';
	}

	useResizingWidthCssVarOnRootElement({
		isEnabled: true,
		cssVar: panelSplitterResizingVar,
		panelId: sideNavPanelSplitterId,
	});

	return (
		<nav
			id={id}
			{...devTimeOnlyAttributes}
			data-layout-slot
			aria-label={label}
			style={
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/enforce-style-prop
					[sideNavVar]: clampedWidth,
				} as CSSProperties
			}
			ref={mergedRef}
			css={[
				styles.root,
				fg('platform_design_system_nav4_sidenav_border') ? styles.newBorder : styles.oldBorder,
				// We are explicitly using the `isExpandedOnDesktop` and `isExpandedOnMobile` values here to ensure we are displaying the
				// correct state during SSR render, as the context value would not have been set yet. These values are derived from the
				// component props (defaultCollapsed) if context hasn't been set yet.
				isExpandedOnDesktop && !isExpandedOnMobile && !isFlyoutVisible && styles.hiddenMobileOnly,
				!isExpandedOnDesktop && isExpandedOnMobile && !isFlyoutVisible && styles.hiddenDesktopOnly,
				!isExpandedOnDesktop &&
					!isExpandedOnMobile &&
					!isFlyoutVisible &&
					styles.hiddenMobileAndDesktop,
				sideNavState?.flyout === 'open' && styles.flyoutOpen,
				sideNavState?.flyout === 'open' &&
					fg('platform_design_system_nav4_sidenav_border') &&
					styles.newBorderFlyoutOpen,
				sideNavState?.flyout === 'triggered-animate-close' && styles.flyoutAnimateClosed,
			]}
			data-testid={testId}
		>
			{/**
			 * This CSS var is used by the `Panel` slot to enforce its maximum width constraint.
			 * When we remove the UNSAFE legacy usage, we can change this to `HoistCssVarToLocalGrid`
			 */}
			<DangerouslyHoistCssVarToDocumentRoot
				variableName={sideNavLiveWidthVar}
				value="0px"
				mediaQuery={media.above.md}
				responsiveValue={
					isExpandedOnDesktop ? `var(${panelSplitterResizingVar}, ${clampedWidth})` : 0
				}
			/>
			{dangerouslyHoistSlotSizes && (
				// ------ START UNSAFE STYLES ------
				// These styles are only needed for the UNSAFE legacy use case for Jira + Confluence.
				// When they aren't needed anymore we can delete them wholesale.
				<DangerouslyHoistCssVarToDocumentRoot
					variableName={UNSAFE_sideNavLayoutVar}
					value={`var(${sideNavLiveWidthVar})`}
				/>
				// ------ END UNSAFE STYLES ------
			)}
			<PanelSplitterProvider
				panelId={sideNavPanelSplitterId}
				panelRef={navRef}
				panelWidth={width}
				onCompleteResize={setWidth}
				getResizeBounds={getResizeBounds}
				resizingCssVar={panelSplitterResizingVar}
				isEnabled={isExpandedOnDesktop && !isFlyoutVisible}
			>
				<div css={styles.flexContainer}>{children}</div>
			</PanelSplitterProvider>
		</nav>
	);
}

/**
 * The side navigation layout area. It will show on the left (inline start) of the screen.
 *
 * Use the side nav area components (`SideNavHeader`, `SideNavContent`, `SideNavFooter`) to position
 * content within areas of the side nav.
 *
 * You can optionally render a `PanelSplitter` as a child to make the side navigation slot resizable.
 */
export function SideNav({
	children,
	defaultCollapsed,
	defaultWidth = 320,
	testId,
	label, // Default value is defined in `SideNavInternal`
	skipLinkLabel = label, // Default value is defined in `SideNavInternal`
	onExpand,
	onCollapse,
	id,
}: SideNavProps) {
	return (
		<OpenLayerObserverNamespaceProvider namespace={openLayerObserverSideNavNamespace}>
			<SideNavInternal
				defaultCollapsed={defaultCollapsed}
				defaultWidth={defaultWidth}
				testId={testId}
				label={label}
				skipLinkLabel={skipLinkLabel}
				onExpand={onExpand}
				onCollapse={onCollapse}
				id={id}
			>
				{children}
			</SideNavInternal>
		</OpenLayerObserverNamespaceProvider>
	);
}
