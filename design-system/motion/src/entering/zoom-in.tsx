import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type CSSObject } from '@emotion/react';

import KeyframesMotion, { type KeyframesMotionProps } from './keyframes-motion';

export const zoomInAnimation = (): CSSObject => ({
	'0%': {
		opacity: 0,
		transform: 'scale(0.5)',
	},
	'50%': {
		opacity: 1,
	},
	'75%': {
		transform: 'scale(1.25)',
	},
	'100%': {
		transform: 'scale(1)',
	},
});

export const shrinkOutAnimation = (): CSSObject => ({
	to: {
		opacity: 0,
		transform: 'scale(0.75)',
	},
});

/**
 * __ZoomIn__
 *
 * Will over zoom an element into position.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions)
 */
const ZoomIn = ({ children, duration = 125, isPaused, onFinish }: KeyframesMotionProps) => {
	return (
		<KeyframesMotion
			duration={duration}
			enteringAnimation={zoomInAnimation()}
			exitingAnimation={shrinkOutAnimation()}
			animationTimingFunction={() => 'ease-in-out'}
			isPaused={isPaused}
			onFinish={onFinish}
		>
			{children}
		</KeyframesMotion>
	);
};

export default ZoomIn;
