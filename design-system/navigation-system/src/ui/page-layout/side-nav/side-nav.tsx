/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { cssMap, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';
import { flushSync } from 'react-dom';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import useStableRef from '@atlaskit/ds-lib/use-stable-ref';
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
import { useIsFhsEnabled } from '../../fhs-rollout/use-is-fhs-enabled';
import {
	bannerMountedVar,
	contentHeightWhenFixed,
	contentInsetBlockStart,
	localSlotLayers,
	sideNavLiveWidthVar,
	sideNavPanelSplitterId,
	sideNavVar,
	topNavMountedVar,
	UNSAFE_sideNavLayoutVar,
} from '../constants';
import { DangerouslyHoistSlotSizes } from '../hoist-slot-sizes-context';
import { DangerouslyHoistCssVarToDocumentRoot } from '../hoist-utils';
import { useLayoutId } from '../id-utils';
import { PanelSplitterProvider } from '../panel-splitter/provider';
import type { ResizeBounds } from '../panel-splitter/types';
import type { CommonSlotProps } from '../types';
import { useResizingWidthCssVarOnRootElement } from '../use-resizing-width-css-var-on-root-element';
import { useSafeDefaultWidth } from '../use-safe-default-width';

import { useSideNavRef } from './element-context';
import { sideNavFlyoutCloseDelayMs } from './flyout-close-delay-ms';
import { useIsSideNavShortcutEnabled } from './is-side-nav-shortcut-enabled-context';
import { sideNavToggleTooltipKeyboardShortcut } from './side-nav-toggle-tooltip-keyboard-shortcut';
import { SideNavToggleButtonElement } from './toggle-button-context';
import { useExpandSideNav } from './use-expand-side-nav';
import { useSideNavToggleKeyboardShortcut } from './use-side-nav-toggle-keyboard-shortcut';
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

/**
 * We are using JS to detect Firefox and disable animations, instead of using CSS, as Compiled currently does not merge duplicate
 * CSS at-rules when at-rules are nested: https://github.com/atlassian-labs/compiled/blob/e04a325915e1d13010205089e4915de0e53bc2d4/packages/css/src/plugins/merge-duplicate-at-rules.ts#L5
 * Avoiding nesting the `@supports` at-rule inside of `@media` means Compiled can remove duplicate styles from the generated CSS.
 */
const isFirefox: boolean =
	typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

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
		// Not required, but declaring explicitly because we really don't want a border at small sizes
		// Previously we had a transparent border to maintain width, but this unintentionally acted as padding
		borderInlineStart: 'none',
		borderInlineEnd: 'none',
		'@media (min-width: 48rem)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			width: `var(${panelSplitterResizingVar}, var(${sideNavVar}))`,
		},
		'@media (min-width: 64rem)': {
			backgroundColor: token('elevation.surface'),
			boxShadow: 'initial',
			gridArea: 'side-nav',
			// We only want the border to be visible when it is not an overlay
			borderInlineEnd: `${token('border.width')} solid ${token('color.border')}`,
		},
	},
	flyoutOpen: {
		'@media (min-width: 64rem)': {
			// These styles are in a media query to override the `styles.root` media query styles
			backgroundColor: token('elevation.surface.overlay'),
			boxShadow: token('elevation.shadow.overlay'),
			gridArea: 'main',
			// Hide the border for the flyout, because it has a shadow
			borderInlineEnd: 'none',
		},
		// Disabling animations for Firefox, as it doesn't support the close animation. See comment block in `styles.animationBaseStyles` for more details.
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
		// Disabling animations for Firefox, as it doesn't support the close animation. See comment block in `styles.animationBaseStyles` for more details.
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
	animationRTLSupport: {
		// Used to support animations for right-to-left (RTL) languages/text direction. We need to flip the animation direction for RTL.
		// There are currently no logical properties for translate transforms: https://github.com/w3c/csswg-drafts/issues/1544
		// Instead, we are using a CSS variable to flip the translate value.
		'--animation-direction': '1',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		"[dir='rtl'] &": {
			'--animation-direction': '-1',
		},
	},
	flyoutBaseStylesFullHeightSidebar: {
		// These styles are shared between the open and close animations for flyout
		'@media (min-width: 64rem)': {
			// These styles are in a media query to override the `styles.root` media query styles
			backgroundColor: token('elevation.surface.overlay'),
			boxShadow: token('elevation.shadow.overlay'),
			gridArea: 'main',
			// Hide the border for the flyout, because it has a shadow
			borderInlineEnd: 'none',
		},
		'@media (prefers-reduced-motion: no-preference) and (min-width: 64rem)': {
			transitionProperty: 'transform, display',
			transitionBehavior: 'allow-discrete',
		},
	},
	flyoutOpenFullHeightSidebar: {
		'@media (prefers-reduced-motion: no-preference) and (min-width: 64rem)': {
			transitionDuration: '0.2s',
			transitionTimingFunction: 'cubic-bezier(0.6, 0, 0, 1)',

			/**
			 * Because we're transitioning from display: none, we need to define the
			 * starting values for when the element is first displayed, so the
			 * transition animation knows where to start from.
			 */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'@starting-style': {
				transform: 'translateX(calc(-100% * var(--animation-direction)))',
			},
		},
	},
	flyoutAnimateClosedFullHeightSidebar: {
		'@media (min-width: 64rem)': {
			display: 'none',
		},
		// Desktop media query is used here to prevent overriding mobile sidebar styles, if the flyout
		// was just closed, and then the user resized to mobile viewport with the mobile sidebar expanded.
		'@media (prefers-reduced-motion: no-preference) and (min-width: 64rem)': {
			transitionDuration: '0.2s',
			transitionTimingFunction: 'cubic-bezier(0, 0.4, 0, 1)',
			transform: 'translateX(calc(-100% * var(--animation-direction)))',
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
	animationBaseStyles: {
		/**
		 * Disabling animations if user has opted for reduced motion
		 *
		 * ⚠️ Note: the `@media` query needs to be a top-level style to make sure Compiled orders the media queries correctly.
		 * Compiled currently only sorts top-level CSS rules:
		 * https://github.com/atlassian-labs/compiled/blob/master/packages/css/src/plugins/sort-atomic-style-sheet.ts#L39
		 */
		'@media (prefers-reduced-motion: no-preference)': {
			transitionProperty: 'transform, display',
			transitionBehavior: 'allow-discrete',
			transitionDuration: '0.2s',
		},
	},
	expandAnimationMobile: {
		// These styles are not limited to "mobile" viewports, as they are not scoped to any media queries.
		// Desktop styles will need to override these if required.
		'@media (prefers-reduced-motion: no-preference)': {
			transitionTimingFunction: 'cubic-bezier(0.6, 0, 0, 1)',

			/**
			 * Because we're transitioning from display: none, we need to define the
			 * starting values for when the element is first displayed, so the
			 * transition animation knows where to start from.
			 */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'@starting-style': {
				transform: 'translateX(calc(-100% * var(--animation-direction)))',
			},
		},
	},
	collapseAnimationMobile: {
		// These styles are not limited to "mobile" viewports, as they are not scoped to any media queries.
		// Desktop styles will need to override these if required.
		'@media (prefers-reduced-motion: no-preference)': {
			gridArea: 'main',
			transitionTimingFunction: 'cubic-bezier(0, 0.4, 0, 1)',
		},

		// We need to explicitly limit setting the `transform` property to small viewports.
		// Unsetting the `transform` property with `transform: initial` on large viewports causes the whole
		// animation to be disabled.
		// Using `not` will flip the `min-width` condition. This is better than using `max-width` as it prevents an overlap
		'@media (prefers-reduced-motion: no-preference) and (not (min-width: 64rem))': {
			transform: 'translateX(calc(-100% * var(--animation-direction)))',
		},
	},
	expandAnimationDesktop: {
		'@media (prefers-reduced-motion: no-preference) and (min-width: 64rem)': {
			// We need to override the mobile styles for desktop
			gridArea: 'side-nav',
			transitionTimingFunction: 'cubic-bezier(0.6, 0, 0, 1)',

			/**
			 * Because we're transitioning from display: none, we need to define the
			 * starting values for when the element is first displayed, so the
			 * transition animation knows where to start from.
			 */
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'@starting-style': {
				transform: 'translateX(calc(-100% * var(--animation-direction)))',
			},
		},
	},
	collapseAnimationDesktop: {
		'@media (prefers-reduced-motion: no-preference) and (min-width: 64rem)': {
			gridArea: 'main',
			transitionTimingFunction: 'cubic-bezier(0, 0.4, 0, 1)',
			transform: 'translateX(calc(-100% * var(--animation-direction)))',
		},
	},
	fullHeightSidebar: {
		'@media (min-width: 64rem)': {
			// We want it to overlap the top nav
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			height: `calc(100vh - var(${bannerMountedVar}, 0px))`,

			// This is the stick point for the sticky positioning, only relevant if the whole page scrolls for some reason
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			insetBlockStart: `calc(var(${bannerMountedVar}, 0px))`,

			// Push the side nav items down, creating room for the top nav start items
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			paddingBlockStart: `calc(var(${topNavMountedVar}, 0px))`,

			// Bleed for the side nav to overlap the top nav, relevant for the initial positioning / when the whole page is not scrolled
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			marginBlockStart: `calc(-1 * var(${topNavMountedVar}, 0px))`,
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
	 * @deprecated
	 *
	 * This prop is being replaced by `defaultSideNavCollapsed` on the `Root` element,
	 * and will be removed in the future.
	 *
	 * ---
	 *
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
	 *
	 * It should be an integer between the resize bounds - the minimum is 240px and the maximum is 50% of the viewport width.
	 *
	 * It is only used when the side nav is first mounted, but you should continuously update your
	 * persisted state using the `onResizeEnd` callback of `PanelSplitter`, to ensure it is up to date
	 * when the app is reloaded.
	 */
	defaultWidth?: number;
	/**
	 * Called when the side nav is expanded.
	 *
	 * Note: The trigger parameter is only provided when the `platform_dst_nav4_fhs_instrumentation_1` feature flag is enabled.
	 */
	onExpand?: VisibilityCallback;
	/**
	 * Called when the side nav is collapsed.
	 *
	 * Note: The trigger parameter is only provided when the `platform_dst_nav4_fhs_instrumentation_1` feature flag is enabled.
	 */
	onCollapse?: VisibilityCallback;

	/**
	 * Called when the side nav begins peeking / flyout.
	 */
	onPeekStart?: () => void;
	/**
	 * Called when the side nav stops peeking / flyout.
	 */
	onPeekEnd?: (args: { trigger: 'mouse-leave' | 'side-nav-expand' }) => void;

	/**
	 * Whether the side nav should be toggled in response to the built-in keyboard shortcut. Use this callback to
	 * conditionally disable the shortcut based on your own custom checks, e.g. if there is a legacy dialog open.
	 *
	 * This prop will do nothing if `isSideNavShortcutEnabled` on Root is not set to `true`, as the keyboard event
	 * listener is only binded if `isSideNavShortcutEnabled` is `true`.
	 *
	 * The shortcut key is `Ctrl` + `[`.
	 *
	 * Note: The built-in keyboard shortcut is behind `useIsFhsEnabled`.
	 */
	canToggleWithShortcut?: () => boolean;
};

const fallbackDefaultWidth = 320;

export const onPeekStartDelayMs = 500;

/**
 * We need an additional component layer so we can wrap the side nav in a `OpenLayerObserver` and have access to the
 * context value.
 */
function SideNavInternal({
	children,
	defaultCollapsed,
	defaultWidth: defaultWidthProp = fallbackDefaultWidth,
	testId,
	label = 'Sidebar',
	skipLinkLabel = label,
	onExpand,
	onCollapse,
	onPeekStart,
	onPeekEnd,
	id: providedId,
	canToggleWithShortcut,
}: SideNavProps) {
	const isFhsEnabled = useIsFhsEnabled();
	const id = useLayoutId({ providedId });
	const expandSideNav = useExpandSideNav({ trigger: 'skip-link' });
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

	const { createAnalyticsEvent } = useAnalyticsEvents();

	const [initialIsExpandedOnDesktop] = useState(isExpandedOnDesktop);

	/**
	 * Captures the initial collapsed/expanded state of the side nav.
	 *
	 * Only firing on desktop because the nav is never open by default on mobile.
	 */
	useEffect(() => {
		if (initialIsExpandedOnDesktop && fg('platform_dst_nav4_fhs_instrumentation_1')) {
			const isDesktop = window.matchMedia('(min-width: 64rem)').matches;
			if (isDesktop) {
				const navigationAnalyticsEvent = createAnalyticsEvent({
					source: 'topNav',
					actionSubject: 'sideNav',
					action: 'viewedOnLoad',
					actionSubjectId: 'sideNavMenu',
					attributes: {
						screen: 'desktop',
					},
				});

				navigationAnalyticsEvent.fire('navigation');
			}
		}
	}, [createAnalyticsEvent, initialIsExpandedOnDesktop]);

	const defaultWidth = useSafeDefaultWidth({
		defaultWidthProp,
		fallbackDefaultWidth,
		slotName: 'SideNav',
	});

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

	const isExpandedOnDesktopRef = useStableRef(isExpandedOnDesktop);
	const hasPeekStartedRef = useRef(false);
	const onPeekStartRef = useStableRef(onPeekStart);
	const onPeekEndRef = useStableRef(onPeekEnd);

	const onPeekStartTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => {
		return () => {
			clearTimeout(onPeekStartTimeoutIdRef.current);
		};
	}, []);

	const updateFlyoutState = useMemo(() => {
		function tryAbortPendingClose() {
			if (flyoutStateRef.current.type === 'waiting-for-close') {
				flyoutStateRef.current.abort();
			}
		}

		function open() {
			const prevFlyoutState = flyoutStateRef.current;

			tryAbortPendingClose();
			flyoutStateRef.current = { type: 'open' };
			setSideNavState((currentState) => {
				if (currentState?.desktop === 'collapsed' && currentState?.flyout !== 'open') {
					return {
						...currentState,
						flyout: 'open',
					};
				}

				return currentState;
			});

			// Avoid redundant calls to `onPeekStart()`
			if (prevFlyoutState.type === 'not-active') {
				clearTimeout(onPeekStartTimeoutIdRef.current);
				onPeekStartTimeoutIdRef.current = setTimeout(() => {
					// If the flyout isn't still open after ~500ms then we won't count the peek
					// As we want to track user intention rather than all hovers
					if (isExpandedOnDesktopRef.current || flyoutStateRef.current.type !== 'open') {
						return;
					}

					hasPeekStartedRef.current = true;
					onPeekStartRef.current?.();
				}, onPeekStartDelayMs);
			}
		}

		function close() {
			const prevFlyoutState = flyoutStateRef.current;

			tryAbortPendingClose();
			flyoutStateRef.current = { type: 'not-active' };
			setSideNavState((currentState) => {
				if (currentState?.desktop === 'collapsed' && currentState?.flyout === 'open') {
					return {
						...currentState,
						flyout: 'triggered-animate-close',
					};
				}

				return currentState;
			});

			// Avoid redundant calls to `onPeekEnd()`
			if (prevFlyoutState.type !== 'not-active' && hasPeekStartedRef.current) {
				hasPeekStartedRef.current = false;
				onPeekEndRef.current?.({
					trigger: isExpandedOnDesktopRef.current ? 'side-nav-expand' : 'mouse-leave',
				});
			}
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
				if (openLayerObserver?.getCount({ namespace: openLayerObserverSideNavNamespace }) === 0) {
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
	}, [isExpandedOnDesktopRef, onPeekEndRef, onPeekStartRef, openLayerObserver, setSideNavState]);

	const toggleVisibilityByScreenResize = useToggleSideNav({ trigger: 'screen-resize' });
	const toggleVisibilityByClickOutsideOnMobile = useToggleSideNav({
		trigger: 'click-outside-on-mobile',
	});

	useEffect(() => {
		if (fg('platform_dst_nav4_side_nav_default_collapsed_api')) {
			// This is the old version of the hook, so we skip it when the flag is enabled
			return;
		}

		// Sync the visibility in context (provided in `<Root>`) with the local `defaultCollapsed` prop provided to `SideNav`
		// after SSR hydration. This should only run once, after the initial render on the client.
		setSideNavState({
			desktop: initialDefaultCollapsed ? 'collapsed' : 'expanded',
			mobile: 'collapsed',
			flyout: 'closed',
			lastTrigger: null,
		});
	}, [initialDefaultCollapsed, setSideNavState]);

	// Moving to `useLayoutEffect` so that there's no visual shift in non-SSR environments when using legacy API
	// For SSR the new API is still necessary
	useLayoutEffect(() => {
		if (!fg('platform_dst_nav4_side_nav_default_collapsed_api')) {
			// This is the new version of the hook, so we skip it when the flag is disabled
			return;
		}

		if (sideNavState !== null) {
			// Only need to do an initial sync if it hasn't been initialized from Root
			return;
		}

		// Sync the visibility in context (provided in `<Root>`) with the local `defaultCollapsed` prop provided to `SideNav`
		// after SSR hydration. This should only run once, after the initial render on the client.
		setSideNavState({
			desktop: initialDefaultCollapsed ? 'collapsed' : 'expanded',
			mobile: 'collapsed',
			flyout: 'closed',
			lastTrigger: null,
		});
	}, [initialDefaultCollapsed, setSideNavState, sideNavState]);

	const handleExpand = useCallback<VisibilityCallback>(
		({ screen, trigger }) => {
			if (fg('platform_dst_nav4_fhs_instrumentation_1')) {
				onExpand?.({ screen, trigger });

				const navigationAnalyticsEvent = createAnalyticsEvent({
					source: 'topNav',
					actionSubject: 'sideNav',
					action: 'expanded',
					actionSubjectId: 'sideNavMenu',
					attributes: {
						trigger,
					},
				});

				navigationAnalyticsEvent.fire('navigation');
			} else {
				onExpand?.({ screen });
			}

			// When the side nav gets expanded, we close the flyout to reset it.
			// This prevents the flyout from staying open and ensures we are respecting the user's intent to expand.
			updateFlyoutState('force-close');
		},
		[onExpand, updateFlyoutState, createAnalyticsEvent],
	);

	const handleCollapse = useCallback<VisibilityCallback>(
		({ screen, trigger }) => {
			if (fg('platform_dst_nav4_fhs_instrumentation_1')) {
				onCollapse?.({ screen, trigger });

				const navigationAnalyticsEvent = createAnalyticsEvent({
					source: 'topNav',
					actionSubject: 'sideNav',
					action: 'collapsed',
					actionSubjectId: 'sideNavMenu',
					attributes: {
						trigger,
					},
				});

				navigationAnalyticsEvent.fire('navigation');
			} else {
				onCollapse?.({ screen });
			}

			// When the side nav gets collapsed, we close the flyout to reset it.
			// This prevents the flyout from staying open and ensures we are respecting the user's intent to collapse.
			updateFlyoutState('force-close');
		},
		[onCollapse, updateFlyoutState, createAnalyticsEvent],
	);

	useSideNavVisibilityCallbacks({
		onExpand: handleExpand,
		onCollapse: handleCollapse,
		isExpandedOnDesktop,
		isExpandedOnMobile,
		lastTrigger: sideNavState?.lastTrigger ?? null,
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
						toggleVisibilityByScreenResize();
					}
				}
			},
		});
	}, [toggleVisibilityByScreenResize, isExpandedOnDesktop, isExpandedOnMobile]);

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

				if (!event.target.isConnected) {
					/**
					 * If the element that was clicked is no longer in the document, we should not collapse the side nav.
					 * This can happen when the user clicks on a dropdown menu item (such as one used in a `...` More menu),
					 * as the dropdown menu will close after being clicked. By the time this event listener runs, the clicked
					 * element will no longer be in the document, so the check below for `sideNav.contains(event.target)` will fail.
					 */
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

				toggleVisibilityByClickOutsideOnMobile();
			},
		});
	}, [id, isExpandedOnMobile, toggleButtonElement, toggleVisibilityByClickOutsideOnMobile]);

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

		return openLayerObserver?.onChange(
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

	useSideNavToggleKeyboardShortcut({ canToggleWithShortcut });
	// Used to conditionally display the keyboard shortcut in the SideNavPanelSplitter tooltip.
	const isShortcutEnabled = useIsSideNavShortcutEnabled();

	useResizingWidthCssVarOnRootElement({
		isEnabled: true,
		cssVar: panelSplitterResizingVar,
		panelId: sideNavPanelSplitterId,
	});

	const isFlyoutClosed = sideNavState?.flyout === 'closed' || sideNavState?.flyout === undefined;

	const isExpandedStateDifferentFromInitial =
		isExpandedOnMobile || isExpandedOnDesktop !== initialIsExpandedOnDesktop;

	/**
	 * Used to track (between renders) if the expanded state of the side nav has ever changed since mount.
	 *
	 * Cannot rely solely on `isExpandedStateDifferentFromInitial` because the expanded state can go back to the initial state.
	 */
	const hasExpandedStateChangedRef = useRef(false);

	useEffect(() => {
		if (hasExpandedStateChangedRef.current) {
			return;
		}

		if (isExpandedStateDifferentFromInitial) {
			hasExpandedStateChangedRef.current = true;
		}
	}, [isExpandedStateDifferentFromInitial]);

	/**
	 * If the expanded state of the side nav has ever changed since mount.
	 *
	 * Used to prevent sidebar expand animations from running on the initial load.
	 * Otherwise, the `@starting-style` rule will cause the sidebar to slide in initially.
	 */
	const hasExpandedStateChanged =
		isExpandedStateDifferentFromInitial || hasExpandedStateChangedRef.current;

	// This is only used for the regular expand and collapse animations, not the flyout animations.
	const shouldShowSidebarToggleAnimation =
		isFhsEnabled &&
		// We do not apply the animation styles on the initial render, as the `@starting-style` rule will cause the sidebar to
		// slide in initially.
		hasExpandedStateChanged &&
		// We also do not apply the animation styles if the side nav is in flyout mode to make sure we don't override flyout styles.
		// If we instead try to unset the `transform` property in the flyout styles using `transform: initial`, it results in the entire
		// flyout animation being disabled.
		!isFlyoutVisible &&
		/**
		 * Disabling animations for Firefox, as it doesn't support animating the `display` property:
		 * https://caniuse.com/mdn-css_properties_display_is_transitionable
		 *
		 * As of October 2025, Firefox supports the expand animation, but not the collapse animation (it instantly changes to `display: none`).
		 * Because of this, we are disabling all sidebar animations for Firefox so it doesn't look like a bug.
		 *
		 * Unfortunately we cannot use `@supports` to target the support of `transition-behavior: allow-discrete` specifically
		 * for the `display` property. And `@supports at-rule(@starting-style)` is also not ready for browser use yet.
		 *
		 * We are using JS to detect Firefox and disable animations, instead of using CSS, as Compiled currently does not merge duplicate
		 * CSS at-rules when at-rules are nested: https://github.com/atlassian-labs/compiled/blob/e04a325915e1d13010205089e4915de0e53bc2d4/packages/css/src/plugins/merge-duplicate-at-rules.ts#L5
		 * Avoiding nesting the `@supports` at-rule inside of `@media` means Compiled can remove duplicate styles from the generated CSS.
		 */
		!isFirefox;

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
				// We are explicitly using the `isExpandedOnDesktop` and `isExpandedOnMobile` values here to ensure we are displaying the
				// correct state during SSR render, as the context value would not have been set yet. These values are derived from the
				// component props (defaultCollapsed) if context hasn't been set yet.
				isExpandedOnDesktop && !isExpandedOnMobile && !isFlyoutVisible && styles.hiddenMobileOnly,
				!isExpandedOnDesktop && isExpandedOnMobile && !isFlyoutVisible && styles.hiddenDesktopOnly,
				!isExpandedOnDesktop &&
					!isExpandedOnMobile &&
					!isFlyoutVisible &&
					styles.hiddenMobileAndDesktop,

				isFhsEnabled && styles.animationRTLSupport,
				// Expand/collapse animation styles
				shouldShowSidebarToggleAnimation && styles.animationBaseStyles,
				// We need to separately apply the styles for the expand or collapse animations for both mobile and desktop
				// based on their relevant expansion state.
				isExpandedOnMobile && shouldShowSidebarToggleAnimation && styles.expandAnimationMobile,
				!isExpandedOnMobile && shouldShowSidebarToggleAnimation && styles.collapseAnimationMobile,
				isExpandedOnDesktop && shouldShowSidebarToggleAnimation && styles.expandAnimationDesktop,
				!isExpandedOnDesktop && shouldShowSidebarToggleAnimation && styles.collapseAnimationDesktop,

				// Flyout styles
				sideNavState?.flyout === 'open' && !isFhsEnabled && styles.flyoutOpen,
				sideNavState?.flyout === 'triggered-animate-close' &&
					!isFhsEnabled &&
					styles.flyoutAnimateClosed,

				(sideNavState?.flyout === 'open' || sideNavState?.flyout === 'triggered-animate-close') &&
					!isFirefox &&
					isFhsEnabled &&
					styles.flyoutBaseStylesFullHeightSidebar,
				sideNavState?.flyout === 'triggered-animate-close' &&
					!isFirefox &&
					isFhsEnabled &&
					styles.flyoutAnimateClosedFullHeightSidebar,
				sideNavState?.flyout === 'open' &&
					!isFirefox &&
					isFhsEnabled &&
					styles.flyoutOpenFullHeightSidebar,
				sideNavState?.flyout === 'triggered-animate-close' &&
					!isFirefox &&
					isFhsEnabled &&
					styles.flyoutAnimateClosedFullHeightSidebar,
				// Flyout is not using full height styles
				isFlyoutClosed && isFhsEnabled && styles.fullHeightSidebar,
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
				shortcut={isShortcutEnabled ? sideNavToggleTooltipKeyboardShortcut : undefined}
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
	onPeekStart,
	onPeekEnd,
	canToggleWithShortcut,
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
				onPeekStart={onPeekStart}
				onPeekEnd={onPeekEnd}
				id={id}
				canToggleWithShortcut={canToggleWithShortcut}
			>
				{children}
			</SideNavInternal>
		</OpenLayerObserverNamespaceProvider>
	);
}
