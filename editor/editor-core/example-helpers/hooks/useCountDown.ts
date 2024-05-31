import { useCallback, useRef } from 'react';

export const useCountDown = (duration: number, onComplete: Function = () => {}) => {
	const intervalRef = useRef<number>(NaN);
	const completeFuncRef = useRef<Function>(onComplete);

	const completeHanlder = useCallback(() => {
		clearTimeout(intervalRef.current);
		completeFuncRef.current?.();
	}, []);

	const start = useCallback(() => {
		if (intervalRef.current) {
			clearTimeout(intervalRef.current);
		}

		intervalRef.current = window.setTimeout(completeHanlder, duration);
	}, [completeHanlder, duration]);

	const stop = useCallback(() => {
		if (intervalRef.current) {
			clearTimeout(intervalRef.current);
		}
	}, []);

	return {
		duration,
		start,
		stop,
	};
};
