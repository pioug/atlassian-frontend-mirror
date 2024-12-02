import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { FeatureFlagsPlugin } from './featureFlagsPluginType';

const pluginKey = new PluginKey('featureFlags');

/**
 * Feature flag plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
export const featureFlagsPlugin: FeatureFlagsPlugin = ({ config: featureFlags = {} }) => ({
	name: 'featureFlags',

	getSharedState(editorState) {
		if (!editorState) {
			return featureFlags || {};
		}

		return pluginKey.getState(editorState) || featureFlags || {};
	},

	pmPlugins() {
		return [
			{
				name: 'featureFlags',
				plugin: () =>
					new SafePlugin({
						key: pluginKey,
						state: {
							init: (): FeatureFlags => ({ ...featureFlags }),
							apply: (_, pluginState) => pluginState,
						},
					}),
			},
		];
	},
});
