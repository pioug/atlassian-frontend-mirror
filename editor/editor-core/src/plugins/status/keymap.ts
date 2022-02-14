import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import * as keymaps from '../../keymaps';
import { Command } from '../../types';

import { mayGetStatusAtSelection } from './utils';

export function keymapPlugin(): SafePlugin {
  const list = {};
  keymaps.bindKeymapWithCommand(keymaps.enter.common!, consumeKeyEvent, list);
  keymaps.bindKeymapWithCommand(keymaps.tab.common!, consumeKeyEvent, list);
  return keymap(list) as SafePlugin;
}

// consume event to prevent status node problems with positioning and selection
const consumeKeyEvent: Command = (state, _dispatch) =>
  !!mayGetStatusAtSelection(state.tr.selection);

export default keymapPlugin;
