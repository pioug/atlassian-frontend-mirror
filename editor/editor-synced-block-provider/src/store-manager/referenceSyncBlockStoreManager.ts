import isEqual from 'lodash/isEqual';

import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import type { Experience } from '@atlaskit/editor-common/experiences';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ProviderFactory, MediaProvider } from '@atlaskit/editor-common/provider-factory';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import { isProviderNotReadyError, ProviderNotReadyError, SyncBlockError } from '../common/types';
import type {
	BlockInstanceId,
	ResourceId,
	SyncBlockAttrs,
	SyncBlockNode,
	SyncBlockPrefetchData,
} from '../common/types';
import type {
	SyncBlockInstance,
	SubscriptionCallback,
	SyncBlockDataProviderInterface,
	TitleSubscriptionCallback,
	SyncBlockSourceInfo,
} from '../providers/types';
import {
	buildErrorAttribution,
	buildFetchErrorAttribution,
	cacheDeletionForcedPayload,
	fetchErrorPayload,
	fetchSuccessPayload,
	getSourceInfoErrorPayload,
	sourceInfoOrphanedPayload,
	updateReferenceErrorPayload,
} from '../utils/errorHandling';
import {
	getFetchExperience,
	getFetchSourceInfoExperience,
	getSaveReferenceExperience,
} from '../utils/experienceTracking';
import { resolveSyncBlockInstance } from '../utils/resolveSyncBlockInstance';
import {
	createSyncBlockNode,
	getSourceProductFromResourceIdSafe,
	normalizeSyncBlockJSONContent,
} from '../utils/utils';

import { SyncBlockBatchFetcher } from './syncBlockBatchFetcher';
import { syncBlockInMemorySessionCache } from './syncBlockInMemorySessionCache';
import { SyncBlockProviderFactoryManager } from './syncBlockProviderFactoryManager';
import { SyncBlockSubscriptionManager } from './syncBlockSubscriptionManager';

const CACHE_KEY_PREFIX = 'sync-block-data-';

const ENTITY_NOT_FOUND_MAX_RETRIES = 3;
const ENTITY_NOT_FOUND_INITIAL_DELAY_MS = 2000;

// Grace period before a cache entry is removed after the last subscriber
// unsubscribes (gated by `platform_synced_block_patch_14`). Guards are
// re-checked at fire time; if any are positive, the timer is rescheduled.
const CACHE_DELETION_GRACE_PERIOD_MS = 30_000;
// Max reschedules before force-deleting with an analytics event (~5 min).
const CACHE_DELETION_MAX_RESCHEDULES = 10;

// A store manager responsible for the lifecycle and state management of reference sync blocks in an editor instance.
// Designed to manage local in-memory state and synchronize with an external data provider.
// Supports fetch, cache, and subscription for sync block data.
// Handles fetching source URL and title for sync blocks.
// Can be used in both editor and renderer contexts.
export class ReferenceSyncBlockStoreManager {
	private viewMode?: ViewMode;
	private dataProvider?: SyncBlockDataProviderInterface;
	// Keeps track of addition and deletion of reference synced blocks on the document
	// This starts as true to always flush the cache when document is saved for the first time
	// to cater the case when a editor session is closed without document being updated right after reference block is deleted
	private isCacheDirty: boolean = true;
	private fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void;

	private syncBlockFetchDataRequests: Map<ResourceId, boolean>;
	private syncBlockSourceInfoRequests: Map<ResourceId, Promise<SyncBlockSourceInfo | undefined>>;
	// Track newly added sync blocks (resourceIds that were just subscribed to without cached data)
	private newlyAddedSyncBlocks: Set<ResourceId>;
	// Keep track of the last flushed subscriptions to optimize cache flushing on document save
	private lastFlushedSyncedBlocks: Record<string, Record<string, boolean>> = {};
	// Callback to notify when an unpublished sync block is detected
	private onUnpublishedSyncBlockDetected?: (resourceId: ResourceId) => void;
	// Track if a flush operation is currently in progress
	private isFlushInProgress: boolean = false;
	// Track if another flush is needed after the current one completes
	private flushNeededAfterCurrent: boolean = false;
	// Track the setTimeout handle for queued flush so we can cancel it on destroy
	private queuedFlushTimeout?: ReturnType<typeof setTimeout>;

	// Track retry attempts for EntityNotFound errors (block may be in the process of being created)
	private entityNotFoundRetryCount: Map<ResourceId, number> = new Map();
	private entityNotFoundRetryTimers: Map<ResourceId, ReturnType<typeof setTimeout>> = new Map();

	// Pending cache deletion timers keyed by resourceId (gated by
	// `platform_synced_block_patch_14`). Cancelled when a subscriber re-attaches.
	private pendingCacheDeletions: Map<ResourceId, ReturnType<typeof setTimeout>> = new Map();
	// Reschedule counter per resource — reset on actual deletion or re-subscribe.
	private cacheDeletionRescheduleCounts: Map<ResourceId, number> = new Map();
	// Set by destroy() so in-flight timer callbacks can early-return.
	private isDestroyed = false;

	public fetchExperience: Experience | undefined;
	private fetchSourceInfoExperience: Experience | undefined;
	private saveExperience: Experience | undefined;

	private _subscriptionManager: SyncBlockSubscriptionManager;
	private _providerFactoryManager: SyncBlockProviderFactoryManager;
	private _batchFetcher: SyncBlockBatchFetcher;

