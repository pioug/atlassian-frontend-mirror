import { useEffect, useRef, useState } from 'react';

/**
 * Provides a boolean value for whether an element is focused.
 * The `bindFocus` function returned provides two event handlers:
 * - `onFocus` and `onBlur` which when triggered set `isFocused` accordingly.
 */
export default function useFocus() {
	const [isFocused, setIsFocused] = useState(false);

	// ensure bindFocus has a stable ref
	const bindFocus = useRef({
		onFocus: (): void => setIsFocused(true),
		onBlur: (): void => setIsFocused(false),
	});

	useEffect(() => {
		// handle the case where a component might
		// unmount while being focused.
		return () => setIsFocused(false);
	}, []);

	return {
		isFocused,
		bindFocus: bindFocus.current,
	};
}
