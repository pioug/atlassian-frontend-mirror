/** @jsx jsx */
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
const shimmerKeyframes = keyframes(shimmer.keyframes);

const skeletonStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
	...shimmer.css,
});

const activeShimmerStyles = css({
	animationName: `${shimmerKeyframes}`,
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
				{ width, height, borderRadius },
			]}
			{...(groupDataAttribute && { [groupDataAttribute]: 'true' })}
		/>
	);
};

export default Skeleton;
