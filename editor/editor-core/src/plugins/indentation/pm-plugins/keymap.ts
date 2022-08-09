import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import * as keymaps from '../../../keymaps';
import { isTextSelection } from '../../../utils';
import { getIndentCommand, getOutdentCommand } from '../commands';
import { INPUT_METHOD } from '../../analytics';

export function keymapPlugin(): SafePlugin | undefined {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.indent)!,
    getIndentCommand(INPUT_METHOD.KEYBOARD),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.outdent)!,
    getOutdentCommand(INPUT_METHOD.KEYBOARD),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.backspace)!,
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
