import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

import type { FindReplacePluginState, FindReplaceToolbarButtonActionProps } from './types';

type Config = {
	takeFullWidth: boolean;
	twoLineEditorToolbar: boolean;
};

export type FindReplacePlugin = NextEditorPlugin<
	'findReplace',
	{
		pluginConfiguration: Config;
		sharedState: FindReplacePluginState | undefined;
		dependencies: [OptionalPlugin<AnalyticsPlugin>, OptionalPlugin<PrimaryToolbarPlugin>];
		actions: {
			getToolbarButton: (params: FindReplaceToolbarButtonActionProps) => React.ReactNode;
		};
	}
>;
