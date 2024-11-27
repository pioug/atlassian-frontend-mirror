import memoizeOne from 'memoize-one';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { CollabEditProvider, SyncUpErrorFunction } from '@atlaskit/editor-common/collab';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import { Step } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { CollabEditPlugin } from '../../collabEditPluginType';
import type { PrivateCollabEditOptions } from '../../types';
import { pluginKey } from '../main/plugin-key';

import type { Cleanup } from './handlers';
import { subscribe } from './handlers';

const initCollab = (collabEditProvider: CollabEditProvider, view: EditorView) => {
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
	editorApi?: ExtractInjectionAPI<CollabEditPlugin> | undefined,
	onSyncUpError?: SyncUpErrorFunction,
) => {
	collabEditProvider.setup({ getState: () => view.state, editorApi, onSyncUpError });
};

const initCollabMemo = memoizeOne(initCollab);

type Props = {
	view: EditorView;
	options: PrivateCollabEditOptions;
	providerFactory: ProviderFactory;
	featureFlags: FeatureFlags;
	editorAnalyticsApi: EditorAnalyticsAPI | undefined;
	pluginInjectionApi?: ExtractInjectionAPI<CollabEditPlugin> | undefined;
};

export const initialize =
	({
		options,
		providerFactory,
		view,
		featureFlags,
		editorAnalyticsApi,
		pluginInjectionApi,
	}: Props) =>
	(provider: CollabEditProvider) => {
		let cleanup: Cleanup | undefined;
		const pluginState = pluginKey.getState(view.state);

		if (pluginState?.isReady && cleanup) {
			cleanup();
		}

		cleanup = subscribe(view, provider, options, featureFlags, providerFactory, editorAnalyticsApi);

		// Initialize provider
		if (options.useNativePlugin) {
			// ED-13912 For NCS we don't want to use memoizeOne because it causes
			// infinite text while changing page-width
			initNewCollab(provider, view, pluginInjectionApi, options.onSyncUpError);
		} else {
			/**
			 * We only want to initialise once, if we reload/reconfigure this plugin
			 * We dont want to re-init collab, it would break existing sessions
			 */
			initCollabMemo(provider, view);
		}

		return cleanup;
	};
