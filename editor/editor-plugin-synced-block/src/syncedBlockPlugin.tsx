import { getSyncedBlockNodeView } from './nodeviews/syncedBlock';
import { createPlugin } from './pm-plugins/main';
import type { SyncedBlockPlugin } from './syncedBlockPluginType';
import { getToolbarConfig } from './ui/floating-toolbar';

export const syncedBlockPlugin: SyncedBlockPlugin = () => ({
	name: 'syncedBlock',
	props: {
		nodeViews: {
			syncedBlock: getSyncedBlockNodeView(),
		},
	},
	pmPlugins() {
		return [
			{
				name: 'syncedBlockPlugin',
				plugin: createPlugin,
			},
		];
	},
	pluginsOptions: {
		floatingToolbar: getToolbarConfig(),
	},
});
