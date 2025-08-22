import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

import type { CreateDisplayGrid, GridPluginOptions, GridPluginState } from './types';

export type GridPluginConfiguration = GridPluginOptions | undefined;
export type GridPluginDependencies = [WidthPlugin];
export type GridPluginSharedState = GridPluginState | null;
export type GridPluginActions = {
	displayGrid: CreateDisplayGrid;
};

export type GridPlugin = NextEditorPlugin<
	'grid',
	{
		actions: GridPluginActions;
		dependencies: GridPluginDependencies;
		pluginConfiguration: GridPluginConfiguration;
		sharedState: GridPluginSharedState;
	}
>;
