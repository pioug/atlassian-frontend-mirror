// eslint-disable-next-line sort-imports
import { useContext, useEffect, useRef, type MutableRefObject } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { type FocusableElementRef } from '../../types';
import { FocusManagerContext } from '../components/focus-manager';

type GetRef<R> = R extends { current: infer T } ? T : R extends (i: infer T) => void ? T : never;

// This function is called whenever a MenuItem mounts.
// The refs stored in the context are used to programmatically
// control focus on a user navigates using the keyboard.
function useRegisterItemWithFocusManager(
	hasPopup: boolean = false,
): MutableRefObject<HTMLAnchorElement | HTMLButtonElement | null> {
	const { registerRef } = useContext(FocusManagerContext);
	const itemRef = useRef<GetRef<FocusableElementRef>>(null);

	useEffect(() => {
		if (hasPopup && fg('select-avoid-duplicated-registered-ref')) {
			return;
		}
		registerRef(itemRef);
	}, [registerRef, hasPopup]);

	return itemRef;
}

export default useRegisterItemWithFocusManager;
