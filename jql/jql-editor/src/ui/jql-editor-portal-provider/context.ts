import { createContext, useContext } from 'react';

import noop from 'lodash/noop';

import { PortalActions } from './types';

export const PortalActionsContext = createContext<PortalActions>({
  onCreatePortal: noop,
  onDestroyPortal: noop,
  onRegisterPluginContainer: noop,
});

export const usePortalActionsContext = () => useContext(PortalActionsContext);
