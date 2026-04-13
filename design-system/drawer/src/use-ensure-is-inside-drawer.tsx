import { useContext } from 'react';

import invariant from 'tiny-invariant';

import { EnsureIsInsideDrawerContext } from './ensure-is-inside-drawer-context';

export const useEnsureIsInsideDrawer = (): void => {
	const context = useContext(EnsureIsInsideDrawerContext);
	invariant(context, 'Drawer sub-components must be used within a Drawer component.');
};
