import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { bindKeymapWithCommand, alignLeft, alignRight } from '../../../keymaps';
import { changeAlignment } from '../commands';

export function keymapPlugin(): SafePlugin {
  const list = {};

  bindKeymapWithCommand(alignLeft.common!, changeAlignment('start'), list);

  bindKeymapWithCommand(alignRight.common!, changeAlignment('end'), list);

  return keymap(list) as SafePlugin;
}
