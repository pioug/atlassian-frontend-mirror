import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import * as keymaps from '../../../keymaps';
import { keymap } from '@atlaskit/editor-common/keymaps';
import { redoFromKeyboard, undoFromKeyboard } from '../commands';

export function keymapPlugin(): SafePlugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.findKeyMapForBrowser(keymaps.redo)!,
    redoFromKeyboard,
    list,
  );

  keymaps.bindKeymapWithCommand(keymaps.undo.common!, undoFromKeyboard, list);

  return keymap(list);
}
