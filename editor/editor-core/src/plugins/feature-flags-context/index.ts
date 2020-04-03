import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { FeatureFlags } from './types';

export const pluginKey = new PluginKey('featureFlagsContextPlugin');

const featureFlagsContextPlugin = (
  featureFlags: FeatureFlags = {},
): EditorPlugin => ({
  name: 'featureFlagsContext',
  pmPlugins() {
    return [
      {
        name: 'featureFlagsContext',
        plugin: () =>
          new Plugin({
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

export const getFeatureFlags = (state: EditorState): FeatureFlags =>
  pluginKey.getState(state);

export default featureFlagsContextPlugin;
