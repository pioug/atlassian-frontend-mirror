import { type RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import type { Experience } from '@atlaskit/editor-common/experiences';
import { logException } from '@atlaskit/editor-common/monitoring';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	SyncBlockError,
	type BlockInstanceId,
	type ResourceId,
	type SyncBlockAttrs,
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
import {
	fetchErrorPayload,
	fetchSuccessPayload,
	getSourceInfoErrorPayload,
	updateReferenceErrorPayload,
} from '../utils/errorHandling';
import { getFetchExperience, getFetchSourceInfoExperience, getSaveReferenceExperience } from '../utils/experienceTracking';
import { resolveSyncBlockInstance } from '../utils/resolveSyncBlockInstance';
import { parseResourceId } from '../utils/resourceId';
import { createSyncBlockNode } from '../utils/utils';

// A store manager responsible for the lifecycle and state management of reference sync blocks in an editor instance.
// Designed to manage local in-memory state and synchronize with an external data provider.
// Supports fetch, cache, and subscription for sync block data.
// Handles fetching source URL and title for sync blocks.
// Can be used in both editor and renderer contexts.
export class ReferenceSyncBlockStoreManager {
	private dataProvider?: SyncBlockDataProvider;
	private syncBlockCache: Map<ResourceId, SyncBlockInstance>;
	// Keeps track of addition and deletion of reference synced blocks on the document
	// This starts as true to always flush the cache when document is saved for the first time
	// to cater the case when a editor seesion is closed without document being updated right after reference block is deleted
	private isCacheDirty: boolean = true;
	private subscriptions: Map<ResourceId, { [localId: BlockInstanceId]: SubscriptionCallback }>;
	private titleSubscriptions: Map<
		ResourceId,
		{ [localId: BlockInstanceId]: TitleSubscriptionCallback }
	>;
	private providerFactories: Map<ResourceId, ProviderFactory>;
	private fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void;

	private syncBlockFetchDataRequests: Map<ResourceId, boolean>;
	private syncBlockSourceInfoRequestsOld: Map<ResourceId, boolean>;
	private syncBlockSourceInfoRequests: Map<ResourceId, Promise<SyncBlockSourceInfo | undefined>>;
	private isRefreshingSubscriptions: boolean = false;
	// Track pending cache deletions to handle block moves (unmount/remount)
	// When a block is moved, the old component unmounts before the new one mounts,
	// causing the cache to be deleted prematurely. We delay deletion to allow
	// the new component to subscribe and cancel the pending deletion.
	private pendingCacheDeletions: Map<ResourceId, ReturnType<typeof setTimeout>>;

	public fetchExperience: Experience | undefined;
	private fetchSourceInfoExperience: Experience | undefined;
	private saveExperience: Experience | undefined;

	constructor(dataProvider?: SyncBlockDataProvider) {
		this.syncBlockCache = new Map();
		this.subscriptions = new Map();
		this.titleSubscriptions = new Map();
		this.dataProvider = dataProvider;
		this.syncBlockFetchDataRequests = new Map();
		this.syncBlockSourceInfoRequestsOld = new Map();
		this.syncBlockSourceInfoRequests = new Map();
		this.providerFactories = new Map();
		this.pendingCacheDeletions = new Map();
	}

	public setFireAnalyticsEvent(
		fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
	) {
		this.fireAnalyticsEvent = fireAnalyticsEvent;

		this.fetchExperience = getFetchExperience(fireAnalyticsEvent);
		this.fetchSourceInfoExperience = getFetchSourceInfoExperience(fireAnalyticsEvent);
		this.saveExperience = getSaveReferenceExperience(fireAnalyticsEvent);
	}

	public generateResourceIdForReference(sourceId: ResourceId): ResourceId {
		if (!this.dataProvider) {
			throw new Error('Data provider not set');
		}
		return this.dataProvider.generateResourceIdForReference(sourceId);
	}

	public updateFireAnalyticsEvent(
		fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
	): void {
		this.fireAnalyticsEvent = fireAnalyticsEvent;
	}

	public getInitialSyncBlockData(resourceId: ResourceId): SyncBlockInstance | undefined {
		const syncBlockNode = createSyncBlockNode('', resourceId);
		return (
			this.getFromCache(resourceId) || this.dataProvider?.getNodeDataFromCache(syncBlockNode)?.data
		);
	}

	/**
	 * Refreshes the subscriptions for all sync blocks.
	 * @returns {Promise<void>}
	 */
	public async refreshSubscriptions(): Promise<void> {
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

	public fetchSyncBlockSourceInfo(
		resourceId: ResourceId,
	): Promise<SyncBlockSourceInfo | undefined> {
		try {
			if (!resourceId || !this.dataProvider) {
				throw new Error('Data provider or resourceId not set');
			}

			if (fg('platform_synced_block_dogfooding')) {
				const existingRequest = this.syncBlockSourceInfoRequests.get(resourceId);
				if (existingRequest) {
					return existingRequest;
				}
			} else if (this.syncBlockSourceInfoRequestsOld.get(resourceId)) {
				return Promise.resolve(undefined);
			}

			const existingSyncBlock = this.getFromCache(resourceId);
			if (!existingSyncBlock) {
				throw new Error('No existing sync block to fetch source info for');
			}

			const {
				sourceAri,
				product,
				blockInstanceId,
				sourceURL,
				sourceTitle,
				onSamePage,
				sourceSubType,
			} = existingSyncBlock.data || {};
			// skip if source URL and title are already present
			if (sourceURL && sourceTitle) {
				if (fg('platform_synced_block_dogfooding')) {
					return Promise.resolve({
						title: sourceTitle,
						url: sourceURL,
						subType: sourceSubType,
						sourceAri: sourceAri || '',
						onSamePage,
						productType: product,
					});
				} else {
					return Promise.resolve(undefined);
				}
			}

			if (!sourceAri || !product || !blockInstanceId) {
				this.fireAnalyticsEvent?.(
					getSourceInfoErrorPayload('SourceAri, product or blockInstanceId missing', resourceId),
				);
				return Promise.resolve(undefined);
			}

			if (fg('platform_synced_block_dogfooding')) {
				this.fetchSourceInfoExperience?.start({});
			}

			const sourceInfoPromise = this.dataProvider
				.fetchSyncBlockSourceInfo(blockInstanceId, sourceAri, product, this.fireAnalyticsEvent)
				.then((sourceInfo) => {
					if (!sourceInfo) {
						if (fg('platform_synced_block_dogfooding')) {
							this.fetchSourceInfoExperience?.failure({ reason: 'No source info returned' });
							this.fireAnalyticsEvent?.(getSourceInfoErrorPayload('No source info returned', resourceId));
						}
						return undefined;
					}
					this.updateCacheWithSourceInfo(resourceId, sourceInfo);

					if (sourceInfo.title) {
						this.updateSourceTitleSubscriptions(resourceId, sourceInfo.title);
					}

					if (fg('platform_synced_block_dogfooding')) {
						if (sourceInfo.title && sourceInfo.url) {
							this.fetchSourceInfoExperience?.success();
						} else {
							this.fetchSourceInfoExperience?.failure({ reason: 'Missing title or url' });
							this.fireAnalyticsEvent?.(getSourceInfoErrorPayload('Missing title or url', resourceId));
						}

						return sourceInfo;
					}
				})
				.catch((error) => {
					if (fg('platform_synced_block_dogfooding')) {
						this.fetchSourceInfoExperience?.failure({ reason: error.message });
					}
					this.fireAnalyticsEvent?.(getSourceInfoErrorPayload(error.message, resourceId));

					return undefined;
				})
				.finally(() => {
					if (fg('platform_synced_block_dogfooding')) {
						this.syncBlockSourceInfoRequests.delete(resourceId);
					} else {
						this.syncBlockSourceInfoRequestsOld.delete(resourceId);
					}
				});

			if (fg('platform_synced_block_dogfooding')) {
				this.syncBlockSourceInfoRequests.set(resourceId, sourceInfoPromise);
				return sourceInfoPromise;
			} else {
				this.syncBlockSourceInfoRequestsOld.set(resourceId, true);
			}
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(getSourceInfoErrorPayload((error as Error).message, resourceId));
		}
		return Promise.resolve(undefined);
	}

	/**
	 * Fetch sync block data for a given array of sync block nodes.
	 * @param syncBlockNodes - The array of sync block nodes to fetch data for
	 * @returns The fetched sync block data results
	 */
	public async fetchSyncBlocksData(syncBlockNodes: SyncBlockNode[]): Promise<void> {
		if (syncBlockNodes.length === 0) {
			return;
		}

		// Don't fetch for not_found error since the source is already deleted
		const nodesToFetch: SyncBlockNode[] = [];

		syncBlockNodes.forEach((node) => {
			if (this.syncBlockFetchDataRequests.get(node.attrs.resourceId)) {
				return;
			}
			const existingSyncBlock = this.getFromCache(node.attrs.resourceId);
			if (existingSyncBlock?.error === SyncBlockError.NotFound) {
				return;
			}
			nodesToFetch.push(node);
		});

		if (nodesToFetch.length === 0) {
			return;
		}

		if (!this.dataProvider) {
			throw new Error('Data provider not set');
		}

		nodesToFetch.forEach((node) => {
			this.syncBlockFetchDataRequests.set(node.attrs.resourceId, true);
		});

		if (fg('platform_synced_block_dogfooding')) {
			this.fetchExperience?.start({});
		}

		const data = await this.dataProvider.fetchNodesData(nodesToFetch).finally(() => {
			nodesToFetch.forEach((node) => {
				this.syncBlockFetchDataRequests.delete(node.attrs.resourceId);
			});
		});

		const resolvedData: SyncBlockInstance[] = [];

		let hasUnexpectedError = false;
		let hasExpectedError = false;

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
				this.fireAnalyticsEvent?.(
					fetchErrorPayload(
						syncBlockInstance.error,
						syncBlockInstance.resourceId,
					),
				);

				if (syncBlockInstance.error === SyncBlockError.NotFound ||
					syncBlockInstance.error === SyncBlockError.Forbidden) {
					hasExpectedError = true;
				} else if (syncBlockInstance.error) {
					hasUnexpectedError = true;
				}
				return;
			} else if (fg('platform_synced_block_dogfooding')) {
				this.fireAnalyticsEvent?.(
					fetchSuccessPayload(syncBlockInstance.resourceId, syncBlockInstance.data?.blockInstanceId, syncBlockInstance.data?.product),
				);
			}

			this.fetchSyncBlockSourceInfo(resolvedSyncBlockInstance.resourceId);
		});

		if (fg('platform_synced_block_dogfooding')) {
			if (hasUnexpectedError) {
				this.fetchExperience?.failure({ reason: 'Unexpected error during fetch' });
			} else if (hasExpectedError) {
				this.fetchExperience?.abort({ reason: 'Expected error: NotFound or PermissionDenied' });
			} else {
				this.fetchExperience?.success();
			}
		}
	}

	private updateCacheWithSourceInfo(resourceId: ResourceId, sourceInfo: SyncBlockSourceInfo) {
		const existingSyncBlock = this.getFromCache(resourceId);
		if (existingSyncBlock && existingSyncBlock.data) {
			existingSyncBlock.data.sourceURL = sourceInfo?.url;
			existingSyncBlock.data = {
				...existingSyncBlock.data,
				sourceURL: sourceInfo?.url,
				sourceTitle: sourceInfo?.title,
				onSamePage: sourceInfo?.onSamePage,
				sourceSubType: sourceInfo?.subType,
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

	public getFromCache(resourceId: ResourceId): SyncBlockInstance | undefined {
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
		// Cancel any pending cache deletion for this resourceId.
		// This handles the case where a block is moved - the old component unmounts
		// (scheduling deletion) but the new component mounts and subscribes before
		// the deletion timeout fires.
		const pendingDeletion = this.pendingCacheDeletions.get(resourceId);
		if (pendingDeletion) {
			clearTimeout(pendingDeletion);
			this.pendingCacheDeletions.delete(resourceId);
		}

		// add to subscriptions map
		const resourceSubscriptions = this.subscriptions.get(resourceId) || {};
		this.subscriptions.set(resourceId, { ...resourceSubscriptions, [localId]: callback });

		// New subscription means new reference synced block is added to the document
		this.isCacheDirty = true;

		const syncBlockNode = createSyncBlockNode(localId, resourceId);

		// call the callback immediately if we have cached data
		// prefer cache from store manager first, should update data provider to use the same cache
		const cachedData =
			this.getFromCache(resourceId) || this.dataProvider?.getNodeDataFromCache(syncBlockNode)?.data;

		if (cachedData) {
			callback(cachedData);
		} else {
			this.fetchSyncBlocksData([syncBlockNode]).catch((error) => {
				logException(error, {
					location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
				});
				this.fireAnalyticsEvent?.(fetchErrorPayload(error.message, resourceId));
			});
		}

		return () => {
			const resourceSubscriptions = this.subscriptions.get(resourceId);
			if (resourceSubscriptions) {
				// Unsubscription means a reference synced block is removed from the document
				this.isCacheDirty = true;

				delete resourceSubscriptions[localId];
				if (Object.keys(resourceSubscriptions).length === 0) {
					this.subscriptions.delete(resourceId);
					// Delay cache deletion to handle block moves (unmount/remount).
					// When a block is moved, the old component unmounts before the new one mounts.
					// By delaying deletion, we give the new component time to subscribe and
					// cancel this pending deletion, preserving the cached data.
					// TODO: EDITOR-4152 - Rework this logic
					const deletionTimeout = setTimeout(() => {
						// Only delete if still no subscribers (wasn't re-subscribed)
						if (!this.subscriptions.has(resourceId)) {
							this.deleteFromCache(resourceId);
						}
						this.pendingCacheDeletions.delete(resourceId);
					}, 1000);
					this.pendingCacheDeletions.set(resourceId, deletionTimeout);
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
		} else {
			if (parentDataProviders?.mentionProvider) {
				providerFactory.setProvider('mentionProvider', parentDataProviders?.mentionProvider);
			}
			if (parentDataProviders?.profilecardProvider) {
				providerFactory.setProvider(
					'profilecardProvider',
					parentDataProviders?.profilecardProvider,
				);
			}
			if (parentDataProviders?.taskDecisionProvider) {
				providerFactory.setProvider(
					'taskDecisionProvider',
					parentDataProviders?.taskDecisionProvider,
				);
			}
		}

		if (providerCreator) {
			try {
				this.retrieveDynamicProviders(resourceId, providerFactory, providerCreator);
			} catch (error) {
				logException(error as Error, {
					location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
				});
				this.fireAnalyticsEvent?.(fetchErrorPayload((error as Error).message, resourceId));
			}
		}
		return providerFactory;
	}

	public getSSRProviders(resourceId: ResourceId) {
		if (!fg('platform_synced_block_dogfooding')) {
			return null;
		}

		if (!this.dataProvider) {
			return null;
		}

		const { providerCreator } = this.dataProvider.getSyncedBlockRendererProviderOptions();

		if (!providerCreator?.createSSRMediaProvider) {
			return null;
		}

		const parsedResourceId = parseResourceId(resourceId);

		if (!parsedResourceId) {
			return null;
		}

		const { contentId, product: contentProduct } = parsedResourceId;

		try {
			const mediaProvider = providerCreator.createSSRMediaProvider({
				contentId,
				contentProduct,
			});

			if (mediaProvider) {
				return {
					media: mediaProvider,
				};
			}
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
			});
		}

		return null;
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
		const hasCardProvider = providerFactory.hasProvider('cardProvider');

		if (hasMediaProvider && hasEmojiProvider && hasCardProvider) {
			return;
		}

		const syncBlock = this.getFromCache(resourceId);
		if (!syncBlock) {
			return;
		}

		if (!syncBlock.data?.sourceAri || !syncBlock.data?.product) {
			this.fireAnalyticsEvent?.(fetchErrorPayload('Sync block source ari or product not found'));
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

		if (!hasCardProvider) {
			if (providerCreator.createSmartLinkProvider) {
				const smartLinkProvider = providerCreator.createSmartLinkProvider();
				if (smartLinkProvider) {
					providerFactory.setProvider('cardProvider', smartLinkProvider);
				}
			}
		}
	}

	/**
	 * Update reference synced blocks on the document with the BE
	 *
	 * @returns true if the reference synced blocks are updated successfully, false otherwise
	 */
	public async flush() {
		if (!this.isCacheDirty) {
			return true;
		}

		let success = true;
		try {
			const blocks: SyncBlockAttrs[] = [];

			// Collect all reference synced blocks on the current document
			Array.from(this.subscriptions.entries()).forEach(([resourceId, callbacks]) => {
				Object.keys(callbacks).forEach((localId) => {
					blocks.push({
						resourceId,
						localId,
					});
				});
			});

			if (blocks.length === 0) {
				this.isCacheDirty = false;
				return true;
			}

			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			// reset isCacheDirty early to prevent race condition
			// There is a race condition where if a user makes changes (create/delete) to a reference sync block
			// on a live page and the reference sync block is being saved while the user
			// is still making changes, the new changes might not be saved if they all happen
			// exactly at a time when the updateReferenceData is being executed asynchronously.
			this.isCacheDirty = false;

			if (fg('platform_synced_block_dogfooding')) {
				this.saveExperience?.start();
			}
			const updateResult = await this.dataProvider.updateReferenceData(blocks);

			if (!updateResult.success) {
				success = false;

				if (fg('platform_synced_block_dogfooding')) {
					this.saveExperience?.failure({
						reason:
							updateResult.error || 'Failed to update reference synced blocks on the document',
					});
				}
				this.fireAnalyticsEvent?.(
					updateReferenceErrorPayload(
						updateResult.error || 'Failed to update reference synced blocks on the document',
					),
				);
			}
		} catch (error) {
			success = false;
			logException(error as Error, {
				location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
			});
			if (fg('platform_synced_block_dogfooding')) {
				this.saveExperience?.failure({ reason: (error as Error).message });
			}
			this.fireAnalyticsEvent?.(updateReferenceErrorPayload((error as Error).message));
		} finally {
			if (!success) {
				// set isCacheDirty back to true for cases where it failed to update the reference synced blocks on the BE
				this.isCacheDirty = true;
			} else if (fg('platform_synced_block_dogfooding')) {
				this.saveExperience?.success();
			}
		}

		return success;
	}

	public destroy(): void {
		this.dataProvider = undefined;
		this.syncBlockCache.clear();
		this.subscriptions.clear();
		this.titleSubscriptions.clear();
		this.syncBlockFetchDataRequests.clear();
		this.syncBlockSourceInfoRequestsOld.clear();
		this.syncBlockSourceInfoRequests.clear();
		this.providerFactories.clear();
		this.isRefreshingSubscriptions = false;
		this.providerFactories.forEach((providerFactory) => {
			providerFactory.destroy();
		});
		this.providerFactories.clear();
		this.saveExperience?.abort({ reason: 'editor-destroyed' });
		this.fetchExperience?.abort({ reason: 'editor-destroyed' });
		this.fetchSourceInfoExperience?.abort({ reason: 'editor-destroyed' });
		this.fireAnalyticsEvent = undefined;
	}
}
