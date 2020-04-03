import { EditorView } from 'prosemirror-view';
import { Step } from 'prosemirror-transform';
import { ProviderFactory } from '@atlaskit/editor-common';
import memoizeOne from 'memoize-one';
import {
  handleInit,
  handleConnection,
  handlePresence,
  handleTelePointer,
  applyRemoteData,
} from '../actions';
import { pluginKey } from '../plugin-key';
import { CollabEditProvider } from '../provider';
import { unsubscribeAllEvents } from './unsubscribe';
import { PrivateCollabEditOptions } from '../types';

const initCollab = (
  collabEditProvider: CollabEditProvider,
  view: EditorView,
) => {
  collabEditProvider.initialize(
    () => view.state,
    json => Step.fromJSON(view.state.schema, json),
  );
};

const initCollabMemo = memoizeOne(initCollab);

type Props = {
  view: EditorView;
  options: PrivateCollabEditOptions;
  providerFactory: ProviderFactory;
};

export const initialize = ({ options, providerFactory, view }: Props) => (
  provider: CollabEditProvider,
) => {
  const pluginState = pluginKey.getState(view.state);
  if (pluginState.isReady) {
    unsubscribeAllEvents(provider);
  }
  provider
    .on('init', data => {
      view.dispatch(view.state.tr.setMeta('collabInitialised', true));
      handleInit(data, view, options, providerFactory);
    })
    .on('connected', data => handleConnection(data, view))
    .on('data', data => applyRemoteData(data, view, options))
    .on('presence', data => handlePresence(data, view))
    .on('telepointer', data => handleTelePointer(data, view))
    .on('local-steps', data => {
      const { steps } = data;
      const { state } = view;
      const { tr } = state;
      steps.forEach((step: Step) => tr.step(step));
      view.dispatch(tr);
    })
    .on('error', error => {
      // TODO: Handle errors property (ED-2580)
      // eslint-disable-next-line no-console
      console.log('error: ', error);
    });
  // Initialize provider
  /**
   * We only want to initialise once, if we reload/reconfigure this plugin
   * We dont want to re-init collab, it would break existing sessions
   */
  initCollabMemo(provider, view);
};
