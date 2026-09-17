import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { isListItemNode, isListNode } from '../utils';

import { isListNodeValidContent } from './isListNodeValidContent';
import { JoinDirection } from './JoinDirection';

type JoinSiblingListsProps = {
	direction?: JoinDirection;
	forceListType?: NodeType;
	tr: Transaction;
};

type ListsJoined = {
	bulletList: number;
	orderedList: number;
};

export const joinSiblingLists = ({
	tr,
	direction,
	forceListType,
}: JoinSiblingListsProps): ListsJoined => {
	const result: ListsJoined = {
		orderedList: 0,
		bulletList: 0,
	};
	const {
		doc,
		selection: { $from, $to },
		selection,
	} = tr;
	const range = $from.blockRange($to, isListNodeValidContent);
	if (!range) {
		return result;
	}

	const rootListNode = doc.nodeAt(range.start);
	const from = isListNode(rootListNode) ? range.start : 0;
	const to = isListNode(rootListNode) ? range.end : tr.doc.content.size;

	const joins: number[] = [];
	doc.nodesBetween(from, to, (node: PMNode, pos: number, parent: PMNode | null) => {
		const resolvedPos = doc.resolve(pos);
		const { nodeBefore, nodeAfter } = resolvedPos;

		if (!nodeBefore || !nodeAfter || !isListNode(nodeBefore) || !isListNode(nodeAfter)) {
			return;
		}

		const isNestedList = isListItemNode(parent);

		if (!isNestedList && nodeBefore.type !== nodeAfter.type && !forceListType) {
			return;
		}
		const index = resolvedPos.index();
		const positionPreviousNode = resolvedPos.posAtIndex(index - 1);
		const positionCurrentNode = resolvedPos.posAtIndex(index);

		// If the previous node is part of the selection, OR
		// If the previous node is not part of the selection and the previous node has the same list type that we’re converting to
		const joinBefore = positionPreviousNode >= from || nodeBefore.type === forceListType;

		if (forceListType) {
			if (joinBefore) {
				tr.setNodeMarkup(positionPreviousNode, forceListType);
			}
			tr.setNodeMarkup(positionCurrentNode, forceListType);
		}

		if (isNestedList && nodeBefore.type !== nodeAfter.type) {
			const nodeType = direction === JoinDirection.RIGHT ? nodeAfter.type : nodeBefore.type;

			tr.setNodeMarkup(positionPreviousNode, nodeType);
		}

		if (joinBefore) {
			joins.push(pos);
		}
	});

	if (selection.empty && rootListNode && isListNode(rootListNode)) {
		const resolvedPos = doc.resolve(range.start + rootListNode.nodeSize);
		const { nodeBefore, nodeAfter } = resolvedPos;

		if (
			nodeBefore &&
			nodeAfter &&
			isListNode(nodeBefore) &&
			isListNode(nodeAfter) &&
			nodeAfter.type === nodeBefore.type
		) {
			joins.push(resolvedPos.pos);
		}
	}

	for (let i = joins.length - 1; i >= 0; i--) {
		const listNode = tr.doc.nodeAt(joins[i]);
		const listName = listNode?.type.name;

		if (listName && (listName === 'orderedList' || listName === 'bulletList')) {
			const amount = result[listName] || 0;
			result[listName] = amount + 1;
		}

		tr.join(joins[i]);
	}

	return result;
};

// eslint-disable-next-line @atlaskit/editor/no-re-export
export { isListNodeValidContent } from './isListNodeValidContent';
// eslint-disable-next-line @atlaskit/editor/no-re-export
export { JoinDirection } from './JoinDirection';
