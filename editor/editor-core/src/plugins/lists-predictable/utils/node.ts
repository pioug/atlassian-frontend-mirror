import { Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';

export function isListNode(node: PMNode | null | undefined) {
  return Boolean(
    node && node.type && ['orderedList', 'bulletList'].includes(node.type.name),
  );
}

export function isParagraphNode(node: PMNode | null | undefined) {
  return Boolean(node && node.type && 'paragraph' === node.type.name);
}

export function isListItemNode(node: PMNode | null | undefined) {
  return Boolean(node && node.type && 'listItem' === node.type.name);
}

export function isBulletList(node: PMNode | null | undefined) {
  return Boolean(node && node.type && 'bulletList' === node.type.name);
}

export enum JoinDirection {
  LEFT = 1,
  RIGHT = -1,
}

type JoinSiblingListsProps = {
  tr: Transaction;
  direction: JoinDirection;
};
export const joinSiblingLists = ({ tr, direction }: JoinSiblingListsProps) => {
  const {
    doc,
    selection: { $from, $to },
  } = tr;
  const range = $from.blockRange($to);
  if (!range) {
    return;
  }

  const joins: number[] = [];

  doc.nodesBetween(range.start, range.end, (node: PMNode, pos: number) => {
    const res = doc.resolve(pos);

    if (
      !res.nodeBefore ||
      !res.nodeAfter ||
      !isListNode(res.nodeBefore) ||
      !isListNode(res.nodeAfter)
    ) {
      return;
    }

    if (res.nodeBefore.type !== res.nodeAfter.type) {
      const resolvedPos = doc.resolve(pos);
      const index = resolvedPos.index();
      // @ts-ignore There is no typing for postAtIndex yet.
      const positionPreviousNode = resolvedPos.posAtIndex(index - 1);
      const nodeType =
        direction === JoinDirection.RIGHT
          ? res.nodeAfter.type
          : res.nodeBefore.type;

      tr.setNodeMarkup(positionPreviousNode, nodeType);
    }

    joins.push(pos);
  });

  joins.forEach(doubleListPosition => {
    tr.join(doubleListPosition);
  });
};
