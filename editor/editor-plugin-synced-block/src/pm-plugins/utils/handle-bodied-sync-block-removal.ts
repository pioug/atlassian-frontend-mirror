import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';

import type { SyncedBlockPlugin } from '../../syncedBlockPluginType';
import { FLAG_ID, type ActiveFlag, type SyncBlockInfo } from '../../types';
import { syncedBlockPluginKey } from '../main';

export type ConfirmationTransactionRef = { current: Transaction | undefined };

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
	tr: Transaction,
	bodiedSyncBlockRemoved: SyncBlockInfo[],
	syncBlockStore: SyncBlockStoreManager,
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	confirmationTransactionRef: ConfirmationTransactionRef,
) => {
	// Clear potential old pending deletion to retreat the deletion as first attempt
	syncBlockStore.sourceManager.clearPendingDeletion();

	// If there are source sync blocks being removed, and we need to confirm with user before deleting,
	// we block the transaction here, and wait for user confirmation to proceed with deletion.
	// See editor-common/src/sync-block/sync-block-store-manager.ts for how we handle user confirmation and
	// proceed with deletion.
	syncBlockStore.sourceManager.deleteSyncBlocksWithConfirmation(
		bodiedSyncBlockRemoved.map((node) => node.attrs),
		() => {
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
				let newState;
				if (!success) {
					newState = {
						activeFlag: {
							id: FLAG_ID.FAIL_TO_DELETE,
							onRetry: onRetry(api, syncBlockStore),
							onDismissed: onDismissed(syncBlockStore),
						} as ActiveFlag,
					};
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
	);
	return false;
};
