import type { VCObserverEntry } from '../types';

export default class EntriesTimeline {
	private unorderedEntries: VCObserverEntry[];
	private sortedEntriesCache: Map<string, WeakRef<VCObserverEntry[]>>;

	constructor() {
		this.unorderedEntries = [];
		this.sortedEntriesCache = new Map();
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
