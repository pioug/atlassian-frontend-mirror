import { TextSelection } from 'prosemirror-state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';

import { Command } from '../../../types';
import { ACTIONS, pluginKey } from '../pm-plugins/main';

export const removeColor = (): Command => (state, dispatch) => {
  const { schema, selection } = state;
  const { textColor } = schema.marks;

  let tr = state.tr;

  if (selection instanceof TextSelection) {
    const { from, to, $cursor } = selection;

    if ($cursor) {
      tr = state.tr.removeStoredMark(textColor);
    } else {
      tr = state.tr.removeMark(from, to, textColor);
    }
  }

  if (selection instanceof CellSelection) {
    /**
     * This is a slight abstraction from `src/utils/commands.ts`
     * The main difference is we can't toggle the default from another (since they are different marks),
     * we want to remove all text color marks on the selection, so we slightly modify the cell selection
     * part here.
     */
    selection.forEachCell((cell, cellPos) => {
      const from = cellPos;
      const to = cellPos + cell.nodeSize;

      tr.doc.nodesBetween(
        tr.mapping.map(from),
        tr.mapping.map(to),
        (node, pos) => {
          if (!node.isText) {
            return true;
          }

          // This is an issue when the user selects some text.
          // We need to check if the current node position is less than the range selection from.
          // If it’s true, that means we should apply the mark using the range selection,
          // not the current node position.
          const nodeBetweenFrom = Math.max(pos, tr.mapping.map(from));
          const nodeBetweenTo = Math.min(
            pos + node.nodeSize,
            tr.mapping.map(to),
          );

          tr.removeMark(nodeBetweenFrom, nodeBetweenTo, textColor);

          return true;
        },
      );
    });
  }

  if (dispatch) {
    dispatch(tr.setMeta(pluginKey, { action: ACTIONS.RESET_COLOR }));
  }
  return true;
};
