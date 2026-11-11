import { useRef, useState } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import type { MotionDuration, MotionEasing } from '@atlaskit/tokens/css-type-schema';

import { isReducedMotion } from '../utils/is-reduced-motion';
import { type CallbackRef } from '../utils/use-element-ref';
import { useLayoutEffect } from '../utils/use-layout-effect';
import { observeResizing, type ResizingObserver } from './observe-resizing';
import { useLegacyResizing } from './use-legacy-resizing';

type ResizingDimension = 'width' | 'height' | 'both';

export interface ResizingOpts {
	/**
	 * Which dimension(s) to animate. One of `'width'`, `'height'`, or `'both'`.
	 */
	dimension: ResizingDimension;
	/**
	 * Duration of the resize transition as a design token CSS variable.
	 *
	 * Accepts a `MotionDuration` token value, e.g. `token('motion.duration.medium')`.
	 */
	duration: MotionDuration;
	/**
	 * Easing of the resize transition as a design token CSS variable.
	 *
	 * Accepts a `MotionEasing` token value, e.g. `token('motion.easing.inout.bold')`.
	 */
	easing: MotionEasing;
	/**
	 * Callback fired once the resize animation has completed,
	 * or when a pending resize is suppressed. With observed resizing, unchanged renders do not
	 * fire this callback.
	 */
	onFinishMotion?: () => void;
	/**
	 * Callback fired immediately before a resize animation starts, while the element is still at
	 * its natural layout with no transition styles applied. Measurements taken here reflect the
	 * size the element will settle at, rather than an intermediate animation frame.
	 *
	 * Not called on the initial render, under reduced motion,
	 * or when the dimension(s) did not change (no animation was needed).
	 */
	onStartMotion?: () => void;
}

/**
 * Animates observed size changes without measuring during React renders or commits.
 * The first observation establishes the initial size without motion. Width and height
 * transitions still affect layout; unchanged renders do not schedule measurements.
 */
const useObservedResizing = (opts: ResizingOpts): { ref: CallbackRef } => {
	const [element, setElement] = useState<HTMLElement | null>(null);
	const committed = useRef(opts);
	const observer = useRef<ResizingObserver>();

	useLayoutEffect(() => {
		committed.current = opts;
		if (isReducedMotion()) {
			observer.current?.suppress();
		}
	});

	useLayoutEffect(() => {
		if (!element || typeof ResizeObserver === 'undefined') {
			return;
		}
		const subscription = observeResizing(element, () => ({
			...committed.current,
			shouldAnimate: !isReducedMotion(),
		}));
		observer.current = subscription;
		return () => {
			subscription.disconnect();
			observer.current = undefined;
		};
	}, [element]);

	return { ref: setElement };
};

export const useResizing = (opts: ResizingOpts): { ref: CallbackRef } => {
	const enableObservedResizing = fg('platform-dst-motion-observed-resizing');
	const observed = useObservedResizing(opts);
	const legacy = useLegacyResizing(opts);
	// Only the selected implementation receives an element. The inactive hook
	// performs no observations, layout reads, or animation writes.
	return fg('platform-dst-motion-uplift') && enableObservedResizing ? observed : legacy;
};
