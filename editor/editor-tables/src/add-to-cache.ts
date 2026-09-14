import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TableMap } from './table-map';
import { tableMapCache } from './table-map-cache';

export function addToCache(key: PMNode, value: TableMap): TableMap {
	return tableMapCache.set(key, value);
}
