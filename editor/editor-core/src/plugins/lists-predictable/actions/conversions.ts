import { Transaction, TextSelection } from 'prosemirror-state';
import { NodeType, ResolvedPos, NodeRange } from 'prosemirror-model';
import { findWrapping } from 'prosemirror-transform';
import {
  ContentNodeWithPos,
  findParentNodeClosestToPos,
} from 'prosemirror-utils';
import { isListNode, joinSiblingLists } from '../utils/node';
import { isEmptyParagraph } from '../../../utils';

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

  const listRange = $from.blockRange($to, isListNode);
  if (listRange) {
    return convertSelectedList({ tr, nextListNodeType });
  }

  const nodeRangeAroundList = $from.blockRange($to);
  if (!nodeRangeAroundList) {
    return;
  }
  const parentNode = nodeRangeAroundList.parent;
  const { startIndex, endIndex, depth } = nodeRangeAroundList;

  const before: { from: ResolvedPos | null; to: ResolvedPos | null } = {
    from: !isListNode(parentNode.child(startIndex))
      ? // @ts-ignore
        doc.resolve(nodeRangeAroundList.$from.posAtIndex(startIndex, depth) + 1)
      : null,
    to: null,
  };
  const after: { from: ResolvedPos | null; to: ResolvedPos | null } = {
    from: null,
    to: !isListNode(parentNode.child(endIndex - 1))
      ? doc.resolve(
          // @ts-ignore
          nodeRangeAroundList.$from.posAtIndex(endIndex - 1, depth) + 1,
        )
      : null,
  };
  let isListNodeFound = false;
  let firstEmptyParagraphAfterListFound = false;
  for (let i = startIndex; i < endIndex; i++) {
    // @ts-ignore posAtIndex is a public API but has no type yet
    const position = nodeRangeAroundList.$from.posAtIndex(i, depth);
    const resolvedPosition = doc.resolve(position);

    if (isEmptyParagraph(parentNode.child(i)) && !isListNodeFound) {
      before.from = doc.resolve(
        // @ts-ignore posAtIndex is a public API but has no type yet
        nodeRangeAroundList.$from.posAtIndex(i, depth) + 2,
      );
    }

    if (
      isEmptyParagraph(parentNode.child(i)) &&
      isListNodeFound &&
      !firstEmptyParagraphAfterListFound
    ) {
      after.to = resolvedPosition;
      firstEmptyParagraphAfterListFound = true;
    }

    if (!isListNode(parentNode.child(i)) && !isListNodeFound) {
      before.to = doc.resolve(resolvedPosition.pos + 1);
    } else if (!isListNodeFound) {
      isListNodeFound = true;
      const endNodePosition = doc.resolve(resolvedPosition.pos + 1).end() + 1;
      if (doc.resolve(endNodePosition).nodeAfter) {
        after.from = doc.resolve(endNodePosition + 1);
      }
    }
  }

  let beforeConversionArgs, beforeRange, afterConversionArgs, afterRange;

  if (after.from && after.to) {
    const mappedFrom = tr.mapping.map(after.from.pos);
    const mappedTo = tr.mapping.map(after.to.pos);
    afterRange = new NodeRange(
      tr.doc.resolve(mappedFrom),
      tr.doc.resolve(mappedTo),
      nodeRangeAroundList.depth,
    );
    afterConversionArgs = {
      tr,
      nextListNodeType,
      nodeRange: afterRange,
    };
  }

  if (before.from && before.to) {
    const mappedFrom = tr.mapping.map(before.from.pos);
    const mappedTo = tr.mapping.map(before.to.pos);
    beforeRange = new NodeRange(
      tr.doc.resolve(mappedFrom),
      tr.doc.resolve(mappedTo),
      nodeRangeAroundList.depth,
    );
    beforeConversionArgs = {
      tr,
      nextListNodeType,
      nodeRange: beforeRange,
    };
  }
  if (
    (!afterRange && !beforeRange) ||
    (afterRange && !findWrapping(afterRange, nextListNodeType)) ||
    (beforeRange && !findWrapping(beforeRange, nextListNodeType))
  ) {
    return;
  }

  if (afterConversionArgs) {
    convertAroundList(afterConversionArgs);
  }

  if (beforeConversionArgs) {
    convertAroundList(beforeConversionArgs);
  }

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
