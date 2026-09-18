import React from 'react';

import { bodiedSyncBlock } from '@atlaskit/adf-schema/bodied-sync-block';
import { syncBlock } from '@atlaskit/adf-schema/sync-block';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type {
	EditorCommand,
	ExtractInjectionAPI,
	PMPluginFactoryParams,
} from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from './syncedBlockPluginType';
import type { SyncedBlockSharedState } from './types';
import { getBlockMenuComponents } from './ui/block-menu-components';
import { DeleteConfirmationModal } from './ui/DeleteConfirmationModal';
import { Flag } from './ui/Flag';
import { getToolbarConfig } from './ui/floating-toolbar';
import { getQuickInsertConfig } from './ui/quick-insert';
import { getSyncedBlockQuickInsertComponents } from './ui/quick-insert/getSyncedBlockQuickInsertComponents';
import { SourceSyncBlockPlaceholder } from './ui/SourceSyncBlockPlaceholder';
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
	editorView,
	onFeedbackPromptShown,
	onGiveFeedback,
}: {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	editorView?: EditorView;
	onFeedbackPromptShown: SyncedBlockPluginOptions['onFeedbackPromptShown'];
	onGiveFeedback: SyncedBlockPluginOptions['onGiveFeedback'];
	syncBlockStore: SyncBlockStoreManager;
}): React.JSX.Element | null => {
	const hasSyncBlocks = useSharedPluginStateWithSelector(
		api,
		['syncedBlock'],
		(states) => states.syncedBlockState?.hasSyncedBlocks,
	);

	if (!hasSyncBlocks) {
		return null;
	}

	return (
		<>
			<SyncBlockRefresher syncBlockStoreManager={syncBlockStoreManager} api={api} />
			<DeleteConfirmationModal
				syncBlockStoreManager={syncBlockStoreManager}
				api={api}
				editorView={editorView}
			/>
			<Flag
				api={api}
				onFeedbackPromptShown={onFeedbackPromptShown}
				onGiveFeedback={onGiveFeedback}
			/>
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

	const isRegisteredSlashCommandEnabled = isExperimentEnabled('platform_editor_slash_command');

	if (isRegisteredSlashCommandEnabled && config?.enableSourceCreation) {
		api?.uiControlRegistry?.actions.register(
			getSyncedBlockQuickInsertComponents({ api, syncBlockStore }),
		);
	}

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
				copySyncedBlockReferenceToClipboardEditorCommand(
					syncBlockStore,
					inputMethod,
					api,
					config?.__livePage,
				),
			insertSyncedBlock:
				(inputMethod): EditorCommand =>
				({ tr }) => {
					if (!config?.enableSourceCreation) {
						return null;
					}

					return (
						createSyncedBlock({
							tr,
							syncBlockStore,
							fireAnalyticsEvent: api?.analytics?.actions.fireAnalyticsEvent,
							inputMethod,
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
			...(!isRegisteredSlashCommandEnabled && {
				quickInsert: getQuickInsertConfig(config, api, syncBlockStore),
			}),
			floatingToolbar: (state, intl) => {
				// When registered slash-command support is on and the document has no synced blocks,
				// skip the toolbar config entirely to avoid the per-selection-change
				// cost of findSyncBlockOrBodiedSyncBlock (EDITOR-6931).
				if (!syncedBlockPluginKey.getState(state)?.hasSyncedBlocks) {
					return undefined;
				}
				return getToolbarConfig(
					state,
					intl,
					api,
					syncBlockStore,
					config?.__livePage,
					config?.onGiveFeedback,
				);
			},
		},

		contentComponent: ({ containerElement, wrapperElement, popupsMountPoint, editorView }) => {
			refs.containerElement = containerElement || undefined;
			refs.popupsMountPoint = popupsMountPoint || undefined;
			refs.wrapperElement = wrapperElement || undefined;

			return (
				<>
					{expValEquals('platform_editor_sync_block_activation', 'isEnabled', true) && (
						<SourceSyncBlockPlaceholder />
					)}
					<LazySyncedBlockUI
						syncBlockStore={syncBlockStore}
						api={api}
						editorView={editorView}
						onFeedbackPromptShown={config?.onFeedbackPromptShown}
						onGiveFeedback={config?.onGiveFeedback}
					/>
				</>
			);
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
				cachedSharedState.hasUnsavedBodiedSyncBlockChanges === hasUnsavedBodiedSyncBlockChanges
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
			syncBlockStore.destroy();
		},
	};
};
