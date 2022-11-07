import { Transaction, TextSelection } from 'prosemirror-state';
import { NodeType, NodeRange } from 'prosemirror-model';
import { findWrapping } from 'prosemirror-transform';
import {
  ContentNodeWithPos,
  findParentNodeClosestToPos,
} from 'prosemirror-utils';
import { isListNode, joinSiblingLists } from '../utils/node';
import { isEmptyParagraph } from '../../../utils';
import { findFirstParentListNode } from '../utils/find';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';

export function convertListType({
  tr,
  nextListNodeType,
}: {
  tr: Transaction;
  nextListNodeType: NodeType;
}) {
  const {
    doc,
    selection: { $from, $to },
  } = tr;

  let listRange;
  if (tr.selection instanceof GapCursorSelection) {
    const nodeSize = $from.nodeAfter?.nodeSize || 1;
    listRange = $from.blockRange($from.doc.resolve($from.pos + nodeSize));
  } else {
    listRange = $from.blockRange($to, isListNode);
  }

  if (listRange) {
    return convertSelectedList({ tr, nextListNodeType });
  }

  let nodeRangeAroundList = $from.blockRange($to);
  if (!nodeRangeAroundList) {
    return;
  }

  const parentNode = nodeRangeAroundList.parent;
  const { startIndex, endIndex, depth } = nodeRangeAroundList;

  // Checking for invalid nodes to prevent conversion
  // eg. a panel cannot be wrapped in a list so return
  // It will skip this check if the selection begins within a list
  // This is to match the behaviour of the toolbar buttons being disabled
  if (!findFirstParentListNode($from)) {
    for (let i = startIndex; i < endIndex; i++) {
      const position = nodeRangeAroundList.$from.posAtIndex(i, depth);
      const resolvedPosition = doc.resolve(position);
      const currentChild = parentNode.child(i);
      const currentNodeRange = resolvedPosition.blockRange(
        tr.doc.resolve(position + currentChild.nodeSize),
      );

      if (
        currentNodeRange &&
        !isListNode(currentChild) &&
        !findWrapping(currentNodeRange, nextListNodeType)
      ) {
        return;
      }
    }
  }

  // Checking for any non list nodes and wrapping them in a list
  // so they can be converted
  tr.doc.nodesBetween(
    nodeRangeAroundList.start,
    nodeRangeAroundList.end,
    (node, pos) => {
      // Skip over any nodes that are part of a list
      if (findFirstParentListNode(tr.doc.resolve(tr.mapping.map(pos)))) {
        return false;
      }

      // The following applies to suitable nodes that are not within a list
      const currentNodeNotWrappedInList = node;
      const isNotAnEmptyParagraphAndIsParagraphOrLeafNode =
        !isEmptyParagraph(currentNodeNotWrappedInList) &&
        (!node.type.isBlock || node.type.name === 'paragraph');

      if (
        isNotAnEmptyParagraphAndIsParagraphOrLeafNode &&
        nodeRangeAroundList
      ) {
        const remainingNodeRange = new NodeRange(
          tr.doc.resolve(tr.mapping.map(pos)),
          tr.doc.resolve(
            tr.mapping.map(pos) + currentNodeNotWrappedInList.nodeSize,
          ),
          nodeRangeAroundList.depth,
        );
        convertAroundList({
          tr,
          nextListNodeType,
          nodeRange: remainingNodeRange,
        });
        return false;
      }
    },
  );

  convertSelectedList({ tr, nextListNodeType });

  if (tr.docChanged) {
    joinSiblingLists({ tr, forceListType: nextListNodeType });
  }
}

const convertSelectedList = ({
  tr,
  nextListNodeType,
}: {
  tr: Transaction;
  nextListNodeType: NodeType;
}) => {
  const {
    selection,
    selection: { from, to },
  } = tr;

  const { codeBlock } = tr.doc.type.schema.nodes;
  // get the positions of all the leaf nodes within the selection
  const nodePositions = [];
  if (
    (selection instanceof TextSelection && selection.$cursor) ||
    selection instanceof GapCursorSelection
  ) {
    nodePositions.push(from);
  } else {
    // nodesBetween doesn't return leaf nodes that are outside of from and to
    tr.doc.nodesBetween(from, to, (node, pos) => {
      // isLeaf is false for empty codeBlock so adding additional check for childCount
      if (!node.isLeaf && !(node.type === codeBlock && node.childCount === 0)) {
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
    .forEach((item) => {
      tr.setNodeMarkup(item.pos, nextListNodeType);
    });
};

const convertAroundList = ({
  tr,
  nextListNodeType,
  nodeRange,
}: {
  tr: Transaction;
  nextListNodeType: NodeType;
  nodeRange: NodeRange;
}) => {
  for (let i = nodeRange.endIndex - 1; i >= nodeRange.startIndex; i--) {
    // @ts-ignore posAtIndex is a public API but has no type yet
    const position = nodeRange.$from.posAtIndex(i, nodeRange.depth);
    const resolvedPos = tr.doc.resolve(position + 1);
    const range = resolvedPos.blockRange(resolvedPos);
    if (!range) {
      return;
    }
    const wrappings = findWrapping(range, nextListNodeType);
    if (!range || !wrappings) {
      return;
    }
    tr.wrap(range, wrappings);
  }
};
