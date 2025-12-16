import React from 'react';

import KeyframesMotion, { type KeyframesMotionProps } from './keyframes-motion';

/**
 * __ZoomIn__
 *
 * Will over zoom an element into position.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions)
 */
const ZoomIn = ({
	children,
	duration = 'small',
	isPaused,
	onFinish,
}: Omit<KeyframesMotionProps, 'animationTimingFunction' | 'animationTimingFunctionExiting'>): React.JSX.Element => {
	return (
		<KeyframesMotion
			duration={duration}
			enteringAnimation="zoom-in"
			exitingAnimation="zoom-out"
			animationTimingFunction="ease-in-out"
			isPaused={isPaused}
			onFinish={onFinish}
		>
			{children}
		</KeyframesMotion>
	);
};

export default ZoomIn;
