import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  Command,
  HigherOrderCommand,
} from '@atlaskit/editor-common/types';

/**
 * Creates a filter that checks if the node at a given number of parents above the current
 * selection is of the correct node type.
 * @param nodeType The node type to compare the nth parent against
 * @param depthAway How many levels above the current node to check against. 0 refers to
 * the current selection's parent, which will be the containing node when the selection
 * is usually inside the text content.
 */
const isNthParentOfType = (
  nodeType: string,
  depthAway: number,
): ((state: EditorState, view?: EditorView) => boolean) => {
  return (state: EditorState): boolean => {
    const { $from } = state.selection;
    const parent = $from.node($from.depth - depthAway);

    return !!parent && parent.type === state.schema.nodes[nodeType];
  };
};

const withScrollIntoView: HigherOrderCommand =
  (command: Command): Command =>
  (state, dispatch, view) =>
    command(
      state,
      (tr) => {
        tr.scrollIntoView();
        if (dispatch) {
          dispatch(tr);
        }
      },
      view,
    );

/**
 * Insert content, delete a range and create a new selection
 * This function automatically handles the mapping of positions for insertion and deletion.
 * The new selection is handled as a function since it may not always be necessary to resolve a position to the transactions mapping
 *
 * @param getSelectionResolvedPos get the resolved position to create a new selection
 * @param insertions content to insert at the specified position
 * @param deletions the ranges to delete
 */

const selectNode =
  (pos: number): Command =>
  (state, dispatch) => {
    if (dispatch) {
      dispatch(
        state.tr.setSelection(new NodeSelection(state.doc.resolve(pos))),
      );
    }
    return true;
  };

export { isNthParentOfType, withScrollIntoView, selectNode };
