/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { UNSAFE_useMediaQuery } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { TopNavStartAttachRef } from '../../../context/top-nav-start/top-nav-start-context';
import { SideNavToggleButtonSlotProvider } from '../side-nav/toggle-button-provider';
import { useSideNavVisibility } from '../side-nav/use-side-nav-visibility';

/**
 * Styles for the TopNavStart element.
 *
 * When `navx-full-height-sidebar` is enabled this is the styling for the inner element,
 * which re-enables pointer events.
 */
const innerStyles = cssMap({
	root: {
		// Taking up the full height of top bar to allow for monitoring mouse events, for improving the side nav flyout experience
		height: '100%',
		alignItems: 'center',
		display: 'flex',
		gap: token('space.050'),
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
 * This wrapper element is only rendered when `navx-full-height-sidebar` is enabled.
 */
const wrapperStyles = cssMap({
	root: {
		boxSizing: 'border-box',
	},
	fullHeightSidebar: {
		// Start padding is not applied to the top nav itself, to avoid misalignment with the side nav
		paddingInlineStart: token('space.150'),
	},
	fullHeightSidebarCollapsed: {
		'@media (min-width: 64rem)': {
			minWidth: '330px',
		},
	},
	fullHeightSidebarExpanded: {
		'@media (min-width: 64rem)': {
			width: `var(--n_sNvlw, 100%)`,
			paddingInlineEnd: token('space.200'),
		},
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
	 * After `platform_dst_nav4_full_height_sidebar_api_changes` rolls out,
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
		<div
			ref={ref}
			data-testid={testId}
			css={[
				wrapperStyles.root,
				wrapperStyles.fullHeightSidebar,
				isExpandedOnDesktop && wrapperStyles.fullHeightSidebarExpanded,
			]}
		>
			<div
				css={[
					innerStyles.root,
					innerStyles.fullHeightSidebar,
					isExpandedOnDesktop && innerStyles.fullHeightSidebarExpanded,
					fg('team25-eu-jira-logo-updates-csm-jsm') && innerStyles.jiraProductLogoUpdate,
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

	const TopNavStartInner = fg('navx-full-height-sidebar')
		? TopNavStartInnerFHS
		: TopNavStartInnerOld;

	return (
		<TopNavStartInner ref={elementRef} testId={testId}>
			{/* If FHS is not enabled, the toggle button is always at the start */}
			{!fg('navx-full-height-sidebar') && (
				<SideNavToggleButtonSlotProvider key={sideNavToggleButtonKey}>
					{sideNavToggleButton}
				</SideNavToggleButtonSlotProvider>
			)}
			{/**
			 * If FHS is enabled, the toggle button is at the start when:
			 *
			 * - on mobile (always)
			 * - collapsed on desktop
			 */}
			{sideNavToggleButton &&
				(!isDesktop || !isExpandedOnDesktop) &&
				fg('navx-full-height-sidebar') && (
					<SideNavToggleButtonSlotProvider key={sideNavToggleButtonKey}>
						{sideNavToggleButton}
					</SideNavToggleButtonSlotProvider>
				)}
			{children}
			{/* If FHS is enabled, the toggle button is at the end ONLY when expanded on desktop */}
			{sideNavToggleButton &&
				isDesktop &&
				isExpandedOnDesktop &&
				fg('navx-full-height-sidebar') && (
					<SideNavToggleButtonSlotProvider key={sideNavToggleButtonKey}>
						{sideNavToggleButton}
					</SideNavToggleButtonSlotProvider>
				)}
		</TopNavStartInner>
	);
}