	constructor(dataProvider?: SyncBlockDataProviderInterface, viewMode?: ViewMode) {
		this.dataProvider = dataProvider;
		this.viewMode = viewMode;
		this.syncBlockFetchDataRequests = new Map();
		this.syncBlockSourceInfoRequests = new Map();
		this.newlyAddedSyncBlocks = new Set();

		this._subscriptionManager = new SyncBlockSubscriptionManager({
			getDataProvider: () => this.dataProvider,
			getFromCache: (rid) => this.getFromCache(rid),
			updateCache: (inst) => this.updateCache(inst),
			deleteFromCache: (rid) => this.deleteFromCache(rid),
			debouncedBatchedFetchSyncBlocks: (rid) => this.debouncedBatchedFetchSyncBlocks(rid),
			fetchSyncBlockSourceInfo: (rid) => this.fetchSyncBlockSourceInfo(rid),
			getFireAnalyticsEvent: () => this.fireAnalyticsEvent,
			markCacheDirty: () => {
				this.isCacheDirty = true;
			},
			// Delegate cache lifecycle to the store manager so guards can be
			// checked atomically (gated by `platform_synced_block_patch_14`).
			scheduleCacheDeletion: (rid) => this.scheduleCacheDeletion(rid),
			cancelPendingCacheDeletion: (rid) => this.cancelPendingCacheDeletion(rid),
		});

		this._providerFactoryManager = new SyncBlockProviderFactoryManager({
			getDataProvider: () => this.dataProvider,
			getFromCache: (rid) => this.getFromCache(rid),
			getFireAnalyticsEvent: () => this.fireAnalyticsEvent,
		});

		this._batchFetcher = new SyncBlockBatchFetcher({
			getSubscriptions: () => this._subscriptionManager.getSubscriptions(),
			fetchSyncBlocksData: (nodes) => this.fetchSyncBlocksData(nodes),
			getFireAnalyticsEvent: () => this.fireAnalyticsEvent,
			// EDITOR-7860: skip + re-queue fetches while not ready / torn down.
			isProviderReady: () => this.hasDataProvider(),
		});

		// The provider might have SSR data cache already set, so we need to update the cache in session memory storage
		this.setSSRDataInSessionCache(this.dataProvider?.getNodeDataCacheKeys());
	}

	public isReferenceBlock(node: PMNode): boolean {
		return node.type.name === 'syncBlock';
	}

	/**
	 * Whether the async data provider is wired and the manager is not torn down.
	 * Consumers gate fetch/subscribe on this to avoid a false `Data provider not
	 * set` fetch error (EDITOR-7860). The `isDestroyed` check covers managers
	 * orphaned mid-flight during an async provider swap, where `dataProvider`
	 * alone is insufficient.
	 */
	public hasDataProvider(): boolean {
		return !this.isDestroyed && !!this.dataProvider;
	}

	/**
	 * Enables or disables real-time GraphQL subscriptions for block updates.
	 * When enabled, the store manager will subscribe to real-time updates
	 * instead of relying on polling.
	 * @param enabled - Whether to enable real-time subscriptions
	 */
	public setRealTimeSubscriptionsEnabled(enabled: boolean): void {
		this._subscriptionManager.setRealTimeSubscriptionsEnabled(enabled);
	}

	/**
	 * Checks if real-time subscriptions are currently enabled.
	 */
	public isRealTimeSubscriptionsEnabled(): boolean {
		return this._subscriptionManager.isRealTimeSubscriptionsEnabled();
	}

	/**
	 * Returns all resource IDs that are currently subscribed to.
	 * Used by React components to render subscription components.
	 */
	public getSubscribedResourceIds(): ResourceId[] {
		return this._subscriptionManager.getSubscribedResourceIds();
	}

	/**
	 * Registers a listener that will be called when subscriptions change.
	 * @param listener - Callback function to invoke when subscriptions change
	 * @returns Unsubscribe function to remove the listener
	 */
	public onSubscriptionsChanged(listener: () => void): () => void {
		return this._subscriptionManager.onSubscriptionsChanged(listener);
	}

	/**
	 * Handles incoming data from a GraphQL subscription.
	 * Called by React subscription components when they receive updates.
	 * @param syncBlockInstance - The updated sync block instance
	 */
	public handleSubscriptionUpdate(syncBlockInstance: SyncBlockInstance): void {
		this._subscriptionManager.handleSubscriptionUpdate(syncBlockInstance);
	}

	public setFireAnalyticsEvent(
		fireAnalyticsEvent?: (payload: RendererSyncBlockEventPayload) => void,
	): void {
		this.fireAnalyticsEvent = fireAnalyticsEvent;

		this.fetchExperience = getFetchExperience(fireAnalyticsEvent);
		this.fetchSourceInfoExperience = getFetchSourceInfoExperience(fireAnalyticsEvent);
		this.saveExperience = getSaveReferenceExperience(fireAnalyticsEvent);
	}

	public setOnUnpublishedSyncBlockDetected(callback?: (resourceId: ResourceId) => void): void {
		this.onUnpublishedSyncBlockDetected = callback;
	}

	/**
	 * Mark a sync block as newly added to the document.
	 * This should be called when a sync block node is added via a transaction.
	 * @param resourceId - The resource ID of the newly added sync block
	 */
	public markAsNewlyAdded(resourceId: ResourceId): void {
		this.newlyAddedSyncBlocks.add(resourceId);
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
		const providerData = this.dataProvider?.getNodeDataFromCache(syncBlockNode)?.data;
		if (providerData) {
			// Initial provider cache data can come from SSR/prefetch and bypass updateCache(),
			// so normalize legacy reference payloads here before rendering.
			return this.normalizeReferenceData(providerData);
		}
		return this.getFromSessionCache(resourceId);
	}

