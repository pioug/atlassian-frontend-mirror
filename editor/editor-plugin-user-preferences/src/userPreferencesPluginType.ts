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
	 * The initial user preferences to be used when the userPreferencesProvider is not available.
	 * Otherwise, will default to the userPreferencesProvider's initial preferences.
	 */
	initialUserPreferences?: ResolvedUserPreferences;
	/**
	 * The user preferences provider to be used to get and set user preferences.
	 * When not provided, user preferences will not be persisted.
	 */
	userPreferencesProvider?: UserPreferencesProvider;
};

export type PrefKey = keyof UserPreferences;
export type ResolvedPrefKey = keyof ResolvedUserPreferences;
export type UserPreferencesSharedState = {
	preferences: ResolvedUserPreferences;
};

export type UserPreferencesPlugin = NextEditorPlugin<
	'userPreferences',
	{
		actions: {
			getUserPreferences: () => ResolvedUserPreferences | undefined;
			updateUserPreference: (
				key: PrefKey,
				value: ResolvedUserPreferences[PrefKey],
			) => EditorCommand;
		};
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		pluginConfiguration: UserPreferencesPluginOptions;
		sharedState: UserPreferencesSharedState;
	}
>;
