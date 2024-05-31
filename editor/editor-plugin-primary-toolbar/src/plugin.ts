import { registerComponent } from './commands';
import { createPlugin, primaryToolbarPluginKey } from './pm-plugin';
import type { PrimaryToolbarPlugin } from './types';

export const primaryToolbarPlugin: PrimaryToolbarPlugin = () => ({
	name: 'primaryToolbar',

	commands: {
		registerComponent,
	},

	pmPlugins: () => [
		{
			name: 'primaryToolbar',
			plugin: () => createPlugin(),
		},
	],

	getSharedState(editorState) {
		if (!editorState) {
			return;
		}

		return primaryToolbarPluginKey.getState(editorState);
	},
});
