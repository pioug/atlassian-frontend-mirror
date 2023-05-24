import { collab } from '@atlaskit/prosemirror-collab';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { CollabEditProvider } from '@atlaskit/collab-provider';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { createPlugin, pluginKey } from './plugin';
import {
  CollabEditOptions,
  ProviderBuilder,
  ProviderCallback,
  PrivateCollabEditOptions,
} from './types';
import { sendTransaction } from './events/send-transaction';
import { addSynchronyErrorAnalytics } from './analytics';
import { nativeCollabProviderPlugin } from './native-collab-provider-plugin';
import type featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
export { pluginKey };
export type { CollabEditOptions };

const providerBuilder: ProviderBuilder =
  (collabEditProviderPromise: Promise<CollabEditProvider>) =>
  async (codeToExecute, onError?: (error: Error) => void) => {
    try {
      const provider = await collabEditProviderPromise;
      if (provider) {
        return codeToExecute(provider);
      }
    } catch (err) {
      if (onError) {
        onError(err as Error);
      } else {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  };

const collabEditPlugin: NextEditorPlugin<
  'collabEdit',
  {
    pluginConfiguration: PrivateCollabEditOptions;
    dependencies: [typeof featureFlagsPlugin];
  }
> = (options, api) => {
  const featureFlags =
    api?.dependencies?.featureFlags?.sharedState.currentState() || {};

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
                plugin: () => collab({ clientID: userId }) as SafePlugin,
              },
              {
                name: 'nativeCollabProviderPlugin',
                plugin: () =>
                  nativeCollabProviderPlugin({
                    providerPromise: collabEditProviderPromise,
                  }),
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
              featureFlags,
            );
          },
        },
      ];
    },

    onEditorViewStateUpdated(props) {
      const addErrorAnalytics = addSynchronyErrorAnalytics(
        props.newEditorState,
        props.newEditorState.tr,
        featureFlags,
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
