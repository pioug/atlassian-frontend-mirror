import { createRegistry } from '@atlaskit/editor-ui-control-model/create-registry';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';

import type { UiControlRegistryPlugin } from './uiControlRegistryPluginType';

export const uiControlRegistryPlugin: UiControlRegistryPlugin = () => {
	const registry = createRegistry();

	return {
		name: 'uiControlRegistry',

		actions: {
			getComponent: (component) => registry.getComponent(component),

			register: (components: RegisterComponent[], options): void => {
				registry.register(components, options);
			},

			unregister: registry.unregister,

			getComponents: registry.getComponents,
		},
	};
};
