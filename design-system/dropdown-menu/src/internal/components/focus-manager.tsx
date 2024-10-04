import React, {
	createContext,
	type FC,
	type MutableRefObject,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
} from 'react';

import { bind } from 'bind-event-listener';

import __noop from '@atlaskit/ds-lib/noop';
import { UNSAFE_useLayering } from '@atlaskit/layering';

import { type FocusableElement } from '../../types';
import handleFocus from '../utils/handle-focus';

/**
 *
 *
 * Context provider which maintains the list of focusable elements and a method to
 * register new menu items.
 * This list drives the keyboard navigation of the menu.
 *
 */
export const FocusManagerContext = createContext<{
	menuItemRefs: FocusableElement[];
	registerRef: (ref: FocusableElement) => void;
}>({
	menuItemRefs: [],
	registerRef: __noop,
});

/**
 * Focus manager logic.
 */
const FocusManager: FC<{
	children: ReactNode;
	onClose: (e: KeyboardEvent) => void;
}> = ({ children, onClose }) => {
	const menuItemRefs = useRef<FocusableElement[]>([]);
	const registerRefCalls = useRef<number>(0);

	const registerRef = useCallback(
		(ref: FocusableElement) => upsertRefAtFirstPosition(ref, menuItemRefs, registerRefCalls),
		[],
	);

	const { isLayerDisabled } = UNSAFE_useLayering();
	useEffect(() => {
		// Intentionally reset count on each render
		registerRefCalls.current = 0;
		// Intentionally rebinding on each render
		return bind(window, {
			type: 'keydown',
			listener: handleFocus(menuItemRefs.current, isLayerDisabled, onClose),
		});
	});

	const contextValue = {
		menuItemRefs: menuItemRefs.current,
		registerRef,
	};

	return (
		<FocusManagerContext.Provider value={contextValue}>{children}</FocusManagerContext.Provider>
	);
};

/**
 * Insert the ref at the call position in the array.
 * If the ref is already in the array, move it to the call position.
 * If the call position is after the current position, ignore the call.
 *
 * @param ref
 * @param menuItemRefs
 * @param registerRefCalls
 */
function upsertRefAtFirstPosition(
	ref: FocusableElement,
	menuItemRefs: MutableRefObject<FocusableElement[]>,
	registerRefCalls: MutableRefObject<number>,
) {
	const positionOnCall = registerRefCalls.current++;

	// Add the ref to the correct position
	if (!menuItemRefs.current.includes(ref)) {
		menuItemRefs.current.splice(positionOnCall, 0, ref);
		return;
	}

	const positionCurrent = menuItemRefs.current.indexOf(ref);
	if (positionOnCall === positionCurrent) {
		// No change needed
		return;
	}

	if (positionOnCall > positionCurrent) {
		// Ignore and so keep the count the same
		registerRefCalls.current--;
		return;
	}

	// Update the position of the ref in the array
	menuItemRefs.current.splice(positionCurrent, 1);
	menuItemRefs.current.splice(positionOnCall, 0, ref);
}

export default FocusManager;
