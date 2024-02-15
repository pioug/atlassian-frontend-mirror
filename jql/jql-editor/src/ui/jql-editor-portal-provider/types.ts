import { ReactNode } from 'react';

import { PluginContainerKey, PluginContainers } from '../../plugins/types';

// Allow portal creators to provide their own container
export type Container = PluginContainerKey | Element;

export type PortalActions = {
  onCreatePortal: (
    key: string,
    portalComponent: ReactNode,
    container: Container,
  ) => void;
  onDestroyPortal: (key: string) => void;
  onRegisterPluginContainer: (
    containerKey: PluginContainerKey,
    element: HTMLElement | null,
  ) => void;
};

export type PortalState = {
  components: {
    [key: string]: {
      portalComponent: ReactNode;
      container: Container;
    };
  };
  containers: PluginContainers;
};

type CreatePortalAction = {
  type: 'createPortal';
  payload: {
    key: string;
    portalComponent: ReactNode;
    container: Container;
  };
};

type DestroyPortalAction = {
  type: 'destroyPortal';
  payload: string;
};

type RegisterPluginContainerAction = {
  type: 'registerPluginContainer';
  payload: {
    containerKey: PluginContainerKey;
    element: HTMLElement | null;
  };
};

export type PortalAction =
  | CreatePortalAction
  | DestroyPortalAction
  | RegisterPluginContainerAction;
