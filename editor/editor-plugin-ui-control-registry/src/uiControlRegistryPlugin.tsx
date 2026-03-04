import { createRegistry } from '@atlaskit/editor-ui-control-model';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';

import type { UiControlRegistryPlugin } from './uiControlRegistryPluginType';

/**
 * Collect all components that belong to the tree rooted at `surfaceKey`.
 *
 * A surface is a root component (one with no `parents`). Starting from that
 * root, every component whose parent chain leads back to it is included.
 */
function getComponentsForSurface(
	allComponents: RegisterComponent[],
	surfaceKey: string,
): RegisterComponent[] {
	const root = allComponents.find(
		(c) => c.key === surfaceKey && (!c.parents || c.parents.length === 0),
	);
	if (!root) {
		return [];
	}

	const includedKeys = new Set<string>([surfaceKey]);
	let changed = true;

	while (changed) {
		changed = false;
		for (const component of allComponents) {
			if (includedKeys.has(component.key)) {
				continue;
			}
			if (component.parents?.some((p) => includedKeys.has(p.key))) {
				includedKeys.add(component.key);
				changed = true;
			}
		}
	}

	return allComponents.filter((c) => includedKeys.has(c.key));
}

export const uiControlRegistryPlugin: UiControlRegistryPlugin = () => {
	const registry = createRegistry();

	return {
		name: 'uiControlRegistry',

		actions: {
			register: (components: RegisterComponent[]): void => {
				registry.register(components);
			},

			getComponents: (surface: string): RegisterComponent[] => {
				return getComponentsForSurface(registry.components, surface);
			},
		},
	};
};
