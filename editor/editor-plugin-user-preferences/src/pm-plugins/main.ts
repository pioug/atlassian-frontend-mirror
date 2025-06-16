import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ResolvedUserPreferences } from '@atlaskit/editor-common/user-preferences';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type {
	UserPreferencesPluginOptions,
	UserPreferencesPlugin,
} from '../userPreferencesPluginType';

export const userPreferencesPluginKey = new PluginKey('userPreferencesPlugin');

type UserPreferencesPluginState = {
	preferences: ResolvedUserPreferences;
};

export const createPlugin = (
	pluginOptions: UserPreferencesPluginOptions,
	_api: ExtractInjectionAPI<UserPreferencesPlugin> | undefined,
) => {
	const { userPreferencesProvider, initialUserPreferences } = pluginOptions;

	const getInitialUserPreferences = (): ResolvedUserPreferences => {
		if (initialUserPreferences && editorExperiment('platform_editor_controls', 'variant1')) {
			return initialUserPreferences;
		}

		return {
			toolbarDockingPosition: 'top',
		};
	};

	return new SafePlugin<UserPreferencesPluginState>({
		key: userPreferencesPluginKey,
		state: {
			init() {
				return {
					preferences: userPreferencesProvider?.getPreferences() || getInitialUserPreferences(),
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
