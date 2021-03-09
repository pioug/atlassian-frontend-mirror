import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { keymap } from '../../../utils/keymap';
import { redoFromKeyboard, undoFromKeyboard } from '../commands';

export function keymapPlugin(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.findKeyMapForBrowser(keymaps.redo)!,
    redoFromKeyboard,
    list,
  );

  keymaps.bindKeymapWithCommand(keymaps.undo.common!, undoFromKeyboard, list);

  return keymap(list);
}
