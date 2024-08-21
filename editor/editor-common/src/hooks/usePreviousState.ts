import { useEffect, useRef } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

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

	if (fg('use-effect-in-use-previous-props')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	}

	const prevValue = ref.current;
	ref.current = value;
	return prevValue;
}
