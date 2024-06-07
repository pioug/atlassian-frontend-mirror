import { type LRUMap } from 'lru_map';
import { type ReplaySubject } from 'rxjs/ReplaySubject';
import { type FileState } from '@atlaskit/media-state';
export class StreamsCache<T> {
	constructor(private readonly streams: LRUMap<string, ReplaySubject<T>>) {}

	has(id: string): boolean {
		return !!this.streams.find(id);
	}

	set(id: string, stream: ReplaySubject<T>) {
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

	removeAll() {
		this.streams.clear();
	}

	remove(id: string) {
		this.streams.delete(id);
	}

	get size(): number {
		return this.streams.size;
	}
}

let streamCache: StreamsCache<FileState>;
export const getFileStreamsCache = () => {
	if (!streamCache) {
		// TODO: we can move this into a static import like
		// import {mediaState} from '@atlaskit/media-core'
		const mediaState = require('@atlaskit/media-core').mediaState;
		streamCache = new StreamsCache<FileState>(mediaState.streams);
	}
	return streamCache;
};
