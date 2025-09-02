import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

import { isSyncedBlockAttributes } from '../ui/extensions/synced-block/utils/synced-block';

export const findSyncedBlockParent = ($pos: ResolvedPos) => {
	for (let i = 0; i <= $pos.depth; i++) {
		const node = $pos.node(i);

		if (isSyncedBlockAttributes(node.attrs)) {
			return {
				node,
				attributes: node.attrs,
			};
		}
	}

	return;
};
