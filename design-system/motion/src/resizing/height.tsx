import React, { Fragment, useRef } from 'react';

import { isReducedMotion } from '../utils/accessibility';
import { easeInOut } from '../utils/curves';
import { durations } from '../utils/durations';
import { useRequestAnimationFrame, useSetTimeout } from '../utils/timer-hooks';
import { type CallbackRef, useElementRef } from '../utils/use-element-ref';
import { useLayoutEffect } from '../utils/use-layout-effect';
import { useSnapshotBeforeUpdate } from '../utils/use-snapshot-before-update';

interface ResizingHeightOpts {
	/**
	 * Duration as a `function`.
	 * Will receive previous and next `height` and return the `duration`.
	 *
	 * By default this will match the [ADG specifications](https://atlassian.design) for how long motion should take.
	 * Design specifications are still a work in progress.
	 */
	duration?: (prevHeight: number, nextHeight: number) => number;
	/**
	 * Timing function as a `function`.
	 * This is handy for changing the curve depending on the user interaction.
	 * Does the user interact [directly or indirectly](/packages/helpers/motion/docs/variables)?
	 * You'll want to use an appropriate curve.
	 * Will receive previous and next `height`, `duration`, and return the
	 * [timing function](https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function).
	 *
	 * By default this will assume indirect motion using `easeInOut`.
	 */
	timingFunction?: (prevHeight: number, nextHeight: number, duration: number) => string;
}

interface Dimensions {
	height: number;
}

/**
 * `useResizingHeight` animates height changes over state changes. If the height hasn't changed nothing will happen.
 *
 * __WARNING__: Potentially janky. This hook animates height which is
 * [notoriously unperformant](https://firefox-source-docs.mozilla.org/performance/bestpractices.html#Get_familiar_with_the_pipeline_that_gets_pixels_to_the_screen).
 * Test your app over low powered devices, you may want to avoid this if you can see it impacting FPS.
 *
 * See [examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/resizing-motions).
 */
export const useResizingHeight = ({
	duration: calcDuration = () => durations.medium,
	timingFunction: calcTimingFunction = () => easeInOut,
}: ResizingHeightOpts = {}) => {
	const prevDimensions = useRef<Dimensions>();
	const [element, setElementRef] = useElementRef();
	// We cleanup on the next effect to prevent the previous timeout being called during
	// the next motion - as now the timeout has essentially been extended!
	const setTimeout = useSetTimeout({ cleanup: 'next-effect' });
	const requestAnimationFrame = useRequestAnimationFrame();

	useSnapshotBeforeUpdate(() => {
		if (isReducedMotion() || !element) {
			return;
		}

		prevDimensions.current = element.getBoundingClientRect();
	});

	useLayoutEffect(() => {
		if (isReducedMotion() || !element || !prevDimensions.current) {
			return;
		}

		// We might already be animating.
		// Because of that we need to expand to the destination height first.
		element.setAttribute('style', '');

		const nextDimensions = element.getBoundingClientRect();
		if (nextDimensions.height === prevDimensions.current.height) {
			return;
		}

		const duration = calcDuration(prevDimensions.current.height, nextDimensions.height);

		const newStyles: React.CSSProperties = {
			height: `${prevDimensions.current.height}px`,
			willChange: 'height',
			transitionProperty: 'height',
			transitionDuration: `${duration}ms`,
			boxSizing: 'border-box',
			transitionTimingFunction: calcTimingFunction(
				prevDimensions.current.height,
				nextDimensions.height,
				duration,
			),
		};
		Object.assign(element.style, newStyles);

		// We split this over two animation frames so the DOM has enough time to flush the changes.
		// We are deliberately not skipping this frame if another render happens - if we do the motion doesn't finish properly.
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!element) {
					return;
				}

				element.style.height = `${nextDimensions.height}px`;

				setTimeout(() => {
					if (!element) {
						return;
					}

					element.setAttribute('style', '');
				}, duration);
			});
		});
	});

	return { ref: setElementRef };
};

/**
 * __ResizingHeight__
 *
 * Component which consumes the useResizingHook() under-the-hood. Its props are the same as the hooks opts.
 *
 * See [examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/resizing-motions).
 */
export const ResizingHeight = ({
	children,
	...props
}: ResizingHeightOpts & {
	children: (opts: { ref: CallbackRef }) => React.ReactNode;
}) => {
	const resizing = useResizingHeight(props);
	return <Fragment>{children(resizing)}</Fragment>;
};

/**
 * This exists only to be able to extract opts.
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default (_opts: ResizingHeightOpts) => {};
