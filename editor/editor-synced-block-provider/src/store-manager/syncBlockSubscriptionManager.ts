import { bind, type UnbindFn } from 'bind-event-listener';

import { getDocument } from '@atlaskit/browser-apis';
import type { RendererSyncBlockEventPayload } from '@atlaskit/editor-common/analytics';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ResourceId, BlockInstanceId } from '../common/types';
import type {
	SyncBlockInstance,
	SubscriptionCallback,
	SyncBlockDataProviderInterface,
	SyncBlockSourceInfo,
	TitleSubscriptionCallback,
	Unsubscribe,
} from '../providers/types';
import {
	buildFetchErrorAttribution,
	fetchErrorPayload,
	fetchSuccessPayload,
} from '../utils/errorHandling';
import { resolveSyncBlockInstance } from '../utils/resolveSyncBlockInstance';
import { getSourceProductFromResourceIdSafe } from '../utils/utils';

export interface SyncBlockSubscriptionManagerDeps {
	/** Cancels any pending cache deletion timer for `resourceId` (gated). */
	cancelPendingCacheDeletion: (resourceId: ResourceId) => void;
	debouncedBatchedFetchSyncBlocks: (resourceId: string) => void;
	deleteFromCache: (resourceId: ResourceId) => void;
	fetchSyncBlockSourceInfo: (resourceId: ResourceId) => Promise<SyncBlockSourceInfo | undefined>;
	getDataProvider: () => SyncBlockDataProviderInterface | undefined;
	getFireAnalyticsEvent: () => ((payload: RendererSyncBlockEventPayload) => void) | undefined;
	getFromCache: (resourceId: ResourceId) => SyncBlockInstance | undefined;
	markCacheDirty: () => void;
	/** Schedules guarded cache deletion for `resourceId` after a grace period (gated). */
	scheduleCacheDeletion: (resourceId: ResourceId) => void;
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

	// Reconnection with exponential backoff.
	private static readonly INITIAL_RETRY_DELAY_MS = 1000;
	private static readonly RETRY_BACKOFF_MULTIPLIER = 2;
	private static readonly MAX_RETRY_ATTEMPTS = 5; // legacy (gate OFF)
	private static readonly MAX_RETRY_ATTEMPTS_HARDENED = 8; // gate ON (EDITOR-7861)
	private static readonly MAX_RETRY_DELAY_MS = 30000; // backoff cap (gate ON)
	private retryAttempts = new Map<ResourceId, number>();
	private pendingRetries = new Map<ResourceId, ReturnType<typeof setTimeout>>();

	// Resources whose reconnection exhausted while the tab was hidden: parked here and
	// re-armed on the next online / visibilitychange→visible instead of surfacing a
	// terminal error. Only a re-armed attempt that also exhausts while visible fails.
	private deferredExhausted = new Set<ResourceId>();
	// Coalesce wake-event bursts into one re-arm sweep to avoid a reconnection storm.
	private static readonly WAKE_DEBOUNCE_MS = 1000;
	private wakeDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	// `online` always sweeps (network is back regardless of tab visibility); a
	// `visibilitychange` only sweeps when the tab became visible.
	private readonly onOnline = () => this.scheduleWakeSweep();
	private readonly onVisibilityChange = () => {
		if (!this.isDocumentHidden()) {
			this.scheduleWakeSweep();
		}
	};
	// Cleanup fns returned by `bind` for the registered wake listeners; a non-empty
	// array means listeners are currently registered. Emptied on teardown.
	private wakeListenerCleanups: UnbindFn[] = [];

	// EDITOR-7861: higher ceiling lets transient WS-gateway drops self-heal
	// before a terminal failure is surfaced.
	private getMaxRetryAttempts(): number {
		return fg('platform_editor_blocks_patch_3')
			? SyncBlockSubscriptionManager.MAX_RETRY_ATTEMPTS_HARDENED
			: SyncBlockSubscriptionManager.MAX_RETRY_ATTEMPTS;
	}

