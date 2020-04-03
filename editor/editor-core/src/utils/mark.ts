import { Node, Mark, MarkType, NodeType } from 'prosemirror-model';
import { SelectionRange, EditorState, Transaction } from 'prosemirror-state';

export const isMarkAllowedInRange = (
  doc: Node,
  ranges: Array<SelectionRange>,
  type: MarkType,
): boolean => {
  for (let i = 0; i < ranges.length; i++) {
    const { $from, $to } = ranges[i];
    let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, node => {
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
  marks?: Array<Mark> | null,
): boolean => {
  if (marks) {
    return marks.some(mark => mark.type !== type && mark.type.excludes(type));
  }
  return false;
};

const not = <T>(fn: (args: T) => boolean) => (arg: T) => !fn(arg);

export const removeBlockMarks = (
  state: EditorState,
  marks: Array<MarkType | undefined>,
): Transaction | undefined => {
  const { selection, schema } = state;
  let { tr } = state;

  // Marks might not exist in Schema
  const marksToRemove = marks.filter(Boolean);
  if (marksToRemove.length === 0) {
    return undefined;
  }

  /** Saves an extra dispatch */
  let blockMarksExists = false;

  const hasMark = (mark: Mark) => marksToRemove.indexOf(mark.type) > -1;
  /**
   * When you need to toggle the selection
   * when another type which does not allow alignment is applied
   */
  state.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
    if (node.type === schema.nodes.paragraph && node.marks.some(hasMark)) {
      blockMarksExists = true;
      const resolvedPos = state.doc.resolve(pos);
      const withoutBlockMarks = node.marks.filter(not(hasMark));
      tr = tr.setNodeMarkup(
        resolvedPos.pos,
        undefined,
        node.attrs,
        withoutBlockMarks,
      );
    }
  });
  return blockMarksExists ? tr : undefined;
};

/**
 * Removes marks from nodes in the current selection that are not supported
 */
export const sanitiseSelectionMarksForWrapping = (
  state: EditorState,
  newParentType?: NodeType,
): Transaction | undefined => {
  let tr: Transaction | undefined;
  const { from, to } = state.tr.selection;

  state.doc.nodesBetween(
    from,
    to,
    (node, pos, parent) => {
      // If iterate over a node thats out of our defined range
      // We skip here but continue to iterate over its children.
      if (node.isText || pos < from || pos > to) {
        return true;
      }
      node.marks.forEach(mark => {
        if (
          !parent.type.allowsMarkType(mark.type) ||
          (newParentType && !newParentType.allowsMarkType(mark.type))
        ) {
          const filteredMarks = node.marks.filter(m => m.type !== mark.type);
          const position = pos > 0 ? pos - 1 : 0;
          tr = (tr || state.tr).setNodeMarkup(
            position,
            undefined,
            node.attrs,
            filteredMarks,
          );
        }
      });
    },
    from,
  );
  return tr;
};
