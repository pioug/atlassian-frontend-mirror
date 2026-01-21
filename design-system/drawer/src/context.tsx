import { type Context, createContext, type SyntheticEvent, useContext } from 'react';

import invariant from 'tiny-invariant';

import type { DrawerProps } from './types';

/**
 * Context used to share the `onClose` prop value with sub-components.
 */
export const OnCloseContext: Context<((event: SyntheticEvent<HTMLElement>, analyticsEvent?: any) => void) | undefined> = createContext<DrawerProps['onClose']>(undefined);

export const useOnClose = (): ((event: SyntheticEvent<HTMLElement>, analyticsEvent?: any) => void) | undefined => useContext(OnCloseContext);

/**
 * Used to ensure Drawer sub-components are used within a Drawer component,
 * and provide a useful error message if not.
 */
export const EnsureIsInsideDrawerContext: Context<boolean> = createContext<boolean>(false);

export const useEnsureIsInsideDrawer = (): void => {
	const context = useContext(EnsureIsInsideDrawerContext);
	invariant(context, 'Drawer sub-components must be used within a Drawer component.');
};
