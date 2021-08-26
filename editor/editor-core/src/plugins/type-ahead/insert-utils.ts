import { Transaction, TextSelection, NodeSelection } from 'prosemirror-state';
import { Node as PMNode, Slice, Fragment } from 'prosemirror-model';
import { normaliseNestedLayout } from '../../utils/selection';
import { safeInsert } from '../../utils/insert';

function findInsertPoint(
  doc: PMNode,
  pos: number,
  nodeToInsert: PMNode,
): { from: number; to: number } {
  const $pos = doc.resolve(pos);
  const createInsertPosition = (from: number, to?: number) => ({
    from,
    to: to || from,
  });

  // Search for a valid position for nodeToInsert in progressively higher levels
  for (let level = $pos.depth; level >= 0; level--) {
    const nodeAtLevel = $pos.node(level);

    // Try to replace the empty paragraph in the level above
    // Scenario:
    //   doc(
    //     table(
    //       row(
    //         cell(
    //           p('{<>}'),
    //         ),
    //       )
    //     )
    //   )
    const levelAbove = Math.max(level - 1, 0);
    const parentNode = $pos.node(levelAbove);
    // Special case: when this is true, the 'to' position should be the end
    // of the empty paragraph
    const isNodeAtLevelEmptyParagraph =
      nodeAtLevel.type.name === 'paragraph' && nodeAtLevel.content.size === 0;
    const indexAtLevelAbove = $pos.index(levelAbove);
    const canReplaceNodeAtLevelAbove = parentNode.canReplaceWith(
      indexAtLevelAbove,
      indexAtLevelAbove,
      nodeToInsert.type,
    );
    if (isNodeAtLevelEmptyParagraph && canReplaceNodeAtLevelAbove) {
      const from = $pos.posAtIndex(indexAtLevelAbove, levelAbove);
      return createInsertPosition(from, from + nodeAtLevel.nodeSize);
    }

    // Try to insert this node right after the node in the level above
    // Scenario:
    //   doc(
    //     panel(
    //       p('{<>}'),
    //     )
    //   )
    const indexAfterAtLevelAbove = $pos.indexAfter(levelAbove);
    const canInsertNodeAtLevelAbove = parentNode.canReplaceWith(
      indexAfterAtLevelAbove,
      indexAfterAtLevelAbove,
      nodeToInsert.type,
    );

    if (canInsertNodeAtLevelAbove) {
      return createInsertPosition(
        $pos.posAtIndex(indexAfterAtLevelAbove, levelAbove),
      );
    }
  }

  return createInsertPosition(0);
}

type Position = {
  start: number;
  end: number;
};
export const insertBlockNode = ({
  node,
  tr,
  position,
}: {
  node: PMNode;
  tr: Transaction;
  position: Position;
}): Transaction => {
  const { start, end } = position;
  if (node.isText) {
    return tr.replaceWith(start, end, node);
  }

  if (node.isBlock) {
    tr.delete(start, end);

    const mappedStart = tr.mapping.map(start);
    const nodeNormalized = normaliseNestedLayout(tr, node);

    // Handle edge cases for hr and mediaSingle
    const inserted = safeInsert(nodeNormalized, mappedStart)(tr);
    if (inserted) {
      return tr;
    }

    const sliceInserted = Slice.maxOpen(Fragment.from(nodeNormalized));

    const { from, to } = findInsertPoint(tr.doc, mappedStart, nodeNormalized);
    tr.replaceWith(from, to, node);

    const openPosition = Math.min(
      from + (node.isAtom ? node.nodeSize : sliceInserted.openStart),
      tr.doc.content.size,
    );
    const FORWARD_DIRECTION = 1;
    const nextSelection = TextSelection.findFrom(
      tr.doc.resolve(openPosition),
      FORWARD_DIRECTION,
      true,
    );
    if (nextSelection) {
      return tr.setSelection(nextSelection);
    }
  }

  return tr;
};

export const insertInlineNodeOrFragment = ({
  maybeFragment,
  tr,
  position,
  selectInlineNode,
}: {
  maybeFragment: Fragment | PMNode;
  tr: Transaction;
  position: Position;
  selectInlineNode: boolean;
}): Transaction => {
  const { start, end } = position;

  const fragment =
    maybeFragment instanceof PMNode
      ? Fragment.from(maybeFragment)
      : maybeFragment;

  tr.replaceWith(start, end, fragment);

  if (selectInlineNode) {
    return tr.setSelection(NodeSelection.create(tr.doc, start));
  }

  return tr.setSelection(
    TextSelection.near(tr.doc.resolve(start + fragment.size)),
  );
};
