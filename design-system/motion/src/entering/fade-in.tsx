import React from 'react';

import KeyframesMotion, { type Animations, type KeyframesMotionProps } from './keyframes-motion';
import type { Direction, Distance } from './types';

const invertedDirection: Record<Direction, Direction> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
} as const;

/**
 * Props for controlling the behavior of the FadeIn animation
 */
export interface FadeKeyframesMotionProps
	extends Omit<KeyframesMotionProps, 'animationTimingFunction' | 'animationTimingFunctionExiting'> {
	/**
	 * The direction the element will enter from using a slide animation. If undefined, no slide will be applied.
	 */
	entranceDirection?: Direction;
	/**
	 * The direction the element will exit to using a slide animation.
	 * If undefined but `entranceDirection` is set, it will exit to the opposite side by default.
	 */
	exitDirection?: Direction;
	/**
	 * The distance the element moves in a direction-based animation.
	 * A `proportional` distance is based on the size of the element.
	 * A `constant` distance will always move the same amount, regardless of size.
	 */
	distance?: Distance;
}

/**
 * __FadeIn__
 *
 * Useful for fading in one or more elements.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions)
 */
const FadeIn = ({
	children,
	duration = 'large',
	entranceDirection,
	exitDirection,
	distance = 'proportional',
	onFinish,
	isPaused,
}: FadeKeyframesMotionProps) => {
	const invertedEntranceDirection =
		entranceDirection !== undefined ? invertedDirection[entranceDirection] : undefined;
	const isExitDirect: Animations = Boolean(exitDirection || invertedEntranceDirection)
		? `fade-out-from-${exitDirection! || invertedEntranceDirection!}${distance === 'proportional' ? '' : '-constant'}`
		: 'fade-out';

	return (
		<KeyframesMotion
			duration={duration}
			enteringAnimation={
				entranceDirection
					? `fade-in-from-${entranceDirection}${distance === 'proportional' ? '' : '-constant'}`
					: 'fade-in'
			}
			exitingAnimation={isExitDirect}
			animationTimingFunction="ease-in-out"
			onFinish={onFinish}
			isPaused={isPaused}
		>
			{children}
		</KeyframesMotion>
	);
};

export default FadeIn;
