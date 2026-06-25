import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ResolvedUserPreferences } from '@atlaskit/editor-common/user-preferences';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type {
	UserPreferencesPluginOptions,
	UserPreferencesPlugin,
} from '../userPreferencesPluginType';

/**
 * Given the current overrides and an override action `{ key, value }`, returns
 * the new overrides object:
 * - If `value` is `null` or `undefined`, the key is removed from overrides.
 * - Otherwise, the key is set to `value` in overrides.
 */
export const applyOverride = (
	currentOverrides: Partial<ResolvedUserPreferences>,
	override: {
		key: keyof ResolvedUserPreferences;
		value: ResolvedUserPreferences[keyof ResolvedUserPreferences] | null | undefined;
	},
): Partial<ResolvedUserPreferences> => {
	const { key, value } = override;
	if (value === null || value === undefined) {
		const { [key]: _, ...rest } = currentOverrides;
		return rest;
	}
	return { ...currentOverrides, [key]: value };
};

export const userPreferencesPluginKey: PluginKey = new PluginKey('userPreferencesPlugin');

type UserPreferencesPluginState = {
	overrides: Partial<ResolvedUserPreferences>;
	preferences: ResolvedUserPreferences;
};

export const createPlugin = (
	pluginOptions: UserPreferencesPluginOptions,
	_api: ExtractInjectionAPI<UserPreferencesPlugin> | undefined,
): SafePlugin<UserPreferencesPluginState> => {
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
					overrides: {} as Partial<ResolvedUserPreferences>,
				};
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(userPreferencesPluginKey);

				if (!meta || (!meta.preferences && !meta.override)) {
					return currentPluginState;
				}

				const nextState = { ...currentPluginState };

				if (meta.preferences) {
					nextState.preferences = {
						...currentPluginState.preferences,
						...meta.preferences,
					};
				}

				if (meta.override) {
					nextState.overrides = applyOverride(currentPluginState.overrides, meta.override);
				}

				return nextState;
			},
		},
	});
};
