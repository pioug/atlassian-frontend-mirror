export class LRUCache<T> {
	private capacity: number;
	private cache: Map<string, T>;
	constructor(capacity: number) {
		this.capacity = capacity;
		this.cache = new Map();
	}
	get(key: string): T | undefined {
		if (!this.cache.has(key)) {
			return undefined;
		}

		// Move the used key to the end to mark it as most recently used
		const value = this.cache.get(key)!;
		this.cache.delete(key);
		this.cache.set(key, value);
		return value;
	}

	set(key: string, value: T): void {
		// Check if the key already exists and delete it to update its position
		if (this.cache.has(key)) {
			this.cache.delete(key);
		} else if (this.cache.size >= this.capacity) {
			// Remove the first (least recently used) cache item if we're at capacity
			const firstKey = this.cache.keys().next().value;
			this.cache.delete(firstKey);
		}
		this.cache.set(key, value);
	}
}
