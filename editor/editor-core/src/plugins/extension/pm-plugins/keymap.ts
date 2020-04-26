import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import { getPluginState } from './main';
import * as keymaps from '../../../keymaps';
import { clearEditingContext } from '../commands';

export default function keymapPlugin(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.escape.common!,
    (state, dispatch) => {
      const extensionState = getPluginState(state);

      if (!extensionState.showContextPanel) {
        return false;
      }

      return clearEditingContext(state, dispatch);
    },
    list,
  );

  return keymap(list);
}
