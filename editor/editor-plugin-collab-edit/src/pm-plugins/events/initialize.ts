import memoizeOne from 'memoize-one';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { CollabEditProvider, SyncUpErrorFunction } from '@atlaskit/editor-common/collab';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI, FeatureFlags } from '@atlaskit/editor-common/types';
import { Step } from '@atlaskit/editor-prosemirror/transform';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { CollabEditPlugin } from '../../collabEditPluginType';
import type { PrivateCollabEditOptions } from '../../types';
import { pluginKey } from '../main/plugin-key';
import { trackNCSInitializationPluginKey } from '../track-ncs-initialization';

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
	editorAnalyticsApi: EditorAnalyticsAPI | undefined;
	featureFlags: FeatureFlags;
	options: PrivateCollabEditOptions;
	pluginInjectionApi?: ExtractInjectionAPI<CollabEditPlugin> | undefined;
	providerFactory: ProviderFactory;
	view: EditorView;
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
	(provider: CollabEditProvider): Cleanup => {
		// eslint-disable-next-line prefer-const
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

		// Rebind path: if the provider has already initialised (i.e. this view()
		// is running because the editor preset was reconfigured or the EditorView
		// was recreated mid-session, e.g. on a rich-text → markdown-mode flip),
		// the provider's `init` event has already fired and won't fire again.
		// Without intervention the freshly-attached collab plugin view never sees
		// `collabInitialised`, so `filterTransaction` silently drops every
		// doc-changing transaction and the editor appears read-only.
		//
		// PM `state.reconfigure` preserves plugin state by key, so in many cases
		// the plugin state survives and no action is needed; we only seed when
		// state was actually lost (e.g. EditorView recreated from scratch).
		//
		// Gated behind `cc-markdown-mode` (the same experiment that drives the
		// preset rebuild on convert); when off, behaviour is unchanged. Uses
		// `expValEquals` (not `*NoExposure`) so the editor's statsig client
		// enrols the user — otherwise an early rebind can race the FE-side
		// exposure and read the default (false), defeating the gate. The
		// experiment check is last so legacy providers (no `getInitPayload`)
		// short-circuit and don't fire an exposure.
		if (provider.getInitPayload && expValEquals('cc-markdown-mode', 'isEnabled', true)) {
			const cachedInit = provider.getInitPayload();
			if (cachedInit) {
				// Defer one microtask so the new pluginView is fully registered
				// before we dispatch (mirrors the timing of a real `init` event).
				Promise.resolve().then(() => {
					if (view.isDestroyed) {
						return;
					}
					const currentCollabState = pluginKey.getState(view.state);
					const currentTrackState = trackNCSInitializationPluginKey.getState(view.state);
					// State was preserved across reconfigure → nothing to do.
					if (currentCollabState?.isReady && currentTrackState?.collabInitialisedAt) {
						return;
					}
					// Seed the freshly-attached pluginView so `isReady` flips to true,
					// `data-has-collab-initialised` becomes "true", and downstream
					// listeners (analytics, sweet-state, track-ncs) re-receive init.
					// Note: we intentionally do NOT replay `handleInit` (which would
					// call `replaceDocument`) — the document is already in the editor
					// and replacing it would clobber any in-flight local steps.
					view.dispatch(view.state.tr.setMeta('collabInitialised', true));
				});
			}
		}

		return cleanup;
	};
