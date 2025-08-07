import type { LocalIdPlugin } from './localIdPluginType';
import { createPlugin } from './pm-plugins/main';

export const localIdPlugin: LocalIdPlugin = () => ({
	name: 'localId',
	pmPlugins() {
		return [
			{
				name: 'localIdPlugin',
				plugin: createPlugin,
			},
		];
	},
});
