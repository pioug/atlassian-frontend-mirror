import { collab } from 'prosemirror-collab';
import { EditorPlugin } from '../../types';
import { createPlugin, pluginKey } from './plugin';
import {
  CollabEditOptions,
  ProviderBuilder,
  ProviderCallback,
  PrivateCollabEditOptions,
} from './types';
export { CollabProvider, CollabEditProvider } from './provider';
import { sendTransaction } from './events/send-transaction';
import { CollabEditProvider } from '@atlaskit/editor-common';

export { CollabEditOptions, pluginKey };

const providerBuilder: ProviderBuilder = (
  collabEditProviderPromise: Promise<CollabEditProvider>,
) => async codeToExecute => {
  try {
    const provider = await collabEditProviderPromise;
    if (provider) {
      codeToExecute(provider);
    }
  } catch (err) {
    // TODO: ED-9002 Send analytics about failure in collab-edit.send-transaction
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

const collabEditPlugin = (options: PrivateCollabEditOptions): EditorPlugin => {
  let providerResolver: (value?: CollabEditProvider) => void = () => {};
  const collabEditProviderPromise: Promise<CollabEditProvider> = new Promise(
    _providerResolver => {
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
                    providerPromise.then(provider =>
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
      if (options.sendDataOnViewUpdated) {
        executeProviderCode(sendTransaction(props));
      }
    },
  };
};

export default collabEditPlugin;
