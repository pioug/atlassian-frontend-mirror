import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';

import type { ComponentRegistry, ToolbarElementNames } from '../primaryToolbarPluginType';

export const registerComponent =
	(componentRegistry: ComponentRegistry) =>
	({
		name,
		component,
	}: {
		component: ToolbarUIComponentFactory;
		name: ToolbarElementNames;
	}): void => {
		componentRegistry.set(name, component);
	};
