import { Plugin } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import { fixTablesKey } from 'prosemirror-tables';
import { Dispatch } from '../../event-dispatcher';
import { sendTransaction } from './events/send-transaction';
import { initialize } from './events/initialize';
import { unsubscribeAllEvents } from './events/unsubscribe';
import { PrivateCollabEditOptions, ProviderCallback } from './types';
import { CollabEditProvider } from './provider';
import { PluginState } from './plugin-state';
import { pluginKey } from './plugin-key';
import { addSynchronyErrorAnalytics } from './analytics';

export { CollabEditProvider, PluginState, pluginKey };

export const createPlugin = (
  dispatch: Dispatch,
  providerFactory: ProviderFactory,
  collabProviderCallback: ProviderCallback,
  options: PrivateCollabEditOptions,
) => {
  return new Plugin({
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
        const { activeParticipants, sessionId } = pluginState;
        const pmTablesMeta = transaction.getMeta(fixTablesKey);

        if (
          !options.sendDataOnViewUpdated &&
          !(pmTablesMeta && pmTablesMeta.fixTables)
        ) {
          collabProviderCallback(
            sendTransaction({
              transaction,
              oldEditorState,
              newEditorState,
            }),
          );
        }

        dispatch(pluginKey, { activeParticipants, sessionId });
        return pluginState;
      },
    },
    props: {
      decorations(this: Plugin, state) {
        return this.getState(state).decorations;
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

      if (!pluginState.isReady && tr.docChanged) {
        return false;
      }

      return true;
    },
    view(view) {
      const addErrorAnalytics = addSynchronyErrorAnalytics(
        view.state,
        view.state.tr,
      );

      collabProviderCallback(
        initialize({ view, options, providerFactory }),
        addErrorAnalytics,
      );

      return {
        destroy() {
          providerFactory.unsubscribeAll('collabEditProvider');

          collabProviderCallback(unsubscribeAllEvents, addErrorAnalytics);
        },
      };
    },
  });
};
