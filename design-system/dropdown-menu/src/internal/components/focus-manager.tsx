import React, {
	createContext,
	type FC,
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import { bind } from 'bind-event-listener';

import __noop from '@atlaskit/ds-lib/noop';
import { UNSAFE_useLayering } from '@atlaskit/layering';

import { type FocusableElementRef } from '../../types';
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
	menuItemRefs: FocusableElementRef[];
	registerRef(ref: FocusableElementRef): void;
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
	const menuItemRefs = useRef<FocusableElementRef[]>([]);
	// Used to force a re-render only
	const [refresh, setRefresh] = useState(0);
	const registerMode = useRef<'ordered' | 'unordered' | 'regenerate'>('ordered');
	registerMode.current = 'ordered';

	const registerRef = useCallback(
		(ref: FocusableElementRef): void => {
			if (menuItemRefs.current.includes(ref)) {
				return;
			}

			switch (registerMode.current) {
				case 'ordered':
					menuItemRefs.current.push(ref);
					break;
				case 'unordered':
					// Reset and force a rerender
					registerMode.current = 'regenerate';
					menuItemRefs.current = [];
					setRefresh(refresh + 1);
					break;
				case 'regenerate':
					// Ignore registrations until the next render cycle
					break;
				default:
					throw new Error(`Unexpected case of ${registerMode.current}`);
			}
		},
		// Updating register ref on force reload will cause `useRegisterItemWithFocusManager` to re-register
		[refresh],
	);

	const { isLayerDisabled } = UNSAFE_useLayering();

	// Intentionally rebinding on each render
	useEffect(() => {
		if (registerMode.current === 'ordered') {
			// Use effect is called after rendering is complete and useEffects of the children a called first
			registerMode.current = 'unordered';
		}
	});

	useEffect(
		() =>
			bind(window, {
				type: 'keydown',
				listener: handleFocus(menuItemRefs, isLayerDisabled, onClose),
			}),
		[isLayerDisabled, onClose],
	);

	const contextValue = {
		menuItemRefs: menuItemRefs.current,
		registerRef,
	};

	return (
		<FocusManagerContext.Provider value={contextValue}>{children}</FocusManagerContext.Provider>
	);
};

export default FocusManager;
