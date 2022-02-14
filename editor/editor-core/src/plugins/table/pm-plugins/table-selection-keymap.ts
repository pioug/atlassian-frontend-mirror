import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import { bindKeymapWithCommand, moveRight, moveLeft } from '../../../keymaps';
import { arrowLeftFromTable, arrowRightFromTable } from '../commands/selection';

export function tableSelectionKeymapPlugin(): SafePlugin {
  const list = {};

  bindKeymapWithCommand(moveRight.common!, arrowRightFromTable, list);

  bindKeymapWithCommand(moveLeft.common!, arrowLeftFromTable, list);

  return keymap(list) as SafePlugin;
}

export default tableSelectionKeymapPlugin;
