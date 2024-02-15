import {
  alignLeft,
  bindKeymapWithCommand,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { changeAlignment } from '../commands';

export function keymapPlugin(): SafePlugin {
  const list = {};

  bindKeymapWithCommand(alignLeft.common!, changeAlignment('start'), list);

  return keymap(list) as SafePlugin;
}
