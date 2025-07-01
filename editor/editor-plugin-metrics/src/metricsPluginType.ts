import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
	UserPreferencesProvider,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import type { MetricsState } from './pm-plugins/main';

type handleIntentToStartEditProps = {
	newSelection?: Selection;
	shouldStartTimer?: boolean;
	shouldPersistActiveSession?: boolean;
};

export type MetricsPluginOptions = {
	// To deprecate when userPreferencesPlugin is added
	userPreferencesProvider?: UserPreferencesProvider;
};

export type MetricsPlugin = NextEditorPlugin<
	'metrics',
	{
		pluginConfiguration?: MetricsPluginOptions;
		dependencies: [OptionalPlugin<AnalyticsPlugin>, OptionalPlugin<UserPreferencesPlugin>];
		sharedState: MetricsState;
		commands: {
			setContentMoved: () => EditorCommand;
			startActiveSessionTimer: () => EditorCommand;
			stopActiveSession: () => EditorCommand;
			handleIntentToStartEdit: ({
				newSelection,
				shouldStartTimer,
				shouldPersistActiveSession,
			}: handleIntentToStartEditProps) => EditorCommand;
		};
	}
>;
