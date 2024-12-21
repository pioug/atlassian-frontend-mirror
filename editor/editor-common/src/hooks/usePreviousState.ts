import { useEffect, useRef } from 'react';

/**
 *
 * Can be used to get the previous state of a prop.
 * This can be helpful when converting class components to functional
 * where we don't have the `prevProps`.
 *
 * @param value New state of the
 * @param initialValue Optional parameter for the inital state of the component
 * @returns
 */
export default function usePreviousState<T>(value: T, initialValue?: T): T | undefined {
	const ref = useRef<T | undefined>(initialValue);

	useEffect(() => {
		// Setting the value to ref.current inside an effect, or otherwise the behaviour in staging/prod doesn't match with local
		// In local, the double rendering in react dev mode causes the previous value to be the same as next value immediately after
		// In prod and staging, double rendering is not done since that is a react prod build
		ref.current = value;
	}, [value]);

	return ref.current;
}
