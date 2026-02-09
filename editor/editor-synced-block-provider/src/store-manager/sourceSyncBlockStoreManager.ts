import { type SyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import type { Experience } from '@atlaskit/editor-common/experiences';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	type ResourceId,
	type SyncBlockAttrs,
	type SyncBlockData as Data,
	type SyncBlockNode,
	SyncBlockError,
	type BlockInstanceId,
	type DeletionReason,
	type ReferenceSyncBlockData,
} from '../common/types';
import type { SyncBlockDataProvider, SyncBlockSourceInfo } from '../providers/types';
import {
	updateErrorPayload,
	createErrorPayload,
	deleteErrorPayload,
	updateCacheErrorPayload,
	getSourceInfoErrorPayload,
	updateSuccessPayload,
	createSuccessPayload,
	deleteSuccessPayload,
	fetchReferencesErrorPayload,
} from '../utils/errorHandling';
import {
	getCreateSourceExperience,
	getDeleteSourceExperience,
	getSaveSourceExperience,
	getFetchSourceInfoExperience,
} from '../utils/experienceTracking';
import { convertSyncBlockPMNodeToSyncBlockData } from '../utils/utils';

export type ConfirmationCallback = (
	syncBlockIds: SyncBlockAttrs[],
	deleteReason: DeletionReason | undefined,
) => Promise<boolean>;
type OnDelete = () => void;
type OnCompletion = (success: boolean) => void;
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
		deletionReason: DeletionReason;
		destroyCallback: DestroyCallback;
		onDelete: OnDelete;
		onDeleteCompleted: OnCompletion;
		syncBlockIds: SyncBlockAttrs[];
	};

	private pendingResourceId?: ResourceId;
	private creationCallback?: CreationCallback;
	private creationCompletionCallbacks: Map<ResourceId, OnCompletion>;

	private createExperience: Experience | undefined;
	private saveExperience: Experience | undefined;
	private deleteExperience: Experience | undefined;
	private fetchSourceInfoExperience: Experience | undefined;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.dataProvider = dataProvider;
		this.syncBlockCache = new Map();
		this.creationCompletionCallbacks = new Map();
	}

	public setFireAnalyticsEvent(fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void) {
		this.fireAnalyticsEvent = fireAnalyticsEvent;

		this.createExperience = getCreateSourceExperience(fireAnalyticsEvent);
		this.saveExperience = getSaveSourceExperience(fireAnalyticsEvent);
		this.deleteExperience = getDeleteSourceExperience(fireAnalyticsEvent);
		this.fetchSourceInfoExperience = getFetchSourceInfoExperience(fireAnalyticsEvent);
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
			const bodiedSyncBlockNodes: SyncBlockNode[] = [];
			const bodiedSyncBlockData: SyncBlockData[] = [];

			Array.from(this.syncBlockCache.values()).forEach((syncBlockData) => {
				// Don't flush nodes that
				// - are waiting to be deleted to avoid nodes being re-created
				// - haven't been updated since we last flushed
				// - are still pending BE creation
				if (
					!syncBlockData.pendingDeletion &&
					syncBlockData.isDirty &&
					!(this.isPendingCreation(syncBlockData.resourceId) && fg('platform_synced_block_patch_1'))
				) {
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

			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			this.saveExperience?.start({});

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
				this.saveExperience?.success();
				writeResults.forEach((result) => {
					if (result.resourceId && !result.error) {
						this.fireAnalyticsEvent?.(updateSuccessPayload(result.resourceId, false));
					}
				});
				return true;
			} else {
				this.saveExperience?.failure();
				writeResults
					.filter((result) => !result.resourceId || result.error)
					.forEach((result) => {
						this.fireAnalyticsEvent?.(
							updateErrorPayload(result.error || 'Failed to write data', result.resourceId),
						);
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

	// Remove this method and pendingResourceId when cleaning up platform_synced_block_patch_1
	public registerPendingCreation(resourceId: ResourceId): void {
		this.pendingResourceId = resourceId;
	}

	public isPendingCreation(resourceId: ResourceId): boolean {
		return this.creationCompletionCallbacks.has(resourceId);
	}

	/**
	 * Register callback function (which inserts node, handles focus etc) to be used later when creation to backend succeed
	 */
	public registerCreationCallback(callback: CreationCallback): void {
		this.creationCallback = callback;
	}

	/**
	 *  Fires callback to insert node (if creation is successful) and clears pending creation data
	 * @param success
	 */
	public commitPendingCreation(success: boolean, resourceId: ResourceId): void {
		if (fg('platform_synced_block_patch_1')) {
			const onCompletion = this.creationCompletionCallbacks.get(resourceId);
			if (onCompletion) {
				this.creationCompletionCallbacks.delete(resourceId);
				onCompletion(success);
			} else {
				this.fireAnalyticsEvent?.(
					createErrorPayload('creation complete callback missing', resourceId),
				);
			}

			if (success) {
				this.fireAnalyticsEvent?.(createSuccessPayload(resourceId || ''));
			} else {
				// Delete the node from cache if fail to create so it's not flushed to BE
				this.syncBlockCache.delete(resourceId || '');
				this.fireAnalyticsEvent?.(
					createErrorPayload('Fail to create bodied sync block', resourceId),
				);
			}
		} else {
			if (success && this.creationCallback) {
				this.creationCallback();
				this.fireAnalyticsEvent?.(createSuccessPayload(this.pendingResourceId || ''));
			} else if (success && !this.creationCallback) {
				this.fireAnalyticsEvent?.(
					createErrorPayload('creation callback missing', this.pendingResourceId),
				);
			}
			this.pendingResourceId = undefined;
		}

		this.creationCallback = undefined;
	}

	/**
	 *
	 * @returns true if waiting for the result of saving new bodiedSyncBlock to backend
	 * Remove this method when cleaning up platform_synced_block_patch_1
	 */
	public hasPendingCreation(): boolean {
		return fg('platform_synced_block_patch_1')
			? this.creationCompletionCallbacks.size > 0
			: !!this.pendingResourceId;
	}

	public registerConfirmationCallback(callback: ConfirmationCallback) {
		this.confirmationCallback = callback;

		return (): void => {
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
	public createBodiedSyncBlockNode(
		attrs: SyncBlockAttrs,
		onCompletion: OnCompletion,
		nodeData?: PMNode,
	): void {
		const { resourceId, localId: blockInstanceId } = attrs;
		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			if (fg('platform_synced_block_patch_1')) {
				this.creationCompletionCallbacks.set(resourceId, onCompletion);
			}
			this.createExperience?.start({});
			this.dataProvider
				.createNodeData({
					content: [],
					blockInstanceId,
					resourceId,
				})
				.then((result) => {
					const resourceId = result.resourceId || '';
					if (resourceId && (!fg('platform_synced_block_patch_1') || !result.error)) {
						this.commitPendingCreation(true, resourceId);

						this.createExperience?.success();

						// Update the sync block data with the node data if it is provided
						// to avoid any race conditions where the data could be missed during a render operation
						if (!fg('platform_synced_block_patch_1')) {
							if (nodeData) {
								this.updateSyncBlockData(nodeData);
							}
						}
					} else {
						this.commitPendingCreation(false, resourceId);
						this.createExperience?.failure({
							reason: result.error || 'Failed to create bodied sync block',
						});
						this.fireAnalyticsEvent?.(
							createErrorPayload(result.error || 'Failed to create bodied sync block', resourceId),
						);
					}
				})
				.catch((error) => {
					this.commitPendingCreation(false, resourceId);
					logException(error as Error, {
						location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
					});
					this.createExperience?.failure({ reason: (error as Error).message });
					this.fireAnalyticsEvent?.(createErrorPayload((error as Error).message, resourceId));
				});

			if (!fg('platform_synced_block_patch_1')) {
				this.registerPendingCreation(resourceId);
			}
		} catch (error) {
			if (
				fg('platform_synced_block_patch_1')
					? this.isPendingCreation(resourceId)
					: this.hasPendingCreation()
			) {
				this.commitPendingCreation(false, resourceId);
			}
			logException(error as Error, {
				location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(createErrorPayload((error as Error).message));
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
		onDeleteCompleted: OnCompletion,
		reason: DeletionReason,
	): Promise<boolean> {
		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			syncBlockIds.forEach((Ids) => {
				this.setPendingDeletion(Ids, true);
			});

			this.deleteExperience?.start({});

			const results = await this.dataProvider.deleteNodesData(
				syncBlockIds.map((attrs) => attrs.resourceId),
				reason,
			);

			let callback;
			const isDeleteSuccessful = results.every((result) => result.success);
			onDeleteCompleted(isDeleteSuccessful);

			if (isDeleteSuccessful) {
				onDelete();
				callback = (Ids: SyncBlockAttrs) => this.syncBlockCache.delete(Ids.resourceId);
				this.clearPendingDeletion();
				this.deleteExperience?.success();
				results.forEach((result) => {
					this.fireAnalyticsEvent?.(deleteSuccessPayload(result.resourceId));
				});
			} else {
				callback = (Ids: SyncBlockAttrs) => {
					this.setPendingDeletion(Ids, false);
				};

				this.deleteExperience?.failure();
				results.forEach((result) => {
					if (result.success) {
						this.fireAnalyticsEvent?.(deleteSuccessPayload(result.resourceId));
					} else {
						this.fireAnalyticsEvent?.(
							deleteErrorPayload(
								result.error || 'Failed to delete synced block',
								result.resourceId,
							),
						);
					}
				});
			}

			syncBlockIds.forEach(callback);
			return isDeleteSuccessful;
		} catch (error) {
			syncBlockIds.forEach((Ids) => {
				this.setPendingDeletion(Ids, false);
				this.fireAnalyticsEvent?.(deleteErrorPayload((error as Error).message, Ids.resourceId));
			});
			logException(error as Error, {
				location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
			});
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
		const { syncBlockIds, onDelete, onDeleteCompleted, deletionReason } = this.deletionRetryInfo;

		if (this.confirmationCallback) {
			await this.delete(syncBlockIds, onDelete, onDeleteCompleted, deletionReason);
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
		deletionReason: DeletionReason,
		onDelete: OnDelete,
		onDeleteCompleted: OnCompletion,
		destroyCallback: DestroyCallback,
	): Promise<void> {
		if (this.confirmationCallback) {
			const confirmed = await this.confirmationCallback(syncBlockIds, deletionReason);
			if (confirmed) {
				const isDeleteSuccessful = await this.delete(
					syncBlockIds,
					onDelete,
					onDeleteCompleted,
					deletionReason,
				);

				if (!isDeleteSuccessful) {
					// If deletion failed, save deletion info for potential retry
					this.deletionRetryInfo = {
						syncBlockIds,
						onDelete,
						onDeleteCompleted,
						destroyCallback,
						deletionReason,
					};
				} else {
					destroyCallback();
				}
			} else {
				destroyCallback();
			}
		}
	}

	getSyncBlockSourceInfo(localId: BlockInstanceId): Promise<SyncBlockSourceInfo | undefined> {
		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			this.fetchSourceInfoExperience?.start();
			return this.dataProvider
				.fetchSyncBlockSourceInfo(localId, undefined, undefined, this.fireAnalyticsEvent)
				.then((sourceInfo) => {
					if (!sourceInfo) {
						this.fetchSourceInfoExperience?.failure({ reason: 'No source info returned' });
					} else {
						this.fetchSourceInfoExperience?.success();
					}

					return sourceInfo;
				});
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(getSourceInfoErrorPayload((error as Error).message));

			return Promise.resolve(undefined);
		}
	}

	fetchReferences(resourceId: string): Promise<ReferenceSyncBlockData> {
		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			return this.dataProvider.fetchReferences(resourceId, true);
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(fetchReferencesErrorPayload((error as Error).message));

			return Promise.resolve({ error: SyncBlockError.Errored });
		}
	}

	public destroy(): void {
		this.syncBlockCache.clear();
		this.confirmationCallback = undefined;
		this.pendingResourceId = undefined;
		this.creationCompletionCallbacks.clear();
		this.creationCallback = undefined;
		this.dataProvider = undefined;
		this.saveExperience?.abort({ reason: 'editorDestroyed' });
		this.createExperience?.abort({ reason: 'editorDestroyed' });
		this.deleteExperience?.abort({ reason: 'editorDestroyed' });
		this.fetchSourceInfoExperience?.abort({ reason: 'editorDestroyed' });
		this.clearPendingDeletion();
	}
}
