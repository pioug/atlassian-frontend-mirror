// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { rebaseTransaction } from '../common/rebase-transaction';
import type {
	ResourceId,
	SyncBlockAttrs,
	SyncBlockData as Data,
	SyncBlockNode,
} from '../common/types';
import type { SyncBlockDataProvider } from '../providers/types';
import { convertSyncBlockPMNodeToSyncBlockData, createBodiedSyncBlockNode } from '../utils/utils';

export type ConfirmationCallback = (syncBlockCount: number) => Promise<boolean>;
export type CreationCallback = () => void;
type SyncBlockData = Data & {
	/**
	 * Whether the block is waiting to be deleted in backend
	 */
	pendingDeletion?: boolean;
};

export class SourceSyncBlockStoreManager {
	private dataProvider?: SyncBlockDataProvider;
	private editorView?: EditorView;

	private syncBlockCache: Map<ResourceId, SyncBlockData>;

	private confirmationCallback?: ConfirmationCallback;
	private confirmationTransaction?: Transaction;

	private pendingResourceId?: ResourceId;
	private creationCallback?: CreationCallback;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.dataProvider = dataProvider;
		this.syncBlockCache = new Map();
	}

	/**
	 * Add/update a sync block node to/from the local cache
	 * @param syncBlockNode - The sync block node to update
	 */
	public updateSyncBlockData(syncBlockNode: PMNode): boolean {
		const { localId, resourceId } = syncBlockNode.attrs;

		if (!localId || !resourceId) {
			throw new Error('Local ID or resource ID is not set');
		}

		const syncBlockData = convertSyncBlockPMNodeToSyncBlockData(syncBlockNode);
		this.syncBlockCache.set(resourceId, syncBlockData);
		return true;
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

			Array.from(this.syncBlockCache.values()).forEach((syncBlockData) => {
				// Don't flush nodes that are waiting to be deleted to avoid nodes being re-created
				if (!syncBlockData.pendingDeletion) {
					bodiedSyncBlockNodes.push({
						type: 'bodiedSyncBlock',
						attrs: {
							localId: syncBlockData.blockInstanceId,
							resourceId: syncBlockData.resourceId,
						},
					});
					bodiedSyncBlockData.push(syncBlockData);
				}
			});

			if (bodiedSyncBlockNodes.length === 0) {
				return Promise.resolve(true);
			}

			const writeResults = await this.dataProvider.writeNodesData(
				bodiedSyncBlockNodes,
				bodiedSyncBlockData,
			);
			return writeResults.every((result) => result.resourceId !== undefined);
		} catch {
			//TODO: EDITOR-1921 - add error analytics
			return false;
		}
	}

	public setEditorView(editorView: EditorView | undefined) {
		this.editorView = editorView;
	}

	public registerPendingCreation(resourceId: ResourceId) {
		this.pendingResourceId = resourceId;
	}

	public registerCreationCallback(callback: CreationCallback) {
		this.creationCallback = callback;
	}

	/**
	 *  Fires callback to insert node (if creation is successful) and clears pending creation data
	 * @param success
	 */
	public commitPendingCreation(success: boolean) {
		if (success && this.creationCallback) {
			this.creationCallback();
		}
		this.pendingResourceId = undefined;
		this.creationCallback = undefined;
	}

	public hasPendingCreation() {
		return !!this.pendingResourceId;
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

	public generateBodiedSyncBlockAttrs(): SyncBlockAttrs {
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		const localId = uuid();
		const sourceId = this.dataProvider?.getSourceId();

		if (!this.dataProvider || !sourceId) {
			throw new Error('Provider of sync block plugin is not set');
		}

		const resourceId = this.dataProvider.generateResourceId(sourceId, localId);
		return { resourceId, localId };
	}

	public createBodiedSyncBlockNode(attrs: SyncBlockAttrs): void {
		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			const { resourceId, localId: blockInstanceId } = attrs;

			this.dataProvider
				.writeNodesData(
					[createBodiedSyncBlockNode(blockInstanceId, resourceId)],
					[
						{
							content: [],
							blockInstanceId,
							resourceId: resourceId,
						},
					],
				)
				.then((results) => {
					results.forEach((result) => {
						const resourceId = result.resourceId;
						if (resourceId) {
							this.commitPendingCreation(true);
						} else {
							this.commitPendingCreation(false);
							// TODO: EDITOR-1921 - add error analytics
						}
					});
				})
				.catch((_reason) => {
					this.commitPendingCreation(false);
					// TODO: EDITOR-1921 - add error analytics
				});

			this.registerPendingCreation(resourceId);
		} catch (error) {
			if (this.hasPendingCreation()) {
				this.commitPendingCreation(false);
			}
			// TODO: EDITOR-1921 - add error analytics
		}
	}

	private setPendingDeletion = (Ids: SyncBlockAttrs, value: boolean) => {
		const syncBlock = this.syncBlockCache.get(Ids.resourceId);
		if (syncBlock) {
			syncBlock.pendingDeletion = value;
		}
	};

	public async deleteSyncBlocksWithConfirmation(
		tr: Transaction,
		syncBlockIds: SyncBlockAttrs[],
	): Promise<void> {
		if (this.confirmationCallback) {
			this.confirmationTransaction = tr;
			const confirmed = await this.confirmationCallback(syncBlockIds.length);
			if (confirmed) {
				this.editorView?.dispatch(
					this.confirmationTransaction.setMeta('isConfirmedSyncBlockDeletion', true),
				);

				try {
					if (!this.dataProvider) {
						throw new Error('Data provider not set');
					}

					syncBlockIds.forEach((Ids) => {
						this.setPendingDeletion(Ids, true);
					});
					const results = await this.dataProvider.deleteNodesData(
						syncBlockIds.map((attrs) => attrs.resourceId),
					);

					let callback;
					if (results.every((result) => result.success)) {
						callback = (Ids: SyncBlockAttrs) => this.syncBlockCache.delete(Ids.resourceId);
					} else {
						callback = (Ids: SyncBlockAttrs) => {
							this.setPendingDeletion(Ids, false);
						};
						// TODO: EDITOR-1921 - add error analytics
					}
					syncBlockIds.forEach(callback);
				} catch (_error) {
					syncBlockIds.forEach((Ids) => {
						this.setPendingDeletion(Ids, false);
					});
					// TODO: EDITOR-1921 - add error analytics
				}
			}
			this.confirmationTransaction = undefined;
		}
	}

	public rebaseTransaction(incomingTr: Transaction, state: EditorState): void {
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
