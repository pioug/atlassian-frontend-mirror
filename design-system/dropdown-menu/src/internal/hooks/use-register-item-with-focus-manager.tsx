import { useContext, useEffect, useRef } from 'react';

import { type FocusableElementRef } from '../../types';
import { FocusManagerContext } from '../components/focus-manager';

type GetRef<R> = R extends { current: infer T } ? T : R extends (i: infer T) => void ? T : never;

// This function is called whenever a MenuItem mounts.
// The refs stored in the context are used to programmatically
// control focus on a user navigates using the keyboard.
function useRegisterItemWithFocusManager() {
	const { registerRef } = useContext(FocusManagerContext);
	const itemRef = useRef<GetRef<FocusableElementRef>>(null);

	useEffect(() => registerRef(itemRef), [registerRef]);

	return itemRef;
}

export default useRegisterItemWithFocusManager;