	private normalizeReferenceData(syncBlock: SyncBlockInstance): SyncBlockInstance {
		if (!syncBlock.data?.content?.length) {
			return syncBlock;
		}

		const content = normalizeSyncBlockJSONContent(syncBlock.data.content);

		if (content === syncBlock.data.content) {
			return syncBlock;
		}

		return {
			...syncBlock,
			data: {
				...syncBlock.data,
				content,
			},
		};
	}

	private updateSessionCache(resourceId: ResourceId): void {
		const latestData = this.getFromCache(resourceId);
		if (latestData) {
			syncBlockInMemorySessionCache.setItem(
				`${CACHE_KEY_PREFIX}${resourceId}`,
				JSON.stringify(latestData),
			);
		}
	}

	private getFromSessionCache(resourceId: ResourceId): SyncBlockInstance | undefined {
		try {
			const raw = syncBlockInMemorySessionCache.getItem(`${CACHE_KEY_PREFIX}${resourceId}`);
			if (!raw) {
				return undefined;
			}
			// Session cache entries written before this sanitizer existed may still include
			// annotation marks or panel_c1 nodes, so keep this read-time safety net for legacy data.
			return this.normalizeReferenceData(JSON.parse(raw) as SyncBlockInstance);
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/referenceSyncBlockStoreManager/getFromSessionCache',
			});
			return undefined;
		}
	}

	public fetchSyncBlockSourceInfoBySourceAri(
		sourceAri: string,
		hasAccess: boolean = true,
	): Promise<SyncBlockSourceInfo | undefined> {
		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			const sourceInfo = this.dataProvider.fetchSyncBlockSourceInfo(
				undefined,
				sourceAri,
				undefined,
				hasAccess,
			);

			return sourceInfo;
		} catch (error) {
			logException(error as Error, {
				location:
					'editor-synced-block-provider/referenceSyncBlockStoreManager/fetchSyncBlockSourceInfoBySourceAri',
			});
			this.fireAnalyticsEvent?.(getSourceInfoErrorPayload((error as Error).message));

			return Promise.resolve(undefined);
		}
	}

	public fetchSyncBlockSourceInfoByLocalId(
		localId: BlockInstanceId,
		hasAccess: boolean = true,
	): Promise<SyncBlockSourceInfo | undefined> {
		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			return this.dataProvider.fetchSyncBlockSourceInfo(localId, undefined, undefined, hasAccess);
		} catch (error) {
			logException(error as Error, {
				location:
					'editor-synced-block-provider/referenceSyncBlockStoreManager/fetchSyncBlockSourceInfoByLocalId',
			});
			this.fireAnalyticsEvent?.(getSourceInfoErrorPayload((error as Error).message));

			return Promise.resolve(undefined);
		}
	}

	public fetchSyncBlockSourceInfo(
		resourceId: ResourceId,
	): Promise<SyncBlockSourceInfo | undefined> {
		try {
			if (!resourceId || !this.dataProvider) {
				throw new Error('Data provider or resourceId not set');
			}

			const existingRequest = this.syncBlockSourceInfoRequests.get(resourceId);
			if (existingRequest) {
				return existingRequest;
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
				onSameDocument,
				sourceSubType,
				issueType,
			} = existingSyncBlock.data || {};
			// skip if source URL and title are already present
			if (sourceURL && sourceTitle) {
				return Promise.resolve({
					title: sourceTitle,
					url: sourceURL,
					subType: sourceSubType,
					sourceAri: sourceAri || '',
					onSameDocument,
					productType: product,
					issueType,
				});
			}

			// Derive once per call so we don't re-parse on every analytics event below.
			// `product` from cached data is preferred when available; fall back to parsing
			// the resourceId.
			const sourceProduct = product ?? getSourceProductFromResourceIdSafe(resourceId);

			if (!sourceAri || !product || !blockInstanceId) {
				this.fireAnalyticsEvent?.(
					getSourceInfoErrorPayload(
						'SourceAri, product or blockInstanceId missing',
						resourceId,
						sourceProduct,
					),
				);
				return Promise.resolve(undefined);
			}

			this.fetchSourceInfoExperience?.start({});
			const sourceInfoPromise = this.dataProvider
				.fetchSyncBlockSourceInfo(
					blockInstanceId,
					sourceAri,
					product,
					true, // hasAccess
				)
				.then((sourceInfo) => {
					if (!sourceInfo) {
						this.fetchSourceInfoExperience?.failure({ reason: 'No source info returned' });
						this.fireAnalyticsEvent?.(
							getSourceInfoErrorPayload('No source info returned', resourceId, sourceProduct),
						);
						return undefined;
					}
					this.updateCacheWithSourceInfo(resourceId, sourceInfo);

					if (sourceInfo.title) {
						this._subscriptionManager.updateSourceTitleSubscriptions(resourceId, sourceInfo.title);
					}

					if (sourceInfo.title && sourceInfo.url) {
						this.fetchSourceInfoExperience?.success();
					} else {
						this.fetchSourceInfoExperience?.failure({ reason: 'Missing title or url' });
						this.fireAnalyticsEvent?.(
							getSourceInfoErrorPayload('Missing title or url', resourceId, sourceProduct),
						);
					}

					return sourceInfo;
				})
				.catch((error) => {
					this.fetchSourceInfoExperience?.failure({ reason: error.message });
					this.fireAnalyticsEvent?.(
						getSourceInfoErrorPayload(error.message, resourceId, sourceProduct),
					);

					return undefined;
				})
				.finally(() => {
					this.syncBlockSourceInfoRequests.delete(resourceId);
				});

			this.syncBlockSourceInfoRequests.set(resourceId, sourceInfoPromise);
			return sourceInfoPromise;
		} catch (error) {
			logException(error as Error, {
				location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(
				getSourceInfoErrorPayload(
					(error as Error).message,
					resourceId,
					getSourceProductFromResourceIdSafe(resourceId),
				),
			);
		}
		return Promise.resolve(undefined);
	}

	/**
	 * Processes prefetched data and updates the cache.
	 * @param prefetchedData - The prefetched data to process
	 * @returns {Promise<void>}
	 */
	public async processPrefetchedData(
		prefetchedData: SyncBlockPrefetchData | undefined,
	): Promise<void> {
		if (!prefetchedData) {
			return;
		}

		// start the fetch experience (this should be started much earlier to properly track performance, but better late than never)
		this.fetchExperience?.start({});

		// mark the sync block requests as in fly
		prefetchedData.resourceIds.forEach((resourceId) => {
			this.syncBlockFetchDataRequests.set(resourceId, true);
		});

		try {
			const prefetchedResolvedData = await prefetchedData.prefetchPromise;

			const { hasUnexpectedError, hasExpectedError } =
				this.processFetchedData(prefetchedResolvedData);

			if (hasUnexpectedError) {
				this.fetchExperience?.failure({ reason: 'Unexpected error during prefetch' });
			} else if (hasExpectedError) {
				this.fetchExperience?.abort({
					reason: 'Expected error: NotFound or PermissionDenied during prefetch',
				});
			} else {
				this.fetchExperience?.success();
			}
		} catch (error) {
			this.fetchExperience?.failure({
				reason: `Prefetch promise rejected: ${(error as Error).message}`,
			});
		} finally {
			// Clean up in-flight markers so subsequent fetches are not blocked
			prefetchedData.resourceIds.forEach((resourceId) => {
				this.syncBlockFetchDataRequests.delete(resourceId);
			});
		}
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
			if (existingSyncBlock?.error?.type === SyncBlockError.NotFound) {
				return;
			}

			nodesToFetch.push(node);
		});

		if (nodesToFetch.length === 0) {
			return;
		}

		if (!this.dataProvider) {
			// EDITOR-7860: tag the throw so catch sites can suppress the benign
			// not-ready/torn-down case. Gate-off keeps the legacy throw + message.
			if (fg('platform_editor_blocks_patch_3')) {
				throw new ProviderNotReadyError();
			}
			throw new Error('Data provider not set');
		}

		nodesToFetch.forEach((node) => {
			this.syncBlockFetchDataRequests.set(node.attrs.resourceId, true);
		});

		this.fetchExperience?.start({});

		const data = await this.dataProvider.fetchNodesData(nodesToFetch).finally(() => {
			nodesToFetch.forEach((node) => {
				this.syncBlockFetchDataRequests.delete(node.attrs.resourceId);
			});
		});

		const { hasUnexpectedError, hasExpectedError } = this.processFetchedData(data);

		if (hasUnexpectedError) {
			this.fetchExperience?.failure({ reason: 'Unexpected error during fetch' });
		} else if (hasExpectedError) {
			this.fetchExperience?.abort({ reason: 'Expected error: NotFound or PermissionDenied' });
		} else {
			this.fetchExperience?.success();
		}
	}

	private processFetchedData(data: SyncBlockInstance[] | undefined) {
		if (!data) {
			return { hasUnexpectedError: false, hasExpectedError: false };
		}

		let hasUnexpectedError = false;
		let hasExpectedError = false;

		data.forEach((syncBlockInstance) => {
			if (!syncBlockInstance.resourceId) {
				const payload =
					syncBlockInstance.error?.reason ||
					syncBlockInstance.error?.type ||
					'Returned sync block instance does not have resource id';
				// No resourceId means we cannot derive a sourceProduct here; intentionally omit.
				// Classify on the structured `type` first, falling back to the free-text
				// `reason`/payload (EDITOR-7862).
				this.fireAnalyticsEvent?.(
					fetchErrorPayload(
						payload,
						undefined,
						undefined,
						buildFetchErrorAttribution(
							fg('platform_editor_blocks_patch_3'),
							syncBlockInstance.error?.type || syncBlockInstance.error?.reason || payload,
							syncBlockInstance.error?.statusCode,
						),
					),
				);
				return;
			}

			const existingSyncBlock = this.getFromCache(syncBlockInstance.resourceId);

			const resolvedSyncBlockInstance = existingSyncBlock
				? resolveSyncBlockInstance(existingSyncBlock, syncBlockInstance)
				: syncBlockInstance;

			this.updateCache(resolvedSyncBlockInstance);

			// Check if this is a newly added unpublished sync block and notify
			// Only trigger for sync blocks that were just added (not refreshed or loaded on page init)
			if (
				!syncBlockInstance.error &&
				resolvedSyncBlockInstance.data?.status === 'unpublished' &&
				this.newlyAddedSyncBlocks.has(syncBlockInstance.resourceId) &&
				this.onUnpublishedSyncBlockDetected
			) {
				// Remove from newly added set after checking to prevent duplicate flags
				this.newlyAddedSyncBlocks.delete(syncBlockInstance.resourceId);
				this.onUnpublishedSyncBlockDetected(resolvedSyncBlockInstance.resourceId);
			} else if (this.newlyAddedSyncBlocks.has(syncBlockInstance.resourceId)) {
				// Remove from newly added set even if not unpublished (to clean up)
				this.newlyAddedSyncBlocks.delete(syncBlockInstance.resourceId);
			}

			// Clear retry tracking on successful fetch — block has been created
			if (
				!syncBlockInstance.error &&
				this.entityNotFoundRetryCount.has(syncBlockInstance.resourceId)
			) {
				const timer = this.entityNotFoundRetryTimers.get(syncBlockInstance.resourceId);
				if (timer) {
					clearTimeout(timer);
					this.entityNotFoundRetryTimers.delete(syncBlockInstance.resourceId);
				}
				this.entityNotFoundRetryCount.delete(syncBlockInstance.resourceId);
			}

			if (syncBlockInstance.error) {
				// Skip error analytics when EntityNotFound will be retried, to avoid
				// inflating error-rate metrics with expected transient failures
				const isRetryingEntityNotFound =
					syncBlockInstance.error.type === SyncBlockError.EntityNotFound &&
					(this.entityNotFoundRetryCount.get(syncBlockInstance.resourceId) ?? 0) <
						ENTITY_NOT_FOUND_MAX_RETRIES &&
					fg('platform_synced_block_patch_13');

				if (!isRetryingEntityNotFound) {
					// Classify on the structured `type` (a `SyncBlockError` enum value) first,
					// falling back to the free-text `reason` so source-state/permission strings
					// are still bucketed (EDITOR-7862). The emitted `error` attribute is unchanged.
					this.fireAnalyticsEvent?.(
						fetchErrorPayload(
							syncBlockInstance.error.reason || syncBlockInstance.error.type,
							syncBlockInstance.resourceId,
							syncBlockInstance.data?.product ??
								getSourceProductFromResourceIdSafe(syncBlockInstance.resourceId),
							buildFetchErrorAttribution(
								fg('platform_editor_blocks_patch_3'),
								syncBlockInstance.error.type || syncBlockInstance.error.reason,
								syncBlockInstance.error.statusCode,
							),
						),
					);
				}

				if (
					syncBlockInstance.error.type === SyncBlockError.NotFound ||
					syncBlockInstance.error.type === SyncBlockError.Forbidden
				) {
					hasExpectedError = true;
				} else if (syncBlockInstance.error.type === SyncBlockError.EntityNotFound) {
					// Schedule a retry for EntityNotFound — the source block may be in
					// the process of being created by a collaborator (race condition
					// between NCS propagation and Block Service createBlock call).
					if (fg('platform_synced_block_patch_13')) {
						this.scheduleEntityNotFoundRetry(syncBlockInstance.resourceId);
					}
					if (!isRetryingEntityNotFound) {
						hasUnexpectedError = true;
					}
				} else if (syncBlockInstance.error) {
					hasUnexpectedError = true;
				}
				return;
			}
			const callbacks = this._subscriptionManager
				.getSubscriptions()
				.get(syncBlockInstance.resourceId);
			const localIds = callbacks ? Object.keys(callbacks) : [];
			localIds.forEach((localId) => {
				this.fireAnalyticsEvent?.(
					fetchSuccessPayload(
						syncBlockInstance.resourceId,
						localId,
						syncBlockInstance.data?.product ??
							getSourceProductFromResourceIdSafe(syncBlockInstance.resourceId),
					),
				);
			});

			this.fetchSyncBlockSourceInfo(resolvedSyncBlockInstance.resourceId);
		});

		return { hasUnexpectedError, hasExpectedError };
	}

	private updateCacheWithSourceInfo(resourceId: ResourceId, sourceInfo: SyncBlockSourceInfo) {
		const existingSyncBlock = this.getFromCache(resourceId);
		// If the cache entry was deleted while the source-info request was
		// in flight, fire an analytics event so the race is observable.
		if (!existingSyncBlock && fg('platform_synced_block_patch_14')) {
			this.fireAnalyticsEvent?.(
				sourceInfoOrphanedPayload(resourceId, getSourceProductFromResourceIdSafe(resourceId), {
					hasPendingDeletion: this.pendingCacheDeletions.has(resourceId),
					hasSubscribers: this._subscriptionManager.getSubscriptions().has(resourceId),
				}),
			);
			logException(new Error('updateCacheWithSourceInfo: cache entry missing for resource'), {
				location:
					'editor-synced-block-provider/referenceSyncBlockStoreManager/orphaned-source-info',
			});
			return;
		}
		if (existingSyncBlock && existingSyncBlock.data) {
			existingSyncBlock.data.sourceURL = sourceInfo?.url;
			existingSyncBlock.data = {
				...existingSyncBlock.data,
				sourceURL: sourceInfo?.url,
				sourceTitle: sourceInfo?.title,
				onSameDocument: sourceInfo?.onSameDocument,
				sourceSubType: sourceInfo?.subType,
				issueType: sourceInfo?.issueType,
			};
			this.updateCache(existingSyncBlock);
		}
	}

	private updateCache(syncBlock: SyncBlockInstance) {
		const sanitizedSyncBlock = this.normalizeReferenceData(syncBlock);
		const { resourceId } = sanitizedSyncBlock;

		if (resourceId) {
			this.dataProvider?.updateCache(
				{ [resourceId]: sanitizedSyncBlock },
				{ strategy: 'merge', source: 'network' },
			);
			this._subscriptionManager.notifySubscriptionCallbacks(resourceId, sanitizedSyncBlock);
			this.updateSessionCache(resourceId);
		}
	}

	public getFromCache(resourceId: ResourceId): SyncBlockInstance | undefined {
		const syncBlockNode = createSyncBlockNode('', resourceId);
		return this.dataProvider?.getNodeDataFromCache(syncBlockNode)?.data;
	}

	private deleteFromCache(resourceId: ResourceId) {
		this.dataProvider?.removeFromCache([resourceId]);
		this._providerFactoryManager.deleteFactory(resourceId);
		// Evict in-flight source-info promise and reset reschedule counter
		// so a stale resolution can't silently merge into a re-fetched entry.
		if (fg('platform_synced_block_patch_14')) {
			this.syncBlockSourceInfoRequests.delete(resourceId);
			this.cacheDeletionRescheduleCounts.delete(resourceId);
		}
	}

	/**
	 * Returns true if the cache entry for `resourceId` is safe to delete:
	 * no active subscribers, no in-flight source-info request, and no
	 * queued/in-flight batch fetch (gated by `platform_synced_block_patch_14`).
	 */
	private canDeleteCache(resourceId: ResourceId): boolean {
		if (this._subscriptionManager.getSubscriptions().has(resourceId)) {
			return false;
		}
		if (this.syncBlockSourceInfoRequests.has(resourceId)) {
			return false;
		}
		if (this._batchFetcher.hasPendingFetch(resourceId)) {
			return false;
		}
		return true;
	}

	/**
	 * Schedules cache deletion for `resourceId` after the grace period
	 * (gated by `platform_synced_block_patch_14`). Called when the last
	 * subscriber unsubscribes. Guards are re-checked at fire time; if any
	 * are positive the timer is rescheduled up to MAX_RESCHEDULES times.
	 */
	public scheduleCacheDeletion(resourceId: ResourceId): void {
		if (!fg('platform_synced_block_patch_14')) {
			return;
		}
		if (this.isDestroyed) {
			return;
		}
		// Cancel any existing timer \u2014 restart the grace period \u2014 but DO NOT
		// reset the reschedule counter. The counter is reset only by
		// `cancelPendingCacheDeletion` (called when a real subscriber returns)
		// or when the cache is actually deleted.
		const existing = this.pendingCacheDeletions.get(resourceId);
		if (existing) {
			clearTimeout(existing);
			this.pendingCacheDeletions.delete(resourceId);
		}

		const timer = setTimeout(() => {
			// Guard against timer callback running after destroy. clearTimeout
			// is synchronous so this should be unreachable in practice, but
			// belt-and-braces.
			if (this.isDestroyed) {
				return;
			}
			this.pendingCacheDeletions.delete(resourceId);
			this.onCacheDeletionTimerFire(resourceId);
		}, CACHE_DELETION_GRACE_PERIOD_MS);

		this.pendingCacheDeletions.set(resourceId, timer);
	}

	/**
	 * Cancels any pending cache deletion timer for `resourceId` and resets the
	 * reschedule counter (gated by `platform_synced_block_patch_14`). Called
	 * when a new subscriber arrives.
	 */
	public cancelPendingCacheDeletion(resourceId: ResourceId): void {
		if (!fg('platform_synced_block_patch_14')) {
			return;
		}
		const existing = this.pendingCacheDeletions.get(resourceId);
		if (existing) {
			clearTimeout(existing);
			this.pendingCacheDeletions.delete(resourceId);
		}
		// Subscribers returning resets the reschedule counter \u2014 the resource is
		// active again.
		this.cacheDeletionRescheduleCounts.delete(resourceId);
	}

	/** Returns whether a cache deletion timer is pending for `resourceId`. */
	public hasPendingCacheDeletion(resourceId: ResourceId): boolean {
		return this.pendingCacheDeletions.has(resourceId);
	}

	private onCacheDeletionTimerFire(resourceId: ResourceId): void {
		if (this.canDeleteCache(resourceId)) {
			// `deleteFromCache` resets the reschedule counter under the flag.
			this.deleteFromCache(resourceId);
			return;
		}

		const currentCount = this.cacheDeletionRescheduleCounts.get(resourceId) ?? 0;
		if (currentCount >= CACHE_DELETION_MAX_RESCHEDULES) {
			// Stuck guard — force deletion to prevent unbounded memory growth and
			// fire analytics so the stuck state is visible in production telemetry.
			//
			// NOTE: If active React subscribers still exist at force-delete time
			// (e.g. an in-flight batch fetch never settled), the cache entry is
			// removed without notifying subscribers. Those components will
			// continue to render with stale data until their next re-render
			// triggers a new batch fetch — typically within ~1 frame. We accept
			// this brief stale window in exchange for bounded memory growth.
			this.fireAnalyticsEvent?.(
				cacheDeletionForcedPayload(
					currentCount,
					resourceId,
					getSourceProductFromResourceIdSafe(resourceId),
				),
			);
			logException(
				new Error(
					`Cache deletion forced after ${currentCount} reschedules — stuck in-flight guard`,
				),
				{
					location:
						'editor-synced-block-provider/referenceSyncBlockStoreManager/cache-deletion-forced',
				},
			);
			// `deleteFromCache` resets the reschedule counter under the flag.
			this.deleteFromCache(resourceId);
			// If subscribers still exist, kick off a fresh fetch so they get
			// fresh data on the next batch tick instead of holding stale data
			// indefinitely.
			if (this._subscriptionManager.getSubscriptions().has(resourceId)) {
				this.debouncedBatchedFetchSyncBlocks(resourceId);
			}
			return;
		}

		this.cacheDeletionRescheduleCounts.set(resourceId, currentCount + 1);
		this.scheduleCacheDeletion(resourceId);
	}

	/**
	 * Schedules a delayed retry for a block that returned EntityNotFound.
	 * The block may be in the process of being created by a collaborator —
	 * the NCS transaction propagates the bodiedSyncBlock ADF node before
	 * the Block Service createBlock call completes.
	 */
	private scheduleEntityNotFoundRetry(resourceId: ResourceId): void {
		const currentRetries = this.entityNotFoundRetryCount.get(resourceId) ?? 0;

		if (currentRetries >= ENTITY_NOT_FOUND_MAX_RETRIES) {
			// Max retries exceeded — keep count at max so future calls immediately exit
			// (don't delete — that would reset the counter and allow unbounded retry waves)
			return;
		}

		// If a timer is already pending, don't schedule another one — let the
		// existing timer fire. This prevents rapid EntityNotFound responses from
		// exhausting the retry budget through cancellations without any actual
		// fetch completing.
		if (this.entityNotFoundRetryTimers.has(resourceId)) {
			return;
		}

		const delay = ENTITY_NOT_FOUND_INITIAL_DELAY_MS * Math.pow(2, currentRetries);

		const timer = setTimeout(() => {
			this.entityNotFoundRetryTimers.delete(resourceId);

			// If no active subscriptions remain for this block, clean up and skip
			const subscriptions = this._subscriptionManager.getSubscriptions().get(resourceId);
			if (!subscriptions || Object.keys(subscriptions).length === 0) {
				this.entityNotFoundRetryCount.delete(resourceId);
				return;
			}

			// Increment count only when the timer fires, not when scheduled
			this.entityNotFoundRetryCount.set(resourceId, currentRetries + 1);

			// Clear the error from cache so fetchSyncBlocksData doesn't skip it
			const cached = this.getFromCache(resourceId);
			if (cached?.error?.type === SyncBlockError.EntityNotFound) {
				this.deleteFromCache(resourceId);
			}

			// Trigger a re-fetch via the batch fetcher
			this.debouncedBatchedFetchSyncBlocks(resourceId);
		}, delay);

		this.entityNotFoundRetryTimers.set(resourceId, timer);
	}

	private debouncedBatchedFetchSyncBlocks(resourceId: string): void {
		this._batchFetcher.queueFetch(resourceId);
	}

	private setSSRDataInSessionCache(resourceIds: string[] | undefined): void {
		if (!resourceIds || resourceIds.length === 0) {
			return;
		}

		resourceIds.forEach((resourceId) => {
			this.updateSessionCache(resourceId);
		});
	}

	public subscribeToSyncBlock(
		resourceId: string,
		localId: string,
		callback: SubscriptionCallback,
	): () => void {
		return this._subscriptionManager.subscribeToSyncBlock(resourceId, localId, callback);
	}

	public subscribeToSourceTitle(node: PMNode, callback: TitleSubscriptionCallback): () => void {
		return this._subscriptionManager.subscribeToSourceTitle(node, callback);
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

			return this._subscriptionManager.subscribeToSyncBlock(resourceId, localId, callback);
		} catch (error) {
			// EDITOR-7860: benign not-ready/torn-down case — suppress both the
			// exception-tracker log and the analytics event (checked first so the
			// benign case stays fully silent). Gate-off behaviour is unchanged.
			if (isProviderNotReadyError(error) && fg('platform_editor_blocks_patch_3')) {
				return () => {};
			}
			logException(error as Error, {
				location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
			});
			this.fireAnalyticsEvent?.(
				fetchErrorPayload(
					(error as Error).message,
					undefined,
					undefined,
					buildFetchErrorAttribution(
						fg('platform_editor_blocks_patch_3'),
						(error as Error).message,
					),
				),
			);
			return () => {};
		}
	}

	/**
	 * Get the URL for a sync block.
	 * @param resourceId - The resource ID of the sync block
	 * @returns
	 */
	public getSyncBlockURL(resourceId: ResourceId): string | undefined {
		return this.getFromCache(resourceId)?.data?.sourceURL;
	}

	public getProviderFactory(resourceId: ResourceId): ProviderFactory | undefined {
		return this._providerFactoryManager.getProviderFactory(resourceId);
	}

	public getSSRProviders(resourceId: ResourceId): {
		media: MediaProvider;
	} | null {
		return this._providerFactoryManager.getSSRProviders(resourceId);
	}

	/**
	 * Update reference synced blocks on the document with the BE
	 *
	 * @returns true if the reference synced blocks are updated successfully, false otherwise
	 */
	public async flush(): Promise<boolean> {
		if (this.viewMode === 'view') {
			// Reference flushes are only meaningful while editing. Treat view-mode flush attempts as
			// gated no-op successes so lifecycle/teardown calls do not report false save failures.
			return true;
		}

		if (!this.isCacheDirty) {
			// we use the isCacheDirty flag as a quick check.
			return true;
		}

		// Prevent concurrent flushes to avoid race conditions with lastFlushedSyncedBlocks
		if (this.isFlushInProgress) {
			// Mark that another flush is needed after the current one completes
			this.flushNeededAfterCurrent = true;

			// We return true here because we know the pending flush will handle the dirty cache
			return true;
		} else {
			this.isFlushInProgress = true;
		}

		let success = true;
		// a copy of the subscriptions STRUCTURE (without the callbacks)
		// To be saved as the last flushed structure if the flush is successful
		const syncedBlocksToFlush: Record<string, Record<string, boolean>> = {};

		try {
			if (!this.dataProvider) {
				throw new Error('Data provider not set');
			}

			const blocks: SyncBlockAttrs[] = [];

			// First, build the complete subscription structure
			for (const [resourceId, callbacks] of this._subscriptionManager
				.getSubscriptions()
				.entries()) {
				syncedBlocksToFlush[resourceId] = {};

				Object.keys(callbacks).forEach((localId) => {
					blocks.push({
						resourceId,
						localId,
					});
					syncedBlocksToFlush[resourceId][localId] = true;
				});
			}

			// Then, compare with the last flushed structure to detect changes
			// We check against the last flushed structure to prevent unnecessary flushes
			// Note that we will always flush at least once when editor starts
			// This is useful for eventual consistency between the editor and the BE.
			if (isEqual(syncedBlocksToFlush, this.lastFlushedSyncedBlocks)) {
				this.isCacheDirty = false; // Reset since we're considering this a successful no-op flush
				return true;
			}
			// reset isCacheDirty early to prevent race condition
			// There is a race condition where if a user makes changes (create/delete) to a reference sync block
			// on a live page and the reference sync block is being saved while the user
			// is still making changes, the new changes might not be saved if they all happen
			// exactly at a time when the updateReferenceData is being executed asynchronously.
			this.isCacheDirty = false;

			this.saveExperience?.start();
			const updateResult = await this.dataProvider.updateReferenceData(blocks);

			if (!updateResult.success) {
				success = false;

				this.saveExperience?.failure({
					reason: updateResult.error || 'Failed to update reference synced blocks on the document',
				});
				this.fireAnalyticsEvent?.(
					updateReferenceErrorPayload(
						updateResult.error || 'Failed to update reference synced blocks on the document',
						undefined,
						undefined,
						buildErrorAttribution(
							fg('platform_editor_blocks_patch_3'),
							updateResult.error,
							updateResult.statusCode,
						),
					),
				);
			}
		} catch (error) {
			success = false;
			logException(error as Error, {
				location: 'editor-synced-block-provider/referenceSyncBlockStoreManager',
			});
			this.saveExperience?.failure({ reason: (error as Error).message });
			// No `resourceId` available in this catch — sourceProduct is intentionally omitted.
			// No structured SyncBlockError/status here, so the attribution `reason` falls back
			// to `unknown` when the gate is on.
			this.fireAnalyticsEvent?.(
				updateReferenceErrorPayload(
					(error as Error).message,
					undefined,
					undefined,
					buildErrorAttribution(fg('platform_editor_blocks_patch_3')),
				),
			);
		} finally {
			if (!success) {
				// set isCacheDirty back to true for cases where it failed to update the reference synced blocks on the BE
				this.isCacheDirty = true;
			} else {
				this.lastFlushedSyncedBlocks = syncedBlocksToFlush;
				this.saveExperience?.success();
			}

			// Always reset isFlushInProgress
			this.isFlushInProgress = false;

			// If another flush was requested while this one was in progress, execute it now
			if (this.flushNeededAfterCurrent) {
				this.flushNeededAfterCurrent = false;
				// Use setTimeout to avoid deep recursion and run queued flush asynchronously
				// Note: flush() handles all exceptions internally and never rejects
				this.queuedFlushTimeout = setTimeout(() => {
					this.queuedFlushTimeout = undefined;
					void this.flush();
				}, 0);
			}
		}

		return success;
	}

	public destroy(): void {
		// Mark destroyed first so in-flight timer callbacks can early-return.
		this.isDestroyed = true;

		// Cancel any queued flush to prevent it from running after destroy
		if (this.queuedFlushTimeout) {
			clearTimeout(this.queuedFlushTimeout);
			this.queuedFlushTimeout = undefined;
		}

		// Cancel any pending EntityNotFound retry timers
		this.entityNotFoundRetryTimers.forEach((timer) => clearTimeout(timer));
		this.entityNotFoundRetryTimers.clear();
		this.entityNotFoundRetryCount.clear();

		// Cancel pending cache deletion timers.
		this.pendingCacheDeletions.forEach((timer) => clearTimeout(timer));
		this.pendingCacheDeletions.clear();
		this.cacheDeletionRescheduleCounts.clear();

		this._subscriptionManager.destroy();
		this._providerFactoryManager.destroy();
		this._batchFetcher.destroy();

		this.dataProvider?.resetCache();

		this.dataProvider = undefined;
		this.syncBlockFetchDataRequests.clear();
		this.syncBlockSourceInfoRequests.clear();
		this.saveExperience?.abort({ reason: 'editorDestroyed' });
		this.fetchExperience?.abort({ reason: 'editorDestroyed' });
		this.fetchSourceInfoExperience?.abort({ reason: 'editorDestroyed' });
		this.fireAnalyticsEvent = undefined;

		// Under `platform_synced_block_patch_14`, `destroy()` is now wired to
		// React component unmount via `useMemoizedSyncBlockStoreManager`.
		// Clearing the module-level singleton on unmount would wipe SSR session
		// cache data that a sibling/successor manager (e.g. the editor
		// instance that mounts immediately after the renderer unmounts during
		// the view-mode transition) is about to read.
		// Let entries age out naturally instead — the in-memory cache is
		// naturally bounded by `maxSize` (LRU) and cleared on hard navigation.
		if (!fg('platform_synced_block_patch_14')) {
			syncBlockInMemorySessionCache.clear();
		}
	}
}
