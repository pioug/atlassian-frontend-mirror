import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import {
  findParentNodeOfType,
  findParentNodeOfTypeClosestToPos,
  safeInsert,
} from '@atlaskit/editor-prosemirror/utils';

import { isListNode } from './list';

export function transformNodeIntoListItem(
  tr: Transaction,
  node: PMNode,
): Transaction {
  const { $to, $from, to, from } = tr.selection;
  const { orderedList, bulletList, listItem } = tr.doc.type.schema.nodes;

  const startLinePosition = $from.start();
  const parentStartPosition = $from.depth === 0 ? 0 : $from.before();

  // Setting the start position
  const startMapped = startLinePosition === from ? parentStartPosition : from;

  // Selected nodes
  const selectionParentListItemNode = findParentNodeOfType(listItem)(
    tr.selection,
  );
  const selectionParentListNodeWithPos = findParentNodeOfType([
    bulletList,
    orderedList,
  ])(tr.selection);
  const selectionParentListNode = selectionParentListNodeWithPos?.node;

  if (!selectionParentListNodeWithPos) {
    return tr;
  }

  // Offsets
  const listWrappingOffset =
    $to.depth - selectionParentListNodeWithPos.depth + 1; // difference in depth between to position and list node
  const listItemWrappingOffset =
    $to.depth - selectionParentListNodeWithPos.depth; // difference in depth between to position and list item node

  // Anything to do with nested lists should safeInsert and not be handled here
  const grandParentListNode = findParentNodeOfTypeClosestToPos(
    tr.doc.resolve(selectionParentListNodeWithPos.pos),
    [bulletList, orderedList],
  );
  const selectionIsInNestedList = !!grandParentListNode;
  let selectedListItemHasNestedList = false;
  selectionParentListItemNode?.node.content.forEach((child) => {
    if (isListNode(child)) {
      selectedListItemHasNestedList = true;
    }
  });
  if (selectedListItemHasNestedList || selectionIsInNestedList) {
    return safeInsert(node)(tr).scrollIntoView();
  }

  // Check if node after the insert position is listItem
  const isNodeAfterInsertPositionIsListItem =
    tr.doc.nodeAt(to + listItemWrappingOffset)?.type === listItem;

  let replaceTo;
  if (isNodeAfterInsertPositionIsListItem) {
    replaceTo = to + listItemWrappingOffset;
  } else if (!isNodeAfterInsertPositionIsListItem) {
    replaceTo = to;
  } else {
    replaceTo = to + listWrappingOffset;
  }

  // handle the insertion of the slice
  tr.replaceWith(startMapped, replaceTo, node).scrollIntoView();

  // Get the next list items position (used later to find the split out ordered list)
  const indexOfNextListItem = $to.indexAfter(
    $to.depth - listItemWrappingOffset,
  );

  const positionOfNextListItem = tr.doc
    .resolve(selectionParentListNodeWithPos.pos + 1)
    .posAtIndex(indexOfNextListItem);

  // Find the ordered list node after the pasted content so we can set it's order
  const mappedPositionOfNextListItem = tr.mapping.map(positionOfNextListItem);
  if (mappedPositionOfNextListItem > tr.doc.nodeSize) {
    return tr;
  }
  const nodeAfterPastedContentResolvedPos = findParentNodeOfTypeClosestToPos(
    tr.doc.resolve(mappedPositionOfNextListItem),
    [orderedList],
  );

  // Work out the new split out lists 'order' (the number it starts from)
  const originalParentOrderedListNodeOrder =
    selectionParentListNode?.attrs.order;
  const numOfListItemsInOriginalList = findParentNodeOfTypeClosestToPos(
    tr.doc.resolve(from - 1),
    [orderedList],
  )?.node.childCount;

  // Set the new split out lists order attribute
  if (
    typeof originalParentOrderedListNodeOrder === 'number' &&
    numOfListItemsInOriginalList &&
    nodeAfterPastedContentResolvedPos
  ) {
    tr.setNodeMarkup(nodeAfterPastedContentResolvedPos.pos, orderedList, {
      ...nodeAfterPastedContentResolvedPos.node.attrs,
      order: originalParentOrderedListNodeOrder + numOfListItemsInOriginalList,
    });
  }

  return tr;
}
