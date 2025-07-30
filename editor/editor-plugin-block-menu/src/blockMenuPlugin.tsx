import type { BlockMenuPlugin } from './blockMenuPluginType';
import { createPlugin } from './pm-plugins/main';

export const blockMenuPlugin: BlockMenuPlugin = () => ({
	name: 'blockMenu',
	pmPlugins() {
		return [
			{
				name: 'blockMenuPlugin',
				plugin: createPlugin,
			},
		];
	},
});
