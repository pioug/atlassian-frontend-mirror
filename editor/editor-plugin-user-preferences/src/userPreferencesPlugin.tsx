import {
	type ResolvedUserPreferences,
	useResolvedUserPreferences,
} from '@atlaskit/editor-common/user-preferences';

import { updateUserPreference } from './pm-plugins/commands';
import { createPlugin, userPreferencesPluginKey } from './pm-plugins/main';
import { useUserPreferencesInitListener } from './ui/useUserPreferencesInitListener';
import { useUserPreferencesUpdateListener } from './ui/useUserPreferencesUpdateListener';
import type { PrefKey, UserPreferencesPlugin } from './userPreferencesPluginType';

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
		},
		getSharedState(editorState) {
			if (!editorState) {
				return null;
			}
			return userPreferencesPluginKey.getState(editorState);
		},
		usePluginHook({ editorView }) {
			const { resolvedUserPreferences } = useResolvedUserPreferences(userPreferencesProvider);

			useUserPreferencesUpdateListener(editorView, resolvedUserPreferences);
			useUserPreferencesInitListener(
				Boolean(userPreferencesProvider?.isInitialized),
				resolvedUserPreferences,
				api,
			);
		},
	};
};
