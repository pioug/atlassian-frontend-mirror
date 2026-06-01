import React from 'react';


import { syncBlock, bodiedSyncBlock } from '@atlaskit/adf-schema';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type {
	EditorCommand,
	ExtractInjectionAPI,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import {
	flushBodiedSyncBlocks,
	flushSyncBlocks,
	discardUnpublishedSyncBlocks,
} from './editor-actions';
import {
	copySyncedBlockReferenceToClipboardEditorCommand,
	createSyncedBlock,
} from './editor-commands';
import { createPlugin, syncedBlockPluginKey } from './pm-plugins/main';
import { getMenuAndToolbarExperiencesPlugin } from './pm-plugins/menu-and-toolbar-experiences';
import type { SyncedBlockPlugin } from './syncedBlockPluginType';
import type { SyncedBlockSharedState } from './types';
import { getBlockMenuComponents } from './ui/block-menu-components';
import { DeleteConfirmationModal } from './ui/DeleteConfirmationModal';
import { Flag } from './ui/Flag';
import { getToolbarConfig } from './ui/floating-toolbar';
import { getQuickInsertConfig } from './ui/quick-insert';
import { SyncBlockRefresher } from './ui/SyncBlockRefresher';
import { getToolbarComponents } from './ui/toolbar-components';

/**
 * EDITOR-6929 / PR-G: Guard contentComponent rendering.
 * When `hasSyncedBlocks` is false return null
 * to avoid mounting SyncBlockRefresher, DeleteConfirmationModal, and Flag —
 * their hooks (useSharedPluginStateWithSelector) would execute selectors on
 * every transaction for no benefit on the ~99.98% of pages with zero synced
 * blocks.
 */
const LazySyncedBlockUI = ({
	syncBlockStore: syncBlockStoreManager,
	api,
}: {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	syncBlockStore: SyncBlockStoreManager;
}): React.JSX.Element | null => {
	const hasSyncBlocks = useSharedPluginStateWithSelector(
		api,
		['syncedBlock'],
		(states) => states.syncedBlockState?.hasSyncedBlocks,
	);

	// Use expValEqualsNoExposure here because the exposure is already fired
	// once at plugin creation time (see syncedBlockPlugin below).
	// This component re-renders on every transaction — avoid redundant SDK evaluations.
	if (!hasSyncBlocks && expValEqualsNoExposure('editor_synced_block_perf', 'isEnabled', true)) {
		return null;
	}

	return (
		<>
			<SyncBlockRefresher syncBlockStoreManager={syncBlockStoreManager} api={api} />
			<DeleteConfirmationModal syncBlockStoreManager={syncBlockStoreManager} api={api} />
			<Flag api={api} />
		</>
	);
};

export const syncedBlockPlugin: SyncedBlockPlugin = ({ config, api }) => {
	const refs: {
		containerElement?: HTMLElement;
		popupsMountPoint?: HTMLElement;
		wrapperElement?: HTMLElement;
	} = {};

	const viewMode = api?.editorViewMode?.sharedState.currentState()?.mode;
	const syncBlockStore = new SyncBlockStoreManager(
		config?.syncBlockDataProvider,
		viewMode,
		config?.__livePage,
	);
	const isPerfExperimentOn = expValEquals('editor_synced_block_perf', 'isEnabled', true);
	syncBlockStore.setFireAnalyticsEvent(api?.analytics?.actions?.fireAnalyticsEvent);

	// --- Memoized getSharedState (EDITOR-6929 / PR-F) ---
	// Cache the last returned shared state object. On each call, perform a
	// shallow comparison of all fields against the cached value. If nothing
	// changed, return the cached reference so SharedStateAPI subscribers
	// (React components) skip re-rendering.
	let cachedSharedState: SyncedBlockSharedState | undefined;

	api?.blockMenu?.actions.registerBlockMenuComponents(
		getBlockMenuComponents(api, config?.enableSourceCreation ?? false),
	);
	api?.toolbar?.actions.registerComponents(
		getToolbarComponents(api, config?.enableSourceCreation ?? false),
	);

	return {
		name: 'syncedBlock',

		nodes() {
			return [
				{
					name: 'syncBlock',
					node: syncBlock,
				},
				{
					name: 'bodiedSyncBlock',
					node: bodiedSyncBlock,
				},
			];
		},

		pmPlugins() {
			return [
				{
					name: 'syncedBlockPlugin',
					plugin: (params: PMPluginFactoryParams) =>
						createPlugin(config, params, syncBlockStore, api),
				},
				{
					name: 'menuAndToolbarExperiencesPlugin',
					plugin: () =>
						getMenuAndToolbarExperiencesPlugin({
							refs,
							dispatchAnalyticsEvent: (payload) =>
								api?.analytics?.actions?.fireAnalyticsEvent(payload),
						}),
				},
			];
		},

		commands: {
			copySyncedBlockReferenceToClipboard: (inputMethod): EditorCommand =>
				copySyncedBlockReferenceToClipboardEditorCommand(syncBlockStore, inputMethod, api),
			insertSyncedBlock:
				(): EditorCommand =>
				({ tr }) => {
					if (!config?.enableSourceCreation) {
						return null;
					}

					return (
						createSyncedBlock({
							tr,
							syncBlockStore,
							fireAnalyticsEvent: api?.analytics?.actions.fireAnalyticsEvent,
						}) || null
					);
				},
		},

		actions: {
			flushBodiedSyncBlocks: () => {
				return flushBodiedSyncBlocks(syncBlockStore);
			},
			flushSyncedBlocks: () => {
				return flushSyncBlocks(syncBlockStore);
			},
			discardUnpublishedSyncBlocks: () => {
				return discardUnpublishedSyncBlocks(syncBlockStore);
			},
		},

		pluginsOptions: {
			quickInsert: getQuickInsertConfig(config, api, syncBlockStore),
			floatingToolbar: (state, intl) => {
				// When the experiment is ON and the document has no synced blocks,
				// skip the toolbar config entirely to avoid the per-selection-change
				// cost of findSyncBlockOrBodiedSyncBlock (EDITOR-6931).
				// Save the expValEquals('editor_synced_block_perf', 'isEnabled', true) in a const
				// because floatingToolbar is called on every selection change.
				// computing it once at plugin initialisation is more efficient.
				if (!syncedBlockPluginKey.getState(state)?.hasSyncedBlocks && isPerfExperimentOn) {
					return undefined;
				}
				return getToolbarConfig(state, intl, api, syncBlockStore);
			},
		},

		contentComponent: ({ containerElement, wrapperElement, popupsMountPoint }) => {
			refs.containerElement = containerElement || undefined;
			refs.popupsMountPoint = popupsMountPoint || undefined;
			refs.wrapperElement = wrapperElement || undefined;

			return <LazySyncedBlockUI syncBlockStore={syncBlockStore} api={api} />;
		},

		getSharedState: (editorState?: EditorState): SyncedBlockSharedState | undefined => {
			if (!editorState) {
				return;
			}
			const pluginState = syncedBlockPluginKey.getState(editorState);
			const {
				activeFlag,
				syncBlockStore: currentSyncBlockStore,
				bodiedSyncBlockDeletionStatus,
				retryCreationPosMap,
				hasSyncedBlocks,
				hasUnsavedBodiedSyncBlockChanges,
			} = pluginState;

			// --- EDITOR-6929 / PR-F: return a stable reference when all
			// fields are unchanged to prevent unnecessary React re-renders. ---
			if (
				cachedSharedState !== undefined &&
				cachedSharedState.activeFlag === activeFlag &&
				cachedSharedState.syncBlockStore === currentSyncBlockStore &&
				cachedSharedState.bodiedSyncBlockDeletionStatus === bodiedSyncBlockDeletionStatus &&
				cachedSharedState.retryCreationPosMap === retryCreationPosMap &&
				cachedSharedState.hasSyncedBlocks === hasSyncedBlocks &&
				cachedSharedState.hasUnsavedBodiedSyncBlockChanges === hasUnsavedBodiedSyncBlockChanges &&
				isPerfExperimentOn
			) {
				return cachedSharedState;
			}

			const nextSharedState: SyncedBlockSharedState = {
				activeFlag,
				syncBlockStore: currentSyncBlockStore,
				bodiedSyncBlockDeletionStatus,
				retryCreationPosMap,
				hasSyncedBlocks,
				hasUnsavedBodiedSyncBlockChanges,
			};
			cachedSharedState = nextSharedState;
			return nextSharedState;
		},

		// Destroy the SyncBlockStoreManager on editor unmount to cancel
		// pending timers, subscriptions, and in-flight fetches.
		destroy() {
			if (fg('platform_synced_block_patch_14')) {
				syncBlockStore.destroy();
			}
		},
	};
};
