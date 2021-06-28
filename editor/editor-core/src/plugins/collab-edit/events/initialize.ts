import { EditorView } from 'prosemirror-view';
import { Step } from 'prosemirror-transform';
import { ProviderFactory } from '@atlaskit/editor-common';
import memoizeOne from 'memoize-one';

import { CollabEditProvider } from '../provider';
import { PrivateCollabEditOptions } from '../types';
import { subscribe, Cleanup } from './handlers';
import { pluginKey } from '../plugin-key';

const initCollab = (
  collabEditProvider: CollabEditProvider,
  view: EditorView,
) => {
  collabEditProvider.initialize(
    () => view.state,
    (json) => Step.fromJSON(view.state.schema, json),
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
  let cleanup: Cleanup | undefined;
  const pluginState = pluginKey.getState(view.state);

  if (pluginState.isReady && cleanup) {
    cleanup();
  }

  cleanup = subscribe(view, provider, options, providerFactory);

  // Initialize provider
  /**
   * We only want to initialise once, if we reload/reconfigure this plugin
   * We dont want to re-init collab, it would break existing sessions
   */
  initCollabMemo(provider, view);

  return cleanup;
};
