import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';
import type {
  Command,
  HigherOrderCommand,
} from '@atlaskit/editor-common/types';

const isFirstChildOfParent = (state: EditorState): boolean => {
  const { $from } = state.selection;
  return $from.depth > 1
    ? (state.selection instanceof GapCursorSelection &&
        $from.parentOffset === 0) ||
        $from.index($from.depth - 1) === 0
    : true;
};

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

// https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js#L90
// Keep going left up the tree, without going across isolating boundaries, until we
// can go along the tree at that same level
//
// You can think of this as, if you could construct each document like we do in the tests,
// return the position of the first ) backwards from the current selection.
function findCutBefore($pos: ResolvedPos): ResolvedPos | null {
  // parent is non-isolating, so we can look across this boundary
  if (!$pos.parent.type.spec.isolating) {
    // search up the tree from the pos's *parent*
    for (let i = $pos.depth - 1; i >= 0; i--) {
      // starting from the inner most node's parent, find out
      // if we're not its first child
      if ($pos.index(i) > 0) {
        return $pos.doc.resolve($pos.before(i + 1));
      }

      if ($pos.node(i).type.spec.isolating) {
        break;
      }
    }
  }

  return null;
}

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

export {
  isFirstChildOfParent,
  isNthParentOfType,
  findCutBefore,
  withScrollIntoView,
  selectNode,
};
