import { type ReactNode } from 'react';

import { type PluginContainerKey, type PluginContainers } from '../../plugins/types';

// Allow portal creators to provide their own container
export type Container = PluginContainerKey | Element;

export type PortalActions = {
	onCreatePortal: (key: string, portalComponent: ReactNode, container: Container) => void;
	onDestroyPortal: (key: string) => void;
	onRegisterPluginContainer: (
		containerKey: PluginContainerKey,
		element: HTMLElement | null,
	) => void;
};

export type PortalState = {
	components: {
		[key: string]: {
			container: Container;
			portalComponent: ReactNode;
		};
	};
	containers: PluginContainers;
};

type CreatePortalAction = {
	payload: {
		container: Container;
		key: string;
		portalComponent: ReactNode;
	};
	type: 'createPortal';
};

type DestroyPortalAction = {
	payload: string;
	type: 'destroyPortal';
};

type RegisterPluginContainerAction = {
	payload: {
		containerKey: PluginContainerKey;
		element: HTMLElement | null;
	};
	type: 'registerPluginContainer';
};

export type PortalAction = CreatePortalAction | DestroyPortalAction | RegisterPluginContainerAction;
