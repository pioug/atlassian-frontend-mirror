import { type SyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import type { Experience } from '@atlaskit/editor-common/experiences';
import { logException } from '@atlaskit/editor-common/monitoring';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	type ResourceId,
	type SyncBlockAttrs,
	type SyncBlockData as Data,
	type SyncBlockNode,
	SyncBlockError,
} from '../common/types';
import type { SyncBlockDataProvider } from '../providers/types';
import {
	updateErrorPayload,
	createErrorPayload,
	deleteErrorPayload,
	updateCacheErrorPayload,
} from '../utils/errorHandling';
import { convertSyncBlockPMNodeToSyncBlockData } from '../utils/utils';

export type ConfirmationCallback = (syncBlockCount: number) => Promise<boolean>;
type OnDelete = () => void;
type OnDeleteCompleted = (success: boolean) => void;
type DestroyCallback = () => void;
export type CreationCallback = () => void;
type SyncBlockData = Data & {
	/**
	 * Whether the current changes have already been saved to the backend
	 * Defaults to true, so we always flush data on the first save
	 */
	isDirty: boolean;
	/**
	 * Whether the block is waiting to be deleted in backend
	 */
	pendingDeletion?: boolean;
};

// A store manager responsible for the lifecycle and state management of source sync blocks in an editor instance.
// Designed to manage local in-memory state and synchronize with an external data provider.
// Supports create, flush, and delete operations for source sync blocks.
// Handles caching, debouncing updates, and publish/subscribe for local changes.
// Ensures consistency between local and remote state, and can be used in both editor and renderer contexts.
export class SourceSyncBlockStoreManager {
	private dataProvider?: SyncBlockDataProvider;
	private fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void;

	private syncBlockCache: Map<ResourceId, SyncBlockData>;

	private confirmationCallback?: ConfirmationCallback;
	private deletionRetryInfo?: {
		destroyCallback: DestroyCallback;
		onDelete: OnDelete;
		onDeleteCompleted: OnDeleteCompleted;
		syncBlockIds: SyncBlockAttrs[];
	};

	private pendingResourceId?: ResourceId;
	private creationCallback?: CreationCallback;

