import { type RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
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
	SyncBlockRendererProviderCreator,
	SyncBlockSourceInfo,
} from '../providers/types';
import { fetchErrorPayload, getSourceInfoErrorPayload } from '../utils/errorHandling';
import { resolveSyncBlockInstance } from '../utils/resolveSyncBlockInstance';
import { createSyncBlockNode } from '../utils/utils';

// A store manager responsible for the lifecycle and state management of reference sync blocks in an editor instance.
// Designed to manage local in-memory state and synchronize with an external data provider.
// Supports fetch, cache, and subscription for sync block data.
// Handles fetching source URL and title for sync blocks.
// Can be used in both editor and renderer contexts.
export class ReferenceSyncBlockStoreManager {
	private dataProvider?: SyncBlockDataProvider;
	private syncBlockCache: Map<ResourceId, SyncBlockInstance>;
	private subscriptions: Map<ResourceId, { [localId: BlockInstanceId]: SubscriptionCallback }>;
	private titleSubscriptions: Map<
		ResourceId,
		{ [localId: BlockInstanceId]: TitleSubscriptionCallback }
	>;
	private providerFactories: Map<ResourceId, ProviderFactory>;
	private fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void;

	private syncBlockURLRequests: Map<ResourceId, boolean>;
	private isRefreshingSubscriptions: boolean = false;

	constructor(
		dataProvider?: SyncBlockDataProvider,
		fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
	) {
		this.syncBlockCache = new Map();
		this.subscriptions = new Map();
		this.titleSubscriptions = new Map();
		this.dataProvider = dataProvider;
		this.syncBlockURLRequests = new Map();
		this.providerFactories = new Map();
		this.fireAnalyticsEvent = fireAnalyticsEvent;
	}

