import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import type {
	DeletionMechanism,
	DeletionReason,
} from '@atlaskit/editor-synced-block-provider/common/types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SyncedBlockPlugin } from '../../syncedBlockPluginType';
import { FLAG_ID } from '../../types';
import type { ActiveFlag, SyncBlockInfo } from '../../types';
import { syncedBlockPluginKey } from '../main';

import { recomputeDeleteTransaction } from './recompute-delete-transaction';

export type TransactionRef = { current: Transaction | undefined };

const onRetry =
	(
		api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
		syncBlockStore: SyncBlockStoreManager,
	) =>
	() => {
		api?.core?.actions.execute(({ tr }) => {
			return tr.setMeta(syncedBlockPluginKey, {
				bodiedSyncBlockDeletionStatus: 'processing',
				activeFlag: false,
			});
		});
		syncBlockStore.sourceManager.retryDeletion();
	};

const onDismissed = (syncBlockStore: SyncBlockStoreManager) => (tr: Transaction) => {
	syncBlockStore.sourceManager.clearPendingDeletion();
	return tr.setMeta(syncedBlockPluginKey, {
		bodiedSyncBlockDeletionStatus: 'none',
	});
};

export const handleBodiedSyncBlockRemoval = (
	bodiedSyncBlockRemoved: SyncBlockInfo[],
	syncBlockStore: SyncBlockStoreManager,
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	confirmationTransactionRef: TransactionRef,
	deletionReason: DeletionReason,
	mechanism?: DeletionMechanism,
) => {
	// Clear potential old pending deletion to retreat the deletion as first attempt
	syncBlockStore.sourceManager.clearPendingDeletion();

	// If there are source sync blocks being removed, and we need to confirm with user before deleting,
	// we block the transaction here, and wait for user confirmation to proceed with deletion.
	// See editor-common/src/sync-block/sync-block-store-manager.ts for how we handle user confirmation and
	// proceed with deletion.
	syncBlockStore.sourceManager.deleteSyncBlocksWithConfirmation(
		bodiedSyncBlockRemoved.map((node) => node.attrs),
		deletionReason,
		() => {
			if (fg('platform_editor_blocks_patch_4')) {
				// Recompute the delete fresh from the live document instead of
				// replaying a stashed-and-rebased transaction. The stash/rebase
				// approach produced stale, schema-invalid transactions when the
				// document changed shape (local edits or remote collab) while the
				// confirmation modal was open — the dominant signature being
				// "Invalid content for node bodiedSyncBlock: <>". See EDITOR-7889.
				api?.core?.actions.execute(({ tr }) => {
					const recomputedTr = recomputeDeleteTransaction(
						tr,
						syncBlockStore.sourceManager.isSourceBlock,
						bodiedSyncBlockRemoved.map((node) => node.attrs),
					);

					// The target node(s) no longer exist in the live document (e.g.
					// a remote collaborator already removed them). There is nothing
					// to delete locally, so return `null` to skip the dispatch
					// entirely — dispatching the untouched transaction would be a
					// no-op that still runs the plugin's filter/append hooks. The
					// backend deletion has already been issued by the store manager.
					if (!recomputedTr) {
						return null;
					}

					recomputedTr.setMeta('isConfirmedSyncBlockDeletion', true);
					if (!recomputedTr.getMeta(pmHistoryPluginKey)) {
						// bodiedSyncBlock deletion is expected to be permanent (cannot undo)
						// For a normal deletion (not triggered by undo), remove it from history so that it cannot be undone
						recomputedTr.setMeta('addToHistory', false);
					}
					return recomputedTr;
				});
				return;
			}

			const confirmationTransaction = confirmationTransactionRef.current;
			if (!confirmationTransaction) {
				return;
			}
			api?.core?.actions.execute(() => {
				const trToDispatch = confirmationTransaction.setMeta('isConfirmedSyncBlockDeletion', true);
				if (!trToDispatch.getMeta(pmHistoryPluginKey)) {
					// bodiedSyncBlock deletion is expected to be permanent (cannot undo)
					// For a normal deletion (not triggered by undo), remove it from history so that it cannot be undone
					trToDispatch.setMeta('addToHistory', false);
				}
				return trToDispatch;
			});
		},
		(success) => {
			api?.core?.actions.execute(({ tr }) => {
				let newState: Record<string, unknown>;
				if (!success) {
					newState = {
						activeFlag: {
							id: FLAG_ID.FAIL_TO_DELETE,
							onRetry: onRetry(api, syncBlockStore),
							onDismissed: onDismissed(syncBlockStore),
						} as ActiveFlag,
					};
				} else {
					newState = { activeFlag: false };
				}
				newState = {
					...newState,
					bodiedSyncBlockDeletionStatus: syncBlockStore.sourceManager.isRetryingDeletion()
						? // For retry, reset to none directly to clean up the status
							'none'
						: // For the first attempt, set to completed for deletion modal can close the modal
							'completed',
				};
				return tr.setMeta(syncedBlockPluginKey, newState);
			});
		},
		() => {
			confirmationTransactionRef.current = undefined;
		},
		mechanism,
	);
	return false;
};
