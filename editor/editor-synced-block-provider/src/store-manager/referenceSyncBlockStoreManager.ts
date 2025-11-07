import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import {
	SyncBlockError,
	type BlockInstanceId,
	type ResourceId,
	type SyncBlockNode,
} from '../common/types';
import type {
	SyncBlockInstance,
	SubscriptionCallback,
	SyncBlockDataProvider,
	TitleSubscriptionCallback,
} from '../providers/types';
import { resolveSyncBlockInstance } from '../utils/resolveSyncBlockInstance';
import { createSyncBlockNode } from '../utils/utils';

export class ReferenceSyncBlockStoreManager {
	private dataProvider?: SyncBlockDataProvider;
	private syncBlockCache: Map<ResourceId, SyncBlockInstance>;
	private subscriptions: Map<ResourceId, { [localId: BlockInstanceId]: SubscriptionCallback }>;
	private titleSubscriptions: Map<
		ResourceId,
		{ [localId: BlockInstanceId]: TitleSubscriptionCallback }
	>;

	private syncBlockURLRequests: Map<ResourceId, boolean>;
	private isRefreshingSubscriptions: boolean = false;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.syncBlockCache = new Map();
		this.subscriptions = new Map();
		this.titleSubscriptions = new Map();
		this.dataProvider = dataProvider;
		this.syncBlockURLRequests = new Map();
	}

	/**
	 * Refreshes the subscriptions for all sync blocks.
	 * @returns {Promise<void>}
	 */
	public async refreshSubscriptions() {
		if (this.isRefreshingSubscriptions) {
			return;
		}

		this.isRefreshingSubscriptions = true;

		const syncBlocks: SyncBlockNode[] = [];

		for (const [resourceId, callbacks] of this.subscriptions.entries()) {
			Object.keys(callbacks).forEach((localId) => {
				syncBlocks.push(createSyncBlockNode(localId, resourceId));
			});
		}

		try {
			// fetch latest data for all subscribed sync blocks
			// this function will update the cache and call the subscriptions
			await this.fetchSyncBlocksData(syncBlocks);
		} catch (error) {
			// TODO: EDITOR-1921 - add error analytics
		} finally {
			this.isRefreshingSubscriptions = false;
		}
	}

	private retrieveSyncBlockSourceInfo(resourceId: ResourceId) {
		if (!resourceId || !this.dataProvider) {
			return;
		}

		// if the sync block is a reference block, we need to fetch the URL to the source
		// we could optimise this further by checking if the sync block is on the same page as the source
		if (!this.syncBlockURLRequests.get(resourceId)) {
			this.syncBlockURLRequests.set(resourceId, true);
			this.dataProvider
				.retrieveSyncBlockSourceInfo(createSyncBlockNode('', resourceId))
				.then((sourceInfo) => {
					const existingSyncBlock = this.getFromCache(resourceId);
					if (existingSyncBlock && existingSyncBlock.data) {
						existingSyncBlock.data = {
							...existingSyncBlock.data,
							sourceURL: sourceInfo?.url,
							sourceTitle: sourceInfo?.title,
						};
						this.updateCache(existingSyncBlock);

						if (sourceInfo?.title) {
							this.updateSourceTitleSubscriptions(existingSyncBlock.resourceId, sourceInfo.title);
						}
					}
				})
				.finally(() => {
					this.syncBlockURLRequests.set(resourceId, false);
				});
		}
	}

	public async fetchSyncBlocksData(syncBlockNodes: SyncBlockNode[]): Promise<SyncBlockInstance[]> {
		if (!this.dataProvider) {
			throw new Error('Data provider not set');
		}

		// Don't fetch for not_found error since the source is already deleted
		const nodesToFetch: SyncBlockNode[] = [],
			blocksWithNotFoundError: SyncBlockInstance[] = [];

		syncBlockNodes.forEach((node) => {
			const existingSyncBlock = this.getFromCache(node.attrs.resourceId);
			if (existingSyncBlock?.error === SyncBlockError.NotFound) {
				blocksWithNotFoundError.push(existingSyncBlock);
			} else {
				nodesToFetch.push(node);
			}
		});

		const data = await this.dataProvider.fetchNodesData(nodesToFetch);
		if (!data) {
			throw new Error('Failed to fetch sync block node data');
		}

		const resolvedData: SyncBlockInstance[] = [];

		data.forEach((syncBlockInstance) => {
			if (!syncBlockInstance.resourceId) {
				return;
			}

			if (syncBlockInstance.error) {
				this.updateCache(syncBlockInstance);
				resolvedData.push(syncBlockInstance);
				return;
			}

			const existingSyncBlock = this.getFromCache(syncBlockInstance.resourceId);

			const resolvedSyncBlockInstance = existingSyncBlock
				? resolveSyncBlockInstance(existingSyncBlock, syncBlockInstance)
				: syncBlockInstance;

			this.updateCache(resolvedSyncBlockInstance);
			resolvedData.push(resolvedSyncBlockInstance);

			// fetch source URL and title if not already present
			if (
				(!resolvedSyncBlockInstance.data?.sourceURL ||
					!resolvedSyncBlockInstance.data?.sourceTitle) &&
				resolvedSyncBlockInstance.resourceId
			) {
				this.retrieveSyncBlockSourceInfo(resolvedSyncBlockInstance.resourceId);
			}
		});

		return [...resolvedData, ...blocksWithNotFoundError];
	}

	private updateCache(syncBlock: SyncBlockInstance) {
		const { resourceId } = syncBlock;

		if (resourceId) {
			this.syncBlockCache.set(resourceId, syncBlock);
			const callbacks = this.subscriptions.get(resourceId);
			if (callbacks) {
				Object.values(callbacks).forEach((callback) => {
					callback(syncBlock);
				});
			}
		}
	}

	private updateSourceTitleSubscriptions(resourceId: string, title: string) {
		const callbacks = this.titleSubscriptions.get(resourceId);
		if (callbacks) {
			Object.values(callbacks).forEach((callback) => {
				callback(title);
			});
		}
	}

	private getFromCache(resourceId: ResourceId): SyncBlockInstance | undefined {
		return this.syncBlockCache.get(resourceId);
	}

	private deleteFromCache(resourceId: ResourceId) {
		this.syncBlockCache.delete(resourceId);
	}

	public subscribeToSyncBlock(
		resourceId: string,
		localId: string,
		callback: SubscriptionCallback,
	): () => void {
		// add to subscriptions map
		const resourceSubscriptions = this.subscriptions.get(resourceId) || {};
		this.subscriptions.set(resourceId, { ...resourceSubscriptions, [localId]: callback });

		// call the callback immediately if we have cached data
		const cachedData = this.getFromCache(resourceId);
		if (cachedData) {
			callback(cachedData);
		} else {
			this.fetchSyncBlocksData([createSyncBlockNode(localId, resourceId)]).catch(() => {});
		}

		return () => {
			const resourceSubscriptions = this.subscriptions.get(resourceId);
			if (resourceSubscriptions) {
				delete resourceSubscriptions[localId];
				if (Object.keys(resourceSubscriptions).length === 0) {
					this.subscriptions.delete(resourceId);
					this.deleteFromCache(resourceId);
				} else {
					this.subscriptions.set(resourceId, resourceSubscriptions);
				}
			}
		};
	}

	public subscribeToSourceTitle(node: PMNode, callback: TitleSubscriptionCallback): () => void {
		// check node is a sync block, as we only support sync block subscriptions
		if (node.type.name !== 'syncBlock') {
			return () => {};
		}
		const { resourceId, localId } = node.attrs;

		if (!localId || !resourceId) {
			return () => {};
		}

		const cachedData = this.getFromCache(resourceId);
		if (cachedData?.data?.sourceTitle) {
			callback(cachedData.data.sourceTitle);
		}

		// add to subscriptions map
		const resourceSubscriptions = this.titleSubscriptions.get(resourceId) || {};
		this.titleSubscriptions.set(resourceId, { ...resourceSubscriptions, [localId]: callback });

		return () => {
			const resourceSubscriptions = this.titleSubscriptions.get(resourceId);
			if (resourceSubscriptions) {
				delete resourceSubscriptions[localId];
				if (Object.keys(resourceSubscriptions).length === 0) {
					this.titleSubscriptions.delete(resourceId);
				} else {
					this.titleSubscriptions.set(resourceId, resourceSubscriptions);
				}
			}
		};
	}

	public subscribe(node: PMNode, callback: SubscriptionCallback): () => void {
		// check node is a sync block, as we only support sync block subscriptions
		if (node.type.name !== 'syncBlock') {
			return () => {};
		}
		const { resourceId, localId } = node.attrs;

		if (!localId || !resourceId) {
			return () => {};
		}

		return this.subscribeToSyncBlock(resourceId, localId, callback);
	}

	/**
	 * Get the URL for a sync block.
	 * @param resourceId - The resource ID of the sync block
	 * @returns
	 */
	public getSyncBlockURL(resourceId: ResourceId): string | undefined {
		const syncBlock = this.getFromCache(resourceId);

		if (!syncBlock) {
			return undefined;
		}

		return syncBlock.data?.sourceURL;
	}

	destroy() {
		this.syncBlockCache.clear();
		this.subscriptions.clear();
		this.syncBlockURLRequests.clear();
	}
}
