import {
  NodeSelection,
  TextSelection,
  type Transaction,
} from '@atlaskit/editor-prosemirror/state';

export const getSelection = (tr: Transaction, start: number) => {
  const node = tr.doc.nodeAt(start);
  const isNodeSelection = node && NodeSelection.isSelectable(node);
  const nodeSize = node ? node.nodeSize : 1;
  const $startPos = tr.doc.resolve(start);

  if (isNodeSelection) {
    return new NodeSelection($startPos);
  } else {
    const textNodesPos: number[] = [];
    tr.doc.nodesBetween($startPos.pos, $startPos.pos + nodeSize, (n, pos) => {
      if (n.isText) {
        textNodesPos.push(pos);
        return false;
      }
      return true;
    });

    const textNodeStart = textNodesPos[0] || start;
    const textNodeDepth = textNodeStart - start;
    return new TextSelection(
      tr.doc.resolve(textNodeStart),
      tr.doc.resolve(start + nodeSize - textNodeDepth),
    );
  }
};
