import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import {
  bindKeymapWithCommand,
  findShortcutByKeymap,
  outdent,
  indent,
  backspace,
} from '@atlaskit/editor-common/keymaps';
import { isTextSelection } from '../../../utils';
import { getIndentCommand, getOutdentCommand } from '../commands';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';

export function keymapPlugin(): SafePlugin | undefined {
  const list = {};

  bindKeymapWithCommand(
    findShortcutByKeymap(indent)!,
    getIndentCommand(INPUT_METHOD.KEYBOARD),
    list,
  );

  bindKeymapWithCommand(
    findShortcutByKeymap(outdent)!,
    getOutdentCommand(INPUT_METHOD.KEYBOARD),
    list,
  );

  bindKeymapWithCommand(
    findShortcutByKeymap(backspace)!,
    (state, dispatch) => {
      const { selection } = state;
      if (
        isTextSelection(selection) &&
        selection.$cursor &&
        selection.$cursor.parentOffset === 0
      ) {
        return dispatch
          ? getOutdentCommand(INPUT_METHOD.KEYBOARD)(state, dispatch)
          : false;
      }
      return false;
    },
    list,
  );

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
