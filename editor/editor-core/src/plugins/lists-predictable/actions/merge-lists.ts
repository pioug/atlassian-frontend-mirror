import { isListNode } from '../utils/node';
import { Transaction } from 'prosemirror-state';

type MergeNextListAtPositionProps = {
  listPosition: number;
  tr: Transaction;
};
export function mergeNextListAtPosition({
  tr,
  listPosition,
}: MergeNextListAtPositionProps) {
  const listNodeAtPosition = tr.doc.nodeAt(listPosition);
  if (!isListNode(listNodeAtPosition)) {
    return;
  }

  const listPositionResolved = tr.doc.resolve(
    listPosition + listNodeAtPosition!.nodeSize,
  );

  const { pos, nodeAfter, nodeBefore } = listPositionResolved;
  if (!isListNode(nodeBefore) || !isListNode(nodeAfter)) {
    return;
  }

  if (nodeAfter?.type.name !== nodeBefore?.type.name) {
    const previousListPosition = pos - nodeBefore!.nodeSize;
    tr.setNodeMarkup(previousListPosition, nodeAfter!.type);
  }

  tr.join(pos);
}
