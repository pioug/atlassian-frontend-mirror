import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T | undefined): T | undefined {
	const ref = useRef<T | undefined>();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
}
