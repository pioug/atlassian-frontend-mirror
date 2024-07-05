import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

import { createPlugin } from './pm-plugin';

export type ContextMenuPlugin = NextEditorPlugin<
	'contextMenu',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
	}
>;

export const contextMenuPlugin: ContextMenuPlugin = ({ api }) => ({
	name: 'contextMenu',

	pmPlugins: () => [
		{
			name: 'contextMenu',
			plugin: () => createPlugin(api),
		},
	],
});
