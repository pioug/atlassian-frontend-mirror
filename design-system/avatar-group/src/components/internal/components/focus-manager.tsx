import React, { type FC, type ReactNode, useCallback, useEffect, useRef } from 'react';

import { bind, type UnbindFn } from 'bind-event-listener';

import { type FocusableElement } from '../../types';
import handleFocus from '../utiles/handle-focus';

import { FocusManagerContext } from './focus-manager-context';

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Focus manager__
 *
 * A focus manager {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
const FocusManager: FC<{ children: ReactNode }> = ({ children }) => {
	const menuItemRefs = useRef<FocusableElement[]>([]);
	const registerRef = useCallback((ref: FocusableElement) => {
		if (ref && !menuItemRefs.current.includes(ref)) {
			menuItemRefs.current.push(ref);
		}
	}, []);

	// set focus and intentionally rebinding listener and clean up listener on each render
	useEffect(() => {
		bind(window, {
			type: 'keydown',
			listener: handleFocus(menuItemRefs.current),
		});

		const unbind: UnbindFn = () => {
			bind(window, {
				type: 'keydown',
				listener: handleFocus(menuItemRefs.current),
			});
		};

		return unbind;
	}, []);

	const contextValue = {
		menuItemRefs: menuItemRefs.current,
		registerRef,
	};

	return (
		<FocusManagerContext.Provider value={contextValue}>{children}</FocusManagerContext.Provider>
	);
};

export default FocusManager;
