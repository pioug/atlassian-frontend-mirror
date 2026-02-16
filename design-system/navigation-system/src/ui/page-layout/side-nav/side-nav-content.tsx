/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, type ReactNode, type Ref, useMemo, useRef } from 'react';

import { cssMap, jsx, keyframes } from '@compiled/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { useIsFhsEnabled } from '../../fhs-rollout/use-is-fhs-enabled';
import { sideNavContentScrollTimelineVar } from '../constants';

import { useSideNavVisibility } from './use-side-nav-visibility';

/**
 * The main content of the side nav, filling up the middle section. It acts as a scroll container.
 *
 * It will grow to take up the available space in the side nav — this is used to push the footer to the
 * bottom of the side nav.
 */
export const SideNavContent: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SideNavContentProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SideNavContentProps>(_SideNavContent);

// Placing this const below the function breaks Compiled!
const styles = cssMap({
	scrollContainer: {
		flex: 1,
		overflow: 'auto',
	},
	paddingContainer: {
		paddingBlockStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
		paddingBlockEnd: token('space.150'),
		paddingInlineStart: token('space.150'),
	},
});

/**
 * Using CSS scroll-driven animations to apply a scrolled indicator border.
 *
 * This approach is better for SSR, as some apps like Confluence will apply the
 * initial scroll position of the side nav content using JS before hydration.
 *
 * If we applied the border through React state it would only appear after hydration,
 * whereas this CSS approach should show even before hydration.
 */
const scrolledBorder = keyframes({
	from: {
		boxShadow: 'none',
	},
	'0.1%': {
		boxShadow: `0px -1px ${token('color.border')}`,
	},
	to: {
		boxShadow: `0px -1px ${token('color.border')}`,
	},
});

const scrollTimelineVar = '--sNcst';
const fullHeightSidebarStyles = cssMap({
	scrollContainer: {
		// Creates the scroll timeline bound to the var
		scrollTimeline: `${scrollTimelineVar} block`,
		// Consumes the scroll timeline for the animation
		animationTimeline: scrollTimelineVar,
		animationName: scrolledBorder,
	},
	scrollContainerWithLayeringFixes: {
		// Only needed when the side nav is full height, which only happens on desktop.
		'@media (min-width: 64rem)': {
			'@supports (scroll-timeline-axis: block)': {
				// Creates the scroll timeline bound to the var
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
				scrollTimelineName: sideNavContentScrollTimelineVar,
				scrollTimelineAxis: 'block',
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
				'html:has([data-private-side-nav-header]) &': {
					// Only applied if there is a SideNavHeader. See the comment in SideNavHeader for more details.
					// Consumes the scroll timeline for the animation
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
					animationTimeline: sideNavContentScrollTimelineVar,
					animationName: scrolledBorder,
				},
			},
		},
	},
});

function _SideNavContent(
	{ children, testId }: SideNavContentProps,
	forwardedRef: Ref<HTMLDivElement>,
) {
	const isFhsEnabled = useIsFhsEnabled();
	const internalRef = useRef<HTMLDivElement>(null);
	const mergedRef = useMemo(() => mergeRefs([internalRef, forwardedRef]), [forwardedRef]);

	const { isExpandedOnDesktop } = useSideNavVisibility();

	return (
		/**
		 * We are adding two `div` elements here on purpose. The padding styles are added to a nested element to make sure the padding is included in the scrollable area.
		 * Otherwise we can run into issues with sticky child elements if the padding is added to the scrollable element - as the stick point would include the padding, but
		 * the scrollable area doesn't, so other non-sticky children can be seen above/below the sticky element's stick point.
		 */
		<div
			css={[
				styles.scrollContainer,
				isFhsEnabled &&
					!fg('platform-dst-side-nav-layering-fixes') &&
					!fg('platform_dst_nav4_fhs_feedback_1') &&
					fullHeightSidebarStyles.scrollContainer,
				// eslint-disable-next-line @atlaskit/platform/no-preconditioning
				isFhsEnabled &&
					isExpandedOnDesktop &&
					fg('platform-dst-side-nav-layering-fixes') &&
					!fg('platform_dst_nav4_fhs_feedback_1') &&
					fullHeightSidebarStyles.scrollContainerWithLayeringFixes,
			]}
			ref={isFhsEnabled ? mergedRef : forwardedRef}
			data-testid={testId}
		>
			<div css={styles.paddingContainer}>{children}</div>
		</div>
	);
}

type SideNavContentProps = {
	/**
	 * The content of the layout area.
	 * Should contain side nav menu items.
	 */
	children: ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
};
