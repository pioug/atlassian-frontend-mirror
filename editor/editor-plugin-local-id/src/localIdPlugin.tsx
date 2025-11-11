import { replaceNode, getNode } from './editor-actions';
import type { LocalIdPlugin } from './localIdPluginType';
import { createPlugin } from './pm-plugins/main';

export const localIdPlugin: LocalIdPlugin = ({ api }) => ({
	name: 'localId',
	actions: {
		replaceNode: replaceNode(api),
		getNode: getNode(api),
	},
	pmPlugins() {
		return [
			{
				name: 'localIdPlugin',
				plugin: () => createPlugin(api),
			},
		];
	},
});
