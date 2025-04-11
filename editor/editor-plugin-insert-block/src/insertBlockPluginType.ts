import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import type {
	InsertBlockPluginOptions,
	InsertBlockPluginDependencies,
	InsertBlockPluginState,
} from './types';

export type InsertBlockPlugin = NextEditorPlugin<
	'insertBlock',
	{
		pluginConfiguration: InsertBlockPluginOptions | undefined;
		dependencies: InsertBlockPluginDependencies;
		actions: {
			toggleAdditionalMenu: () => void;
		};
		sharedState: InsertBlockPluginState | undefined;
	}
>;
