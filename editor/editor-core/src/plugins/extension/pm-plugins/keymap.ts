import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { getPluginState } from './main';
import * as keymaps from '../../../keymaps';
import { clearEditingContext } from '../commands';

export default function keymapPlugin(): SafePlugin {
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

  return keymap(list) as SafePlugin;
}
