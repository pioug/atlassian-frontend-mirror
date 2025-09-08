/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useContext, useEffect, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { TopNavStartAttachRef } from '../../../context/top-nav-start/top-nav-start-context';
import { useSideNavVisibility } from '../side-nav/use-side-nav-visibility';

const styles = cssMap({
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
	fullHeightSidebar: {
		// Using width to provide the end padding
		// To avoid this element covering the resize grab area
		maxWidth: `calc(100% - ${token('space.200')})`,
		// Start padding is not applied to the top nav itself, to avoid misalignment with the side nav
		paddingInlineStart: token('space.150'),
		// Pointer events are disabled on the top nav
		// So we need to restore them for the slot
		pointerEvents: 'auto',
	},
	// When the full height sidebar is visible, the regular 300px min width should not be applied
	// Otherwise the slot covers the side nav panel splitter
	fullHeightSidebarExpanded: {
		'@media (min-width: 64rem)': {
			minWidth: 'unset',
		},
	},
});

/**
 * __TopNavStart__
 *
 * Wrapper for the top navigation actions on the inline-start (left) side of the top navigation.
 */
export function TopNavStart({
	children,
	testId,
}: {
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
}) {
	const ref = useContext(TopNavStartAttachRef);
	const elementRef = useRef(null);

	useEffect(() => {
		if (fg('platform_fix_component_state_update_for_suspense')) {
			ref(elementRef.current);
		}
	}, [elementRef, ref]);

	// Need to use `{ defaultCollapsed: true }` otherwise when there is no side nav mounted this never becomes false
	const { isExpandedOnDesktop } = useSideNavVisibility({ defaultCollapsed: true });

	return (
		<div
			css={[
				styles.root,
				fg('navx-full-height-sidebar') && styles.fullHeightSidebar,
				isExpandedOnDesktop && fg('navx-full-height-sidebar') && styles.fullHeightSidebarExpanded,
			]}
			ref={fg('platform_fix_component_state_update_for_suspense') ? elementRef : ref}
			data-testid={testId}
		>
			{children}
		</div>
	);
}
