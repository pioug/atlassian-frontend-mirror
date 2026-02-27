import rafSchedule from 'raf-schd';

import { type RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';

import type { ResourceId, BlockInstanceId, SyncBlockNode } from '../common/types';
import type { SubscriptionCallback } from '../providers/types';
import { fetchErrorPayload } from '../utils/errorHandling';
import { createSyncBlockNode } from '../utils/utils';

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

			this.deps.fetchSyncBlocksData(syncBlockNodes).catch((error) => {
				logException(error, {
					location: 'editor-synced-block-provider/syncBlockBatchFetcher/batchedFetchSyncBlocks',
				});
				resourceIds.forEach((resId) => {
					this.deps.getFireAnalyticsEvent()?.(fetchErrorPayload(error.message, resId));
				});
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

	public cancel(): void {
		this.scheduledBatchFetch.cancel();
	}

	public clearPending(): void {
		this.pendingFetchRequests.clear();
	}

	public destroy(): void {
		this.cancel();
		this.clearPending();
	}
}
