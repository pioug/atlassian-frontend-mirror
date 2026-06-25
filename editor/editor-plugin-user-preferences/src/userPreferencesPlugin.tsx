import { useResolvedUserPreferences } from '@atlaskit/editor-common/user-preferences';
import type { ResolvedUserPreferences } from '@atlaskit/editor-common/user-preferences';

import {
	clearOverrideUserPreference,
	overrideUserPreference,
	updateUserPreference,
} from './pm-plugins/commands';
import { createPlugin, userPreferencesPluginKey } from './pm-plugins/main';
import { useDocumentVisibilityWatcher } from './ui/useDocumentVisibilityWatcher';
import { useUserPreferencesInitListener } from './ui/useUserPreferencesInitListener';
import { useUserPreferencesUpdateListener } from './ui/useUserPreferencesUpdateListener';
import type { PrefKey, ResolvedPrefKey, UserPreferencesPlugin } from './userPreferencesPluginType';

export const userPreferencesPlugin: UserPreferencesPlugin = ({ config, api }) => {
	const userPreferencesProvider = config.userPreferencesProvider;

	return {
		name: 'userPreferences',
		pmPlugins() {
			return [
				{
					name: 'userPreferencesPlugin',
					plugin: () => {
						return createPlugin(config, api);
					},
				},
			];
		},
		actions: {
			updateUserPreference: (key: PrefKey, value: ResolvedUserPreferences[PrefKey]) => {
				return updateUserPreference({
					key,
					value,
					userPreferencesProvider,
					editorAnalyticsApi: api?.analytics?.actions,
				});
			},
			getUserPreferences: () => {
				if (!userPreferencesProvider) {
					return config.initialUserPreferences;
				}
				return userPreferencesProvider.getPreferences();
			},
		},
		commands: {
			overrideUserPreference: (key: PrefKey, value: ResolvedUserPreferences[ResolvedPrefKey]) => {
				return overrideUserPreference({ key, value });
			},
			clearOverrideUserPreference: (key: PrefKey) => {
				return clearOverrideUserPreference({ key });
			},
		},
		getSharedState(editorState) {
			if (!editorState) {
				return null;
			}

			const state = userPreferencesPluginKey.getState(editorState);

			// state can return undefined if the plugin hasn't been registered
			if (!state) {
				return null;
			} else if (!state.overrides || Object.keys(state.overrides).length === 0) {
				return state;
			}

			return {
				...state,
				preferences: {
					...state.preferences,
					...state.overrides,
				},
			};
		},
		usePluginHook({ editorView }) {
			const { resolvedUserPreferences } = useResolvedUserPreferences(userPreferencesProvider);

			useUserPreferencesUpdateListener(editorView, resolvedUserPreferences);
			useDocumentVisibilityWatcher(userPreferencesProvider);
			useUserPreferencesInitListener(
				Boolean(userPreferencesProvider?.isInitialized),
				resolvedUserPreferences,
				api,
			);
		},
	};
};
