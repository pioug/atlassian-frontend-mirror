/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties } from 'react';

import { css, cssMap, jsx, keyframes } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { SkeletonHeadingItemProps } from '../types';

const N20A = 'rgba(9, 30, 66, 0.04)';
const N30A = 'rgba(9, 30, 66, 0.08)';

const styles = cssMap({
	skeleton: {
		paddingBlock: token('space.0', '0px'),
		paddingInline: token('space.200', '16px'),
		'&::after': {
			display: 'block',
			width: '30%',
			height: token('space.100', '8px'),
			backgroundColor: token('color.skeleton', N20A),
			borderRadius: 100,
			content: '""',
		},
	},
	customWidth: {
		'&::after': {
			width: 'var(--width)',
		},
	},
});

/**
 * These styles are mirrored in:
 * packages/design-system/theme/src/constants.tsx
 * packages/design-system/menu/src/menu-item/skeleton-item.tsx
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
 * These styles are defined using `css` rather than `cssMap` as there is a
 * bug when using `cssMap` that causes a build failure due to the use of keyframes.
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
 * __Skeleton heading item__
 *
 * A skeleton heading item is used in place of a heading item when its contents it not ready.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/skeleton-heading-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const SkeletonHeadingItem: ({
	isShimmering,
	testId,
	width,
	xcss,
}: SkeletonHeadingItemProps) => JSX.Element = ({
	isShimmering = false,
	testId,
	width,
	xcss,
}: SkeletonHeadingItemProps) => {
	return (
		<div
			className={xcss}
			style={
				{
					'--width': width,
				} as CSSProperties
			}
			css={[styles.skeleton, width && styles.customWidth, isShimmering && shimmerStyles]}
			data-ds--menu--skeleton-heading-item
			data-testid={testId}
		/>
	);
};

export default SkeletonHeadingItem;
