import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import * as keymaps from '../../../keymaps';
import { isTextSelection } from '../../../utils';
import { indent, outdent } from '../commands';

export function keymapPlugin(): SafePlugin | undefined {
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

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
