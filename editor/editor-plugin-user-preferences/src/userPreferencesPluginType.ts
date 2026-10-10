import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { UserPreferencesProvider } from '@atlaskit/editor-common/user-preferences-provider';
import type {
	ResolvedUserPreferences,
	UserPreferences,
} from '@atlaskit/editor-common/user-preferences/user-preferences';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';

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
	overrides: Partial<ResolvedUserPreferences>;
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
		commands: {
			clearOverrideUserPreference: (key: ResolvedPrefKey) => EditorCommand;
			overrideUserPreference: (
				key: ResolvedPrefKey,
				value: ResolvedUserPreferences[ResolvedPrefKey],
			) => EditorCommand;
		};
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
		pluginConfiguration: UserPreferencesPluginOptions;
		sharedState: UserPreferencesSharedState;
	}
>;
