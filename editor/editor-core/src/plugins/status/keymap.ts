import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import { bindKeymapWithCommand, enter, tab } from '../../keymaps';
import type { Command } from '../../types';

import { mayGetStatusAtSelection } from './utils';

export function keymapPlugin(): SafePlugin {
  const list = {};
  bindKeymapWithCommand(enter.common!, consumeKeyEvent, list);
  bindKeymapWithCommand(tab.common!, consumeKeyEvent, list);
  return keymap(list) as SafePlugin;
}

// consume event to prevent status node problems with positioning and selection
const consumeKeyEvent: Command = (state, _dispatch) =>
  !!mayGetStatusAtSelection(state.tr.selection);

export default keymapPlugin;
