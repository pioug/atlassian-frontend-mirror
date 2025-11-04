import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import { lazyBodiedSyncBlockView } from '../nodeviews/bodiedLazySyncedBlock';
import { lazySyncBlockView } from '../nodeviews/lazySyncedBlock';
import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';

import { trackSyncBlocks } from './utils/track-sync-blocks';

export const syncedBlockPluginKey = new PluginKey('syncedBlockPlugin');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type SyncedBlockPluginState = {};

export const createPlugin = (
	options: SyncedBlockPluginOptions | undefined,
	pmPluginFactoryParams: PMPluginFactoryParams,
	syncBlockStore: SyncBlockStoreManager,
	api?: ExtractInjectionAPI<SyncedBlockPlugin>,
) => {
	return new SafePlugin<SyncedBlockPluginState>({
		key: syncedBlockPluginKey,
		state: {
			init(_, instance: EditorState): SyncedBlockPluginState {
				const syncBlockNodes = instance.doc.children.filter(
					(node) => node.type.name === 'syncBlock',
				);
				syncBlockStore.fetchSyncBlocksData(syncBlockNodes);
				return {};
			},
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(syncedBlockPluginKey);
				if (meta) {
					return meta;
				}
				return currentPluginState;
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
				!syncBlockStore?.requireConfirmationBeforeDelete() ||
				Boolean(tr.getMeta('isRemote')) ||
				Boolean(tr.getMeta('isConfirmedSyncBlockDeletion'))
			) {
				return true;
			}

			const { removed } = trackSyncBlocks(syncBlockStore, tr, state);

			if (removed.length > 0) {
				// If there are source sync blocks being removed, and we need to confirm with user before deleting,
				// we block the transaction here, and wait for user confirmation to proceed with deletion.
				// See editor-common/src/sync-block/sync-block-store-manager.ts for how we handle user confirmation and
				// proceed with deletion.
				syncBlockStore.deleteSyncBlocksWithConfirmation(tr, removed);

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
