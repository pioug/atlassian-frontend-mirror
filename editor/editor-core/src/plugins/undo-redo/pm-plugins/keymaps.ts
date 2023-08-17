import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  undo,
  redo,
  keymap,
  bindKeymapWithCommand,
  findKeyMapForBrowser,
} from '@atlaskit/editor-common/keymaps';
import { redoFromKeyboard, undoFromKeyboard } from '../commands';

export function keymapPlugin(): SafePlugin {
  const list = {};

  bindKeymapWithCommand(findKeyMapForBrowser(redo)!, redoFromKeyboard, list);

  bindKeymapWithCommand(undo.common!, undoFromKeyboard, list);

  return keymap(list);
}
