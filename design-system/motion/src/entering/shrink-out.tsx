import type React from 'react';

import { durations } from '../utils/durations';
import { useRequestAnimationFrame, useSetTimeout } from '../utils/timer-hooks';
import { useElementRef } from '../utils/use-element-ref';
import { useLayoutEffect } from '../utils/use-layout-effect';

import { useExitingPersistence } from './exiting-persistence';
import { type MotionProps } from './types';

export interface ShrinkOutProps extends MotionProps<{ ref: React.Ref<any> }> {}

/**
 * __ShrinkOut__
 *
 * Will shrink an element down to nothing when exiting.
 * Works best with flex children as collapsing margins can come with undesired behaviour.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/entering-motions)
 */
const ShrinkOut = ({ children, duration = 'small', onFinish }: ShrinkOutProps): any => {
	const [element, setElementRef] = useElementRef();
	const exiting = useExitingPersistence();
	const requestAnimationFrame = useRequestAnimationFrame();
	const setTimeout = useSetTimeout();
	const direction = exiting.isExiting ? 'exiting' : 'entering';

	useLayoutEffect(() => {
		if (exiting.isExiting && element) {
			const newStyles: React.CSSProperties = {
				// We fix both width and height because when changing box sizing to border-box.
				width: `${element.offsetWidth}px`,
				height: `${element.offsetHeight}px`,
				boxSizing: 'border-box',
				willChange: 'width,margin',
			};
			Object.assign(element.style, newStyles);

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					const newStyles: React.CSSProperties = {
						width: '0px',
						margin: '0px', // We animate margin down to zero so it doesn't take any space.
						transitionTimingFunction: 'cubic-bezier(0.8,0,0,0.8)',
						transitionDuration: durations[duration] + 'ms',
						transitionProperty: 'width,margin',
					};

					Object.assign(element.style, newStyles);

					setTimeout(() => {
						exiting.onFinish && exiting.onFinish();
						onFinish && onFinish('exiting');
					}, durations[duration]);
				});
			});
		}
	});

	return children({ ref: setElementRef }, direction);
};

export default ShrinkOut;
