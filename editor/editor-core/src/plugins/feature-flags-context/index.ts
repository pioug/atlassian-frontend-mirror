import { Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { useEditorContext } from '../../ui/EditorContext';
import type { FeatureFlags } from '../../types/feature-flags';

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

export const useFeatureFlags = (): FeatureFlags | undefined => {
  const { editorActions } = useEditorContext();
  const editorView = editorActions?._privateGetEditorView();
  return editorView?.state ? pluginKey.getState(editorView.state) : undefined;
};

export default featureFlagsContextPlugin;
