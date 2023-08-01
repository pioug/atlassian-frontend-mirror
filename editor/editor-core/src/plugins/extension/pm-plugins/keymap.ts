import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { getPluginState } from './main';
import * as keymaps from '../../../keymaps';
import { clearEditingContext } from '../commands';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';

export default function keymapPlugin(
  applyChange: ApplyChangeHandler | undefined,
): SafePlugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.escape.common!,
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
