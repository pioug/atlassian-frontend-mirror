import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TableMap } from './table-map';

// Share the same cache between readers and writers. Table maps are relative to
// immutable table nodes, so changing the document produces a different key.
let readFromCache: (key: PMNode) => TableMap | undefined;
let addToCache: (key: PMNode, value: TableMap) => TableMap;

if (typeof WeakMap !== 'undefined') {
	const cache = new WeakMap<PMNode, TableMap | undefined>();
	readFromCache = (key) => cache.get(key);
	addToCache = (key, value) => {
		cache.set(key, value);
		return value;
	};
} else {
	// The original fallback stores five pairs in a ten-slot circular cache.
	const cache: [PMNode, TableMap][] = [];
	const cacheSize = 5;
	let cachePos = 0;
	readFromCache = (key) => {
		for (const [node, map] of cache) {
			if (node === key) {
				return map;
			}
		}
		return undefined;
	};
	addToCache = (key, value) => {
		if (cachePos === cacheSize) {
			cachePos = 0;
		}
		cache[cachePos++] = [key, value];
		return value;
	};
}

export const tableMapCache: {
	get: (key: PMNode) => TableMap | undefined;
	set: (key: PMNode, value: TableMap) => TableMap;
} = { get: readFromCache, set: addToCache };
