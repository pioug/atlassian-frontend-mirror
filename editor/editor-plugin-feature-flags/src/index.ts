import { PluginKey } from 'prosemirror-state';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { FeatureFlags, NextEditorPlugin } from '@atlaskit/editor-common/types';

const pluginKey = new PluginKey('featureFlags');
const featureFlagsPlugin: NextEditorPlugin<
  'featureFlags',
  {
    pluginConfiguration: FeatureFlags;
    sharedState: FeatureFlags;
  }
> = (featureFlags = {}) => ({
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
