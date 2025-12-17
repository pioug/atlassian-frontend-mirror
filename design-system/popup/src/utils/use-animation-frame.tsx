import { useCallback, useRef } from 'react';

export const useAnimationFrame = () => {
	const animationsRef = useRef<Array<number>>([]);

	const requestFrame = useCallback((callback: () => void): number => {
		const id = requestAnimationFrame(callback);
		animationsRef.current.push(id);
		return id;
	}, []);

	const cancelFrame = useCallback((id: number): void => {
		cancelAnimationFrame(id);
		animationsRef.current = animationsRef.current.filter((frameId) => frameId !== id);
	}, []);

	const cancelAllFrames = useCallback((): void => {
		animationsRef.current.forEach((id) => cancelAnimationFrame(id));
		animationsRef.current = [];
	}, []);

	return {
		requestFrame,
		cancelFrame,
		cancelAllFrames,
	};
};
