import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import {
	type ResolvedUserPreferences,
	type UserPreferences,
	UserPreferencesProvider,
} from '@atlaskit/editor-common/user-preferences';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

export type Config = {
	userPreferencesProvider: UserPreferencesProvider;
};

export type PrefKey = keyof UserPreferences;
export type ResolvedPrefKey = keyof ResolvedUserPreferences;
export type UserPreferencesSharedState = { preferences: ResolvedUserPreferences };

export type UserPreferencesPlugin = NextEditorPlugin<
	'userPreferences',
	{
		pluginConfiguration: Config;
		actions: {
			updateUserPreference: (
				key: PrefKey,
				value: ResolvedUserPreferences[PrefKey],
			) => EditorCommand;
			setDefaultPreferences: (preferences: ResolvedUserPreferences) => void;
		};
		sharedState: UserPreferencesSharedState;
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
	}
>;
