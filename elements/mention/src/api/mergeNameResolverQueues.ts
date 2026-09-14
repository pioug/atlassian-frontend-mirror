import type { Callback } from './Callback';
import type { Queue } from './Queue';

type QueueItem = [string, Callback[]];

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
