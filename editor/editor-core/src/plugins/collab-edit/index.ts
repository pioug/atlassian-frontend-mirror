import { collab } from 'prosemirror-collab';
import { CollabEditProvider } from '@atlaskit/editor-common';
import { EditorPlugin } from '../../types';
import { createPlugin, pluginKey } from './plugin';
import {
  CollabEditOptions,
  ProviderBuilder,
  ProviderCallback,
  PrivateCollabEditOptions,
} from './types';
export { CollabProvider } from './provider';
export type { CollabEditProvider } from './provider';
import { sendTransaction } from './events/send-transaction';
import { addSynchronyErrorAnalytics } from './analytics';

export { pluginKey };
export type { CollabEditOptions };

const providerBuilder: ProviderBuilder = (
  collabEditProviderPromise: Promise<CollabEditProvider>,
) => async (codeToExecute, onError?: (error: Error) => void) => {
  try {
    const provider = await collabEditProviderPromise;
    if (provider) {
      return codeToExecute(provider);
    }
  } catch (err) {
    if (onError) {
      onError(err);
    } else {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
};

const collabEditPlugin = (options: PrivateCollabEditOptions): EditorPlugin => {
  let providerResolver: (value: CollabEditProvider) => void = () => {};
  const collabEditProviderPromise: Promise<CollabEditProvider> = new Promise(
    (_providerResolver) => {
      providerResolver = _providerResolver;
    },
  );
  const executeProviderCode: ProviderCallback = providerBuilder(
    collabEditProviderPromise,
  );

  return {
    name: 'collabEdit',

    pmPlugins() {
      const { useNativePlugin = false, userId = null } = options || {};

      return [
        ...(useNativePlugin
          ? [
              {
                name: 'pmCollab',
                plugin: () => collab({ clientID: userId }),
              },
            ]
          : []),
        {
          name: 'collab',
          plugin: ({ dispatch, providerFactory }) => {
            providerFactory &&
              providerFactory.subscribe(
                'collabEditProvider',
                (
                  _name: string,
                  providerPromise?: Promise<CollabEditProvider>,
                ) => {
                  if (providerPromise) {
                    providerPromise.then((provider) =>
                      providerResolver(provider),
                    );
                  }
                },
              );

            return createPlugin(
              dispatch,
              providerFactory,
              executeProviderCode,
              options,
            );
          },
        },
      ];
    },

    onEditorViewStateUpdated(props) {
      const addErrorAnalytics = addSynchronyErrorAnalytics(
        props.newEditorState,
        props.newEditorState.tr,
      );

      executeProviderCode(
        sendTransaction({
          originalTransaction: props.originalTransaction,
          transactions: props.transactions,
          oldEditorState: props.oldEditorState,
          newEditorState: props.newEditorState,
          useNativePlugin: options && options.useNativePlugin!,
        }),
        addErrorAnalytics,
      );
    },
  };
};

export default collabEditPlugin;
