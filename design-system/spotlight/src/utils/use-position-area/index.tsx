import { useEffect, useState } from 'react';

import { bind } from 'bind-event-listener';

import type { PositionArea } from '../../types';

/**
 * Future improvements to this might be to check if the target resizes with:
 * ```
 * 		const ro = new ResizeObserver(read);
 * 		ro.observe(targetRef.current);
 * ```
 *
 * No need to do this for the PopoverContent, as it has static height/width.
 */
export const usePositionArea = (
	ref: React.RefObject<HTMLElement>,
): PositionArea | 'none' | undefined => {
	const [positionArea, setPositionArea] = useState<PositionArea | 'none' | undefined>(undefined);

	useEffect(() => {
		const el = ref.current;
		if (!el) {
			return;
		}

		const readPositionArea = (): PositionArea | 'none' | undefined => {
			try {
				return el.computedStyleMap().get('position-area')?.toString() as
					| PositionArea
					| 'none'
					| undefined;
			} catch {
				// Some old browsers do not support computedStyleMap, so fall back to getPropertyValue
				return window.getComputedStyle(el).getPropertyValue('position-area').trim() as
					| PositionArea
					| 'none'
					| undefined;
			}
		};

		const read = () => {
			const positionArea = readPositionArea();
			setPositionArea(positionArea);
		};

		read();
		/**
		 * requestAnimationFrame ensures that initial renders are in a different position
		 * to the supplied prop value (e.g. the viewport is too small so the position is
		 * recalculated) are rendered correctly.
		 */
		const rafId = window.requestAnimationFrame(read);

		// Check if the viewport resizes
		const unbindResize = bind(window, {
			type: 'resize',
			listener: read,
			options: { passive: true },
		});

		// Check if the viewport scrolls
		const unbindScroll = bind(window, {
			type: 'scroll',
			listener: read,
			options: { passive: true, capture: true },
		});

		return () => {
			window.cancelAnimationFrame(rafId);
			unbindResize();
			unbindScroll();
		};
	}, [ref]);

	return positionArea;
};
