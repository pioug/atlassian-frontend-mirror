import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import {
	type ResolvedUserPreferences,
	type UserPreferencesProvider,
	type UserPreferences,
} from '@atlaskit/editor-common/user-preferences';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

export type UserPreferencesPluginOptions = {
	/**
	 * The user preferences provider to be used to get and set user preferences.
	 * When not provided, user preferences will not be persisted.
	 */
	userPreferencesProvider?: UserPreferencesProvider;
	/**
	 * The initial user preferences to be used when the userPreferencesProvider is not available.
	 * Otherwise, will default to the userPreferencesProvider's initial preferences.
	 */
	initialUserPreferences?: ResolvedUserPreferences;
};

export type PrefKey = keyof UserPreferences;
export type ResolvedPrefKey = keyof ResolvedUserPreferences;
export type UserPreferencesSharedState = { preferences: ResolvedUserPreferences };

export type UserPreferencesPlugin = NextEditorPlugin<
	'userPreferences',
	{
		pluginConfiguration: UserPreferencesPluginOptions;
		actions: {
			updateUserPreference: (
				key: PrefKey,
				value: ResolvedUserPreferences[PrefKey],
			) => EditorCommand;
		};
		sharedState: UserPreferencesSharedState;
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
	}
>;
