import type { Command } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';

// We should override default behaviour when selection spans node depths or
// ends at a node junction
const shouldMoveCursorAfterDelete = (state: EditorState) => {
  const {
    selection: { $from, $to },
  } = state;

  const nodeRange = $from.blockRange($to);

  if (!nodeRange) {
    return false;
  }

  const hasSameAncestor =
    $from.depth === $to.depth && $from.depth - 1 === nodeRange.depth;

  const toPositionHasNodeAfter = !!$to.nodeAfter;

  if (hasSameAncestor || toPositionHasNodeAfter) {
    return false;
  }

  return true;
};

/**
 * Fixes cursor position after delete for list/task in panel and table
 *
 * ED-13873 fixes a bug where after deleting a list the cursor would move
 * to the cell to the right. Uses setSelection to position the cursor as expected after deleting.
 *
 * @param state EditorState
 * @param dispatch CommandDispatch
 * @returns boolean
 */
export const deleteAndMoveCursor: Command = (state, dispatch) => {
  if (state.selection.empty || !(state.selection instanceof TextSelection)) {
    return false;
  }

  if (!shouldMoveCursorAfterDelete(state)) {
    return false;
  }

  const { tr } = state;

  tr.deleteSelection();

  // Make sure the next position is not out of boundaries
  const previousPosition = Math.min(
    Math.max(state.selection.$from.pos, 0),
    tr.doc.content.size,
  );
  // Override default delete behaviour that moves the cursor to first suitable position after selection (postive bias).
  // See. selectionToInsertionEnd. We will override behavior with negative bias (search for suitable cursor position backwards).
  tr.setSelection(Selection.near(tr.doc.resolve(previousPosition), -1));

  if (dispatch) {
    dispatch(tr.scrollIntoView());
  }

  return true;
};
