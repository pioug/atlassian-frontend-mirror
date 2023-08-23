import type { Node, Mark, MarkType } from '@atlaskit/editor-prosemirror/model';
import type { SelectionRange } from '@atlaskit/editor-prosemirror/state';

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
