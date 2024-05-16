import {
  NodeSelection,
  TextSelection,
  type Transaction,
} from '@atlaskit/editor-prosemirror/state';

export const getSelection = (tr: Transaction, start: number) => {
  const node = tr.doc.nodeAt(start);
  const isNodeSelection = node && NodeSelection.isSelectable(node);
  const nodeSize = node ? node.nodeSize : 1;
  const depth = tr.doc.resolve(start).depth;

  const selection = isNodeSelection
    ? new NodeSelection(tr.doc.resolve(start))
    : new TextSelection(
        tr.doc.resolve(start),
        tr.doc.resolve(start + nodeSize - depth),
      );

  return selection;
};
