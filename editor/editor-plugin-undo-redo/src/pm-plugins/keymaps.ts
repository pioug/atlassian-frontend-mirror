import {
  bindKeymapWithCommand,
  findKeyMapForBrowser,
  isCapsLockOnAndModifyKeyboardEvent,
  redo,
  undo,
} from '@atlaskit/editor-common/keymaps';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keydownHandler } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { redoFromKeyboard, undoFromKeyboard } from '../commands';

export function keymapPlugin(): SafePlugin {
  const list = {};

  bindKeymapWithCommand(findKeyMapForBrowser(redo)!, redoFromKeyboard, list);

  bindKeymapWithCommand(undo.common!, undoFromKeyboard, list);

  return new SafePlugin({
    props: {
      handleKeyDown(view: EditorView, event: KeyboardEvent) {
        let keyboardEvent = isCapsLockOnAndModifyKeyboardEvent(event);
        return keydownHandler(list)(view, keyboardEvent);
      },
    },
  });
}
