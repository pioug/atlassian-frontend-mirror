import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { Dispatch } from '../../event-dispatcher';
import { initialize } from './events/initialize';
import type { PrivateCollabEditOptions, ProviderCallback } from './types';
import { PluginState } from './plugin-state';
import { pluginKey } from './plugin-key';
import { addSynchronyErrorAnalytics } from './analytics';
import {
  fireAnalyticsEvent,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type {
  FeatureFlags,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import type {
  CollabEditProvider,
  SyncUpErrorFunction,
} from '@atlaskit/editor-common/collab';
import type collabEditPlugin from './index';

export { PluginState, pluginKey };

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  providerResolver: (value: CollabEditProvider) => void,
  collabProviderCallback: ProviderCallback,
  options: PrivateCollabEditOptions,
  featureFlags: FeatureFlags,
  pluginInjectionApi: ExtractInjectionAPI<typeof collabEditPlugin> | undefined,
) => {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init(config) {
        return PluginState.init(config);
      },
      apply(
        transaction,
        prevPluginState: PluginState,
        oldEditorState,
        newEditorState,
      ) {
        const pluginState = prevPluginState.apply(transaction);
        dispatch(pluginKey, pluginState);
        return pluginState;
      },
    },
    props: {
      decorations(state) {
        return pluginKey.getState(state)?.decorations;
      },
    },
    filterTransaction(tr, state) {
      const pluginState = pluginKey.getState(state);
      const collabInitialiseTr = tr.getMeta('collabInitialised');

      // Don't allow transactions that modifies the document before
      // collab-plugin is ready.
      if (collabInitialiseTr) {
        return true;
      }

      if (!pluginState?.isReady && tr.docChanged) {
        return false;
      }

      return true;
    },
    view(view) {
      const addErrorAnalytics = addSynchronyErrorAnalytics(
        view.state,
        view.state.tr,
        featureFlags,
        pluginInjectionApi?.analytics?.actions,
      );
      const onSyncUpError: SyncUpErrorFunction = (attributes) => {
        const fireAnalyticsCallback = fireAnalyticsEvent(
          pluginInjectionApi?.analytics?.sharedState.currentState()
            ?.createAnalyticsEvent ?? undefined,
        );
        fireAnalyticsCallback({
          payload: {
            action: ACTION.NEW_COLLAB_SYNC_UP_ERROR_NO_STEPS,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
            attributes,
          },
        });
      };
      options.onSyncUpError = onSyncUpError;
      const cleanup = collabProviderCallback(
        initialize({
          view,
          options,
          providerFactory,
          featureFlags,
          editorAnalyticsApi: pluginInjectionApi?.analytics?.actions,
        }),
        addErrorAnalytics,
      );

      providerFactory &&
        providerFactory.subscribe(
          'collabEditProvider',
          (_name: string, providerPromise?: Promise<CollabEditProvider>) => {
            if (providerPromise) {
              providerPromise.then((provider) => providerResolver(provider));
            }
          },
        );

      return {
        destroy() {
          providerFactory.unsubscribeAll('collabEditProvider');
          if (cleanup) {
            cleanup.then((unsubscribe) => {
              if (unsubscribe) {
                unsubscribe();
              }
            });
          }
        },
      };
    },
  });
};
