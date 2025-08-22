import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import type {
	InsertBlockPluginOptions,
	InsertBlockPluginDependencies,
	InsertBlockPluginState,
} from './types';

export type InsertBlockPlugin = NextEditorPlugin<
	'insertBlock',
	{
		actions: {
			toggleAdditionalMenu: () => void;
		};
		dependencies: InsertBlockPluginDependencies;
		pluginConfiguration: InsertBlockPluginOptions | undefined;
		sharedState: InsertBlockPluginState | undefined;
	}
>;
