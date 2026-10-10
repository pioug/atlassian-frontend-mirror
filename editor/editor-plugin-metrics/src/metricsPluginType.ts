import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { UserPreferencesProvider } from '@atlaskit/editor-common/types/user-preferences';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin-type';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import type { MetricsState } from './pm-plugins/main';

type handleIntentToStartEditProps = {
	newSelection?: Selection;
	shouldPersistActiveSession?: boolean;
	shouldStartTimer?: boolean;
};

export type MetricsPluginOptions = {
	// To deprecate when userPreferencesPlugin is added
	userPreferencesProvider?: UserPreferencesProvider;
};

export type MetricsPlugin = NextEditorPlugin<
	'metrics',
	{
		commands: {
			handleIntentToStartEdit: ({
				newSelection,
				shouldStartTimer,
				shouldPersistActiveSession,
			}: handleIntentToStartEditProps) => EditorCommand;
			setContentMoved: () => EditorCommand;
			startActiveSessionTimer: () => EditorCommand;
			stopActiveSession: () => EditorCommand;
		};
		dependencies: [OptionalPlugin<AnalyticsPlugin>, OptionalPlugin<UserPreferencesPlugin>];
		pluginConfiguration?: MetricsPluginOptions;
		sharedState: MetricsState;
	}
>;