	// Backoff delay for the given attempt.
	// Gate OFF: pure exponential (1s, 2s, 4s, 8s, 16s).
	// Gate ON (EDITOR-7861): exponential capped at MAX_RETRY_DELAY_MS with equal
	// jitter (capped/2 + random*capped/2) — de-synchronises simultaneous
	// reconnects while guaranteeing a non-zero delay (full jitter could hit 0).
	private getReconnectionDelay(attempts: number): number {
		const exponential =
			SyncBlockSubscriptionManager.INITIAL_RETRY_DELAY_MS *
			Math.pow(SyncBlockSubscriptionManager.RETRY_BACKOFF_MULTIPLIER, attempts);

		if (!fg('platform_editor_blocks_patch_3')) {
			return exponential;
		}

		const half = Math.min(exponential, SyncBlockSubscriptionManager.MAX_RETRY_DELAY_MS) / 2;
		return Math.round(half + Math.random() * half);
	}

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
				this.deps.getFireAnalyticsEvent()?.(
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
		//
		// Under the flag, cache deletion is owned by the store manager.
		// With the flag off, the legacy 1s timer path is preserved.
		const pendingDeletion = this.pendingCacheDeletions.get(resourceId);

		if (fg('platform_synced_block_patch_14')) {
			this.deps.cancelPendingCacheDeletion(resourceId);
		} else if (pendingDeletion) {
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
				const remainingIds = Object.keys(resourceSubscriptions);

				if (remainingIds.length === 0) {
					this.subscriptions.delete(resourceId);

					// Clean up GraphQL subscription when no more local subscribers
					this.cleanupSubscription(resourceId);

					// Notify listeners that subscription was removed
					this.notifySubscriptionChangeListeners();

					// Under the flag, delegate cache deletion to the store manager
					// which uses a 30s grace period with guard re-checks.
					if (fg('platform_synced_block_patch_14')) {
						this.deps.scheduleCacheDeletion(resourceId);
					} else {
						// Legacy path (unchanged): delay cache deletion to handle
						// block moves (unmount/remount). When a block is moved, the
						// old component unmounts before the new one mounts. By
						// delaying deletion, we give the new component time to
						// subscribe and cancel this pending deletion, preserving
						// the cached data.
						// TODO: EDITOR-4152 - Rework this logic (superseded by
						// `platform_synced_block_patch_14`).
						const deletionTimeout = setTimeout(() => {
							const hasSubscribers = this.subscriptions.has(resourceId);

							// Only delete if still no subscribers (wasn't re-subscribed)
							if (!hasSubscribers) {
								this.deps.deleteFromCache(resourceId);
							}
							this.pendingCacheDeletions.delete(resourceId);
						}, 1000);
						this.pendingCacheDeletions.set(resourceId, deletionTimeout);
					}
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
				// EDITOR-7861: a single socket drop is usually transient and
				// recovers on reconnect, so under the gate we don't fire a
				// user-facing error here — it's only surfaced on exhaustion (see
				// scheduleReconnection). Gate OFF keeps the legacy fire-on-drop.
				// This branch only runs when the gate is OFF, so buildFetchErrorAttribution
				// would return undefined; the structured attribution (EDITOR-7862) is therefore
				// applied at the gate-ON exhaustion site in scheduleReconnection instead.
				if (!fg('platform_editor_blocks_patch_3')) {
					this.deps.getFireAnalyticsEvent()?.(
						fetchErrorPayload(
							error.message,
							resourceId,
							getSourceProductFromResourceIdSafe(resourceId),
						),
					);
				}
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

	// Schedules a reconnection with backoff (see getMaxRetryAttempts /
	// getReconnectionDelay for the gated behaviour).
	private scheduleReconnection(resourceId: ResourceId): void {
		const attempts = this.retryAttempts.get(resourceId) ?? 0;
		const maxAttempts = this.getMaxRetryAttempts();

		if (attempts >= maxAttempts) {
			// Exhausted all attempts — the only place a WS drop surfaces as a
			// fetch error under the gate (EDITOR-7861).
			const errorMessage = `Subscription reconnection failed after ${attempts} attempts`;

			// Tab hidden at exhaustion: don't surface a terminal failure (user isn't
			// looking, and most exhaustions self-recover once foregrounded). Park + re-arm
			// on wake, emitting a benign `deferred` signal so suppression stays auditable.
			const shouldDefer = fg('platform_editor_blocks_patch_3') && this.isDocumentHidden();
			if (shouldDefer) {
				this.deferredExhausted.add(resourceId);
				this.registerWakeListeners();
				this.deps.getFireAnalyticsEvent()?.(
					fetchErrorPayload(
						errorMessage,
						resourceId,
						getSourceProductFromResourceIdSafe(resourceId),
						buildFetchErrorAttribution(true, errorMessage, undefined, /* deferred */ true),
					),
				);
				return;
			}

			logException(new Error(errorMessage), {
				location: 'editor-synced-block-provider/syncBlockSubscriptionManager/max-retries-exhausted',
			});
			this.deps.getFireAnalyticsEvent()?.(
				fetchErrorPayload(
					errorMessage,
					resourceId,
					getSourceProductFromResourceIdSafe(resourceId),
					buildFetchErrorAttribution(fg('platform_editor_blocks_patch_3'), errorMessage),
				),
			);
			return;
		}

		const delay = this.getReconnectionDelay(attempts);

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

	/**
	 * Whether the tab is currently hidden. SSR/non-browser is treated as "not hidden" so
	 * we never defer where wake events can't fire (realtime never subscribes there anyway).
	 */
	private isDocumentHidden(): boolean {
		return getDocument()?.hidden === true;
	}

	/**
	 * Lazily register shared `online` / `visibilitychange` listeners on first deferral.
	 * Torn down by `unregisterWakeListeners` (via `handleWake`). No-op in SSR / non-browser.
	 */
	private registerWakeListeners(): void {
		if (this.wakeListenerCleanups.length > 0 || typeof window === 'undefined') {
			return;
		}
		this.wakeListenerCleanups.push(bind(window, { type: 'online', listener: this.onOnline }));
		const doc = getDocument();
		if (doc) {
			this.wakeListenerCleanups.push(
				bind(doc, { type: 'visibilitychange', listener: this.onVisibilityChange }),
			);
		}
	}

	private unregisterWakeListeners(): void {
		if (this.wakeDebounceTimer !== null) {
			clearTimeout(this.wakeDebounceTimer);
			this.wakeDebounceTimer = null;
		}
		for (const cleanup of this.wakeListenerCleanups) {
			cleanup();
		}
		this.wakeListenerCleanups = [];
	}

	/**
	 * Coalesce a burst of wake events into one debounced re-arm sweep. Callers decide
	 * eligibility: `onOnline` always sweeps; `onVisibilityChange` only sweeps when visible.
	 */
	private scheduleWakeSweep(): void {
		if (this.wakeDebounceTimer !== null) {
			return;
		}
		this.wakeDebounceTimer = setTimeout(() => {
			this.wakeDebounceTimer = null;
			this.handleWake();
		}, SyncBlockSubscriptionManager.WAKE_DEBOUNCE_MS);
	}

	/**
	 * Re-arm every deferred resource: full reset (attempts→0) + immediate reconnect now
	 * the tab is visible / online. Healthy subscriptions are untouched. A re-armed cycle
	 * that later exhausts while visible fires the terminal error normally.
	 */
	private handleWake(): void {
		if (this.deferredExhausted.size === 0) {
			this.unregisterWakeListeners();
			return;
		}
		const toRearm = Array.from(this.deferredExhausted);
		this.deferredExhausted.clear();
		for (const resourceId of toRearm) {
			// Only re-arm resources that still have active subscribers and realtime on.
			if (!this.subscriptions.has(resourceId) || !this.shouldUseRealTime()) {
				continue;
			}
			this.resetRetryCount(resourceId);
			this.cancelPendingRetry(resourceId);
			this.setupSubscription(resourceId);
		}
		// No deferred resources remain until another hidden exhaustion re-adds one.
		this.unregisterWakeListeners();
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
		// Nothing left to re-arm: drop parked exhaustions and tear down wake listeners.
		this.deferredExhausted.clear();
		this.unregisterWakeListeners();
	}

	public cleanupSubscription(resourceId: ResourceId): void {
		const unsubscribe = this.graphqlSubscriptions.get(resourceId);
		if (unsubscribe) {
			unsubscribe();
			this.graphqlSubscriptions.delete(resourceId);
		}
		this.cancelPendingRetry(resourceId);
		this.retryAttempts.delete(resourceId);
		// No subscribers left, so this resource can't be re-armed.
		this.deferredExhausted.delete(resourceId);
		if (this.deferredExhausted.size === 0) {
			this.unregisterWakeListeners();
		}
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
			// A healthy update means a parked exhaustion recovered on its own before any
			// wake sweep — drop it and tear down listeners if nothing else is parked.
			if (this.deferredExhausted.delete(syncBlockInstance.resourceId)) {
				if (this.deferredExhausted.size === 0) {
					this.unregisterWakeListeners();
				}
			}
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

			// Prefer the structured `type` (a `SyncBlockError` enum value) for classification
			// and fall back to the free-text `reason` so source-state/permission strings are
			// still bucketed (EDITOR-7862). The emitted free-text `error` attribute is unchanged.
			this.deps.getFireAnalyticsEvent()?.(
				fetchErrorPayload(
					errorMessage,
					syncBlockInstance.resourceId,
					syncBlockInstance.data?.product ??
						getSourceProductFromResourceIdSafe(syncBlockInstance.resourceId),
					buildFetchErrorAttribution(
						fg('platform_editor_blocks_patch_3'),
						syncBlockInstance.error?.type || syncBlockInstance.error?.reason,
						syncBlockInstance.error?.statusCode,
					),
				),
			);
		}
	}
}
