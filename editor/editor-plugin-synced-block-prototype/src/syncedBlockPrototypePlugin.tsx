import React from 'react';

import { createPlugin } from './pm-plugins/main';
import type { SyncedBlockPrototypePlugin } from './syncedBlockPrototypePluginType';
import { GlobalStylesWrapper } from './ui/extensions/synced-block/components/GlobalStyles';

export const syncedBlockPrototypePlugin: SyncedBlockPrototypePlugin = () => {
	return {
		name: 'syncedBlockPrototype',
		pmPlugins() {
			return [
				{
					name: 'syncedBlockPrototypePlugin',
					plugin: createPlugin,
				},
			];
		},
		contentComponent() {
			return <GlobalStylesWrapper />;
		},
	};
};
