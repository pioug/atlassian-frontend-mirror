import { Mark, MarkType } from 'prosemirror-model';
import { EditorState, TextSelection } from 'prosemirror-state';

import { N800 } from '@atlaskit/theme/colors';

export const DEFAULT_COLOR = {
  color: N800.toLowerCase(),
  label: 'Dark gray',
};

export const getActiveColor = (state: EditorState): string | null => {
  const { $from, $to, $cursor } = state.selection as TextSelection;
  const { textColor } = state.schema.marks as { textColor: MarkType };

  // Filter out other marks
  let marks: Array<Mark | undefined> = [];
  if ($cursor) {
    marks.push(
      textColor.isInSet(state.storedMarks || $cursor.marks()) || undefined,
    );
  } else {
    state.doc.nodesBetween($from.pos, $to.pos, (currentNode) => {
      if (currentNode.isLeaf) {
        const mark = textColor.isInSet(currentNode.marks) || undefined;
        marks.push(mark);
        return !mark;
      }
      return true;
    });
  }

  // Merge consecutive same color marks
  let prevMark: Mark | undefined;
  marks = marks.filter((mark) => {
    if (mark && prevMark && mark.attrs.color === prevMark.attrs.color) {
      return false;
    }
    prevMark = mark;
    return true;
  });

  const marksWithColor = marks.filter((mark) => !!mark) as Array<Mark>;
  // When multiple colors are selected revert back to default color
  if (
    marksWithColor.length > 1 ||
    (marksWithColor.length === 1 && marks.length > 1)
  ) {
    return null;
  }
  return marksWithColor.length
    ? marksWithColor[0].attrs.color
    : DEFAULT_COLOR.color;
};
