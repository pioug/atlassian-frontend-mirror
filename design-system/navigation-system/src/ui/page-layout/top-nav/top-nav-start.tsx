/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import useStableRef from '@atlaskit/ds-lib/use-stable-ref';
import { fg } from '@atlaskit/platform-feature-flags';
import { UNSAFE_useMediaQuery } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { TopNavStartAttachRef } from '../../../context/top-nav-start/top-nav-start-context';
import { useIsFhsEnabled } from '../../fhs-rollout/use-is-fhs-enabled';
import { useSideNavVisibility } from '../side-nav/use-side-nav-visibility';
import { SideNavVisibilityState } from '../side-nav/visibility-context';

/**
 * Firefox does support these reorder animations, but only partially enabling layout animations would look odd.
 *
 * We are using JS to detect Firefox and disable animations, instead of using CSS, as Compiled currently does not merge duplicate
 * CSS at-rules when at-rules are nested: https://github.com/atlassian-labs/compiled/blob/e04a325915e1d13010205089e4915de0e53bc2d4/packages/css/src/plugins/merge-duplicate-at-rules.ts#L5
 * Avoiding nesting the `@supports` at-rule inside of `@media` means Compiled can remove duplicate styles from the generated CSS.
 */
const isFirefox: boolean =
	typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

// Placed in a variable, as the value is used in the translateX value for the children wrapper animation.
const flexGap = token('space.050');

/**
 * Styles for the TopNavStart element.
 *
 * When `useIsFhsEnabled` is true this is the styling for the inner element,
 * which re-enables pointer events.
 */
const innerStyles = cssMap({
	root: {
		// Taking up the full height of top bar to allow for monitoring mouse events, for improving the side nav flyout experience
		height: '100%',
		alignItems: 'center',
		display: 'flex',
		gap: flexGap,
		gridColumn: 1,
		// Sets a minimum width on the content so that it aligns with the side nav (when side nav is at default width)
		'@media (min-width: 64rem)': {
			// Intrinsic width of content without wrapping
			// The actual grid column can still be larger
			width: 'max-content',
			/**
			 * Using `300px` because:
			 *
			 * - Side nav default width is `320px`
			 * - Top bar has `12px` padding on each side
			 * - There is an `8px` gap between TopNavStart and TopNavMiddle
			 *
			 * So `320px` - (`12px` + `8px`) = `300px`
			 */
			minWidth: '300px',
			// We want the specified width to be inclusive of padding
			boxSizing: 'border-box',
		},
	},
	jiraProductLogoUpdate: {
		'@media (min-width: 64rem)': {
			// Jira product logo update, added 30px for CSM logo as the size is larger than the default
			// https://jplat.atlassian.net/browse/BLU-8440
			minWidth: '330px',
		},
	},
	fullHeightSidebar: {
		// Pointer events are disabled on the top nav
		// So we need to restore them for the slot
		pointerEvents: 'auto',
	},
	fullHeightSidebarExpanded: {
		'@media (min-width: 64rem)': {
			// When the full height sidebar is visible, the regular min width should not be applied
			// Otherwise the slot covers the side nav panel splitter
			minWidth: 'unset',
			width: '100%',
		},
	},
});

/**
 * Styles for the outer element, that does not have re-enabled pointer events and spans the entire
 * width of the TopNavStart area.
 *
 * This wrapper element is only rendered when `useIsFhsEnabled` is true.
 */
const wrapperStyles = cssMap({
	root: {
		boxSizing: 'border-box',
		// Start padding is not applied to the top nav itself, to avoid misalignment with the side nav
		paddingInlineStart: token('space.150'),
		// Taking up the full height of top bar to allow for monitoring mouse events, for improving the side nav flyout experience
		height: '100%',
	},
	fullHeightSidebarExpanded: {
		'@media (min-width: 64rem)': {
			width: `var(--n_sNvlw, 100%)`,
			paddingInlineEnd: token('space.200'),
		},
	},
});

/**
 * We use a fixed translateX offset for the slide animation (used when the TopNavStart children elements are reordered).
 * This fixed offset makes the elements appear to animate smoothly from the old to the new position.
 * This offset is calculated based on:
 * - 32px (2rem) width of the side nav toggle button (IconButton)
 * - 4px gap ('space.050' token) of the flex container
 *
 * The benefit of hardcoding this offset is that we don't need to calculate it using JS each time the sidebar is toggled.
 * However, it could become out of sync if the width of IconButton changes.
 *
 * The alternative is using JS to store the previous position of the children wrapper element, and calculate the offset based on
 * the new position, and then transforming using that offset. This would prevent the animation from going out of sync.
 */
