import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { isListItemNode, isListNode } from '../utils';

export const countListItemsInSelection = (tr: Transaction): number => {
	const { from, to } = tr.selection;
	if (from === to) {
		return 1;
	}
	let count = 0;
	const listSlice = tr.doc.cut(from, to);
	listSlice.content.nodesBetween(0, listSlice.content.size, (node, pos, parent, index) => {
		if (parent && isListItemNode(parent) && !isListNode(node) && index === 0) {
			count++;
		}
	});
	return count;
};
