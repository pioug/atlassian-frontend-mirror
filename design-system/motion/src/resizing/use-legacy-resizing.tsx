import React, { useRef } from 'react';

import { isReducedMotion } from '../utils/is-reduced-motion';
import { type CallbackRef, useElementRef } from '../utils/use-element-ref';
import { useLayoutEffect } from '../utils/use-layout-effect';
import { useRequestAnimationFrame } from '../utils/use-request-animation-frame';
import { useSetTimeout } from '../utils/use-set-timeout';
import { useSnapshotBeforeUpdate } from '../utils/use-snapshot-before-update';
import type { ResizingOpts } from './use-resizing';

/**
 * Which dimension(s) of the element to animate.
 *
 * - `'width'` animates only width changes.
 * - `'height'` animates only height changes.
 * - `'both'` animates width and height changes simultaneously.
 */
type ResizingDimension = 'width' | 'height' | 'both';

interface Dimensions {
	width: number;
	height: number;
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
 * Returns `true` if any of the dimension(s) being animated have changed
 * between the previous and next measurements.
 */
function hasDimensionChanged(
	dimension: ResizingDimension,
	prev: Dimensions,
	next: Dimensions,
): boolean {
	if (dimension === 'width') {
		return prev.width !== next.width;
	}
	if (dimension === 'height') {
		return prev.height !== next.height;
	}
	return prev.width !== next.width || prev.height !== next.height;
}

/**
 * Returns the CSS `transition-property` / `will-change` value for the
 * given dimension(s).
 */
function getDimensionPropertyList(dimension: ResizingDimension): string {
	if (dimension === 'both') {
		return 'width, height';
	}
	return dimension;
}

/**
 * `useResizing` animates dimension changes (width, height, or both) over state changes.
 * If the relevant dimension(s) haven't changed nothing will happen.
 *
 * Pass `dimension: 'width' | 'height' | 'both'` to choose which axis (or axes) to animate.
 *
 * __WARNING__: Potentially janky. This hook animates layout-affecting properties which are
 * [notoriously unperformant](https://firefox-source-docs.mozilla.org/performance/bestpractices.html#Get_familiar_with_the_pipeline_that_gets_pixels_to_the_screen).
 * Test your app over low powered devices, you may want to avoid this if you can see it impacting FPS.
 */
export const useLegacyResizing = ({
	dimension,
	duration,
	easing,
	onFinishMotion,
	onStartMotion,
}: ResizingOpts): {
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

		const rect = element.getBoundingClientRect();
		prevDimensions.current = { width: rect.width, height: rect.height };
	});

	useLayoutEffect(() => {
		if (!element) {
			return;
		}

		if (isReducedMotion()) {
			// No motion will ever run, so the element is already at its final dimensions.
			onFinishMotion?.();
			return;
		}

		if (!prevDimensions.current) {
			return;
		}

		// We might already be animating.
		// Because of that we need to expand to the destination dimensions first.
		element.setAttribute('style', '');

		const rect = element.getBoundingClientRect();
		const nextDimensions: Dimensions = { width: rect.width, height: rect.height };

		if (!hasDimensionChanged(dimension, prevDimensions.current, nextDimensions)) {
			onFinishMotion?.();
			return;
		}

		// Any in-flight transition styles have been cleared and the next ones haven't been applied
		// yet, so the element is at the natural layout it will settle at.
		onStartMotion?.();

		const propertyList = getDimensionPropertyList(dimension);
		const newStyles: React.CSSProperties = {
			willChange: propertyList,
			transitionProperty: propertyList,
			transitionDuration: duration,
			boxSizing: 'border-box',
			transitionTimingFunction: easing,
		};
		if (dimension === 'width' || dimension === 'both') {
			newStyles.width = `${prevDimensions.current.width}px`;
		}
		if (dimension === 'height' || dimension === 'both') {
			newStyles.height = `${prevDimensions.current.height}px`;
		}
		Object.assign(element.style, newStyles);

		const resolvedDuration = parseCSSTimeToMs(getComputedStyle(element).transitionDuration);

		// We split this over two animation frames so the DOM has enough time to flush the changes.
		// We are deliberately not skipping this frame if another render happens - if we do the motion doesn't finish properly.
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				if (!element) {
					return;
				}

				if (dimension === 'width' || dimension === 'both') {
					element.style.width = `${nextDimensions.width}px`;
				}
				if (dimension === 'height' || dimension === 'both') {
					element.style.height = `${nextDimensions.height}px`;
				}

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
