import React, { createContext } from 'react';

import __noop from '@atlaskit/ds-lib/noop';

import { type FocusableElement } from '../../types';

/**
 * Context provider which maintains the list of focusable elements and a method to
 * register new menu items.
 * This list drives the keyboard navgation of the menu.
 *
 */
export const FocusManagerContext: React.Context<{
	menuItemRefs: FocusableElement[];
	registerRef: (ref: FocusableElement) => void;
}> = createContext<{
	menuItemRefs: FocusableElement[];
	registerRef: (ref: FocusableElement) => void;
}>({
	menuItemRefs: [],
	registerRef: __noop,
});
