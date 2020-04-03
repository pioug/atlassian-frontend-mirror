import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';

import * as keymaps from '../../../keymaps';
import { stateKey } from '../pm-plugins/plugin-key';
import { Command } from '../../../types';
import { MediaPluginState } from './types';

export function keymapPlugin(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(keymaps.undo.common!, ignoreLinksInSteps, list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common!, splitMediaGroup, list);
  keymaps.bindKeymapWithCommand(
    keymaps.insertNewLine.common!,
    splitMediaGroup,
    list,
  );

  return keymap(list);
}

const ignoreLinksInSteps: Command = state => {
  const mediaPluginState = stateKey.getState(state) as MediaPluginState;
  mediaPluginState.ignoreLinks = true;
  return false;
};

const splitMediaGroup: Command = state => {
  const mediaPluginState = stateKey.getState(state) as MediaPluginState;
  return mediaPluginState.splitMediaGroup();
};

export default keymapPlugin;
