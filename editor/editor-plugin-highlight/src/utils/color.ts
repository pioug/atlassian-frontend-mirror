import { REMOVE_HIGHLIGHT_COLOR } from '@atlaskit/editor-common/ui-color';
import type { Mark, MarkType } from '@atlaskit/editor-prosemirror/model';
import type {
  TextSelection,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

export const getActiveColor = (tr: Transaction): string | null => {
  const { $from, $to, $cursor } = tr.selection as TextSelection;

  const { backgroundColor } = tr.doc.type.schema.marks as {
    backgroundColor: MarkType;
  };

  // Filter out other marks
  let marks: Array<Mark | undefined> = [];
  if ($cursor) {
    marks.push(
      backgroundColor.isInSet(tr.storedMarks || $cursor.marks()) || undefined,
    );
  } else {
    tr.doc.nodesBetween($from.pos, $to.pos, currentNode => {
      if (currentNode.isLeaf) {
        const mark = backgroundColor.isInSet(currentNode.marks) || undefined;
        marks.push(mark);
        return !mark;
      }
      return true;
    });
  }

  // Merge consecutive same color marks
  let prevMark: Mark | undefined;
  marks = marks.filter(mark => {
    if (mark && prevMark && mark.attrs.color === prevMark.attrs.color) {
      return false;
    }
    prevMark = mark;
    return true;
  });

  const marksWithColor = marks.filter(mark => !!mark) as Array<Mark>;
  // When multiple colors are selected revert back to default color
  if (
    marksWithColor.length > 1 ||
    (marksWithColor.length === 1 && marks.length > 1)
  ) {
    return null;
  }
  return marksWithColor.length
    ? marksWithColor[0].attrs.color
    : REMOVE_HIGHLIGHT_COLOR;
};
