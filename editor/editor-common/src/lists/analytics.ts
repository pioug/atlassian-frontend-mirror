import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { CommonListAnalyticsAttributes } from '../analytics';
import { isListItemNode, isListNode } from '../utils';

import { getListItemAttributes } from './selection';

export const getCommonListAnalyticsAttributes = (
	tr: Transaction,
): CommonListAnalyticsAttributes => {
	const {
		selection: { $from, $to },
	} = tr;
	const fromAttrs = getListItemAttributes($from);
	const toAttrs = getListItemAttributes($to);

	return {
		itemIndexAtSelectionStart: fromAttrs.itemIndex,
		itemIndexAtSelectionEnd: toAttrs.itemIndex,
		indentLevelAtSelectionStart: fromAttrs.indentLevel,
		indentLevelAtSelectionEnd: toAttrs.indentLevel,
		itemsInSelection: countListItemsInSelection(tr),
	};
};

export const countListItemsInSelection = (tr: Transaction) => {
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
