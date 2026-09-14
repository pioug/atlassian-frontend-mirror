import { useCallback, useEffect, useRef } from 'react';

import { getHookDeps } from './get-hook-deps';
import type { Opts } from './opts';

/**
 * Will return request animation frame as a function which will clean itself up.
 */
export const useRequestAnimationFrame = (
	opts: Opts = { cleanup: 'unmount' },
): ((handler: FrameRequestCallback) => void) => {
	const frames = useRef<number[]>([]);

	useEffect(() => {
		return () => {
			if (frames.current.length) {
				frames.current.forEach((id) => cancelAnimationFrame(id));
				frames.current = [];
			}
		};
		// We dynamically set this so we either clean up on the next effect - or on unmount.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, getHookDeps(opts));

	return useCallback((handler: FrameRequestCallback) => {
		const id = requestAnimationFrame((time) => {
			frames.current = frames.current.filter((frameId) => frameId !== id);
			handler(time);
		});
		frames.current.push(id);
	}, []);
};
