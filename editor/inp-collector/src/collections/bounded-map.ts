/** A `Map` that forgets its oldest entry once it holds more than `limit`. */
export class BoundedMap<Key, Value> {
	private readonly entries = new Map<Key, Value>();

	constructor(private readonly limit: number) {}

	get(key: Key): Value | undefined {
		return this.entries.get(key);
	}

	forEach(visit: (value: Value, key: Key) => void): void {
		this.entries.forEach(visit);
	}

	set(key: Key, value: Value): void {
		this.entries.delete(key);
		this.entries.set(key, value);

		if (this.entries.size <= this.limit) {
			return;
		}

		const oldest = this.entries.keys().next();

		if (!oldest.done) {
			this.entries.delete(oldest.value);
		}
	}
}
