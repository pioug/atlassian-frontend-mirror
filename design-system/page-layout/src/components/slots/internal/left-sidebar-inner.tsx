/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { css, jsx } from '@emotion/react';

import { easeOut, prefersReducedMotion } from '@atlaskit/motion';
import { UNSAFE_media } from '@atlaskit/primitives/responsive';

import {
	BANNER_HEIGHT,
	LEFT_PANEL_WIDTH,
	LEFT_SIDEBAR_FLYOUT_WIDTH,
	LEFT_SIDEBAR_WIDTH,
	MAX_MOBILE_SIDEBAR_FLYOUT_WIDTH,
	MOBILE_COLLAPSED_LEFT_SIDEBAR_WIDTH,
	TOP_NAVIGATION_HEIGHT,
	TRANSITION_DURATION,
} from '../../../common/constants';
import { useIsSidebarDragging } from '../../../common/hooks';

type LeftSidebarInnerProps = {
	children: ReactNode;
	isFixed?: boolean;
	isFlyoutOpen?: boolean;
};

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const prefersReducedMotionStyles = css(prefersReducedMotion());

const mobileStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[UNSAFE_media.below.sm]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${MOBILE_COLLAPSED_LEFT_SIDEBAR_WIDTH}px`,
		position: 'fixed',
		insetBlockEnd: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		insetBlockStart: `calc(${BANNER_HEIGHT} + ${TOP_NAVIGATION_HEIGHT})`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		insetInlineStart: `${LEFT_PANEL_WIDTH}`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transition: `width ${TRANSITION_DURATION}ms ${easeOut} 0s`,
	},
});

const mobileInnerFlyoutStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[UNSAFE_media.below.sm]: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `min(90vw, ${MAX_MOBILE_SIDEBAR_FLYOUT_WIDTH}px)`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		maxWidth: MAX_MOBILE_SIDEBAR_FLYOUT_WIDTH,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transition: `width ${TRANSITION_DURATION}ms ${easeOut} 0s, box-shadow ${TRANSITION_DURATION}ms ${easeOut} 0s`,
	},
});

/**
 * This inner wrapper is required to allow the sidebar to be `position: fixed`.
 *
 * If we were to apply `position: fixed` to the outer wrapper, it will be popped
 * out of its flex container and Main would stretch to occupy all the space.
 */
const fixedInnerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${LEFT_SIDEBAR_WIDTH}`,
	position: 'fixed',
	insetBlockEnd: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	insetBlockStart: `calc(${BANNER_HEIGHT} + ${TOP_NAVIGATION_HEIGHT})`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	insetInlineStart: `${LEFT_PANEL_WIDTH}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `width ${TRANSITION_DURATION}ms ${easeOut} 0s`,
});

const fixedInnerFlyoutStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: LEFT_SIDEBAR_FLYOUT_WIDTH,
});

/**
 * Static in the sense of `position: static`.
 *
 * It will expand the page height to fit its content.
 */
const staticInnerStyles = css({
	height: '100%',
});

const draggingStyles = css({
	cursor: 'ew-resize',
	// Make sure drag to resize does not animate as the user drags
	transition: 'none',
});

const LeftSidebarInner = ({
	children,
	isFixed = false,
	isFlyoutOpen = false,
}: LeftSidebarInnerProps): jsx.JSX.Element => {
	const isDragging = useIsSidebarDragging();

	return (
		<div
			css={[
				// mobile viewport styles
				mobileStyles,
				isFlyoutOpen && mobileInnerFlyoutStyles,

				// generic styles
				!isFixed && staticInnerStyles,
				isFixed && fixedInnerStyles,
				isFixed && isFlyoutOpen && fixedInnerFlyoutStyles,
				isDragging && draggingStyles,
				prefersReducedMotionStyles,
			]}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default LeftSidebarInner;
