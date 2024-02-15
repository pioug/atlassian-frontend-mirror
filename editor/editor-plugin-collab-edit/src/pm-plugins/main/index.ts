import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  fireAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import type {
  CollabEditProvider,
  SyncUpErrorFunction,
} from '@atlaskit/editor-common/collab';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  ExtractInjectionAPI,
  FeatureFlags,
} from '@atlaskit/editor-common/types';
import type {
  EditorState,
  ReadonlyTransaction,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { addSynchronyErrorAnalytics } from '../../analytics';
import { initialize } from '../../events/initialize';
import type { PrivateCollabEditOptions, ProviderCallback } from '../../types';
import type { CollabEditPlugin } from '../../types';

import { pluginKey } from './plugin-key';
import { PluginState } from './plugin-state';

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  providerResolver: (value: CollabEditProvider) => void,
  collabProviderCallback: ProviderCallback,
  options: PrivateCollabEditOptions,
  featureFlags: FeatureFlags,
  pluginInjectionApi: ExtractInjectionAPI<CollabEditPlugin> | undefined,
) => {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init(config: any) {
        return PluginState.init(config);
      },
      apply(
        transaction: ReadonlyTransaction,
        prevPluginState: PluginState,
        _oldEditorState: EditorState,
        _newEditorState: EditorState,
      ) {
        const pluginState = prevPluginState.apply(transaction);
        dispatch(pluginKey, pluginState);
        return pluginState;
      },
    },
    props: {
      decorations(state: EditorState) {
        return pluginKey.getState(state)?.decorations;
      },
    },
    filterTransaction(tr: Transaction, state: EditorState) {
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
    view(view: EditorView) {
      const addErrorAnalytics = addSynchronyErrorAnalytics(
        view.state,
        view.state.tr,
        featureFlags,
        pluginInjectionApi?.analytics?.actions,
      );
      const onSyncUpError: SyncUpErrorFunction = attributes => {
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
              providerPromise.then(provider => providerResolver(provider));
            }
          },
        );

      return {
        destroy() {
          providerFactory.unsubscribeAll('collabEditProvider');
          if (cleanup) {
            cleanup.then(unsubscribe => {
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
