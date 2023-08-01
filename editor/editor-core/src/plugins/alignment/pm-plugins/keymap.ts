import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { bindKeymapWithCommand, alignLeft } from '../../../keymaps';
import { changeAlignment } from '../commands';

export function keymapPlugin(): SafePlugin {
  const list = {};

  bindKeymapWithCommand(alignLeft.common!, changeAlignment('start'), list);

  return keymap(list) as SafePlugin;
}
