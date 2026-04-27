import { createContext, useContext, type Context } from 'react';

import noop from 'lodash/noop';

import { type PortalActions } from './types';

export const PortalActionsContext: Context<PortalActions> = createContext<PortalActions>({
	onCreatePortal: noop,
	onDestroyPortal: noop,
	onRegisterPluginContainer: noop,
});

export const usePortalActionsContext = (): PortalActions => useContext(PortalActionsContext);
