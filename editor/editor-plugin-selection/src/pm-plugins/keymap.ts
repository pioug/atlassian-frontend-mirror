import {
  bindKeymapWithCommand,
  moveLeft,
  moveRight,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { arrowLeft, arrowRight } from '../commands';

function keymapPlugin() {
  const list = {};

  bindKeymapWithCommand(moveRight.common!, arrowRight, list);

  bindKeymapWithCommand(moveLeft.common!, arrowLeft, list);

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
