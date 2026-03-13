// eslint-disable-next-line sort-imports
import { useContext, useEffect, useRef, type RefObject } from 'react';

import { type FocusableElement } from '../../types';
import { FocusManagerContext } from '../components/focus-manager';

// The refs stored in the context are used to programatically
// control focus on a user navigates using the keyboard.
function useRegisterItemWithFocusManager(): RefObject<FocusableElement> {
	const { registerRef } = useContext(FocusManagerContext);
	const itemRef = useRef<FocusableElement>(null);

	useEffect(() => {
		if (itemRef.current !== null) {
			registerRef(itemRef.current);
		}
	}, [registerRef]);

	return itemRef;
}

export default useRegisterItemWithFocusManager;
