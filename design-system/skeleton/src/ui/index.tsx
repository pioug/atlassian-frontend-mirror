/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx, keyframes } from '@compiled/react';

import { token } from '@atlaskit/tokens';

type SkeletonProps = {
	width: string | number;
	height: string | number;
	/**
	 * Defaults to 100px to allow for any reasonable size skeleton having rounded corners.
	 */
	borderRadius?: string | number;
	/**
	 * Overrides the default color of skeleton, and overrides the default shimmering start color if ShimmeringEndColor also provided.
	 */
	color?: string;
	/**
	 * Overrides the default shimmering ending color of skeleton.
	 */
	ShimmeringEndColor?: string;
	/**
	 * Enables the shimmering animation.
	 */
	isShimmering?: boolean;
	/**
	 * Applied as a data-attribute. Use this to target groups of skeletons with the same name (e.g. for applying custom styles)
	 * ```
	 * groupName="my-skeleton" -> <div data-my-skeleton>
	 * ```
	 */
	groupName?: string;
	testId?: string;
};

const shimmerKeyframes = keyframes({
	from: {
		backgroundColor: `var(--ds-skeleton-from-color, ${token('color.skeleton')})`,
	},
	to: {
		backgroundColor: `var(--ds-skeleton-to-color, ${token('color.skeleton.subtle')})`,
	},
});

const skeletonStyles = css({
	animationDirection: 'alternate',
	animationDuration: '1.5s',
	animationIterationCount: 'infinite',
	animationTimingFunction: 'linear',
	backgroundColor: token('color.skeleton'),
});

const activeShimmerStyles = css({
	animationName: shimmerKeyframes,
});

/**
 * __Skeleton__
 *
 * A skeleton acts as a placeholder for content, usually while the content loads.
 *
 * - [Examples](https://atlassian.design/components/skeleton/examples)
 * - [Code](https://atlassian.design/components/skeleton/code)
 */
const Skeleton = ({
	width,
	height,
	borderRadius = '100px',
	color,
	ShimmeringEndColor,
	isShimmering = false,
	groupName,
	testId,
}: SkeletonProps) => {
	const groupDataAttribute = groupName && `data-${groupName}`;

	return (
		<div
			data-testid={testId}
			css={[skeletonStyles, isShimmering && activeShimmerStyles]}
			style={
				{
					width,
					height,
					borderRadius,
					backgroundColor: color,
					// Override the keyframes if both colors are provided, otherwise use the CSS variable fallbacks in our keyframes
					'--ds-skeleton-from-color': color && ShimmeringEndColor ? color : undefined,
					'--ds-skeleton-to-color': color && ShimmeringEndColor ? ShimmeringEndColor : undefined,
				} as React.CSSProperties
			}
			{...(groupDataAttribute && { [groupDataAttribute]: 'true' })}
		/>
	);
};

export default Skeleton;
