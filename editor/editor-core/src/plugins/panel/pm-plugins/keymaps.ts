import { keymap } from 'prosemirror-keymap';
import { ResolvedPos } from 'prosemirror-model';
import { Transaction, Plugin } from 'prosemirror-state';
import { setTextSelection } from 'prosemirror-utils';
import { Command } from '../../../types';

// Somewhat broken and subverted: https://product-fabric.atlassian.net/browse/ED-6504
export function keymapPlugin(): Plugin | undefined {
  const deleteCurrentItem = ($from: ResolvedPos, tr: Transaction) => {
    return tr.delete($from.before($from.depth) - 1, $from.end($from.depth) + 1);
  };

  const keymaps: Record<string, Command> = {
    Backspace: (state, dispatch) => {
      const {
        selection,
        schema: { nodes },
        tr,
      } = state;
      const { panel } = nodes;

      const { $from, $to } = selection;
      // Don't do anything if selection is a range
      if ($from.pos !== $to.pos) {
        return false;
      }

      // If not at the start of a panel, no joining will happen so allow default behaviour (backspacing characters etc..)
      if ($from.parentOffset !== 0) {
        return false;
      }

      const previousPos = tr.doc.resolve(
        Math.max(0, $from.before($from.depth) - 1),
      );

      const previousNodeType =
        previousPos.pos > 0 && previousPos.parent && previousPos.parent.type;
      const parentNodeType = $from.parent.type;
      const isPreviousNodeAPanel = previousNodeType === panel;
      const isParentNodeAPanel = parentNodeType === panel;

      // Stops merging panels when deleting empty paragraph in between
      if (isPreviousNodeAPanel && !isParentNodeAPanel) {
        const content = $from.node($from.depth).content;
        const insertPos = previousPos.pos - 1;
        deleteCurrentItem($from, tr).insert(insertPos, content);
        if (dispatch) {
          dispatch(setTextSelection(insertPos)(tr).scrollIntoView());
        }
        return true;
      }

      const nodeType = $from.node().type;
      if (nodeType !== panel) {
        return false;
      }

      return true;
    },
  };
  return keymap(keymaps);
}

export default keymapPlugin;
