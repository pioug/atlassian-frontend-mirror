import type { ContextMenuPlugin } from './contextMenuPluginType';
import { createPlugin } from './pm-plugins/main';

export const contextMenuPlugin: ContextMenuPlugin = ({ api }) => ({
	name: 'contextMenu',

	pmPlugins: () => [
		{
			name: 'contextMenu',
			plugin: () => createPlugin(api),
		},
	],
});
