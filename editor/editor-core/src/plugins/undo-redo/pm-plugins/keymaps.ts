import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  undo,
  redo,
  bindKeymapWithCommand,
  findKeyMapForBrowser,
  isCapsLockOnAndModifyKeyboardEvent,
} from '@atlaskit/editor-common/keymaps';
import { redoFromKeyboard, undoFromKeyboard } from '../commands';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';

export function keymapPlugin(): SafePlugin {
  const list = {};

  bindKeymapWithCommand(findKeyMapForBrowser(redo)!, redoFromKeyboard, list);

  bindKeymapWithCommand(undo.common!, undoFromKeyboard, list);

  return new SafePlugin({
    props: {
      handleKeyDown(view, event) {
        let keyboardEvent = isCapsLockOnAndModifyKeyboardEvent(event);
        return keydownHandler(list)(view, keyboardEvent);
      },
    },
  });
}
