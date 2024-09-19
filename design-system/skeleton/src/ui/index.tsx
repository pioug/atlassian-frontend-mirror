/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, keyframes } from '@emotion/react';

import { skeletonShimmer } from '@atlaskit/theme/constants';

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

const shimmer = skeletonShimmer();
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const shimmerKeyframes = keyframes(shimmer.keyframes);

const skeletonStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	...shimmer.css,
});

const activeShimmerStyles = css({
	animationName: `${shimmerKeyframes}`,
});

const getKeyframes = (fromColor: string, toColor: string) =>
	keyframes({
		from: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			backgroundColor: fromColor,
		},
		to: {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
			backgroundColor: toColor,
		},
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
			css={[
				skeletonStyles,
				isShimmering && activeShimmerStyles,
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				{
					width,
					height,
					borderRadius,
					backgroundColor: color,
					animationName:
						color && ShimmeringEndColor ? getKeyframes(color, ShimmeringEndColor) : undefined,
				},
			]}
			{...(groupDataAttribute && { [groupDataAttribute]: 'true' })}
		/>
	);
};

export default Skeleton;
