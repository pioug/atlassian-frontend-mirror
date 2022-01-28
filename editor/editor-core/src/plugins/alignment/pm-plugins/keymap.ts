import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import { bindKeymapWithCommand, alignLeft, alignRight } from '../../../keymaps';
import { changeAlignment } from '../commands';

export function keymapPlugin(): Plugin {
  const list = {};

  bindKeymapWithCommand(alignLeft.common!, changeAlignment('start'), list);

  bindKeymapWithCommand(alignRight.common!, changeAlignment('end'), list);

  return keymap(list);
}
