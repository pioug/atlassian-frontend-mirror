import React from 'react';

import { createPlugin } from './pm-plugins/main';
import type { SyncedBlockPlugin } from './syncedBlockPluginType';
import { GlobalStylesWrapper } from './ui/extensions/synced-block/components/GlobalStyles';

export const syncedBlockPlugin: SyncedBlockPlugin = () => {
	return {
		name: 'syncedBlock',
		pmPlugins() {
			return [
				{
					name: 'syncedBlockPlugin',
					plugin: createPlugin,
				},
			];
		},
		contentComponent() {
			return <GlobalStylesWrapper />;
		},
	};
};
