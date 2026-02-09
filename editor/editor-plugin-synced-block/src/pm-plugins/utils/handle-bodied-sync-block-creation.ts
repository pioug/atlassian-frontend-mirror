import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	TextSelection,
	type EditorState,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';

import type { SyncedBlockPlugin } from '../../syncedBlockPluginType';
import { FLAG_ID, type SyncBlockInfo } from '../../types';
import { syncedBlockPluginKey } from '../main';

const onRetry = (api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined, resourceId: string) => {
	return () => {
		api?.core?.actions.focus();
		api?.core?.actions.execute(({ tr }) => {
			const pos = api?.syncedBlock?.sharedState
				.currentState()
				?.retryCreationPosMap?.get(resourceId);
			const from = pos?.from;
			const to = pos?.to;
			if (from === undefined || to === undefined) {
				return tr;
			}

			tr.setSelection(TextSelection.create(tr.doc, from, to)).setMeta(syncedBlockPluginKey, {
				activeFlag: false,
			});
			api?.syncedBlock?.commands.insertSyncedBlock()({ tr });

			return tr;
		});
	};
};

const getRevertCreationPos = (
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
	doc: PMNode,
	resourceId: string,
) => {
	const retryCreationPos = api?.syncedBlock?.sharedState
		.currentState()
		?.retryCreationPosMap?.get(resourceId);

	if (retryCreationPos) {
		return retryCreationPos;
	}

	// Fallback to find the positions in case BE call returns before plugin state becomes available
	// which is highly unlikely
	let currentPos: { from: number; to: number } | undefined;
	doc.descendants((node, pos) => {
		if (currentPos) {
			return false;
		}
		if (node.type.name === 'bodiedSyncBlock' && resourceId === node.attrs.resourceId) {
			currentPos = { from: pos, to: pos + node.nodeSize };

			return false;
		}
	});

	return currentPos;
};

const buildRevertCreationTr = (tr: Transaction, pos: { from: number; to: number }): Transaction => {
	const content = tr.doc.nodeAt(pos.from)?.content;
	if (content) {
		tr.replaceWith(pos.from, pos.to, content);
		const contentFrom = tr.mapping.map(pos.from);
		tr.setSelection(TextSelection.create(tr.doc, contentFrom, contentFrom + content.size));
	} else {
		tr.delete(pos.from, pos.to);
	}
	return tr;
};

/**
 *
 * Save the new bodiedSyncBlock to backend with empty content and handles revert (if failed) and retry flow
 */
export const handleBodiedSyncBlockCreation = (
	bodiedSyncBlockAdded: SyncBlockInfo[],
	editorState: EditorState,
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined,
) => {
	const syncBlockStore = syncedBlockPluginKey.getState(editorState).syncBlockStore;

	bodiedSyncBlockAdded.forEach((node) => {
		if (node.from === undefined || node.to === undefined) {
			return;
		}
		const retryCreationPos = { from: node.from, to: node.to };
		const resourceId = node.attrs.resourceId;

		setTimeout(() => {
			api?.core?.actions.execute(({ tr }) => {
				return tr.setMeta(syncedBlockPluginKey, {
					retryCreationPos: { resourceId, pos: retryCreationPos },
				});
			});
		});
		syncBlockStore.sourceManager.createBodiedSyncBlockNode(
			node.attrs,
			(success: boolean) => {
				if (success) {
					api?.core?.actions.execute(({ tr }) => {
						return tr.setMeta(syncedBlockPluginKey, {
							retryCreationPos: { resourceId, pos: undefined },
						});
					});
					api?.core?.actions.focus();
				} else {
					api?.core?.actions.execute(({ tr }) => {
						const revertCreationPos = getRevertCreationPos(api, tr.doc, resourceId);
						if (!revertCreationPos) {
							return tr;
						}
						const revertTr = buildRevertCreationTr(tr, revertCreationPos);
						return revertTr
							.setMeta('isConfirmedSyncBlockDeletion', true)
							.setMeta('addToHistory', false)
							.setMeta(syncedBlockPluginKey, {
								activeFlag: {
									id: FLAG_ID.CANNOT_CREATE_SYNC_BLOCK,
									onRetry: onRetry(api, resourceId),
									onDismissed: (tr: Transaction) =>
										tr.setMeta(syncedBlockPluginKey, {
											...tr.getMeta(syncedBlockPluginKey),
											retryCreationPos: { resourceId, pos: undefined },
										}),
								},
							});
					});
				}
			},
			node.node,
		);
	});
};
