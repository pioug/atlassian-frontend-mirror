import { EditorState, TextSelection } from 'prosemirror-state';

import { isMarkAllowedInRange, isMarkExcluded } from '../../../utils/mark';
import { ResolvedPos } from 'prosemirror-model';

const hasLinkMark = ($pos: ResolvedPos): boolean => {
  const {
    doc: {
      type: {
        schema: {
          marks: { link: linkMarkType },
        },
      },
    },
    pos,
  } = $pos;

  if (!linkMarkType) {
    return false;
  }

  return $pos.doc.rangeHasMark(
    pos,
    Math.min(pos + 1, $pos.doc.content.size),
    linkMarkType,
  );
};

export const getDisabledState = (state: EditorState): boolean => {
  const { textColor } = state.schema.marks;
  if (textColor) {
    const { empty, ranges, $cursor } = state.selection as TextSelection;
    if (
      (empty && !$cursor) ||
      ($cursor && hasLinkMark($cursor)) ||
      isMarkAllowedInRange(state.doc, ranges, textColor) === false
    ) {
      return true;
    }

    if (
      isMarkExcluded(
        textColor,
        state.storedMarks || ($cursor && $cursor.marks()),
      )
    ) {
      return true;
    }

    return false;
  }

  return true;
};
