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