const childrenWrapperAnimationOffset = `calc(2rem + ${flexGap})`;

const childrenWrapperStyles = cssMap({
	root: {
		// Follow the same flex styles as parent (top nav start element)
		display: 'inherit',
		gap: 'inherit',
		alignItems: 'center',
		// Allow the flex item to shrink. Otherwise it will stay at min-content size, causing overflow out of the TopNavStart flex container.
		minWidth: 0,
		// Used to support animations for right-to-left (RTL) languages/text direction. We need to flip the animation direction for RTL.
		// There are currently no logical properties for translate transforms: https://github.com/w3c/csswg-drafts/issues/1544
		// Instead, we are using a CSS variable to flip the translate value.
		'--animation-direction': '1',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		"[dir='rtl'] &": {
			'--animation-direction': '-1',
		},
	},
	animationBaseStyles: {
		// Disabling animations if user has opted for reduced motion
		'@media (prefers-reduced-motion: no-preference)': {
			transitionProperty: 'transform',
		},
	},
	finalPosition: {
		'@media (prefers-reduced-motion: no-preference)': {
			transform: 'translateX(0rem)',
			transitionDuration: '0.2s',
		},
	},
	expandAnimationStartPosition: {
		'@media (prefers-reduced-motion: no-preference)': {
			transform: `translateX(calc(${childrenWrapperAnimationOffset} * var(--animation-direction)))`,
		},
	},
	collapseAnimationStartPosition: {
		'@media (prefers-reduced-motion: no-preference)': {
			transform: `translateX(calc(-1 * ${childrenWrapperAnimationOffset} * var(--animation-direction)))`,
		},
	},
});

/**
 * We use a fixed translateX offset for the toggle button slide animation (used when the TopNavStart children elements are reordered).
 * The specific value doesn't matter too much for the toggle button animation, so we are using `100%`, which will match the toggle button width.
 *
 * By combining the `translateX` animation with an `opacity` fade, the feel and experience is actually quite similar to animating the
 * element from the exact old position (offset), and it avoids the additional complexity of needing to track and calculate the exact offset.
 */
const toggleButtonWrapperStyles = cssMap({
	root: {
		'@media (prefers-reduced-motion: no-preference)': {
			transitionProperty: 'transform, opacity',
		},
		// Used to support animations for right-to-left (RTL) languages/text direction. We need to flip the animation direction for RTL.
		// There are currently no logical properties for translate transforms: https://github.com/w3c/csswg-drafts/issues/1544
		// Instead, we are using a CSS variable to flip the translate value.
		'--animation-direction': '1',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		"[dir='rtl'] &": {
			'--animation-direction': '-1',
		},
	},
	finalPosition: {
		'@media (prefers-reduced-motion: no-preference)': {
			transform: 'translateX(0rem)',
			transitionDuration: '0.2s',
			opacity: 1,
		},
	},
	expandAnimationStartPosition: {
		'@media (prefers-reduced-motion: no-preference)': {
			transform: 'translateX(calc(-100% * var(--animation-direction)))',
			opacity: 0,
		},
	},
	collapseAnimationStartPosition: {
		'@media (prefers-reduced-motion: no-preference)': {
			transform: 'translateX(calc(100% * var(--animation-direction)))',
			opacity: 0,
		},
	},
	expandAnimationTimingFunction: {
		'@media (prefers-reduced-motion: no-preference)': {
			// This timing function feels most aligned with the sidebar slide in (expand) animation
			transitionTimingFunction: 'ease-in-out',
		},
	},
	collapseAnimationTimingFunction: {
		'@media (prefers-reduced-motion: no-preference)': {
			// This timing function feels most aligned with the sidebar slide out (collapse) animation
			transitionTimingFunction: 'ease',
		},
	},
	alignEnd: {
		// Align the toggle button to the end when FHS is expanded
		marginInlineStart: 'auto',
	},
});

/**
 * The consistent key used for the side nav toggle button to ensure it does not get remounted
 * when it is reordered.
 *
 * This ensures we get focus restoration for free.
 */
const sideNavToggleButtonKey = 'side-nav-toggle-button';

