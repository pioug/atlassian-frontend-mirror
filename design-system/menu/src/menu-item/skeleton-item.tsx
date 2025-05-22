/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties } from 'react';

import { css, cssMap, jsx, keyframes } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { SkeletonItemProps } from '../types';

const skeletonItemElemSize = 20;
const N20A = 'rgba(9, 30, 66, 0.04)';
const N30A = 'rgba(9, 30, 66, 0.08)';

const styles = cssMap({
	root: {
		display: 'flex',
		minHeight: 40,
		paddingBlock: token('space.0', '0'),
		paddingInline: token('space.250', '20px'),
		alignItems: 'center',
		pointerEvents: 'none',
		'&::after': {
			height: 9,
			backgroundColor: token('color.skeleton', N20A),
			borderRadius: 100,
			content: '""',
			// This is a little bespoke but we need to push everything down 1px
			// because the skeleton content should align to the bottom of the text.
			// Confirm VR test failures before accepting a change.
			marginBlockStart: 1,
		},
	},
	defaultWidth: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:nth-of-type(1n)::after': {
			flexBasis: '70%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:nth-of-type(2n)::after': {
			flexBasis: '50%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:nth-of-type(3n)::after': {
			flexBasis: '60%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:nth-of-type(4n)::after': {
			flexBasis: '90%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:nth-of-type(5n)::after': {
			flexBasis: '35%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:nth-of-type(6n)::after': {
			flexBasis: '77%',
		},
	},
	customWidth: {
		'&::after': {
			flexBasis: 'var(--width)',
		},
	},
	beforeElement: {
		'&::before': {
			width: skeletonItemElemSize,
			height: skeletonItemElemSize,
			flexShrink: 0,
			backgroundColor: token('color.skeleton', N20A),
			content: '""',
			marginInlineEnd: 14,
			marginInlineStart: token('space.025', '2px'),
		},
	},
	avatar: {
		'&::before': {
			borderRadius: '100%',
		},
	},
	icon: {
		'&::before': {
			borderRadius: '3px',
		},
	},
	sideNavSkeleton: {
		paddingInline: token('space.100', '8px'),
		'&::before': {
			height: '1.5rem',
			marginInlineEnd: token('space.200', '16px'),
			width: '1.5rem',
		},
	},
});

/**
 * These styles are mirrored in:
 * packages/design-system/theme/src/constants.tsx
 * packages/design-system/menu/src/menu-item/skeleton-heading-item.tsx
 *
 * Please update both.
 */
const shimmerKeyframes = keyframes({
	from: {
		backgroundColor: token('color.skeleton', N20A),
	},
	to: {
		backgroundColor: token('color.skeleton.subtle', N30A),
	},
});

/**
 * These styles are defined using `css` rather than `cssMap` as there is a bug when using
 * `cssMap` that causes a build failure due to the use of keyframes within this pseudo-element.
 */
const shimmerStyles = css({
	'&::before, &::after': {
		animationDirection: 'alternate',
		animationDuration: '1.5s',
		animationIterationCount: 'infinite',
		animationName: shimmerKeyframes,
		animationTimingFunction: 'linear',
		backgroundColor: token('color.skeleton', N20A),
	},
});

/**
 * __Skeleton item__
 *
 * A skeleton item is used in place of an item when its contents it not ready.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/skeleton-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const SkeletonItem = ({
	hasAvatar,
	hasIcon,
	isShimmering = false,
	isSideNavSkeleton = false,
	testId,
	width,
	xcss,
}: SkeletonItemProps) => {
	return (
		<div
			className={xcss}
			style={
				{
					'--width': width,
				} as CSSProperties
			}
			css={[
				styles.root,
				(hasAvatar || hasIcon) && styles.beforeElement,
				hasAvatar && styles.avatar,
				hasIcon && styles.icon,
				width ? styles.customWidth : styles.defaultWidth,
				isSideNavSkeleton && styles.sideNavSkeleton,
				isShimmering && shimmerStyles,
			]}
			data-testid={testId}
		/>
	);
};

export default SkeletonItem;
