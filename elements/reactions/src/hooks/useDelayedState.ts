import { useCallback, useRef, useEffect, useState } from 'react';

type useDelayedStateResponse<T> = [T, (value: T, immediate?: boolean) => void];

export const useDelayedState = <T>(initialState: T, delay: number): useDelayedStateResponse<T> => {
	const [state, setState] = useState<T>(initialState);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const handleDelayedStateChange = useCallback(
		(newState: T, immediate = false) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			if (immediate) {
				setState(newState);
			} else {
				timeoutRef.current = setTimeout(() => {
					setState(newState);
				}, delay);
			}
		},
		[delay],
	);

	return [state, handleDelayedStateChange];
};
