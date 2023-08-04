import type {
  Node,
  Mark,
  MarkType,
  NodeType,
} from '@atlaskit/editor-prosemirror/model';
import type {
  SelectionRange,
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

export const isMarkAllowedInRange = (
  doc: Node,
  ranges: readonly SelectionRange[],
  type: MarkType,
): boolean => {
  for (let i = 0; i < ranges.length; i++) {
    const { $from, $to } = ranges[i];
    let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, (node) => {
      if (can) {
        return false;
      }
      can = node.inlineContent && node.type.allowsMarkType(type);
      return;
    });
    if (can) {
      return can;
    }
  }
  return false;
};

export const isMarkExcluded = (
  type: MarkType,
  marks?: readonly Mark[] | null,
): boolean => {
  if (marks) {
    return marks.some((mark) => mark.type !== type && mark.type.excludes(type));
  }
  return false;
};

/**
 * Removes marks from nodes in the current selection that are not supported
 */
export const sanitiseSelectionMarksForWrapping = (
  state: EditorState,
  newParentType?: NodeType,
): Transaction | undefined => {
  const { tr } = state;
  sanitiseMarksInSelection(tr, newParentType);
  return tr;
};

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
    node.marks.forEach((mark) => {
      if (
        !parent?.type.allowsMarkType(mark.type) ||
        (newParentType && !newParentType.allowsMarkType(mark.type))
      ) {
        const filteredMarks = node.marks.filter((m) => m.type !== mark.type);
        const position = pos > 0 ? pos : 0;

        const marksRemoved = node.marks.filter((m) => m.type === mark.type);
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
