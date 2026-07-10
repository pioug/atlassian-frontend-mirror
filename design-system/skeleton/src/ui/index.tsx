/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useContext, useEffect, useLayoutEffect as useRealLayoutEffect } from 'react';

import { css, jsx, keyframes } from '@compiled/react';

import InteractionContext from '@atlaskit/interaction-context';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import type { BorderRadius } from '@atlaskit/tokens/css-type-schema';

export type SkeletonProps = {
	/**
	 * Width of the skeleton.
	 */
	width: string | number;
	/**
	 * Height of the skeleton.
	 */
	height: string | number;
	/**
	 * Controls the border radius, or rounding of the skeleton's corners.
	 */
	borderRadius?: Exclude<BorderRadius, 'inherit'>;
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
	/**
	 * An optional `interactionName` used to identify when this component is holding an interaction.
	 */
	interactionName?: string;
	/**
	 * A test id for automated testing.
	 */
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
 * `useLayoutEffect` is being used in SSR safe form. On the server, this work doesn’t need to run.
 * `useEffect` is used in-place, because `useEffect` is not run on the server and it matches types
 * which makes things simpler than doing an `isServer` check or a `null` check.
 *
 * @see https://hello.atlassian.net/wiki/spaces/DST/pages/2081696628/DSTDACI-010+-+Interaction+Tracing+hooks+in+DS+components
 */
const useLayoutEffect = typeof window === 'undefined' ? useEffect : useRealLayoutEffect;

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
	borderRadius = token('radius.small'),
	color,
	ShimmeringEndColor,
	isShimmering = false,
	groupName,
	interactionName,
	testId,
}: SkeletonProps): JSX.Element => {
	const groupDataAttribute = groupName && `data-${groupName}`;

	const context = useContext(InteractionContext);
	useLayoutEffect(() => {
		if (context != null && fg('platform-dst-skeleton-ufo-hold')) {
			return context.hold(interactionName);
		}
	}, [context, interactionName]);

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
