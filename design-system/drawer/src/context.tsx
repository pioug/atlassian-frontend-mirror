import { createContext, useContext } from 'react';

import invariant from 'tiny-invariant';

import type { DrawerProps } from './compiled/types';

/**
 * Context used to share the `onClose` prop value with sub-components.
 */
export const OnCloseContext = createContext<DrawerProps['onClose']>(undefined);

export const useOnClose = () => useContext(OnCloseContext);

/**
 * Used to ensure Drawer sub-components are used within a Drawer component,
 * and provide a useful error message if not.
 */
export const EnsureIsInsideDrawerContext = createContext<boolean>(false);

export const useEnsureIsInsideDrawer = () => {
	const context = useContext(EnsureIsInsideDrawerContext);
	invariant(context, 'Drawer sub-components must be used within a Drawer component.');
};
