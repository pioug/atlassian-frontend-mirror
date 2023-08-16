import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { CollabEditProvider } from '@atlaskit/editor-common/collab';

const nativeCollabProviderPluginKey = new PluginKey(
  'nativeCollabProviderPlugin',
);
export const nativeCollabProviderPlugin = ({
  providerPromise,
}: {
  providerPromise: Promise<CollabEditProvider>;
}) => {
  return new SafePlugin<CollabEditProvider | null>({
    key: nativeCollabProviderPluginKey,
    state: {
      init: () => null,
      apply: (tr, currentPluginState) => {
        const provider = tr.getMeta(nativeCollabProviderPluginKey);
        return provider ? provider : currentPluginState;
      },
    },
    view: (editorView: EditorView) => {
      providerPromise.then((provider) => {
        const { dispatch, state } = editorView;
        const tr = state.tr;
        tr.setMeta(nativeCollabProviderPluginKey, provider);
        dispatch(tr);
      });
      return {};
    },
  });
};

export const getCollabProvider = (
  editorState: EditorState,
): CollabEditProvider | null => {
  return nativeCollabProviderPluginKey.getState(editorState);
};
