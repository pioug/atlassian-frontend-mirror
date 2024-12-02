import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

import type { CreateDisplayGrid, GridPluginOptions, GridPluginState } from './types';

export type GridPlugin = NextEditorPlugin<
	'grid',
	{
		pluginConfiguration: GridPluginOptions | undefined;
		dependencies: [WidthPlugin];
		sharedState: GridPluginState | null;
		actions: {
			displayGrid: CreateDisplayGrid;
		};
	}
>;
