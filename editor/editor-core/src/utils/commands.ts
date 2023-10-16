import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  Command,
  HigherOrderCommand,
} from '@atlaskit/editor-common/types';

/**
 * Creates a filter that checks if the node at a given number of parents above the current
 * selection is of the correct node type.
 *
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

export { isNthParentOfType, withScrollIntoView };
