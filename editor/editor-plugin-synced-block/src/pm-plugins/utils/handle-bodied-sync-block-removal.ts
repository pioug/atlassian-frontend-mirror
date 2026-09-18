import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { pmHistoryPluginKey } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { SyncBlockStoreManager } from '@atlaskit/editor-synced-block-provider';
import type {
	DeletionMechanism,
	DeletionReason,
} from '@atlaskit/editor-synced-block-provider/common/types';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import type { SyncedBlockPlugin } from '../../syncedBlockPluginType';
import { FLAG_ID } from '../../types';
import type { ActiveFlag, SyncBlockAttrs, SyncBlockInfo } from '../../types';
import { syncedBlockPluginKey } from '../main';
import {
	matchesRequestedBlock,
	recomputeDeleteTransaction,
	recomputeUnsyncTransaction,
} from './recompute-delete-transaction';

export type TransactionRef = { current: Transaction | undefined };

export type SourceFeedbackCallbacks = {
	onDeleteCompleted: (success: boolean) => void;
	onDeleteTransaction: (tr: Transaction) => void;
	onDestroy: () => void;
};

export type HandleBodiedSyncBlockRemovalOptions = {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
	confirmationTransactionRef: TransactionRef;
	deletionReason: DeletionReason;
	feedbackCallbacks?: SourceFeedbackCallbacks;
	mechanism?: DeletionMechanism;
	removed: SyncBlockInfo[];
	syncBlockStore: SyncBlockStoreManager;
};

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

const topLevelSourceBlocks = (doc: PMNode, isSourceBlock: (node: PMNode) => boolean): PMNode[] => {
	const blocks: PMNode[] = [];
	doc.forEach((node) => {
		if (isSourceBlock(node)) {
			blocks.push(node);
		}
	});
	return blocks;
};

/**
 * Whether `tr` removes every block in `wanted` from the document. Identity follows
 * `matchesRequestedBlock` (localId, falling back to resourceId) so this agrees with the
 * recompute helpers.
 */
const removesRequestedBlocks = (
	tr: Transaction,
	isSourceBlock: (node: PMNode) => boolean,
	wanted: SyncBlockAttrs[],
): boolean => {
	const before = topLevelSourceBlocks(tr.before, isSourceBlock);
	const after = topLevelSourceBlocks(tr.doc, isSourceBlock);
	return wanted.every(
		(block) =>
			before.some((node) => matchesRequestedBlock(node, block)) &&
			!after.some((node) => matchesRequestedBlock(node, block)),
	);
};

/**
 * Replay the undo that removed `wanted` once the source deletion has been confirmed and
 * persisted (EDITOR-8863).
 *
 * The original undo transaction was rejected by `filterTransaction` so the confirmation could
 * run, which leaves the history event on top of the undo stack. Building the undo again from
 * the live state (via the history plugin) restores whatever the block was converted from
 * (e.g. a table), unlike a recomputed whole-node delete which drops that content.
 *
 * Guard: only dispatch if that undo still removes the same source block(s). If the user
 * edited in the meantime the top of the stack is no longer that event, so return `false` and
 * let the caller fall back to the recomputed unwrap.
 */
const replayConfirmedUndo = (
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	isSourceBlock: (node: PMNode) => boolean,
	wanted: SyncBlockAttrs[],
	onTransaction: (tr: Transaction) => void,
): boolean => {
	const undo = api?.history?.commands.undo;
	if (!undo || !api?.core) {
		return false;
	}

	let applied = false;
	api.core.actions.execute(({ tr }) => {
		const undoTr = undo({ tr });
		if (!undoTr || !removesRequestedBlocks(undoTr, isSourceBlock, wanted)) {
			return null;
		}
		undoTr.setMeta('isConfirmedSyncBlockDeletion', true);
		onTransaction(undoTr);
		applied = true;
		return undoTr;
	});
	return applied;
};

