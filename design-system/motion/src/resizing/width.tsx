import React, { useRef } from 'react';

import type { MotionDuration, MotionEasing } from '@atlaskit/tokens/css-type-schema';

import { isReducedMotion } from '../utils/accessibility';
import { useRequestAnimationFrame, useSetTimeout } from '../utils/timer-hooks';
import { type CallbackRef, useElementRef } from '../utils/use-element-ref';
import { useLayoutEffect } from '../utils/use-layout-effect';
import { useSnapshotBeforeUpdate } from '../utils/use-snapshot-before-update';

interface ResizingWidthOpts {
	/**
	 * Duration of the width transition as a design token CSS variable.
	 *
	 * Accepts a `MotionDuration` token value, e.g. `token('motion.duration.medium')`.
	 */
	duration: MotionDuration;
	/**
	 * Easing of the width transition as a design token CSS variable.
	 *
	 * Accepts a `MotionEasing` token value, e.g. `token('motion.easing.inout.bold')`.
	 */
	easing: MotionEasing;
	/**
	 * Callback fired once the width resize animation has completed.
	 * or immediately if the width did not change (no animation was needed).
	 */
	onFinishMotion?: () => void;
}

interface Dimensions {
	width: number;
}

/**
 * Parses a CSS time value (e.g. `"0.2s"` or `"200ms"`) and returns milliseconds.
 * Falls back to 0 if the value cannot be parsed.
 */
function parseCSSTimeToMs(value: string): number {
	const parsed = parseFloat(value);
	if (Number.isNaN(parsed)) {
		return 0;
	}
	if (value.endsWith('ms')) {
		return parsed;
	}
	return parsed * 1000;
}

/**
 * `useResizingWidth` animates width changes over state changes. If the width hasn't changed nothing will happen.
 *
 * __WARNING__: Potentially janky. This hook animates width which is
 * [notoriously unperformant](https://firefox-source-docs.mozilla.org/performance/bestpractices.html#Get_familiar_with_the_pipeline_that_gets_pixels_to_the_screen).
 * Test your app over low powered devices, you may want to avoid this if you can see it impacting FPS.
 */
export const useResizingWidth = ({
	duration,
	easing,
	onFinishMotion,
}: ResizingWidthOpts): {
	ref: CallbackRef;
} => {
	const prevDimensions = useRef<Dimensions>();
	const [element, setElementRef] = useElementRef();
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
		// Because of that we need to expand to the destination width first.
		element.setAttribute('style', '');

		const nextDimensions = element.getBoundingClientRect();
		if (nextDimensions.width === prevDimensions.current.width) {
			onFinishMotion?.();
			return;
		}

		const newStyles: React.CSSProperties = {
			width: `${prevDimensions.current.width}px`,
			willChange: 'width',
			transitionProperty: 'width',
			transitionDuration: duration,
			boxSizing: 'border-box',
			transitionTimingFunction: easing,
		};
		Object.assign(element.style, newStyles);

		const resolvedDuration = parseCSSTimeToMs(
			getComputedStyle(element).transitionDuration,
		);

		// We split this over two animation frames so the DOM has enough time to flush the changes.
		// We are deliberately not skipping this frame if another render happens - if we do the motion doesn't finish properly.
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!element) {
					return;
				}

				element.style.width = `${nextDimensions.width}px`;

				setTimeout(() => {
					if (!element) {
						return;
					}

					element.setAttribute('style', '');
					onFinishMotion?.();
				}, resolvedDuration);
			});
		});
	});

	return { ref: setElementRef };
};

/**
 * __ResizingWidth__
 *
 * Component which consumes the useResizingWidth() hook under-the-hood. Its props are the same as the hook's opts.
 */
export const ResizingWidth = ({
	children,
	...props
}: ResizingWidthOpts & {
	children: (opts: { ref: CallbackRef }) => React.ReactNode;
}): React.JSX.Element => {
	const resizing = useResizingWidth(props);
	return <>{children(resizing)}</>;
};
