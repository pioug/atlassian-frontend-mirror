import React from 'react';

import KeyframesMotion, { type KeyframesMotionProps } from './keyframes-motion';
import { type AnimationCurve, type Direction, type Fade } from './types';

export interface SlideInProps extends KeyframesMotionProps {
	/**
	 * Direction the element will slide in from.
	 * E.g. `"right"` will slide in from the right to the left.
	 *
	 * If `exitTo` is not set, exiting will reverse this motion.
	 * E.g. If `enterFrom: "right"`, will slide out to the right.
	 */
	enterFrom: Direction;
	/**
	 * Direction the element will slide out towards.
	 * E.g. `"right"` will slide out to the right.
	 *
	 * If this is not set, exiting will reverse the entrance motion.
	 * E.g. If `enterFrom: "right"`, will slide out to the right.
	 */
	exitTo?: Direction;
	/**
	 * Whether an element will fade on enter, on exit or both.
	 *
	 * `'none'` is the default and will cause the element to not fade,
	 * `'in'` will cause the element to fade on enter,
	 * `'out'` will cause the element to fade on exit,
	 * `'inout'` will cause the element to fade on both.
	 */
	fade?: Fade;
	/**
	 * A custom function used to override the default animation timings.
	 * Returns which animation curve to use depending on the current transitioning state.
	 */
	animationTimingFunction?: AnimationCurve;

	/**
	 * A custom function used to override the default animation timings when exiting.
	 * Returns which animation curve to use depending on the current transitioning state.
	 */
	animationTimingFunctionExiting?: AnimationCurve;
}

/**
 * __SlideIn__
 *
 * Will slide an element into position, generally used for things that appear from outside of the viewport into view.
 *
 * See [examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions).
 */
const SlideIn = ({
	children,
	enterFrom,
	exitTo,
	fade = 'none',
	duration = 'medium',
	isPaused,
	onFinish,
	animationTimingFunction = 'ease-out',
	animationTimingFunctionExiting = 'ease-in',
}: SlideInProps) => {
	return (
		<KeyframesMotion
			duration={duration}
			enteringAnimation={`slide-in-from-${enterFrom}`}
			exitingAnimation={`slide-out-from-${exitTo || enterFrom}`}
			animationTimingFunction={animationTimingFunction}
			animationTimingFunctionExiting={animationTimingFunctionExiting}
			isPaused={isPaused}
			onFinish={onFinish}
		>
			{children}
		</KeyframesMotion>
	);
};

export default SlideIn;
