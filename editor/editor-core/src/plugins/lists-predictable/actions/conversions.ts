import { Transaction, TextSelection } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import {
  ContentNodeWithPos,
  findParentNodeClosestToPos,
} from 'prosemirror-utils';
import { isListNode } from '../utils/node';

export function convertListType({
  tr,
  nextListNodeType,
}: {
  tr: Transaction;
  nextListNodeType: NodeType;
}) {
  const {
    selection,
    selection: { from, to },
  } = tr;

  // get the positions of all the leaf nodes within the selection
  const nodePositions = [];
  if (selection instanceof TextSelection && selection.$cursor) {
    nodePositions.push(from);
  } else {
    // nodesBetween doesn't return leaf nodes that are outside of from and to
    tr.doc.nodesBetween(from, to, (node, pos) => {
      if (!node.isLeaf) {
        return true;
      }
      nodePositions.push(pos);
    });
  }

  // use those positions to get the closest parent list nodes
  nodePositions
    .reduce((acc: ContentNodeWithPos[], pos: number) => {
      const closestParentListNode = findParentNodeClosestToPos(
        tr.doc.resolve(pos),
        isListNode,
      );
      if (!closestParentListNode) {
        return acc;
      }

      // don't add duplicates if the parent has already been added into the array
      const existingParent = acc.find((node: ContentNodeWithPos) => {
        return (
          node.pos === closestParentListNode.pos &&
          node.start === closestParentListNode.start &&
          node.depth === closestParentListNode.depth
        );
      });
      if (!existingParent) {
        acc.push(closestParentListNode);
      }

      return acc;
    }, [])
    .forEach(item => {
      tr.setNodeMarkup(item.pos, nextListNodeType);
    });
}
