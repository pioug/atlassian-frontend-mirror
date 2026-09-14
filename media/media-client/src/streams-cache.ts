import { type LRUMap } from 'lru_map';
import { type ReplaySubject } from 'rxjs/ReplaySubject';

export class StreamsCache<T> {
	constructor(private readonly streams: LRUMap<string, ReplaySubject<T>>) {}

	has(id: string): boolean {
		return !!this.streams.find(id);
	}

	set(id: string, stream: ReplaySubject<T>): void {
		this.streams.set(id, stream);
	}

	get(id: string): ReplaySubject<T> | undefined {
		return this.streams.get(id);
	}

	getOrInsert(id: string, callback: () => ReplaySubject<T>): ReplaySubject<T> {
		if (!this.has(id)) {
			this.set(id, callback());
		}
		return this.get(id)!;
	}

	removeAll(): void {
		this.streams.clear();
	}

	remove(id: string): void {
		this.streams.delete(id);
	}

	get size(): number {
		return this.streams.size;
	}
}
