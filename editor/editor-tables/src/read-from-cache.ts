import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import type { TableMap } from './table-map';
import { tableMapCache } from './table-map-cache';

export function readFromCache(key: PMNode): TableMap | undefined {
	return tableMapCache.get(key);
}
