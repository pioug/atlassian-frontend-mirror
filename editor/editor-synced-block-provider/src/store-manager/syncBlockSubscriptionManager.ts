import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { ResourceId, BlockInstanceId } from '../common/types';
import type {
	SyncBlockInstance,
	SubscriptionCallback,
	SyncBlockDataProviderInterface,
	SyncBlockSourceInfo,
	TitleSubscriptionCallback,
	Unsubscribe,
} from '../providers/types';
import { fetchErrorPayload, fetchSuccessPayload } from '../utils/errorHandling';
import { resolveSyncBlockInstance } from '../utils/resolveSyncBlockInstance';
import { getSourceProductFromResourceIdSafe } from '../utils/utils';

export interface SyncBlockSubscriptionManagerDeps {
	debouncedBatchedFetchSyncBlocks: (resourceId: string) => void;
	deleteFromCache: (resourceId: ResourceId) => void;
	fetchSyncBlockSourceInfo: (resourceId: ResourceId) => Promise<SyncBlockSourceInfo | undefined>;
	getDataProvider: () => SyncBlockDataProviderInterface | undefined;
	getFireAnalyticsEvent: () => ((payload: RendererSyncBlockEventPayload) => void) | undefined;
	getFromCache: (resourceId: ResourceId) => SyncBlockInstance | undefined;
	markCacheDirty: () => void;
	updateCache: (syncBlockInstance: SyncBlockInstance) => void;
}

/**
 * Manages the lifecycle of GraphQL WebSocket subscriptions for sync block
 * real-time updates, owns the subscriptions and titleSubscriptions maps,
 * and provides a listener API so React components can react when the set
 * of subscribed resource IDs changes.
 */
export class SyncBlockSubscriptionManager {
	private subscriptions = new Map<
		ResourceId,
		{ [localId: BlockInstanceId]: SubscriptionCallback }
	>();
	private titleSubscriptions = new Map<
		ResourceId,
		{ [localId: BlockInstanceId]: TitleSubscriptionCallback }
	>();
	private graphqlSubscriptions = new Map<ResourceId, Unsubscribe>();
	private subscriptionChangeListeners = new Set<() => void>();
	private useRealTimeSubscriptions = false;
	// Track pending cache deletions to handle block moves (unmount/remount)
	// When a block is moved, the old component unmounts before the new one mounts,
	// causing the cache to be deleted prematurely. We delay deletion to allow
	// the new component to subscribe and cancel the pending deletion.
	private pendingCacheDeletions = new Map<ResourceId, ReturnType<typeof setTimeout>>();

	// Reconnection with exponential backoff
	private static readonly INITIAL_RETRY_DELAY_MS = 1000;
	private static readonly RETRY_BACKOFF_MULTIPLIER = 2;
	private static readonly MAX_RETRY_ATTEMPTS = 5;
	private retryAttempts = new Map<ResourceId, number>();
	private pendingRetries = new Map<ResourceId, ReturnType<typeof setTimeout>>();

	constructor(private deps: SyncBlockSubscriptionManagerDeps) {}

	/**
	 * Returns the subscriptions map. Used by external consumers (e.g. batch fetcher, flush)
	 * that need to read the current subscription state.
	 */
	public getSubscriptions(): Map<ResourceId, { [localId: BlockInstanceId]: SubscriptionCallback }> {
		return this.subscriptions;
	}

	public setRealTimeSubscriptionsEnabled(enabled: boolean): void {
		if (this.useRealTimeSubscriptions === enabled) {
			return;
		}
		this.useRealTimeSubscriptions = enabled;

		if (enabled) {
			this.setupSubscriptionsForAllBlocks();
		} else {
			this.cleanupAll();
		}
	}

	public isRealTimeSubscriptionsEnabled(): boolean {
		return this.useRealTimeSubscriptions;
	}

	public getSubscribedResourceIds(): ResourceId[] {
		return Array.from(this.subscriptions.keys());
	}

	public onSubscriptionsChanged(listener: () => void): () => void {
		this.subscriptionChangeListeners.add(listener);
		return () => {
			this.subscriptionChangeListeners.delete(listener);
		};
	}

	public notifySubscriptionChangeListeners(): void {
		this.subscriptionChangeListeners.forEach((listener) => {
			try {
				listener();
			} catch (error) {
				logException(error as Error, {
					location:
						'editor-synced-block-provider/syncBlockSubscriptionManager/notifySubscriptionChangeListeners',
				});
				this.deps.getFireAnalyticsEvent()?.(fetchErrorPayload((error as Error).message));
			}
		});
	}

