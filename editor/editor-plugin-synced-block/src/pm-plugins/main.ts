import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler } from '@atlaskit/editor-common/selection';
import { BodiedSyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { DecorationSet, EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import { lazyBodiedSyncBlockView } from '../nodeviews/bodiedLazySyncedBlock';
import { lazySyncBlockView } from '../nodeviews/lazySyncedBlock';
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';

import { calculateDecorations } from './utils/selection-decorations';
import { trackSyncBlocks } from './utils/track-sync-blocks';

export const syncedBlockPluginKey = new PluginKey('syncedBlockPlugin');

type SyncedBlockPluginState = {
	decorationSet: DecorationSet;
};

export const createPlugin = (
	options: SyncedBlockPluginOptions | undefined,
	pmPluginFactoryParams: PMPluginFactoryParams,
	syncBlockStore: SyncBlockStoreManager,
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
) => {
	const { useLongPressSelection = false } = options || {};

	return new SafePlugin<SyncedBlockPluginState>({
		key: syncedBlockPluginKey,
		state: {
			init(_, instance: EditorState): SyncedBlockPluginState {
				const syncBlockNodes = instance.doc.children.filter(
					(node) => node.type.name === 'syncBlock',
				);
				syncBlockStore.fetchSyncBlocksData(syncBlockNodes);
				return {
					decorationSet: calculateDecorations(instance.doc, instance.selection, instance.schema),
				};
			},
			apply: (tr, currentPluginState, oldEditorState) => {
				const meta = tr.getMeta(syncedBlockPluginKey);
				if (meta) {
					return meta;
				}

				let newState = currentPluginState;
				if (!tr.selection.eq(oldEditorState.selection)) {
					newState = {
						...newState,
						decorationSet: calculateDecorations(tr.doc, tr.selection, tr.doc.type.schema),
					};
				} else if (newState.decorationSet) {
					newState = {
						...newState,
						decorationSet: newState.decorationSet.map(tr.mapping, tr.doc),
					};
				}
				return newState;
			},
		},
		props: {
			nodeViews: {
				syncBlock: lazySyncBlockView({
					options,
					pmPluginFactoryParams,
					api,
					syncBlockStore,
				}),
				bodiedSyncBlock: lazyBodiedSyncBlockView({
					pluginOptions: options,
					pmPluginFactoryParams,
					api,
					syncBlockStore,
				}),
			},
			decorations: (state) => {
				const pluginState = syncedBlockPluginKey.getState(state);
				return pluginState?.decorationSet;
			},
			handleClickOn: createSelectionClickHandler(
				['bodiedSyncBlock'],
				(target) => !!target.closest(`.${BodiedSyncBlockSharedCssClassName.prefix}`),
				{ useLongPressSelection },
			),
		},
		view: (editorView: EditorView) => {
			syncBlockStore.setEditorView(editorView);

			return {
				destroy() {
					syncBlockStore.setEditorView(undefined);
				},
			};
		},
		filterTransaction: (tr, state) => {
			// Ignore transactions that don't change the document
			// or are from remote (collab) or already confirmed sync block deletion
			// We only care about local changes that change the document
			// and are not yet confirmed for sync block deletion
			if (
				!tr.docChanged ||
				(!syncBlockStore?.requireConfirmationBeforeDelete() &&
					!syncBlockStore.hasPendingCreation()) ||
				Boolean(tr.getMeta('isRemote')) ||
				Boolean(tr.getMeta('isConfirmedSyncBlockDeletion')) ||
				Boolean(tr.getMeta('isCommitSyncBlockCreation'))
			) {
				return true;
			}

			const { removed, added } = trackSyncBlocks(syncBlockStore, tr, state);

			if (removed.length > 0) {
				// If there are source sync blocks being removed, and we need to confirm with user before deleting,
				// we block the transaction here, and wait for user confirmation to proceed with deletion.
				// See editor-common/src/sync-block/sync-block-store-manager.ts for how we handle user confirmation and
				// proceed with deletion.
				syncBlockStore.deleteSyncBlocksWithConfirmation(tr, removed);

				return false;
			}

			if (added.length > 0) {
				// If there is bodiedSyncBlock node addition and it's waiting for the result of saving the node to backend (syncBlockStore.hasPendingCreation()),
				// we need to intercept the transaction and save it in insert callback so that we only insert it to the document when backend call if backend call is successful
				// The callback will be evoked by in SourceSyncBlockStoreManager.commitPendingCreation
				syncBlockStore.registerCreationCallback(() => {
					api?.core?.actions.execute(() => {
						return tr.setMeta('isCommitSyncBlockCreation', true);
					});
					api?.core.actions.focus();
				});

				return false;
			}

			return true;
		},
		appendTransaction: (trs, _oldState, newState) => {
			trs
				.filter((tr) => tr.docChanged)
				.forEach((tr) => {
					syncBlockStore?.rebaseTransaction(tr, newState);
				});

			return null;
		},
	});
};
