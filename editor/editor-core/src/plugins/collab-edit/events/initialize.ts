import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { Step } from '@atlaskit/editor-prosemirror/transform';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import memoizeOne from 'memoize-one';

import type {
  CollabEditProvider,
  SyncUpErrorFunction,
} from '@atlaskit/editor-common/collab';
import type { PrivateCollabEditOptions } from '../types';
import type { Cleanup } from './handlers';
import { subscribe } from './handlers';
import { pluginKey } from '../plugin-key';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

const initCollab = (
  collabEditProvider: CollabEditProvider,
  view: EditorView,
) => {
  if (collabEditProvider.initialize) {
    collabEditProvider.initialize(
      () => view.state,
      (json) => Step.fromJSON(view.state.schema, json),
    );
  }
};

const initNewCollab = (
  collabEditProvider: CollabEditProvider,
  view: EditorView,
  onSyncUpError?: SyncUpErrorFunction,
) => {
  collabEditProvider.setup({ getState: () => view.state, onSyncUpError });
};

const initCollabMemo = memoizeOne(initCollab);

type Props = {
  view: EditorView;
  options: PrivateCollabEditOptions;
  providerFactory: ProviderFactory;
  featureFlags: FeatureFlags;
  editorAnalyticsApi: EditorAnalyticsAPI | undefined;
};

export const initialize =
  ({
    options,
    providerFactory,
    view,
    featureFlags,
    editorAnalyticsApi,
  }: Props) =>
  (provider: CollabEditProvider) => {
    let cleanup: Cleanup | undefined;
    const pluginState = pluginKey.getState(view.state);

    if (pluginState?.isReady && cleanup) {
      cleanup();
    }

    cleanup = subscribe(
      view,
      provider,
      options,
      featureFlags,
      providerFactory,
      editorAnalyticsApi,
    );

    // Initialize provider
    if (options.useNativePlugin) {
      // ED-13912 For NCS we don't want to use memoizeOne because it causes
      // infinite text while changing page-width
      initNewCollab(provider, view, options.onSyncUpError);
    } else {
      /**
       * We only want to initialise once, if we reload/reconfigure this plugin
       * We dont want to re-init collab, it would break existing sessions
       */
      initCollabMemo(provider, view);
    }

    return cleanup;
  };
