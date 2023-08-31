import { collab } from '@atlaskit/prosemirror-collab';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { CollabEditProvider } from '@atlaskit/editor-common/collab';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { createPlugin, pluginKey } from './plugin';
import type {
  ProviderBuilder,
  ProviderCallback,
  PrivateCollabEditOptions,
} from './types';
import { sendTransaction } from './events/send-transaction';
import { addSynchronyErrorAnalytics } from './analytics';
import { nativeCollabProviderPlugin } from './native-collab-provider-plugin';
import type { FeatureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
export { pluginKey };

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
    dependencies: [FeatureFlagsPlugin, OptionalPlugin<typeof analyticsPlugin>];
  }
> = ({ config: options, api }) => {
  const featureFlags = api?.featureFlags?.sharedState.currentState() || {};

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
            return createPlugin(
              dispatch,
              providerFactory,
              providerResolver,
              executeProviderCode,
              options,
              featureFlags,
              api,
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
        api?.analytics?.actions,
      );

      executeProviderCode(
        sendTransaction({
          originalTransaction: props.originalTransaction,
          transactions: props.transactions,
          oldEditorState: props.oldEditorState,
          newEditorState: props.newEditorState,
          useNativePlugin: options?.useNativePlugin ?? false,
        }),
        addErrorAnalytics,
      );
    },
  };
};

export default collabEditPlugin;