export const handleBodiedSyncBlockRemoval = ({
	api,
	confirmationTransactionRef,
	deletionReason,
	feedbackCallbacks,
	mechanism,
	removed,
	syncBlockStore,
}: HandleBodiedSyncBlockRemovalOptions): boolean => {
	const removedAttrs = removed.map((node) => node.attrs);
	const { isSourceBlock } = syncBlockStore.sourceManager;

	// Clear potential old pending deletion to retreat the deletion as first attempt
	syncBlockStore.sourceManager.clearPendingDeletion();

	// If there are source sync blocks being removed, and we need to confirm with user before deleting,
	// we block the transaction here, and wait for user confirmation to proceed with deletion.
	// See editor-common/src/sync-block/sync-block-store-manager.ts for how we handle user confirmation and
	// proceed with deletion.
	syncBlockStore.sourceManager.deleteSyncBlocksWithConfirmation(
		removedAttrs,
		deletionReason,
		() => {
			const closeBlockMenu = (confirmedTr: Transaction) => {
				if (isExperimentEnabled('platform_editor_blocks_exp_patch_10')) {
					// The original transaction's closeMenu meta was rejected along with it above,
					// so re-apply it here to close the block menu once the change actually lands.
					api?.blockControls?.commands?.toggleBlockMenu({ closeMenu: true })({
						tr: confirmedTr,
					});
				}
			};

			// Any undo that removes a source block (creation, paste, ...) must restore what was
			// there before. A recomputed whole-node delete drops the converted content and leaves
			// the event on the undo stack, so replay the undo instead (EDITOR-8863).
			const shouldReplayUndo =
				mechanism === 'undo' && isExperimentEnabled('platform_editor_blocks_exp_patch_10');
			if (
				shouldReplayUndo &&
				replayConfirmedUndo(api, isSourceBlock, removedAttrs, (undoTr) => {
					closeBlockMenu(undoTr);
					feedbackCallbacks?.onDeleteTransaction(undoTr);
				})
			) {
				return;
			}

			// Recompute the delete fresh from the live document instead of
			// replaying a stashed-and-rebased transaction. The stash/rebase
			// approach produced stale, schema-invalid transactions when the
			// document changed shape (local edits or remote collab) while the
			// confirmation modal was open — the dominant signature being
			// "Invalid content for node bodiedSyncBlock: <>". See EDITOR-7889.
			api?.core?.actions.execute(({ tr }) => {
				// EDITOR-8230: unsync must remove only the sync wrapper and keep the block's
				// content inline, whereas delete removes the whole block. Before this branch,
				// the confirm path always recomputed a full delete, so unsyncing a source block
				// silently deleted its content. When the deletion was actually triggered by
				// unsync, recompute an unwrap (replaceWith content) instead of a delete.
				// The same applies when the undo could not be replayed (the undo stack changed
				// while the backend delete was in flight): the backend delete has already
				// succeeded, so drop the wrapper but keep the content (EDITOR-8863).
				const recomputedTr =
					deletionReason === 'source-block-unsynced' || shouldReplayUndo
						? recomputeUnsyncTransaction(tr, isSourceBlock, removedAttrs)
						: recomputeDeleteTransaction(tr, isSourceBlock, removedAttrs);

				// The target node(s) no longer exist in the live document (e.g.
				// a remote collaborator already removed them). There is nothing
				// to delete locally, so return `null` to skip the dispatch
				// entirely — dispatching the untouched transaction would be a
				// no-op that still runs the plugin's filter/append hooks. The
				// backend deletion has already been issued by the store manager.
				if (!recomputedTr) {
					return null;
				}

				closeBlockMenu(recomputedTr);

				recomputedTr.setMeta('isConfirmedSyncBlockDeletion', true);
				feedbackCallbacks?.onDeleteTransaction(recomputedTr);
				if (!recomputedTr.getMeta(pmHistoryPluginKey)) {
					// bodiedSyncBlock deletion is expected to be permanent (cannot undo)
					// For a normal deletion (not triggered by undo), remove it from history so that it cannot be undone
					recomputedTr.setMeta('addToHistory', false);
				}
				return recomputedTr;
			});
		},
		(success) => {
			feedbackCallbacks?.onDeleteCompleted(success);
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
			feedbackCallbacks?.onDestroy();
		},
		mechanism,
	);
	return false;
};
