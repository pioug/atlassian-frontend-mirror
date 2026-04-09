import React, { createContext } from 'react';

import __noop from '@atlaskit/ds-lib/noop';

import { type FocusableElementRef } from '../../types';

/**
 * __Focus manager context__
 *
 * A context that stores dropdown menu item refs and provides a way to register
 * them for focus management within the dropdown menu.
 */
export const FocusManagerContext: React.Context<{
	menuItemRefs: FocusableElementRef[];
	registerRef(ref: FocusableElementRef): void;
}> = createContext<{
	menuItemRefs: FocusableElementRef[];
	registerRef(ref: FocusableElementRef): void;
}>({
	menuItemRefs: [],
	registerRef: __noop,
});
