import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { bindKeymapWithCommand, find as findKeymap } from '../../keymaps';
import { activateWithAnalytics } from './commands-with-analytics';
import type { Command } from '../../types';
import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';

const activateFindReplace = (): Command => (state, dispatch) => {
  activateWithAnalytics({ triggerMethod: TRIGGER_METHOD.SHORTCUT })(
    state,
    dispatch,
  );
  return true;
};

const keymapPlugin = () => {
  const list = {};
  bindKeymapWithCommand(findKeymap.common!, activateFindReplace(), list);
  return keymap(list) as SafePlugin;
};

export default keymapPlugin;
