// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import { type SyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type {
	ResourceId,
	SyncBlockAttrs,
	SyncBlockData as Data,
	SyncBlockNode,
} from '../common/types';
import type { SyncBlockDataProvider } from '../providers/types';
import {
	updateErrorPayload,
	createErrorPayload,
	deleteErrorPayload,
	updateCacheErrorPayload,
} from '../utils/errorHandling';
import { convertSyncBlockPMNodeToSyncBlockData, createBodiedSyncBlockNode } from '../utils/utils';

export type ConfirmationCallback = (syncBlockCount: number) => Promise<boolean>;
export type CreationCallback = () => void;
type SyncBlockData = Data & {
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

	private pendingResourceId?: ResourceId;
	private creationCallback?: CreationCallback;

	constructor(
		dataProvider?: SyncBlockDataProvider,
		fireAnalyticsEvent?: (payload: SyncBlockEventPayload) => void,
	) {
		this.dataProvider = dataProvider;
		this.syncBlockCache = new Map();
		this.fireAnalyticsEvent = fireAnalyticsEvent;
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
			this.syncBlockCache.set(resourceId, syncBlockData);
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

			if (writeResults.every((result) => result.resourceId !== undefined)) {
				return true;
			} else {
				writeResults
					.filter((result) => result.resourceId === undefined)
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
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		const localId = uuid();
		const sourceId = this.dataProvider?.getSourceId();

		if (!this.dataProvider || !sourceId) {
			throw new Error('Data provider not set or source id not set');
		}

		const resourceId = this.dataProvider.generateResourceId(sourceId, localId);
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
							this.fireAnalyticsEvent?.(
								createErrorPayload(result.error || 'Failed to create bodied sync block'),
							);
						}
					});
				})
				.catch((error) => {
					this.commitPendingCreation(false);
					logException(error as Error, {
						location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
					});
					this.fireAnalyticsEvent?.(createErrorPayload((error as Error).message));
				});

			this.registerPendingCreation(resourceId);
		} catch (error) {
			if (this.hasPendingCreation()) {
				this.commitPendingCreation(false);
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

	public async deleteSyncBlocksWithConfirmation(
		syncBlockIds: SyncBlockAttrs[],
		deleteCallback: () => void,
	): Promise<void> {
		if (this.confirmationCallback) {
			const confirmed = await this.confirmationCallback(syncBlockIds.length);
			if (confirmed) {
				deleteCallback();

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

						results
							.filter((result) => result.resourceId === undefined)
							.forEach((result) => {
								this.fireAnalyticsEvent?.(
									deleteErrorPayload(result.error || 'Failed to delete synced block'),
								);
							});
					}
					syncBlockIds.forEach(callback);
				} catch (error) {
					syncBlockIds.forEach((Ids) => {
						this.setPendingDeletion(Ids, false);
					});
					logException(error as Error, {
						location: 'editor-synced-block-provider/sourceSyncBlockStoreManager',
					});
					this.fireAnalyticsEvent?.(deleteErrorPayload((error as Error).message));
				}
			}
		}
	}

	public destroy(): void {
		this.syncBlockCache.clear();
		this.confirmationCallback = undefined;
		this.pendingResourceId = undefined;
		this.creationCallback = undefined;
		this.dataProvider = undefined;
	}
}
