import { EditorState, TextSelection } from 'prosemirror-state';

import { isMarkAllowedInRange, isMarkExcluded } from '../../../utils/mark';

export const getDisabledState = (state: EditorState): boolean => {
  const { textColor } = state.schema.marks;
  if (textColor) {
    const { empty, ranges, $cursor } = state.selection as TextSelection;
    if (
      (empty && !$cursor) ||
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
