import { useCallback, useEffect, useState } from 'react';

import uuid from 'uuid';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { resourceIdFromSourceAndLocalId } from '../utils/ari';
import {
	convertSyncBlockPMNodeToSyncBlockData,
	convertSyncBlockPMNodeToSyncBlockNode,
} from '../utils/utils';

import { rebaseTransaction } from './rebase-transaction';
import { SyncBlockStatus } from './types';
import type {
	FetchSyncBlockDataResult,
	SyncBlockAttrs,
	SyncBlockData,
	SyncBlockDataProvider,
	SyncBlockNode,
} from './types';

// Do this typedef to make it clear that
// this is a local identifier for a resource for local use
type BlockInstanceId = string;

export interface SyncBlock {
	sourceURL?: string;
	syncBlockData: SyncBlockData;
	syncNode: SyncBlockNode;
}

type ConfirmationCallback = () => Promise<boolean>;

// A store manager responsible for the lifecycle and state management of sync blocks in an editor instance.
// Supports create, read, update, and delete operations for sync blocks.
// Designed to manage local in-memory state and synchronize with an external data provider.
// Handles caching, debouncing updates, and publish/subscribe for local changes.
// Ensures consistency between local and remote state, and can be used in both editor and renderer contexts.
export class SyncBlockStoreManager {
	private syncBlocks: Map<BlockInstanceId, SyncBlock>;
	private syncBlockURLRequests: Map<BlockInstanceId, boolean>;
	private confirmationCallback?: ConfirmationCallback;
	private editorView?: EditorView;
	private dataProvider?: SyncBlockDataProvider;
	private confirmationTransaction?: Transaction;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.syncBlocks = new Map();
		this.syncBlockURLRequests = new Map();
		this.dataProvider = dataProvider;
	}

	/**
	 *
	 * @param node - The sync block node to get the source URL for
	 * @returns The source URL for the sync block node if it exists. Otherwise trigger fetch and return undefined, syncBlock will update with URL asynchronously.
	 */
	private getSyncBlockSourceURL(node: PMNode): string | undefined {
		const { localId, resourceId } = node.attrs;

		if (!localId || !resourceId || !this.dataProvider) {
			return undefined;
		}

		const existingSyncBlock = this.syncBlocks.get(localId);

		if (!existingSyncBlock) {
			return undefined;
		}

		const { sourceURL } = existingSyncBlock;
		if (sourceURL) {
			return sourceURL;
		}

		// if the sync block is a reference block, we need to fetch the URL to the source
		// we could optimise this further by checking if the sync block is on the same page as the source
		if (!this.isSourceBlock(node) && !this.syncBlockURLRequests.get(localId)) {
			const syncBlockNode: SyncBlockNode = convertSyncBlockPMNodeToSyncBlockNode(node, false);
			this.syncBlockURLRequests.set(localId, true);
			this.dataProvider
				.retrieveSyncBlockSourceUrl(syncBlockNode)
				.then((sourceURL) => {
					const existingSyncBlock = this.syncBlocks.get(localId);
					if (existingSyncBlock) {
						const syncBlock: SyncBlock = {
							...existingSyncBlock,
							sourceURL,
						};
						this.syncBlocks.set(localId, syncBlock);
					}
				})
				.finally(() => {
					this.syncBlockURLRequests.set(localId, false);
				});
		}
		return undefined;
	}

	public async fetchSyncBlockData(syncBlockNode: PMNode): Promise<FetchSyncBlockDataResult> {
		if (!['bodiedSyncBlock', 'syncBlock'].includes(syncBlockNode.type.name)) {
			throw new Error('Node is not a sync block');
		}

		const syncNode: SyncBlockNode = convertSyncBlockPMNodeToSyncBlockNode(syncBlockNode, false);
		if (!this.dataProvider) {
			throw new Error('Data provider not set');
		}

		const data = await this.dataProvider.fetchNodesData([syncNode]);
		if (!data) {
			throw new Error('Failed to fetch sync block node data');
		}

		const sourceURL = this.getSyncBlockSourceURL(syncBlockNode);

		const fetchSyncBlockDataResult = data[0];
		if (!('status' in fetchSyncBlockDataResult)) {
			// only adds it to the map if it did not error out
			this.syncBlocks.set(syncBlockNode.attrs.localId, {
				syncNode,
				sourceURL,
				syncBlockData: fetchSyncBlockDataResult,
			});
		}

		return fetchSyncBlockDataResult;
	}

	/**
	 * Add/update a sync block node to/from the local cache
	 * @param syncBlockNode - The sync block node to update
	 */
	public updateSyncBlockData(syncBlockNode: PMNode) {
		try {
			if (!this.isSourceBlock(syncBlockNode)) {
				throw new Error('Node is not a source sync block');
			}

			const { localId, resourceId } = syncBlockNode.attrs;

			if (!localId || !resourceId) {
				throw new Error('Local ID or resource ID is not set');
			}

			const existingSyncBlock = this.syncBlocks.get(localId);
			const sourceURL = existingSyncBlock?.sourceURL;
			const syncBlock: SyncBlock = {
				syncNode: convertSyncBlockPMNodeToSyncBlockNode(syncBlockNode),
				sourceURL,
				syncBlockData: {
					...convertSyncBlockPMNodeToSyncBlockData(syncBlockNode),
					sourceDocumentAri: resourceId, // same as resourceId ARI when content property API
				},
			};
			this.syncBlocks.set(localId, syncBlock);
		} catch {
			//TODO: EDITOR-1921 - add error analytics
		}
	}

	/**
	 * Save content of bodiedSyncBlock nodes in local cache to backend
	 *
	 * @returns true if saving all nodes successfully, false if fail to save some/all nodes
	 */
	public async flushBodiedSyncBlocks(): Promise<boolean> {
		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			const bodiedSyncBlockNodes: SyncBlockNode[] = [];
			const bodiedSyncBlockData: SyncBlockData[] = [];

			Array.from(this.syncBlocks.values()).forEach((syncBlock) => {
				if (syncBlock.syncNode.type === 'bodiedSyncBlock') {
					bodiedSyncBlockNodes.push(syncBlock.syncNode);
					bodiedSyncBlockData.push(syncBlock.syncBlockData);
				}
			});

			if (bodiedSyncBlockNodes.length === 0) {
				return Promise.resolve(true);
			}

			const resourceIds = await this.dataProvider.writeNodesData(
				bodiedSyncBlockNodes,
				bodiedSyncBlockData,
			);
			return resourceIds.every((resourceId) => resourceId !== undefined);
		} catch {
			//TODO: EDITOR-1921 - add error analytics
			return false;
		}
	}

	/**
	 * Get the URL for a sync block.
	 * @param localId - The local ID of the sync block to get the URL for
	 * @returns
	 */
	public getSyncBlockURL(localId: BlockInstanceId): string | undefined {
		const syncBlock = this.syncBlocks.get(localId);
		return syncBlock?.sourceURL;
	}

	public setEditorView(editorView: EditorView | undefined) {
		this.editorView = editorView;
	}

	public isSourceBlock(node: PMNode): boolean {
		if (node.type.name !== 'bodiedSyncBlock') {
			return false;
		}

		const { resourceId, localId } = node.attrs;
		const sourceId = this.dataProvider?.getSourceId();

		if (!sourceId) {
			return false;
		}

		return (
			typeof resourceId === 'string' &&
			typeof sourceId === 'string' &&
			typeof localId === 'string' &&
			resourceId === resourceIdFromSourceAndLocalId(sourceId, localId)
		);
	}

	public registerConfirmationCallback(callback: ConfirmationCallback) {
		this.confirmationCallback = callback;

		return () => {
			this.confirmationCallback = undefined;
		};
	}

	public requireConfirmationBeforeDelete(): boolean {
		return !!this.confirmationCallback;
	}

	public createSyncBlockNode(): SyncBlockNode {
		const blockInstanceId = uuid();
		const sourceId = this.dataProvider?.getSourceId();
		if (!sourceId) {
			throw new Error('Provider of sync block plugin is not set');
		}

		// This should be generated by the data provider implementation as it differs between data providers
		const resourceId = resourceIdFromSourceAndLocalId(sourceId, blockInstanceId);
		const syncBlockNode: SyncBlockNode = {
			attrs: {
				resourceId,
				localId: blockInstanceId,
			},
			type: 'bodiedSyncBlock',
		};
		return syncBlockNode;
	}

	public async deleteSyncBlocksWithConfirmation(tr: Transaction, syncBlockIds: SyncBlockAttrs[]) {
		if (this.confirmationCallback) {
			this.confirmationTransaction = tr;
			const confirmed = await this.confirmationCallback();
			if (confirmed) {
				this.editorView?.dispatch(
					this.confirmationTransaction.setMeta('isConfirmedSyncBlockDeletion', true),
				);
				// Need to update the BE on deletion
				syncBlockIds.forEach(({ localId }) => this.syncBlocks.delete(localId));
			}
			this.confirmationTransaction = undefined;
		}
	}

	public rebaseTransaction(incomingTr: Transaction, state: EditorState) {
		if (!this.confirmationTransaction) {
			return;
		}

		this.confirmationTransaction = rebaseTransaction(
			this.confirmationTransaction,
			incomingTr,
			state,
		);
	}
}