	public handleSubscriptionUpdate(syncBlockInstance: SyncBlockInstance): void {
		if (!syncBlockInstance.resourceId) {
			return;
		}
		const existing = this.deps.getFromCache(syncBlockInstance.resourceId);
		const resolved = existing
			? resolveSyncBlockInstance(existing, syncBlockInstance)
			: syncBlockInstance;

		this.deps.updateCache(resolved);

		if (!syncBlockInstance.error) {
			this.deps.fetchSyncBlockSourceInfo(resolved.resourceId);
		}
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
		const isNewResourceSubscription = Object.keys(resourceSubscriptions).length === 0;
		this.subscriptions.set(resourceId, { ...resourceSubscriptions, [localId]: callback });

		// New subscription means new reference synced block is added to the document
		this.deps.markCacheDirty();

		// Notify listeners if this is a new resource subscription
		if (isNewResourceSubscription) {
			this.notifySubscriptionChangeListeners();
		}

		const cachedData = this.deps.getFromCache(resourceId);

		if (cachedData) {
			callback(cachedData);
		} else {
			this.deps.debouncedBatchedFetchSyncBlocks(resourceId);
		}

		// Set up GraphQL subscription if real-time subscriptions are enabled
		if (this.shouldUseRealTime()) {
			this.setupSubscription(resourceId);
		}

		return () => {
			const resourceSubscriptions = this.subscriptions.get(resourceId);
			if (resourceSubscriptions) {
				// Unsubscription means a reference synced block is removed from the document
				this.deps.markCacheDirty();

				delete resourceSubscriptions[localId];
				if (Object.keys(resourceSubscriptions).length === 0) {
					this.subscriptions.delete(resourceId);

					// Clean up GraphQL subscription when no more local subscribers
					this.cleanupSubscription(resourceId);

					// Notify listeners that subscription was removed
					this.notifySubscriptionChangeListeners();

					// Delay cache deletion to handle block moves (unmount/remount).
					// When a block is moved, the old component unmounts before the new one mounts.
					// By delaying deletion, we give the new component time to subscribe and
					// cancel this pending deletion, preserving the cached data.
					// TODO: EDITOR-4152 - Rework this logic
					const deletionTimeout = setTimeout(() => {
						// Only delete if still no subscribers (wasn't re-subscribed)
						if (!this.subscriptions.has(resourceId)) {
							this.deps.deleteFromCache(resourceId);
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

		const cachedData = this.deps.getFromCache(resourceId);
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

	public updateSourceTitleSubscriptions(resourceId: string, title: string): void {
		const callbacks = this.titleSubscriptions.get(resourceId);
		if (callbacks) {
			Object.values(callbacks).forEach((callback) => {
				callback(title);
			});
		}
	}

	/**
	 * Notifies all subscription callbacks for a given resource ID with the provided sync block instance.
	 */
	public notifySubscriptionCallbacks(resourceId: ResourceId, syncBlock: SyncBlockInstance): void {
		const callbacks = this.subscriptions.get(resourceId);
		if (callbacks) {
			Object.values(callbacks).forEach((callback) => {
				callback(syncBlock);
			});
		}
	}

	public setupSubscription(resourceId: ResourceId): void {
		if (this.graphqlSubscriptions.has(resourceId)) {
			return;
		}
		const dataProvider = this.deps.getDataProvider();
		if (!dataProvider?.subscribeToBlockUpdates) {
			return;
		}

		const unsubscribe = dataProvider.subscribeToBlockUpdates(
			resourceId,
			(syncBlockInstance) => {
				this.handleGraphQLUpdate(syncBlockInstance);
			},
			(error) => {
				logException(error, {
					location:
						'editor-synced-block-provider/syncBlockSubscriptionManager/graphql-subscription',
				});
				this.deps.getFireAnalyticsEvent()?.(
					fetchErrorPayload(
						error.message,
						resourceId,
						getSourceProductFromResourceIdSafe(resourceId),
					),
				);
				this.handleSubscriptionTerminated(resourceId);
			},
			() => {
				this.handleSubscriptionTerminated(resourceId);
			},
		);

		if (unsubscribe) {
			this.graphqlSubscriptions.set(resourceId, unsubscribe);
		}
	}

	/**
	 * Handles subscription termination (complete or error) by cleaning up the
	 * stale entry and scheduling a reconnection with exponential backoff.
	 */
	private handleSubscriptionTerminated(resourceId: ResourceId): void {
		// Remove the stale subscription entry so setupSubscription won't early-return
		this.graphqlSubscriptions.delete(resourceId);

		// Guard against duplicate calls (graphql-ws can fire both error and complete)
		if (this.pendingRetries.has(resourceId)) {
			return;
		}

		// Only reconnect if there are still active subscribers for this resource
		if (this.subscriptions.has(resourceId) && this.shouldUseRealTime()) {
			this.scheduleReconnection(resourceId);
		}
	}

	/**
	 * Schedules a reconnection attempt with exponential backoff.
	 * Delay = INITIAL_RETRY_DELAY_MS * (RETRY_BACKOFF_MULTIPLIER ^ attempts)
	 * e.g. 1s, 2s, 4s, 8s, 16s
	 */
	private scheduleReconnection(resourceId: ResourceId): void {
		const attempts = this.retryAttempts.get(resourceId) ?? 0;

		if (attempts >= SyncBlockSubscriptionManager.MAX_RETRY_ATTEMPTS) {
			const errorMessage = `Subscription reconnection failed after ${attempts} attempts`;
			logException(new Error(errorMessage), {
				location: 'editor-synced-block-provider/syncBlockSubscriptionManager/max-retries-exhausted',
			});
			this.deps.getFireAnalyticsEvent()?.(
				fetchErrorPayload(errorMessage, resourceId, getSourceProductFromResourceIdSafe(resourceId)),
			);
			return;
		}

		const delay =
			SyncBlockSubscriptionManager.INITIAL_RETRY_DELAY_MS *
			Math.pow(SyncBlockSubscriptionManager.RETRY_BACKOFF_MULTIPLIER, attempts);

		const timer = setTimeout(() => {
			this.pendingRetries.delete(resourceId);

			// Only re-subscribe if still relevant
			if (this.subscriptions.has(resourceId) && this.shouldUseRealTime()) {
				this.setupSubscription(resourceId);

				// Only increment if the subscription was actually established
				// (setupSubscription may be a no-op if another code path already re-established it)
				if (this.graphqlSubscriptions.has(resourceId)) {
					this.retryAttempts.set(resourceId, attempts + 1);
				}
			} else {
				// Conditions no longer met — clean up stale retry state
				this.retryAttempts.delete(resourceId);
			}
		}, delay);

		this.pendingRetries.set(resourceId, timer);
	}

	/**
	 * Resets the retry counter for a resource. Called when a successful
	 * update is received, indicating the subscription is healthy.
	 */
	private resetRetryCount(resourceId: ResourceId): void {
		this.retryAttempts.delete(resourceId);
	}

	private cancelPendingRetry(resourceId: ResourceId): void {
		const timer = this.pendingRetries.get(resourceId);
		if (timer) {
			clearTimeout(timer);
			this.pendingRetries.delete(resourceId);
		}
	}

	private cancelAllPendingRetries(): void {
		for (const timer of this.pendingRetries.values()) {
			clearTimeout(timer);
		}
		this.pendingRetries.clear();
		this.retryAttempts.clear();
	}

	public cleanupSubscription(resourceId: ResourceId): void {
		const unsubscribe = this.graphqlSubscriptions.get(resourceId);
		if (unsubscribe) {
			unsubscribe();
			this.graphqlSubscriptions.delete(resourceId);
		}
		this.cancelPendingRetry(resourceId);
		this.retryAttempts.delete(resourceId);
	}

	public setupSubscriptionsForAllBlocks(): void {
		for (const resourceId of this.subscriptions.keys()) {
			this.setupSubscription(resourceId);
		}
	}

	public cleanupAll(): void {
		for (const unsubscribe of this.graphqlSubscriptions.values()) {
			unsubscribe();
		}
		this.graphqlSubscriptions.clear();
		this.cancelAllPendingRetries();
	}

	public destroy(): void {
		this.cleanupAll();
		this.subscriptions.clear();
		this.titleSubscriptions.clear();
		this.subscriptionChangeListeners.clear();
		this.useRealTimeSubscriptions = false;

		// Clear any pending cache deletions
		for (const timeout of this.pendingCacheDeletions.values()) {
			clearTimeout(timeout);
		}
		this.pendingCacheDeletions.clear();
	}

	public shouldUseRealTime(): boolean {
		return this.useRealTimeSubscriptions;
	}

	private handleGraphQLUpdate(syncBlockInstance: SyncBlockInstance): void {
		if (!syncBlockInstance.resourceId) {
			return;
		}

		const existing = this.deps.getFromCache(syncBlockInstance.resourceId);
		const resolved = existing
			? resolveSyncBlockInstance(existing, syncBlockInstance)
			: syncBlockInstance;

		this.deps.updateCache(resolved);

		if (!syncBlockInstance.error) {
			this.resetRetryCount(syncBlockInstance.resourceId);
			const callbacks = this.subscriptions.get(syncBlockInstance.resourceId);
			const localIds = callbacks ? Object.keys(callbacks) : [];
			localIds.forEach((localId) => {
				this.deps.getFireAnalyticsEvent()?.(
					fetchSuccessPayload(
						syncBlockInstance.resourceId,
						localId,
						syncBlockInstance.data?.product ??
							getSourceProductFromResourceIdSafe(syncBlockInstance.resourceId),
					),
				);
			});
			this.deps.fetchSyncBlockSourceInfo(resolved.resourceId);
		} else {
			const errorMessage = syncBlockInstance.error?.reason || syncBlockInstance.error?.type;

			this.deps.getFireAnalyticsEvent()?.(
				fetchErrorPayload(
					errorMessage,
					syncBlockInstance.resourceId,
					syncBlockInstance.data?.product ??
						getSourceProductFromResourceIdSafe(syncBlockInstance.resourceId),
				),
			);
		}
	}
}
