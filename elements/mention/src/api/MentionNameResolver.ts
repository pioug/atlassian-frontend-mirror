import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { type MentionNameDetails, type MentionNameResolver, MentionNameStatus } from '../types';
import { type MentionNameClient } from './MentionNameClient';
import { fireAnalyticsMentionHydrationEvent } from '../util/analytics';

interface Callback {
	(value: MentionNameDetails): void;
}

export type { MentionNameResolver } from '../types';

/** A queue for user ids */
type Queue = Map<string, Callback[]>;
type QueueItem = [string, Callback[]];

export class DefaultMentionNameResolver implements MentionNameResolver {
	public static waitForBatch = 100; // ms
	private static waitForResolveAll: number = 800; // ms
	private client: MentionNameClient;
	private nameCache: Map<string, MentionNameDetails> = new Map();
	private nameQueue: Queue = new Map();
	private nameStartTime: Map<string, number> = new Map();
	private processingQueue: Queue = new Map();
	private debounce: number = 0;
	private debounceOnResolve: number | null = null;
	private onResolvedAll: () => void;
	private isOnResolvedAllCalled: boolean = false;
	private fireHydrationEvent: (
		action: string,
		userId: string,
		fromCache: boolean,
		duration: number,
	) => void;

	constructor(
		client: MentionNameClient,
		analyticsProps: WithAnalyticsEventsProps = {},
		onResolvedAll: () => void = () => {},
	) {
		this.client = client;
		this.fireHydrationEvent = fireAnalyticsMentionHydrationEvent(analyticsProps);
		// If provided, this will be called once all pending mentions in the queue are resolved.
		// A sample usage is scrolling to a mention on page load, after the mentions have loadad.
		this.onResolvedAll = onResolvedAll;
	}

	lookupName(id: string): Promise<MentionNameDetails> | MentionNameDetails {
		const name = this.nameCache.get(id);
		if (name) {
			this.fireAnalytics(true, name);
			if (this.nameQueue.size === 0) {
				this.scheduleOnAllResolved();
			}
			return name;
		}
		return new Promise<MentionNameDetails>((resolve) => {
			const processingItems = this.processingQueue.get(id);

			if (processingItems) {
				this.processingQueue.set(id, [...processingItems, resolve]);
			}

			const queuedItems = this.nameQueue.get(id) || [];
			this.nameQueue.set(id, [...queuedItems, resolve]);

			if (queuedItems.length === 0 && !processingItems) {
				this.nameStartTime.set(id, Date.now());
			}

			this.scheduleProcessQueue();

			if (this.isQueueAtLimit()) {
				this.processQueue();
			}
		});
	}

	cacheName(id: string, name: string): void {
		this.nameCache.set(id, {
			id,
			name,
			status: MentionNameStatus.OK,
		});
	}

	private scheduleProcessQueue() {
		if (!this.debounce) {
			this.debounce = window.setTimeout(this.processQueue, DefaultMentionNameResolver.waitForBatch);
		}
	}

	private scheduleOnAllResolved(): void {
		if (this.debounceOnResolve) {
			clearTimeout(this.debounceOnResolve);
		}
		this.debounceOnResolve = window.setTimeout(() => {
			if (this.isOnResolvedAllCalled) {
				return;
			}
			this.onResolvedAll();
			this.isOnResolvedAllCalled = true;
		}, DefaultMentionNameResolver.waitForResolveAll);
	}

	private isQueueAtLimit() {
		return this.nameQueue.size >= this.client.getLookupLimit();
	}

	private splitQueueAtLimit() {
		const values = Array.from(this.nameQueue.entries());
		const splitPoint = this.client.getLookupLimit();

		return {
			queue: new Map(values.slice(0, splitPoint)),
			extraQueue: new Map(values.slice(splitPoint)),
		};
	}

	private resolveQueueItem(mentionDetail: MentionNameDetails) {
		const { id } = mentionDetail;
		const resolvers = this.processingQueue.get(id);
		if (resolvers) {
			this.processingQueue.delete(id);
			this.nameCache.set(id, mentionDetail);
			resolvers.forEach((resolve) => {
				try {
					resolve(mentionDetail);
				} catch {
					// ignore - exception in consumer
				}
			});

			this.fireAnalytics(false, mentionDetail);
		}
	}

	private processQueue = () => {
		clearTimeout(this.debounce);
		this.debounce = 0;

		const { queue, extraQueue } = this.splitQueueAtLimit();
		this.nameQueue = extraQueue;
		this.processingQueue = mergeNameResolverQueues(this.processingQueue, queue);

		this.client
			.lookupMentionNames(Array.from(queue.keys()))
			.then((response) => {
				response.forEach((mentionDetail) => {
					const { id } = mentionDetail;
					queue.delete(id);
					this.resolveQueueItem(mentionDetail);
				});
				queue.forEach((_callback, id) => {
					// No response from client for these ids treat as unknown
					this.resolveQueueItem({
						id,
						status: MentionNameStatus.UNKNOWN,
					});
				});
			})
			.catch(() => {
				// Service completely failed, reject all items in the queue
				queue.forEach((_callback, id) => {
					this.resolveQueueItem({
						id,
						status: MentionNameStatus.SERVICE_ERROR,
					});
				});
			});

		// Make sure anything left in the queue gets processed.
		if (this.nameQueue.size > 0) {
			this.scheduleProcessQueue();
		} else {
			this.scheduleOnAllResolved();
		}
	};

	private fireAnalytics(fromCache: boolean, mentionDetail: MentionNameDetails) {
		const { id } = mentionDetail;
		const action = mentionDetail.status === MentionNameStatus.OK ? 'completed' : 'failed';
		const start = this.nameStartTime.get(id);
		const duration = start ? Date.now() - start : 0;
		this.nameStartTime.delete(id);
		this.fireHydrationEvent(action, id, fromCache, duration);
	}
}

/**
 * Merge the two queues making sure to merge callback arrays for items in queueB already in queueA.
 * This addresses [this ticket](https://product-fabric.atlassian.net/browse/QS-3789).
 */
export function mergeNameResolverQueues(queueA: Queue, queueB: Queue): Queue {
	const queueBeingMerged = new Map([...queueA]);

	// now add the items from the second queue that are not already in the
	//  merged queue being built
	[...queueB].forEach((item: QueueItem) => {
		const [key, queueBCallbacks] = item;
		const itemAlreadyInMergedQueue = queueBeingMerged.has(key);
		if (!itemAlreadyInMergedQueue) {
			queueBeingMerged.set(key, queueBCallbacks);
		} else {
			// item already in merged queue, merge the callback arrays
			const queueACallbacks = queueBeingMerged.get(key) ?? [];
			const mergedCallbacks = new Set([...queueBCallbacks, ...queueACallbacks]);
			const deduplicatedCallbacks = Array.from(mergedCallbacks.values()); // prevents calling them twice
			queueBeingMerged.set(key, deduplicatedCallbacks);
		}
	});

	return queueBeingMerged;
}