	public updateFireAnalyticsEvent(
		fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
	) {
		this.fireAnalyticsEvent = fireAnalyticsEvent;
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
			logException(error as Error, {
				location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(fetchErrorPayload((error as Error).message));
		} finally {
			this.isRefreshingSubscriptions = false;
		}
	}

	private fetchSyncBlockSourceInfo(resourceId: ResourceId): void {
		try {
			if (!resourceId || !this.dataProvider) {
				throw new Error('Data provider or resourceId not set');
			}

			if (this.syncBlockURLRequests.get(resourceId)) {
				return;
			}

			const existingSyncBlock = this.getFromCache(resourceId);
			if (!existingSyncBlock) {
				throw new Error('No existing sync block to fetch source info for');
			}

			// skip if source URL and title are already present
			if (existingSyncBlock.data?.sourceURL && existingSyncBlock.data?.sourceTitle) {
				return;
			}

			const { sourceAri, product, blockInstanceId } = existingSyncBlock.data || {};
			if (!sourceAri || !product || !blockInstanceId) {
				this.fireAnalyticsEvent?.(
					getSourceInfoErrorPayload('SourceAri, product or blockInstanceId missing'),
				);
				return;
			}

			this.syncBlockURLRequests.set(resourceId, true);

			this.dataProvider
				.fetchSyncBlockSourceInfo(blockInstanceId, sourceAri, product, this.fireAnalyticsEvent)
				.then((sourceInfo) => {
					if (!sourceInfo) {
						return;
					}
					this.updateCacheWithSourceInfo(resourceId, sourceInfo);
					if (sourceInfo.title) {
						this.updateSourceTitleSubscriptions(resourceId, sourceInfo.title);
					}
				})
				.catch((error) => {
					this.fireAnalyticsEvent?.(getSourceInfoErrorPayload(error.message));
				})
				.finally(() => {
					this.syncBlockURLRequests.delete(resourceId);
				});
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(getSourceInfoErrorPayload((error as Error).message));
		}
	}

	/**
	 * Fetch sync block data for a given array of sync block nodes.
	 * @param syncBlockNodes - The array of sync block nodes to fetch data for
	 * @returns The fetched sync block data results
	 */
	public async fetchSyncBlocksData(syncBlockNodes: SyncBlockNode[]): Promise<SyncBlockInstance[]> {
		if (syncBlockNodes.length === 0) {
			return Promise.resolve([]);
		}

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
		const resolvedData: SyncBlockInstance[] = [];

		data.forEach((syncBlockInstance) => {
			if (!syncBlockInstance.resourceId) {
				this.fireAnalyticsEvent?.(
					fetchErrorPayload(
						syncBlockInstance.error || 'Returned sync block instance does not have resource id',
					),
				);
				return;
			}

			const existingSyncBlock = this.getFromCache(syncBlockInstance.resourceId);

			const resolvedSyncBlockInstance = existingSyncBlock
				? resolveSyncBlockInstance(existingSyncBlock, syncBlockInstance)
				: syncBlockInstance;

			this.updateCache(resolvedSyncBlockInstance);
			resolvedData.push(resolvedSyncBlockInstance);

			if (syncBlockInstance.error) {
				this.fireAnalyticsEvent?.(fetchErrorPayload(syncBlockInstance.error));
				return;
			}

			this.fetchSyncBlockSourceInfo(resolvedSyncBlockInstance.resourceId);
		});

		return [...resolvedData, ...blocksWithNotFoundError];
	}

	private updateCacheWithSourceInfo(resourceId: ResourceId, sourceInfo: SyncBlockSourceInfo) {
		const existingSyncBlock = this.getFromCache(resourceId);
		if (existingSyncBlock && existingSyncBlock.data) {
			existingSyncBlock.data.sourceURL = sourceInfo?.url;
			existingSyncBlock.data = {
				...existingSyncBlock.data,
				sourceURL: sourceInfo?.url,
				sourceTitle: sourceInfo?.title,
			};
			this.updateCache(existingSyncBlock);
		}
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
		this.providerFactories.delete(resourceId);
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
			this.fetchSyncBlocksData([createSyncBlockNode(localId, resourceId)]).catch((error) => {
				logException(error, {
					location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
				});
				this.fireAnalyticsEvent?.(fetchErrorPayload(error.message));
			});
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
		try {
			// check node is a sync block, as we only support sync block subscriptions
			if (node.type.name !== 'syncBlock') {
				throw new Error('Only sync block node subscriptions are supported');
			}

			const { resourceId, localId } = node.attrs;

			if (!localId || !resourceId) {
				throw new Error('Missing local id or resource id');
			}

			return this.subscribeToSyncBlock(resourceId, localId, callback);
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(fetchErrorPayload((error as Error).message));
			return () => {};
		}
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

	public getProviderFactory(resourceId: ResourceId): ProviderFactory | undefined {
		if (!this.dataProvider) {
			const error = new Error('Data provider not set');
			logException(error, {
				location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(fetchErrorPayload(error.message));
			return undefined;
		}

		const { parentDataProviders, providerCreator } =
			this.dataProvider.getSyncedBlockRendererProviderOptions();

		let providerFactory: ProviderFactory | undefined = this.providerFactories.get(resourceId);
		if (!providerFactory) {
			providerFactory = ProviderFactory.create({
				mentionProvider: parentDataProviders?.mentionProvider,
				profilecardProvider: parentDataProviders?.profilecardProvider,
				taskDecisionProvider: parentDataProviders?.taskDecisionProvider,
			});
			this.providerFactories.set(resourceId, providerFactory);
		}

		if (providerCreator) {
			try {
				this.retrieveDynamicProviders(resourceId, providerFactory, providerCreator);
			} catch (error) {
				logException(error as Error, {
					location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
				});
				this.fireAnalyticsEvent?.(fetchErrorPayload((error as Error).message));
			}
		}
		return providerFactory;
	}

	private retrieveDynamicProviders(
		resourceId: ResourceId,
		providerFactory: ProviderFactory,
		providerCreator: SyncBlockRendererProviderCreator,
	) {
		if (!this.dataProvider) {
			throw new Error('Data provider not set');
		}

		const hasMediaProvider = providerFactory.hasProvider('mediaProvider');
		const hasEmojiProvider = providerFactory.hasProvider('emojiProvider');
		if (hasMediaProvider && hasEmojiProvider) {
			return;
		}

		const syncBlock = this.getFromCache(resourceId);
		if (!syncBlock || !syncBlock.data?.sourceAri || !syncBlock.data?.product) {
			this.fireAnalyticsEvent?.(fetchErrorPayload('Sync block or source ari or product not found'));
			return;
		}

		const parentInfo = this.dataProvider.retrieveSyncBlockParentInfo(
			syncBlock.data?.sourceAri,
			syncBlock.data?.product,
		);

		if (!parentInfo) {
			throw new Error('Unable to retrive sync block parent info');
		}

		const { contentId, contentProduct } = parentInfo;

		if (!hasMediaProvider) {
			if (providerCreator.createMediaProvider && contentId && contentProduct) {
				const mediaProvider = providerCreator.createMediaProvider({
					contentProduct,
					contentId,
				});
				if (mediaProvider) {
					providerFactory.setProvider('mediaProvider', mediaProvider);
				}
			}
		}

		if (!hasEmojiProvider) {
			if (providerCreator.createEmojiProvider && contentId && contentProduct) {
				const emojiProvider = providerCreator.createEmojiProvider({
					contentProduct,
					contentId,
				});
				if (emojiProvider) {
					providerFactory.setProvider('emojiProvider', emojiProvider);
				}
			}
		}
	}

	public destroy(): void {
		this.dataProvider = undefined;
		this.syncBlockCache.clear();
		this.subscriptions.clear();
		this.titleSubscriptions.clear();
		this.syncBlockURLRequests.clear();
		this.providerFactories.clear();
		this.isRefreshingSubscriptions = false;
		this.providerFactories.forEach((providerFactory) => {
			providerFactory.destroy();
		});
		this.providerFactories.clear();
		this.fireAnalyticsEvent = undefined;
	}
}