export function useFetchSyncBlockData(
	manager: SyncBlockStoreManager,
	syncBlockNode: PMNode,
): FetchSyncBlockDataResult | null {
	const [fetchSyncBlockDataResult, setFetchSyncBlockDataResult] =
		useState<FetchSyncBlockDataResult | null>(null);
	const fetchSyncBlockNode = useCallback(() => {
		manager
			.fetchSyncBlockData(syncBlockNode)
			.then((data) => {
				if ('status' in data) {
					// if there is an error, we don't want to replace real existing data with the error data
					if (!fetchSyncBlockDataResult || 'status' in fetchSyncBlockDataResult) {
						setFetchSyncBlockDataResult(data);
					}
				} else {
					setFetchSyncBlockDataResult(data);
				}
			})
			.catch(() => {
				//TODO: EDITOR-1921 - add error analytics
				if (!fetchSyncBlockDataResult || 'status' in fetchSyncBlockDataResult) {
					setFetchSyncBlockDataResult({ status: SyncBlockStatus.Errored });
				}
			});
	}, [manager, syncBlockNode, fetchSyncBlockDataResult]);

	useEffect(() => {
		fetchSyncBlockNode();
		const interval = window.setInterval(fetchSyncBlockNode, 3000);

		return () => {
			window.clearInterval(interval);
		};
	}, [fetchSyncBlockNode]);
	return fetchSyncBlockDataResult;
}

export function useHandleContentChanges(
	manager: SyncBlockStoreManager,
	syncBlockNode: PMNode,
): void {
	useEffect(() => {
		//TODO: EDITOR-1921 - add error analytics
		manager.updateSyncBlockData(syncBlockNode);
	}, [manager, syncBlockNode]);
}
