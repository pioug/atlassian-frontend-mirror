import React from 'react';

import KeyframesMotion, { type Animations, type KeyframesMotionProps } from './keyframes-motion';
import type { AnimationCurve } from './types';

/**
 * Props for controlling the behavior of the AnimateIn animation
 */
export interface AnimateKeyframesMotionProps
	extends Omit<KeyframesMotionProps, 'animationTimingFunctionExiting'> {
	/**
	 * CSS keyframes for the entering animation.
	 */
	enteringAnimation: Animations;
	/**
	 * CSS keyframes for the exiting animation.
	 */
	exitingAnimation?: Animations;

	animationTimingFunction: AnimationCurve;
}

/**
 * __AnimateIn__
 *
 * Useful for Animating in one or more elements.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions)
 */
const AnimateIn = ({
	children,
	duration = 'large',
	enteringAnimation,
	exitingAnimation,
	onFinish,
	isPaused,
	animationTimingFunction,
}: AnimateKeyframesMotionProps): React.JSX.Element => {
	return (
		<KeyframesMotion
			duration={duration}
			enteringAnimation={enteringAnimation}
			exitingAnimation={exitingAnimation}
			animationTimingFunction={animationTimingFunction}
			onFinish={onFinish}
			isPaused={isPaused}
		>
			{children}
		</KeyframesMotion>
	);
};

export default AnimateIn;
