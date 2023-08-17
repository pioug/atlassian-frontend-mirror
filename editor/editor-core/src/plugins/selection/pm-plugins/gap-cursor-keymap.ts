import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  bindKeymapWithCommand,
  insertNewLine,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  backspace,
  deleteKey,
} from '@atlaskit/editor-common/keymaps';
import { arrow, deleteNode } from '../gap-cursor/actions';
import { Direction } from '../gap-cursor/direction';
import { GapCursorSelection } from '../gap-cursor/selection';
import { createParagraphNear } from '@atlaskit/editor-prosemirror/commands';

export default function keymapPlugin(): SafePlugin {
  const map = {};

  bindKeymapWithCommand(
    insertNewLine.common!,
    (state, dispatch, view) => {
      const isInGapCursor = state.selection instanceof GapCursorSelection;
      // Only operate in gap cursor
      if (!isInGapCursor) {
        return false;
      }
      return createParagraphNear(state, dispatch);
    },
    map,
  );

  bindKeymapWithCommand(
    moveLeft.common!,
    (state, dispatch, view) => {
      const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
      return arrow(Direction.LEFT, endOfTextblock)(state, dispatch, view);
    },
    map,
  );

  bindKeymapWithCommand(
    moveRight.common!,
    (state, dispatch, view) => {
      const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
      return arrow(Direction.RIGHT, endOfTextblock)(state, dispatch);
    },
    map,
  );

  bindKeymapWithCommand(
    moveUp.common!,
    (state, dispatch, view) => {
      const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
      return arrow(Direction.UP, endOfTextblock)(state, dispatch);
    },
    map,
  );

  bindKeymapWithCommand(
    moveDown.common!,
    (state, dispatch, view) => {
      const endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
      return arrow(Direction.DOWN, endOfTextblock)(state, dispatch);
    },
    map,
  );

  // default PM's Backspace doesn't handle removing block nodes when cursor is after it
  bindKeymapWithCommand(backspace.common!, deleteNode(Direction.BACKWARD), map);

  // handle Delete key (remove node after the cursor)
  bindKeymapWithCommand(deleteKey.common!, deleteNode(Direction.FORWARD), map);

  return keymap(map) as SafePlugin;
}
