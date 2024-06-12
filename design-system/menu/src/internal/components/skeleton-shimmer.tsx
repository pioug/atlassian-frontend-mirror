/** @jsx jsx */
import { type ReactNode } from 'react';

import { ClassNames, css, jsx, keyframes } from '@emotion/react';

import { N20A, N30A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type SkeletonShimmerProps = {
	children: ({ className }: { className?: string }) => ReactNode;
	isShimmering?: boolean;
};

/**
 * These keyframes are mirrored in:
 * packages/design-system/theme/src/constants.tsx
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
 * These styles are mirrored in:
 * packages/design-system/theme/src/constants.tsx
 *
 * Please update both.
 */
const shimmerStyles = css({
	'::before, ::after': {
		animationDirection: 'alternate',
		animationDuration: '1.5s',
		animationIterationCount: 'infinite',
		animationName: `${shimmerKeyframes}`,
		animationTimingFunction: 'linear',
		backgroundColor: token('color.skeleton', N20A),
	},
});

/**
 * __Skeleton shimmer__
 *
 * A skeleton shimmer is the animation shown on loading skeletons for
 * perceived performance and user satisfaction.
 *
 * This component provides a `className` through render props. This value will
 * have type:
 * + `string`, when `isShimmering={true}`.
 * + `undefined`, when `isShimmering={false}`.
 *
 * @internal
 */
const SkeletonShimmer = ({ children, isShimmering = false }: SkeletonShimmerProps) => {
	return (
		<ClassNames>
			{({ css }) =>
				children({
					className: isShimmering ? css(shimmerStyles) : undefined,
				})
			}
		</ClassNames>
	);
};

export default SkeletonShimmer;
