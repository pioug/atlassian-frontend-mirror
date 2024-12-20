import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import type {
	InsertBlockOptions,
	InsertBlockPluginDependencies,
	InsertBlockPluginState,
} from './types';

export type InsertBlockPlugin = NextEditorPlugin<
	'insertBlock',
	{
		pluginConfiguration: InsertBlockOptions | undefined;
		dependencies: InsertBlockPluginDependencies;
		actions: {
			toggleAdditionalMenu: () => void;
		};
		sharedState: InsertBlockPluginState | undefined;
	}
>;
