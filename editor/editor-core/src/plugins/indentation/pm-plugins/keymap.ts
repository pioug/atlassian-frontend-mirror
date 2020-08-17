import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';

import * as keymaps from '../../../keymaps';
import { isTextSelection } from '../../../utils';
import { indent, outdent } from '../commands';

export function keymapPlugin(): Plugin | undefined {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.indent)!,
    indent,
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.outdent)!,
    outdent,
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
        return dispatch ? outdent(state, dispatch) : false;
      }
      return false;
    },
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