	public createExperience: Experience | undefined;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.dataProvider = dataProvider;
		this.syncBlockCache = new Map();
	}

	public setFireAnalyticsEvent(fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void) {
		this.fireAnalyticsEvent = fireAnalyticsEvent;
	}

	public setCreateExperience(createExperience: Experience) {
		this.createExperience = createExperience;
	}

	public isSourceBlock(node: PMNode): boolean {
		return node.type.name === 'bodiedSyncBlock';
	}

	/**
	 * Add/update a sync block node to/from the local cache
	 * @param syncBlockNode - The sync block node to update
	 */
	public updateSyncBlockData(syncBlockNode: PMNode): boolean {
		try {
			if (!this.isSourceBlock(syncBlockNode)) {
				throw new Error('Invalid sync block node type provided for updateSyncBlockData');
			}

			const { localId, resourceId } = syncBlockNode.attrs;

			if (!localId || !resourceId) {
				throw new Error('Local ID or resource ID is not set');
			}

			const syncBlockData = convertSyncBlockPMNodeToSyncBlockData(syncBlockNode);
			this.syncBlockCache.set(resourceId, { ...syncBlockData, isDirty: true });
			return true;
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(updateCacheErrorPayload((error as Error).message));
			return false;
		}
	}

	/**
	 * Save content of bodiedSyncBlock nodes in local cache to backend
	 *
	 * @returns true if saving all nodes successfully, false if fail to save some/all nodes
	 */
	public async flush(): Promise<boolean> {
		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			const bodiedSyncBlockNodes: SyncBlockNode[] = [];
			const bodiedSyncBlockData: SyncBlockData[] = [];

			Array.from(this.syncBlockCache.values()).forEach((syncBlockData) => {
				// Don't flush nodes that are waiting to be deleted to avoid nodes being re-created
				// Don't flush nodes that haven't been updated since we last flushed
				if (!syncBlockData.pendingDeletion && syncBlockData.isDirty) {
					bodiedSyncBlockNodes.push({
						type: 'bodiedSyncBlock',
						attrs: {
							localId: syncBlockData.blockInstanceId,
							resourceId: syncBlockData.resourceId,
						},
					});
					bodiedSyncBlockData.push(syncBlockData);

					// reset isDirty early to prevent race condition
					// There is a race condition where if a user makes changes to a source sync block
					// on a live page and the source sync block is being saved while the user
					// is still making changes, the new changes might not be saved if they all happen
					// exactly at a time when the writeNodesData is being executed asynchronously.
					syncBlockData.isDirty = false;
				}
			});

			if (bodiedSyncBlockNodes.length === 0) {
				return Promise.resolve(true);
			}

			const writeResults = await this.dataProvider.writeNodesData(
				bodiedSyncBlockNodes,
				bodiedSyncBlockData,
			);

			writeResults.forEach((result) => {
				// set isDirty to true for cases where it failed to save the sync block to the BE
				if (result.resourceId && result.error && result.error !== SyncBlockError.NotFound) {
					const cachedData = this.syncBlockCache.get(result.resourceId);
					if (cachedData) {
						cachedData.isDirty = true;
					}
				}
			});

			if (writeResults.every((result) => result.resourceId && !result.error)) {
				return true;
			} else {
				writeResults
					.filter((result) => !result.resourceId || result.error)
					.forEach((result) => {
						this.fireAnalyticsEvent?.(updateErrorPayload(result.error || 'Failed to write data'));
					});

				return false;
			}
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(updateErrorPayload((error as Error).message));
			return false;
		}
	}

	public registerPendingCreation(resourceId: ResourceId) {
		this.pendingResourceId = resourceId;
	}

	/**
	 * Register callback function (which inserts node, handles focus etc) to be used later when creation to backend succeed
	 */
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

	/**
	 *
	 * @returns true if waiting for the result of saving new bodiedSyncBlock to backend
	 */
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

	/**
	 * @returns attributes for a new bodiedSyncBlock node
	 */
	public generateBodiedSyncBlockAttrs(): SyncBlockAttrs {
		if (!this.dataProvider) {
			throw new Error('Data provider not set or source id not set');
		}

		const { resourceId, localId } = this.dataProvider.generateResourceId();
		return { resourceId, localId };
	}

	/**
	 * Create a bodiedSyncBlock node with empty content to backend
	 * @param attrs attributes Ids of the node
	 */
	public createBodiedSyncBlockNode(attrs: SyncBlockAttrs): void {
		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			const { resourceId, localId: blockInstanceId } = attrs;

			this.dataProvider
				.createNodeData({
					content: [],
					blockInstanceId,
					resourceId: resourceId,
				})
				.then((result) => {
					const resourceId = result.resourceId;
					if (resourceId) {
						this.commitPendingCreation(true);
					} else {
						this.commitPendingCreation(false);
						if (fg('platform_synced_block_dogfooding')) {
							this.createExperience?.failure({reason: result.error || 'Failed to create bodied sync block'})
						} else {
							this.fireAnalyticsEvent?.(
								createErrorPayload(result.error || 'Failed to create bodied sync block'),
							);
						}
					}
				})
				.catch((error) => {
					this.commitPendingCreation(false);
					logException(error as Error, {
						location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
					});
					if (fg('platform_synced_block_dogfooding')) {
						this.createExperience?.failure({reason: (error as Error).message})
					} else {
						this.fireAnalyticsEvent?.(createErrorPayload((error as Error).message));
					}
				});

			this.registerPendingCreation(resourceId);
		} catch (error) {
			if (this.hasPendingCreation()) {
				this.commitPendingCreation(false);
			}
			logException(error as Error, {
				location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
			});
			if (fg('platform_synced_block_dogfooding')) {
				this.createExperience?.failure({reason: (error as Error).message})
			} else {
				this.fireAnalyticsEvent?.(createErrorPayload((error as Error).message));
			}
		}
	}

	private setPendingDeletion = (Ids: SyncBlockAttrs, value: boolean) => {
		const syncBlock = this.syncBlockCache.get(Ids.resourceId);
		if (syncBlock) {
			syncBlock.pendingDeletion = value;
		}
	};

	private async delete(
		syncBlockIds: SyncBlockAttrs[],
		onDelete: OnDelete,
		onDeleteCompleted: OnDeleteCompleted,
	): Promise<boolean> {
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
			const isDeleteSuccessful = results.every((result) => result.success);
			onDeleteCompleted(isDeleteSuccessful);

			if (isDeleteSuccessful) {
				onDelete();
				callback = (Ids: SyncBlockAttrs) => this.syncBlockCache.delete(Ids.resourceId);
				this.clearPendingDeletion();
			} else {
				callback = (Ids: SyncBlockAttrs) => {
					this.setPendingDeletion(Ids, false);
				};

				results
					.filter((result) => result.resourceId === undefined)
					.forEach((result) => {
						this.fireAnalyticsEvent?.(
							deleteErrorPayload(result.error || 'Failed to delete synced block'),
						);
					});
			}
			syncBlockIds.forEach(callback);
			return isDeleteSuccessful;
		} catch (error) {
			syncBlockIds.forEach((Ids) => {
				this.setPendingDeletion(Ids, false);
			});
			logException(error as Error, {
				location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(deleteErrorPayload((error as Error).message));
			onDeleteCompleted(false);
			return false;
		}
	}

	public isRetryingDeletion(): boolean {
		return !!this.deletionRetryInfo;
	}

	public async retryDeletion(): Promise<void> {
		if (!this.deletionRetryInfo) {
			return Promise.resolve();
		}
		const { syncBlockIds, onDelete, onDeleteCompleted } = this.deletionRetryInfo;

		if (this.confirmationCallback) {
			await this.delete(syncBlockIds, onDelete, onDeleteCompleted);
		}
	}

	public clearPendingDeletion(): void {
		this.deletionRetryInfo?.destroyCallback();
		this.deletionRetryInfo = undefined;
	}

	/**
	 *
	 * @param syncBlockIds - The sync block ids to delete
	 * @param onDelete - The callback to delete sync block node from document
	 * @param onDeleteCompleted - The callback for after the deletion is saved to BE (whether successful or not)
	 * @param destroyCallback - The callback to clear any reference stored for deletion (regardless if deletion is completed or abort)
	 */
	public async deleteSyncBlocksWithConfirmation(
		syncBlockIds: SyncBlockAttrs[],
		onDelete: OnDelete,
		onDeleteCompleted: OnDeleteCompleted,
		destroyCallback: DestroyCallback,
	): Promise<void> {
		if (this.confirmationCallback) {
			const confirmed = await this.confirmationCallback(syncBlockIds.length);
			if (confirmed) {
				const isDeleteSuccessful = await this.delete(syncBlockIds, onDelete, onDeleteCompleted);

				if (!isDeleteSuccessful) {
					// If deletion failed, save deletion info for potential retry
					this.deletionRetryInfo = {
						syncBlockIds,
						onDelete,
						onDeleteCompleted,
						destroyCallback,
					};
				}
			} else {
				destroyCallback();
			}
		}
	}

	public destroy(): void {
		this.syncBlockCache.clear();
		this.confirmationCallback = undefined;
		this.pendingResourceId = undefined;
		this.creationCallback = undefined;
		this.dataProvider = undefined;
		this.clearPendingDeletion();
	}
}
