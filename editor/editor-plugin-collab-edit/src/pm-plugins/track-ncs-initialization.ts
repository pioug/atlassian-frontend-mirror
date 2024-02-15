import { isDirtyTransaction } from '@atlaskit/editor-common/collab';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type {
  EditorState,
  ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';

import type { CollabInitializedMetadata } from '../types';

export const trackNCSInitializationPluginKey =
  new PluginKey<CollabInitializedMetadata>(
    'collabTrackNCSInitializationPlugin',
  );

export const createPlugin = () => {
  return new SafePlugin<CollabInitializedMetadata>({
    key: trackNCSInitializationPluginKey,
    state: {
      init() {
        return {
          collabInitialisedAt: null,
          firstChangeAfterInitAt: null,
        };
      },
      apply(
        transaction: ReadonlyTransaction,
        prevPluginState: CollabInitializedMetadata,
        oldState: EditorState,
      ) {
        if (Boolean(transaction.getMeta('collabInitialised'))) {
          return {
            collabInitialisedAt: Date.now(),
            firstChangeAfterInitAt: null,
          };
        }

        const shouldCheckDocument =
          prevPluginState.collabInitialisedAt &&
          !prevPluginState.firstChangeAfterInitAt;

        if (!shouldCheckDocument) {
          return prevPluginState;
        }

        const isDocumentReplaceFromRemote =
          Boolean(transaction.getMeta('isRemote')) &&
          Boolean(transaction.getMeta('replaceDocument'));

        if (isDocumentReplaceFromRemote) {
          return prevPluginState;
        }

        if (isDirtyTransaction(transaction)) {
          return prevPluginState;
        }

        if (transaction.docChanged && !transaction.doc.eq(oldState.doc)) {
          return {
            collabInitialisedAt: prevPluginState.collabInitialisedAt,
            firstChangeAfterInitAt: Date.now(),
          };
        }

        return prevPluginState;
      },
    },

    props: {
      attributes(editorState: EditorState) {
        const trackPluginState =
          trackNCSInitializationPluginKey.getState(editorState);

        return {
          ['data-has-collab-initialised']: `${Boolean(
            trackPluginState?.collabInitialisedAt,
          )}`,
        };
      },
    },
  });
};
