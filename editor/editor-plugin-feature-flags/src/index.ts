import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  FeatureFlags,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

const pluginKey = new PluginKey('featureFlags');
export type FeatureFlagsPlugin = NextEditorPlugin<
  'featureFlags',
  {
    pluginConfiguration: FeatureFlags;
    sharedState: FeatureFlags;
  }
>;

const featureFlagsPlugin: FeatureFlagsPlugin = ({
  config: featureFlags = {},
}) => ({
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

export default featureFlagsPlugin;
