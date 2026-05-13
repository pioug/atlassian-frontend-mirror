import { useCallback, useEffect, useRef } from 'react';

interface Opts {
	cleanup: 'next-effect' | 'unmount';
}

const getHookDeps = (opts: Opts) => {
	switch (opts.cleanup) {
		case 'next-effect':
			return undefined;

		case 'unmount':
		default:
			return [];
	}
};

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
