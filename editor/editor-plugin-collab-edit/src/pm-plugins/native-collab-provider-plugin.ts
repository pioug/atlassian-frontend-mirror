import type {
  CollabEditProvider,
  CollabEvents,
} from '@atlaskit/editor-common/collab';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  EditorState,
  ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

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
      apply: (
        tr: ReadonlyTransaction,
        currentPluginState: CollabEditProvider<CollabEvents> | null,
      ) => {
        const provider = tr.getMeta(nativeCollabProviderPluginKey);
        return provider ? provider : currentPluginState;
      },
    },
    view: (editorView: EditorView) => {
      providerPromise.then(provider => {
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
