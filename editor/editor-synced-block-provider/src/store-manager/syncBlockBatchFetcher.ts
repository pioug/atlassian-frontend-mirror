import rafSchedule from 'raf-schd';

import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';

import type { ResourceId, BlockInstanceId, SyncBlockNode } from '../common/types';
import type { SubscriptionCallback } from '../providers/types';
import { fetchErrorPayload } from '../utils/errorHandling';
import { createSyncBlockNode, getSourceProductFromResourceIdSafe } from '../utils/utils';

export interface SyncBlockBatchFetcherDeps {
	fetchSyncBlocksData: (nodes: SyncBlockNode[]) => Promise<void>;
	getFireAnalyticsEvent: () => ((payload: RendererSyncBlockEventPayload) => void) | undefined;
	getSubscriptions: () => Map<ResourceId, { [localId: BlockInstanceId]: SubscriptionCallback }>;
}

/**
 * Handles debounced batch-fetching of sync block data via `raf-schd`.
 * Accumulates resource IDs and flushes them in a single fetch per
 * animation frame.
 */
export class SyncBlockBatchFetcher {
	private pendingFetchRequests = new Set<string>();
	// Tracks resourceIds whose batched fetch is in flight (after RAF drains
	// pendingFetchRequests, before the promise settles). Ensures
	// `hasPendingFetch` remains true during the network window.
	private inFlightFetches = new Set<string>();
	private isDestroyed = false;
	private scheduledBatchFetch: ReturnType<typeof rafSchedule>;

	constructor(private deps: SyncBlockBatchFetcherDeps) {
		this.scheduledBatchFetch = rafSchedule(() => {
			if (this.pendingFetchRequests.size === 0) {
				return;
			}

			const resourceIds = Array.from(this.pendingFetchRequests);

			const syncBlockNodes = resourceIds.map((resId) => {
				const subscriptions = this.deps.getSubscriptions().get(resId) || {};
				const firstLocalId = Object.keys(subscriptions)[0] || '';
				return createSyncBlockNode(firstLocalId, resId);
			});

			this.pendingFetchRequests.clear();

			// Track in-flight before the fetch so guards remain positive.
			resourceIds.forEach((resId) => this.inFlightFetches.add(resId));

			this.deps
				.fetchSyncBlocksData(syncBlockNodes)
				.catch((error) => {
					logException(error, {
						location: 'editor-synced-block-provider/syncBlockBatchFetcher/batchedFetchSyncBlocks',
					});
					resourceIds.forEach((resId) => {
						this.deps.getFireAnalyticsEvent()?.(
							fetchErrorPayload(error.message, resId, getSourceProductFromResourceIdSafe(resId)),
						);
					});
				})
				.finally(() => {
					// If the fetcher was destroyed while the request was in flight,
					// skip cleanup — `destroy()` already cleared `inFlightFetches`
					// and there's nothing observable to update.
					if (this.isDestroyed) {
						return;
					}
					// Clear in-flight tracking once the fetch settles.
					resourceIds.forEach((resId) => this.inFlightFetches.delete(resId));
				});
		});
	}

	public queueFetch(resourceId: string): void {
		const subscriptions = this.deps.getSubscriptions();
		if (
			subscriptions.has(resourceId) &&
			Object.keys(subscriptions.get(resourceId) || {}).length > 0
		) {
			this.pendingFetchRequests.add(resourceId);
			this.scheduledBatchFetch();
		} else {
			this.pendingFetchRequests.delete(resourceId);
		}
	}

	/**
	 * Returns true if a batched fetch is queued or in flight for `resourceId`.
	 * Used by cache deletion guards to prevent deleting while a fetch is
	 * about to populate the entry.
	 */
	public hasPendingFetch(resourceId: string): boolean {
		return this.pendingFetchRequests.has(resourceId) || this.inFlightFetches.has(resourceId);
	}

	public cancel(): void {
		this.scheduledBatchFetch.cancel();
	}

	public clearPending(): void {
		this.pendingFetchRequests.clear();
	}

	public destroy(): void {
		this.isDestroyed = true;
		this.cancel();
		this.clearPending();
		// Clear in-flight tracking to prevent stale entries after teardown.
		this.inFlightFetches.clear();
	}
}
