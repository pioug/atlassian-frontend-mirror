import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';

import { isListNode } from '../utils';

export const numberNestedLists = (resolvedPos: ResolvedPos): number => {
	let count = 0;
	for (let i = resolvedPos.depth - 1; i > 0; i--) {
		const node = resolvedPos.node(i);
		if (isListNode(node)) {
			count += 1;
		}
	}
	return count;
};
