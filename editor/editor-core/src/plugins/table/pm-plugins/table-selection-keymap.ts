import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';

import { bindKeymapWithCommand, moveRight, moveLeft } from '../../../keymaps';
import { arrowLeftFromTable, arrowRightFromTable } from '../commands/selection';

export function tableSelectionKeymapPlugin(): Plugin {
  const list = {};

  bindKeymapWithCommand(moveRight.common!, arrowRightFromTable, list);

  bindKeymapWithCommand(moveLeft.common!, arrowLeftFromTable, list);

  return keymap(list);
}

export default tableSelectionKeymapPlugin;