type TopNavStartProps = {
	/**
	 * The content of the layout area.
	 *
	 * Should contain `SideNavToggleButton`, `AppSwitcher`, and `AppLogo`/`CustomLogo` components.
	 */
	children: React.ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Slot for the side nav toggle button.
	 *
	 * You should only render `<SideNavToggleButton>` inside this slot, not as a child.
	 *
	 * After `platform_dst_nav4_side_nav_toggle_button_slot` rolls out,
	 * this prop will become required.
	 *
	 * Consumers that do not need a toggle button can explicitly pass `null`.
	 */
	sideNavToggleButton?: React.ReactNode;
};

const TopNavStartInnerOld = forwardRef(function TopNavStartInner(
	{ children, testId }: Pick<TopNavStartProps, 'children' | 'testId'>,
	ref: React.ForwardedRef<HTMLDivElement>,
) {
	return (
		<div
			ref={ref}
			data-testid={testId}
			css={[
				innerStyles.root,
				fg('team25-eu-jira-logo-updates-csm-jsm') && innerStyles.jiraProductLogoUpdate,
			]}
		>
			{children}
		</div>
	);
});

const TopNavStartInnerFHS = forwardRef(function TopNavStartInnerFHS(
	{ children, testId }: Pick<TopNavStartProps, 'children' | 'testId'>,
	ref: React.ForwardedRef<HTMLDivElement>,
) {
	// This needs the real `defaultCollapsed` state or will not SSR properly
	// TODO: lift `defaultCollapsed` state to `Root` (DSP-23683)
	// then context value will be correct in SSR / from initial render
	const { isExpandedOnDesktop } = useSideNavVisibility({ defaultCollapsed: true });

	return (
		<div css={[wrapperStyles.root, isExpandedOnDesktop && wrapperStyles.fullHeightSidebarExpanded]}>
			<div
				ref={ref}
				data-testid={testId}
				css={[
					innerStyles.root,
					innerStyles.fullHeightSidebar,
					// Needs to be before the expanded styles so that the min-width can be unset
					fg('team25-eu-jira-logo-updates-csm-jsm') && innerStyles.jiraProductLogoUpdate,
					isExpandedOnDesktop && innerStyles.fullHeightSidebarExpanded,
				]}
			>
				{children}
			</div>
		</div>
	);
});

/**
 * __TopNavStart__
 *
 * Wrapper for the top navigation actions on the inline-start (left) side of the top navigation.
 */
