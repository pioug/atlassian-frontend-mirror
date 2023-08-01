import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import { bindKeymapWithCommand, moveRight, moveLeft } from '../../../keymaps';
import { arrowRight, arrowLeft } from '../commands';

function keymapPlugin() {
  const list = {};

  bindKeymapWithCommand(moveRight.common!, arrowRight, list);

  bindKeymapWithCommand(moveLeft.common!, arrowLeft, list);

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
