import { markProfilingEnd, markProfilingStart, withProfiling } from '../../../self-measurements';
import type { VCObserverEntry } from '../types';

export default class EntriesTimeline {
	private unorderedEntries: VCObserverEntry[] = [];

	private sortedEntriesCache = new Map<string, WeakRef<VCObserverEntry[]>>();
	constructor() {
		const operationTimer = markProfilingStart('EntriesTimeline constructor');
		this.unorderedEntries = [];
		this.push = withProfiling(this.push.bind(this), ['vc']);
		this.getCacheKey = withProfiling(this.getCacheKey.bind(this), ['vc']);
		this.getOrderedEntries = withProfiling(this.getOrderedEntries.bind(this), ['vc']);
		this.clear = withProfiling(this.clear.bind(this), ['vc']);
		markProfilingEnd(operationTimer, { tags: ['vc'] });
	}

	push(entry: VCObserverEntry) {
		this.unorderedEntries.push(entry);
		this.sortedEntriesCache.clear();
	}

	private getCacheKey(
		start: DOMHighResTimeStamp | null | undefined,
		stop: DOMHighResTimeStamp | null | undefined,
	) {
		return `${start ?? 'null'}_${stop ?? 'null'}`;
	}

	getOrderedEntries({
		start,
		stop,
	}: {
		start?: DOMHighResTimeStamp | null;
		stop?: DOMHighResTimeStamp | null;
	}): ReadonlyArray<VCObserverEntry> {
		const cacheKey = this.getCacheKey(start, stop);

		const cachedSortedEntries = this.sortedEntriesCache.get(cacheKey)?.deref();
		if (cachedSortedEntries) {
			return cachedSortedEntries;
		}

		const filteredEntries = this.unorderedEntries.filter(
			(e) => e.time >= (start ?? 0) && e.time <= (stop ?? performance.now()),
		);

		const sortedEntries = filteredEntries.sort((a, b) => a.time - b.time);

		this.sortedEntriesCache.set(cacheKey, new WeakRef(sortedEntries));

		return sortedEntries;
	}

	clear() {
		this.unorderedEntries = [];
		this.sortedEntriesCache.clear();
	}
}
