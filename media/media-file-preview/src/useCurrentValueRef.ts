import { type MutableRefObject, useRef } from 'react';

/** Stores the provided value in a ref object to avoid "component rerenders" when the value is used as a hook dependency */
export function useCurrentValueRef<T>(value: T): MutableRefObject<T> {
	const ref = useRef<T>(value);
	ref.current = value;
	return ref;
}
