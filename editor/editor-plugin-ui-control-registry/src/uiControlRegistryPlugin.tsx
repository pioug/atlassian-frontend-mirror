import { createRegistry } from '@atlaskit/editor-ui-control-model/create-registry';

import type { UiControlRegistryPlugin } from './uiControlRegistryPluginType';

export const uiControlRegistryPlugin: UiControlRegistryPlugin = () => {
	const registry = createRegistry();

	return {
		name: 'uiControlRegistry',

		actions: {
			getComponent: registry.getComponent,
			register: registry.register,
			subscribe: registry.subscribe,
			unregister: registry.unregister,
			getComponents: registry.getComponents,
		},
	};
};
