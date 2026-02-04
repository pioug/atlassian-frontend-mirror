import { useRef, useState } from 'react';

import type { FocusEventHandlers, FocusState } from './types';

/**
 * __Use focus ring__
 *
 * The useFocusRing hook manages focus in the rare cases where the focus ring’s visual application and the element that takes focus differ.
 * This is not typically a good practice for accessibility, so don’t do this unless you’ve consulted with the accessibility team.
 *
 */
const useFocusRing = (initialState: FocusState = 'off'): {
    readonly focusState: "on" | "off";
    readonly focusProps: FocusEventHandlers;
} => {
	const [focusState, setFocusState] = useState<'on' | 'off'>(initialState);
	const focusProps = useRef<FocusEventHandlers>({
		onFocus: () => setFocusState('on'),
		onBlur: () => setFocusState('off'),
	});

	return {
		focusState,
		focusProps: focusProps.current,
	} as const;
};

export default useFocusRing;
