import { insertContentDeleteRange } from '../../../../utils/commands';
import { Fragment, ResolvedPos, Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
import { isListNode } from '../../utils/node';

type DeleteAction = (props: {
  tr: Transaction;
  $next: ResolvedPos;
  $head: ResolvedPos;
}) => boolean;

// Case for when a users selection is at the end of a paragraph, the paragraph
// is followed by a list, and they delete forward
export const joinListItemWithParagraph: DeleteAction = ({
  tr,
  $next,
  $head,
}) => {
  // For empty paragraphs before a list
  if ($head.parent.content.size < 1) {
    insertContentDeleteRange(
      tr,
      (tr) => tr.doc.resolve($head.pos),
      [],
      [[$head.pos - 1, $head.pos]],
    );

    return true;
  }

  const paragraphPosition = $head.pos;
  const list = tr.doc.nodeAt($next.pos - 1);
  const firstListItem = tr.doc.nodeAt($next.pos);

  if (!list || !firstListItem) {
    return false;
  }

  const firstChildNodeOfFirstListItem = firstListItem.firstChild;

  if (!firstChildNodeOfFirstListItem) {
    return false;
  }

  const lastChildOfFirstListItem = firstListItem.lastChild;
  const firstGrandchildOfFirstListItem =
    firstChildNodeOfFirstListItem.firstChild;
  const firstListItemHasOneChildWithNoNestedLists =
    hasSingleChild(firstListItem) &&
    firstChildNodeOfFirstListItem.childCount < 2 &&
    $next.nodeAfter;
  const firstListItemContainsParagraphAndNestedList =
    !hasSingleChild(firstListItem) &&
    lastChildOfFirstListItem &&
    isListNode(lastChildOfFirstListItem);

  const insertions: [Fragment, number][] = [];
  const deletions: [number, number][] = [];

  // For lists that only have one list item with no children - need to remove remaining list
  if (
    hasSingleChild(list) &&
    hasSingleChild(firstListItem) &&
    $next.nodeAfter
  ) {
    deletions.push([
      tr.mapping.map($next.pos - 1),
      tr.mapping.map($next.pos + $next.nodeAfter.nodeSize + 1),
    ]);
  }

  // For first list items that have a paragraph and a list
  if (firstListItemContainsParagraphAndNestedList) {
    const firstListItemNestedList = Fragment.from(
      lastChildOfFirstListItem!.content,
    );
    insertions.push([firstListItemNestedList, tr.mapping.map($next.pos)]);
  }

  // For first list item has one child & no nested lists OR first list items that have a paragraph and a list
  if (
    firstListItemHasOneChildWithNoNestedLists ||
    firstListItemContainsParagraphAndNestedList
  ) {
    deletions.push([
      tr.mapping.map($next.pos),
      tr.mapping.map($next.pos + firstListItem.nodeSize - 1),
    ]);

    const firstListItemText = Fragment.from(
      firstChildNodeOfFirstListItem.content,
    );

    insertions.push([firstListItemText, paragraphPosition]);

    insertContentDeleteRange(
      tr,
      (tr) => tr.doc.resolve($head.pos),
      insertions,
      deletions,
    );

    return true;
  }

  // For any first list items that have multiple children (eg. multiple paragraphs)
  if (firstListItem.childCount > 1) {
    insertions.push([
      Fragment.from(firstChildNodeOfFirstListItem.content),
      paragraphPosition,
    ]);

    deletions.push([
      tr.mapping.map($next.pos + 1),
      tr.mapping.map($next.pos + firstChildNodeOfFirstListItem.nodeSize + 1),
    ]);

    insertContentDeleteRange(
      tr,
      (tr) => tr.doc.resolve($head.pos),
      insertions,
      deletions,
    );

    return true;
  }

  // For any remaining first list items that have a single child (eg. single paragraph, multiple lines of text)
  if (
    firstGrandchildOfFirstListItem &&
    firstGrandchildOfFirstListItem.type.name === 'hardBreak'
  ) {
    const nodeSizeOfGrandchild = firstGrandchildOfFirstListItem
      ? firstGrandchildOfFirstListItem.nodeSize
      : 0;

    deletions.push([
      tr.mapping.map($next.pos + 2),
      tr.mapping.map($next.pos + 2 + nodeSizeOfGrandchild),
    ]);
  } else {
    insertions.push([
      Fragment.from(firstChildNodeOfFirstListItem.content),
      paragraphPosition,
    ]);

    const nodeSizeOfFirstChild = firstChildNodeOfFirstListItem.nodeSize;

    deletions.push([
      tr.mapping.map($next.pos),
      tr.mapping.map($next.pos + 2 + nodeSizeOfFirstChild),
    ]);
  }

  insertContentDeleteRange(
    tr,
    (tr) => tr.doc.resolve($head.pos),
    insertions,
    deletions,
  );

  return true;
};

const hasSingleChild = (node: PMNode) => {
  return node.childCount === 1;
};
