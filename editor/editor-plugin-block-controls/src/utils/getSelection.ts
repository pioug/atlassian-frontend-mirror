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
    // To trigger the annotation floating toolbar for non-selectable node, we need to select on the text node
    // Find the first text node in the node
    let textNodesPos: number = start;
    let foundTextNodes = false;
    tr.doc.nodesBetween($startPos.pos, $startPos.pos + nodeSize, (n, pos) => {
      if (foundTextNodes) {
        return false;
      }
      if (n.isText) {
        textNodesPos = pos;
        foundTextNodes = true;
        return false;
      }
      return true;
    });

    const textNodeDepth = textNodesPos - start;
    return new TextSelection(
      tr.doc.resolve(textNodesPos),
      tr.doc.resolve(start + nodeSize - textNodeDepth),
    );
  }
};
