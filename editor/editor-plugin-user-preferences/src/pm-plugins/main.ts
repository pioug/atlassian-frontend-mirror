import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ResolvedUserPreferences } from '@atlaskit/editor-common/user-preferences';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import { Config, UserPreferencesPlugin } from '../userPreferencesPluginType';

export const userPreferencesPluginKey = new PluginKey('userPreferencesPlugin');

type UserPreferencesPluginState = {
	preferences: ResolvedUserPreferences;
};

export const createPlugin = (
	pluginOptions: Config,
	_api: ExtractInjectionAPI<UserPreferencesPlugin> | undefined,
) => {
	const { userPreferencesProvider } = pluginOptions;

	return new SafePlugin<UserPreferencesPluginState>({
		key: userPreferencesPluginKey,
		state: {
			init() {
				return {
					preferences: userPreferencesProvider.getPreferences(),
				};
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(userPreferencesPluginKey);
				if (meta?.preferences) {
					return {
						...currentPluginState,
						preferences: {
							...currentPluginState.preferences,
							...meta.preferences,
						},
					};
				}
				return currentPluginState;
			},
		},
	});
};
