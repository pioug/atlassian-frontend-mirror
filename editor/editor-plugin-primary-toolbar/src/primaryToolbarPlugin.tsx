import type { ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';

import { registerComponent } from './editor-actions/actions';
import { createPlugin, primaryToolbarPluginKey } from './pm-plugins/pm-plugin';
import type { PrimaryToolbarPlugin } from './primaryToolbarPluginType';
import Separator from './ui/separator';

export const primaryToolbarPlugin: PrimaryToolbarPlugin = ({ config }) => {
	// We use a plugin variable to store the component registry to avoid having to use
	// effects in each plugin, and to enable rendering the toolbar in SSR
	// TODO: ED-26962 - Replace this with something in plugin state once we have a way to initialise across plugins on plugin initialisation
	const componentRegistry = new Map<string, ToolbarUIComponentFactory>();

	// Pre-fill registry with the separator component
	componentRegistry.set('separator', Separator);

	return {
		name: 'primaryToolbar',

		actions: {
			registerComponent: registerComponent(componentRegistry),
		},

		pmPlugins: () => [
			{
				name: 'primaryToolbar',
				plugin: () =>
					createPlugin({
						componentRegistry,
						contextualFormattingEnabled: config?.contextualFormattingEnabled,
					}),
			},
		],

		getSharedState(editorState) {
			if (!editorState) {
				return;
			}

			return primaryToolbarPluginKey.getState(editorState);
		},
	};
};
