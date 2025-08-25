import type { NodeType, Node as PMNode, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { isListItemNode, isListNode } from '../utils';

import { wrapTaskListIntoListAbove } from './replace-content';

export function isListNodeValidContent(node: PMNode) {
	const { bulletList } = node.type.schema.nodes;
	if (!bulletList) {
		return false;
	}

	const listFragment = Fragment.from(bulletList.createAndFill());

	return !isListItemNode(node) && node.type.validContent(listFragment);
}

export enum JoinDirection {
	LEFT = 1,
	RIGHT = -1,
}

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

/**
 * Returns the prosemirror position for the child at give index inside the parent node.
 * Example: Considering doc structure as below using the function
 *          passing parent resolved position for li and index 2
 *          would return starting position of taskList
 * DOC STRUCTURE:
 * ol()
 *  ( li(
 *      p('text'),
 *      ul(content),
 *      taskList(),
 *    )
 *  )
 * @param $from Starting resolved position for the parent node of the child we are looking for.
 * @param index Index of the child node we want the position for.
 * @returns
 */
const findStartPositionOfChildWithIndex = ($from: ResolvedPos, index: number): number => {
	const parent = $from.node();
	let currentPos = $from.pos + 1;
	for (let i = 0; i < index; i++) {
		currentPos += parent.child(i).nodeSize;
	}
	return currentPos;
};

const findGrandParentResolvedPos = (tr: Transaction, $from: ResolvedPos) => {
	return $from.depth > 2 ? tr.doc.resolve($from.start($from.depth - 2)) : null;
};

const findNestedTaskListsIndexAtSameLevel = (tr: Transaction, $from: ResolvedPos) => {
	/*
    Currently our cursor would be inside a pargraph of a list of type numbered/bullet list,
    we need to find the grandparent of the cursor which is the list at same level of taskList.
    We can get the root list item(inside which various lists are being resolved before outdenting) by going one depth above that list.
  */
	const nestedListResolvedPos = findGrandParentResolvedPos(tr, $from);
	const rootListItem = nestedListResolvedPos?.node(nestedListResolvedPos.depth - 1);

	const nestedTaskListsIndexes: number[] = [];
	const rootListItemChildCount = rootListItem?.childCount || 0;
	// first child of list item is always paragraph (i = 0) so we start from 1
	for (let i = 1; i < rootListItemChildCount; i++) {
		if (rootListItem?.child(i).type.name === 'taskList') {
			nestedTaskListsIndexes.push(i);
		}
	}
	return nestedTaskListsIndexes;
};

export const processNestedTaskListsInSameLevel = (tr: Transaction) => {
	const { $from } = tr.selection;

	const nestedTaskListIndexes = findNestedTaskListsIndexAtSameLevel(tr, $from);
	if (nestedTaskListIndexes.length === 0) {
		return;
	}

	const nestedListResolvedPos = findGrandParentResolvedPos(tr, $from);
	const rootListItemStart = nestedListResolvedPos?.start(nestedListResolvedPos.depth - 1);

	/* We need not wrap the taskList present above other lists since it doesn't affect the flow. */
	const nestedTaskListIndexesToWrap = nestedTaskListIndexes.filter((index) => index > 1);

	/*
    Wraps the taskLists present at each index mentioned in the nestedTaskListIndexesToWrap to the list above it.
    After each wrap the indexes changes since two lists are being merged into one,
    so we keep track of it and use it to access actual calculated taskList indexes.
  */
	if (rootListItemStart) {
		let taskListsFixedNested = 0;
		nestedTaskListIndexesToWrap.forEach((index) => {
			wrapTaskListIntoListAbove(
				tr,
				findStartPositionOfChildWithIndex(
					tr.doc.resolve(rootListItemStart),
					index - taskListsFixedNested,
				),
				findStartPositionOfChildWithIndex(
					tr.doc.resolve(rootListItemStart),
					index - 1 - taskListsFixedNested,
				),
			);
			taskListsFixedNested++;
		});
	}
	return;
};
