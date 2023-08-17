import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { getPluginState } from './main';
import { bindKeymapWithCommand, escape } from '@atlaskit/editor-common/keymaps';
import { clearEditingContext } from '../commands';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';

export default function keymapPlugin(
  applyChange: ApplyChangeHandler | undefined,
): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    escape.common!,
    (state, dispatch) => {
      const extensionState = getPluginState(state);

      if (!extensionState.showContextPanel) {
        return false;
      }

      return clearEditingContext(applyChange)(state, dispatch);
    },
    list,
  );

  return keymap(list) as SafePlugin;
}
