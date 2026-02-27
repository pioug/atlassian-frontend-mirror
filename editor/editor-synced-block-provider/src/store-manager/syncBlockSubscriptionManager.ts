import { type RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ResourceId, BlockInstanceId } from '../common/types';
import type {
	SyncBlockInstance,
	SubscriptionCallback,
	SyncBlockDataProviderInterface,
	SyncBlockSourceInfo,
	Unsubscribe,
} from '../providers/types';
import { fetchErrorPayload, fetchSuccessPayload } from '../utils/errorHandling';
import { resolveSyncBlockInstance } from '../utils/resolveSyncBlockInstance';

export interface SyncBlockSubscriptionManagerDeps {
	fetchSyncBlockSourceInfo: (resourceId: ResourceId) => Promise<SyncBlockSourceInfo | undefined>;
	getDataProvider: () => SyncBlockDataProviderInterface | undefined;
	getFireAnalyticsEvent: () => ((payload: RendererSyncBlockEventPayload) => void) | undefined;
	getFromCache: (resourceId: ResourceId) => SyncBlockInstance | undefined;
	getSubscriptions: () => Map<ResourceId, { [localId: BlockInstanceId]: SubscriptionCallback }>;
	updateCache: (syncBlockInstance: SyncBlockInstance) => void;
}

/**
 * Manages the lifecycle of GraphQL WebSocket subscriptions for sync block
 * real-time updates, and provides a listener API so React components can
 * react when the set of subscribed resource IDs changes.
 */
export class SyncBlockSubscriptionManager {
	private graphqlSubscriptions = new Map<ResourceId, Unsubscribe>();
	private subscriptionChangeListeners = new Set<() => void>();
	private useRealTimeSubscriptions = false;

	constructor(private deps: SyncBlockSubscriptionManagerDeps) {}

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
		return Array.from(this.deps.getSubscriptions().keys());
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
				this.deps.getFireAnalyticsEvent()?.(fetchErrorPayload(error.message));
			},
		);

		if (unsubscribe) {
			this.graphqlSubscriptions.set(resourceId, unsubscribe);
		}
	}

	public cleanupSubscription(resourceId: ResourceId): void {
		const unsubscribe = this.graphqlSubscriptions.get(resourceId);
		if (unsubscribe) {
			unsubscribe();
			this.graphqlSubscriptions.delete(resourceId);
		}
	}

	public setupSubscriptionsForAllBlocks(): void {
		for (const resourceId of this.deps.getSubscriptions().keys()) {
			this.setupSubscription(resourceId);
		}
	}

	public cleanupAll(): void {
		for (const unsubscribe of this.graphqlSubscriptions.values()) {
			unsubscribe();
		}
		this.graphqlSubscriptions.clear();
	}

	public destroy(): void {
		this.cleanupAll();
		this.subscriptionChangeListeners.clear();
		this.useRealTimeSubscriptions = false;
	}

	public shouldUseRealTime(): boolean {
		return this.useRealTimeSubscriptions;
	}

	private handleGraphQLUpdate(syncBlockInstance: SyncBlockInstance): void {
		if (!syncBlockInstance.resourceId) {
			if (fg('platform_synced_block_patch_5')) {
				return;
			}
			throw new Error(
				'Sync block instance provided to graphql subscription update missing resource id',
			);
		}

		const existing = this.deps.getFromCache(syncBlockInstance.resourceId);
		const resolved = existing
			? resolveSyncBlockInstance(existing, syncBlockInstance)
			: syncBlockInstance;

		this.deps.updateCache(resolved);

		if (!syncBlockInstance.error) {
			const callbacks = this.deps.getSubscriptions().get(syncBlockInstance.resourceId);
			const localIds = callbacks ? Object.keys(callbacks) : [];
			localIds.forEach((localId) => {
				this.deps.getFireAnalyticsEvent()?.(
					fetchSuccessPayload(
						syncBlockInstance.resourceId,
						localId,
						syncBlockInstance.data?.product,
					),
				);
			});
			this.deps.fetchSyncBlockSourceInfo(resolved.resourceId);
		} else {
			const errorMessage = fg('platform_synced_block_patch_3')
				? syncBlockInstance.error?.reason || syncBlockInstance.error?.type
				: syncBlockInstance.error?.type;

			this.deps.getFireAnalyticsEvent()?.(
				fetchErrorPayload(errorMessage, syncBlockInstance.resourceId),
			);
		}
	}
}
