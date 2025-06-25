import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { CardPlugin } from '@atlaskit/editor-plugin-card';
import type { MentionsPlugin } from '@atlaskit/editor-plugin-mentions';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';

import type { FindReplacePluginState, FindReplaceToolbarButtonActionProps } from './types';

export type FindReplacePluginOptions = {
	takeFullWidth: boolean;
	twoLineEditorToolbar: boolean;
};

export type FindReplacePluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<PrimaryToolbarPlugin>,
	OptionalPlugin<MentionsPlugin>,
	OptionalPlugin<CardPlugin>,
];

export type FindReplacePlugin = NextEditorPlugin<
	'findReplace',
	{
		pluginConfiguration: FindReplacePluginOptions;
		sharedState: FindReplacePluginState | undefined;
		dependencies: FindReplacePluginDependencies;
		actions: {
			registerToolbarButton: (params: FindReplaceToolbarButtonActionProps) => React.ReactNode;
			activateFindReplace: (
				triggerMethod?: TRIGGER_METHOD.SHORTCUT | TRIGGER_METHOD.TOOLBAR | TRIGGER_METHOD.EXTERNAL,
			) => boolean;
		};
	}
>;
