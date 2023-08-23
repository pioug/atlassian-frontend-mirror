import type { Mark, Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

type NodesSanitized = Array<{
  node: Node;
  marksRemoved: Mark[];
}>;

export const sanitiseMarksInSelection = (
  tr: Transaction,
  newParentType?: NodeType,
): NodesSanitized => {
  const { from, to } = tr.selection;
  const nodesSanitized: NodesSanitized = [];

  tr.doc.nodesBetween(from, to, (node, pos, parent) => {
    if (node.isText) {
      return false;
    }
    // Skip expands and layouts if they are outside selection
    // but continue to iterate over their children.
    if (
      ['expand', 'layoutSection'].includes(node.type.name) &&
      (pos < from || pos > to)
    ) {
      return true;
    }
    node.marks.forEach(mark => {
      if (
        !parent?.type.allowsMarkType(mark.type) ||
        (newParentType && !newParentType.allowsMarkType(mark.type))
      ) {
        const filteredMarks = node.marks.filter(m => m.type !== mark.type);
        const position = pos > 0 ? pos : 0;

        const marksRemoved = node.marks.filter(m => m.type === mark.type);
        nodesSanitized.push({
          node,
          marksRemoved,
        });
        tr.setNodeMarkup(position, undefined, node.attrs, filteredMarks);
      }
    });
  });

  return nodesSanitized;
};
