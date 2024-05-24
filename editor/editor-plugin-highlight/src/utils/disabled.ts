import {
  isMarkAllowedInRange,
  isMarkExcluded,
} from '@atlaskit/editor-common/mark';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import {
  type EditorState,
  NodeSelection,
  type TextSelection,
} from '@atlaskit/editor-prosemirror/state';

export const getDisabledState = (state: EditorState): boolean => {
  const { backgroundColor } = state.schema.marks;
  const { empty, ranges, $cursor } = state.selection as TextSelection;

  if (!backgroundColor) {
    return true;
  }

  if (
    state.selection instanceof NodeSelection ||
    state.selection instanceof GapCursorSelection
  ) {
    return true;
  }

  if (
    (empty && !$cursor) ||
    isMarkAllowedInRange(state.doc, ranges, backgroundColor) === false
  ) {
    return true;
  }
  if (
    isMarkExcluded(
      backgroundColor,
      state.storedMarks || ($cursor && $cursor.marks()),
    )
  ) {
    return true;
  }
  return false;
};
