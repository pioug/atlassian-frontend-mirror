import { N10, N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { VAR_SCROLL_INDICATOR_COLOR, VAR_SEPARATOR_COLOR } from '../../common/constants';

const scrollIndicatorMaskZIndex = 2;
const scrollIndicatorZIndex = 1;
const scrollIndicatorHeight = 2;
const scrollIndicatorBorderRadius = '1px';
const containerPadding = 8;

const itemHeadingContentHeight = 16; // Originally headingSizes.h100.lineHeight from '@atlaskit/theme/typography'
const skeletonHeadingHeight = containerPadding;
const skeletonHeadingMarginOffset = 3;
// Skeleton content is slightly shorter than the real content.
// Because of that we slightly increase the top margin to offset this so the
// containing size both real and skeleton always equal approx 30px.
const skeletonHeadingTopMargin =
	containerPadding * 2.5 +
	(itemHeadingContentHeight - skeletonHeadingHeight) -
	skeletonHeadingMarginOffset;
// We want to move the entire body up by 3px without affecting the height of the skeleton container.
const skeletonHeadingBottomMargin = containerPadding * 0.75 + skeletonHeadingMarginOffset;

interface StyleOpts {
	showTopScrollIndicator?: boolean;
}

/**
 * This outer container css contains the "real" scroll indicators which are
 * always rendered to the screen.
 * They are "conditionally" shown from the users perspective using the inner container CSS
 * which has other pseudo elements which "mask" the "real" scroll indicators.
 */
export const outerContainerCSS = (
	opts: StyleOpts & { scrollbarWidth: number },
): {
	// Flex is needed to ensure the overflow indicators are positioned correctly.
	readonly display: 'flex';
	readonly height: '100%';
	readonly overflow: 'hidden';
	readonly position: 'relative';
	readonly '&::before': {
		readonly content: "''";
		readonly display: 'block';
		readonly left: 'var(--ds-space-100)';
		readonly right: number;
		readonly height: 2;
		readonly borderRadius: 'var(--ds-radius-xsmall)';
		readonly backgroundColor: 'var(--ds-menu-seperator-color, var(--ds-border))';
		readonly position: 'absolute';
		readonly zIndex: 1;
	};
	readonly '&::after': {
		readonly content: "''";
		readonly position: 'absolute';
		readonly display: 'block';
		readonly borderRadius: 'var(--ds-radius-xsmall)';
		readonly flexShrink: 0;
		readonly height: 2;
		readonly left: 'var(--ds-space-100)';
		readonly right: number;
		readonly bottom: 0;
		readonly zIndex: 1;
		readonly backgroundColor: 'var(--ds-menu-seperator-color, var(--ds-border))';
	};
} =>
	({
		// Flex is needed to ensure the overflow indicators are positioned correctly.
		display: 'flex',
		height: '100%',
		overflow: 'hidden',
		position: 'relative',

		'&::before': {
			content: "''",
			display: 'block',
			left: token('space.100', '8px'),
			right: containerPadding + opts.scrollbarWidth,
			height: scrollIndicatorHeight,
			borderRadius: token('radius.xsmall', scrollIndicatorBorderRadius),
			backgroundColor: `var(${VAR_SEPARATOR_COLOR}, ${token('color.border', N30)})`,
			position: 'absolute',
			zIndex: scrollIndicatorZIndex,
		},

		'&::after': {
			content: "''",
			position: 'absolute',
			display: 'block',
			borderRadius: token('radius.xsmall', scrollIndicatorBorderRadius),
			flexShrink: 0,
			height: scrollIndicatorHeight,
			left: token('space.100', '8px'),
			right: containerPadding + opts.scrollbarWidth,
			bottom: 0,
			zIndex: scrollIndicatorZIndex,
			backgroundColor: `var(${VAR_SEPARATOR_COLOR}, ${token('color.border', N30)})`,
		},
	}) as const;

/**
 * This inner container css contains the "mask" logic for the scroll indicators.
 * Essentially they cover (mask) the "real" scroll indicators when the user is scrolled
 * to the top or bottom of the container.
 */
export const innerContainerCSS = (
	opts: StyleOpts,
): {
	// This after pseudo element abuses being a flex child and pushes itself down to the
	// very bottom of the container - doing so ends up "masking" the actual scroll indicator.
	readonly '&::after': {
		readonly borderRadius: 'var(--ds-radius-xsmall)';
		readonly content: "''";
		readonly display: 'block';
		readonly flexShrink: 0;
		readonly height: 2;
		// This is used to "push" the element to the bottom of the flex container.
		readonly marginTop: 'auto';
		readonly position: 'relative';
		readonly zIndex: 2;
		readonly backgroundColor: 'var(--ds-menu-scroll-indicator-color, var(--ds-surface))';
	};
	readonly '&::before'?:
		| {
				readonly borderRadius: 'var(--ds-radius-xsmall)';
				readonly content: "''";
				readonly left: 0;
				readonly right: 0;
				readonly height: 2;
				readonly backgroundColor: 'var(--ds-menu-scroll-indicator-color, var(--ds-surface))';
				readonly position: 'absolute';
				readonly display: 'block';
				readonly zIndex: 2;
		  }
		| undefined;
	readonly display: 'flex';
	readonly overflow: 'auto';
	readonly width: '100%';
	readonly position: 'relative';
	readonly boxSizing: 'border-box';
	readonly flexDirection: 'column';
} =>
	({
		display: 'flex',
		overflow: 'auto',
		width: '100%',
		position: 'relative',
		boxSizing: 'border-box',
		flexDirection: 'column',

		// This before pseudo element is works by being positioned at the top of this scrolling
		// container - so when you scroll down it stops "masking" the actual scroll indicator.
		...(!opts.showTopScrollIndicator &&
			({
				'&::before': {
					borderRadius: token('radius.xsmall', scrollIndicatorBorderRadius),
					content: "''",
					left: 0,
					right: 0,
					height: scrollIndicatorHeight,
					backgroundColor: `var(${VAR_SCROLL_INDICATOR_COLOR}, ${token('elevation.surface', N10)})`,
					position: 'absolute',
					display: 'block',
					zIndex: scrollIndicatorMaskZIndex,
				},
			} as const)),

		// This after pseudo element abuses being a flex child and pushes itself down to the
		// very bottom of the container - doing so ends up "masking" the actual scroll indicator.
		'&::after': {
			borderRadius: token('radius.xsmall', scrollIndicatorBorderRadius),
			content: "''",
			display: 'block',
			flexShrink: 0,
			height: scrollIndicatorHeight,
			// This is used to "push" the element to the bottom of the flex container.
			marginTop: 'auto',
			position: 'relative',
			zIndex: scrollIndicatorMaskZIndex,
			backgroundColor: `var(${VAR_SCROLL_INDICATOR_COLOR}, ${token('elevation.surface', N10)})`,
		},
	}) as const;

export const containerCSS = (
	opts: StyleOpts,
): {
	// When the scroll indicator is always shown we need to add some padding
	// so the spacing between matches what it would be if the indicator was a "block" element.
	// We use margin here so any child absolutely positioned elements are positioned correctly.
	readonly marginTop: 0 | 2;
	readonly marginLeft: 'var(--ds-space-100)';
	readonly marginRight: 'var(--ds-space-100)';
	// Enables child absolutely positioned elements to be positioned relative to this element.
	readonly position: 'relative';
	readonly '& [data-ds--menu--heading-item]': {
		readonly marginBottom: 'var(--ds-space-075)';
		readonly marginTop: 'var(--ds-space-200)';
	};
	readonly '& [data-ds--menu--skeleton-heading-item]': {
		readonly marginTop: number;
		readonly marginBottom: number;
	};
} =>
	({
		// When the scroll indicator is always shown we need to add some padding
		// so the spacing between matches what it would be if the indicator was a "block" element.
		// We use margin here so any child absolutely positioned elements are positioned correctly.
		marginTop: opts.showTopScrollIndicator ? scrollIndicatorHeight : 0,
		marginLeft: token('space.100', '8px'),
		marginRight: token('space.100', '8px'),
		// Enables child absolutely positioned elements to be positioned relative to this element.
		position: 'relative',

		'& [data-ds--menu--heading-item]': {
			marginBottom: token('space.075', '6px'),
			marginTop: token('space.200', '16px'),
		},
		'& [data-ds--menu--skeleton-heading-item]': {
			marginTop: skeletonHeadingTopMargin,
			marginBottom: skeletonHeadingBottomMargin,
		},
	}) as const;
