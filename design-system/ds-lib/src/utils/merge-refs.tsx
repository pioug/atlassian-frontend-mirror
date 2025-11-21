import { type MutableRefObject, type Ref, type RefCallback } from 'react';

/**
 * Assigns the node to all the refs passed in the argument.
 */
export default function mergeRefs<T>(refs: (Ref<T> | null | undefined | false)[]): RefCallback<T> {
	return (value: T | null) => {
		refs.forEach((ref) => {
			if (typeof ref === 'function') {
				ref(value);
			} else if (ref !== null && typeof ref === 'object') {
				(ref as MutableRefObject<T | null>).current = value;
			}
		});
	};
}