export function TopNavStart({ children, testId, sideNavToggleButton }: TopNavStartProps) {
	const isFhsEnabled = useIsFhsEnabled();
	const ref = useContext(TopNavStartAttachRef);
	const elementRef = useRef(null);

	// FIXME: unsafe pattern with Suspense, should use callback ref / store in state
	// Should handle the underlying HTMLElement changing without a remount
	useEffect(() => {
		ref(elementRef.current);
	}, [elementRef, ref]);

	// This needs the real `defaultCollapsed` state or will not SSR properly
	// TODO: lift `defaultCollapsed` state to `Root` (DSP-23683)
	// then context value will be correct in SSR / from initial render
	const { isExpandedOnDesktop } = useSideNavVisibility({ defaultCollapsed: true });

	// For SSR assume desktop
	const [isDesktop, setIsDesktop] = useState(true);
	// Set state to real value on client
	// This could result in some visible shift on mobile when hydrating SSR
	// TODO: review and improve SSR behavior as necessary (DSP-23817)
	useLayoutEffect(() => {
		// Checking this to avoid breaking tests when `matchMedia` is not mocked
		// Ideally we wouldn't cater to test environments, but this avoids introducing unnecessary friction
		if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
			setIsDesktop(window.matchMedia('(min-width: 64rem)').matches);
		}
	}, []);

	UNSAFE_useMediaQuery('above.md', (event) => {
		setIsDesktop(event.matches);
	});

	const [animationState, setAnimationState] = useState<{
		type: 'idle' | 'expand' | 'collapse';
	}>({
		type: 'idle',
	});

	// Used to prevent the reorder animations from running on the initial render.
	const isFirstRenderRef = useRef(true);

	const sideNavState = useContext(SideNavVisibilityState);

	useEffect(() => {
		if (!isFhsEnabled) {
			return;
		}

		// Ignore renders until the side nav state is initialized
		// So that apps using the legacy API for setting side nav default state do not see
		// animations when they shouldn't
		if (sideNavState === null) {
			return;
		}

		if (isFirstRenderRef.current) {
			isFirstRenderRef.current = false;
		}
	}, [isFhsEnabled, sideNavState]);

	// Using a stable ref to avoid re-running the animation layout effect when the toggle button prop value changes, which
	// can happen a lot (e.g. if the parent re-renders)
	const sideNavToggleButtonStableRef = useStableRef(sideNavToggleButton);

	useLayoutEffect(() => {
		if (!isFhsEnabled) {
			return;
		}

		/**
		 * This layout effect is used to animate the TopNavStart children elements to their new position after being reordered.
		 * It is called when the sidebar's desktop expansion state changes.
		 *
		 * It works by first setting a translateX offset on the elements, used as the start position of the slide animation.
		 * - For the toggle button, it's a fixed offset. It's combined with an opacity, so the exact offset doesn't matter too much.
		 * - For the children wrapper (wrapping everything except the toggle button), an offset was chosen to make the animation
		 * start position the exact same as the element's old position. See comments for `childrenWrapperStyles` for more details.
		 *
		 * On the next frame, the translateX offset is cleared, triggering the animation to the new position.
		 */

		if (isFirstRenderRef.current) {
			// No animations on initial render.
			return;
		}

		if (!sideNavToggleButtonStableRef.current) {
			// If there is no toggle button, there should be no re-order animations.
			return;
		}

		// Set the translateX offsets so elements are ready to animate to their actual new position after being reordered
		setAnimationState({
			type: isExpandedOnDesktop ? 'expand' : 'collapse',
		});

		requestAnimationFrame(() => {
			// Clear translateX offsets on next frame to trigger animation to new position in a re-render
			setAnimationState({ type: 'idle' });
		});

		// This layout effect is called when the sidebar's desktop expansion state changes.
	}, [isExpandedOnDesktop, isFhsEnabled, sideNavToggleButtonStableRef]);

	const TopNavStartInner = isFhsEnabled ? TopNavStartInnerFHS : TopNavStartInnerOld;

	return (
		<TopNavStartInner ref={elementRef} testId={testId}>
			{/* If FHS is not enabled, the toggle button is always at the start */}
			{!isFhsEnabled && sideNavToggleButton}
			{/**
			 * If FHS is enabled, the toggle button is at the start when:
			 *
			 * - on mobile (always)
			 * - collapsed on desktop
			 */}
			{sideNavToggleButton && (!isDesktop || !isExpandedOnDesktop) && isFhsEnabled && (
				<div
					key={sideNavToggleButtonKey}
					css={[
						!isFirefox && toggleButtonWrapperStyles.root,
						!isFirefox && animationState.type === 'idle' && toggleButtonWrapperStyles.finalPosition,
						!isFirefox &&
							// Timing function is applied when the browser animates to the idle position.
							animationState.type === 'idle' &&
							toggleButtonWrapperStyles.collapseAnimationTimingFunction,
						!isFirefox &&
							animationState.type === 'collapse' &&
							toggleButtonWrapperStyles.collapseAnimationStartPosition,
					]}
				>
					{sideNavToggleButton}
				</div>
			)}
			{isFhsEnabled ? (
				// Wrapper element is used to animate the TopNavStart children content to its new position during
				// the sidebar toggle animation.
				<div
					css={[
						childrenWrapperStyles.root,
						!isFirefox && childrenWrapperStyles.animationBaseStyles,
						!isFirefox && animationState.type === 'idle' && childrenWrapperStyles.finalPosition,
						!isFirefox &&
							animationState.type === 'expand' &&
							childrenWrapperStyles.expandAnimationStartPosition,
						!isFirefox &&
							animationState.type === 'collapse' &&
							childrenWrapperStyles.collapseAnimationStartPosition,
					]}
				>
					{children}
				</div>
			) : (
				children
			)}
			{/* If FHS is enabled, the toggle button is at the end ONLY when expanded on desktop */}
			{sideNavToggleButton && isDesktop && isExpandedOnDesktop && isFhsEnabled && (
				<div
					key={sideNavToggleButtonKey}
					css={[
						!isFirefox && toggleButtonWrapperStyles.root,
						toggleButtonWrapperStyles.alignEnd,
						!isFirefox && animationState.type === 'idle' && toggleButtonWrapperStyles.finalPosition,
						!isFirefox &&
							// Timing function is applied when the browser animates to the idle position.
							animationState.type === 'idle' &&
							toggleButtonWrapperStyles.expandAnimationTimingFunction,
						!isFirefox &&
							animationState.type === 'expand' &&
							toggleButtonWrapperStyles.expandAnimationStartPosition,
					]}
				>
					{sideNavToggleButton}
				</div>
			)}
		</TopNavStartInner>
	);
}
