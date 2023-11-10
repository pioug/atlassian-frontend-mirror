import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { bindKeymapWithCommand, find as findKeymap } from '../../keymaps';
import { activateWithAnalytics } from './commands-with-analytics';
import type { Command } from '../../types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';

const activateFindReplace =
  (editorAnalyticsAPI: EditorAnalyticsAPI | undefined): Command =>
  (state, dispatch) => {
    activateWithAnalytics(editorAnalyticsAPI)({
      triggerMethod: TRIGGER_METHOD.SHORTCUT,
    })(state, dispatch);
    return true;
  };

const keymapPlugin = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) => {
  const list = {};
  bindKeymapWithCommand(
    findKeymap.common!,
    activateFindReplace(editorAnalyticsAPI),
    list,
  );
  return keymap(list) as SafePlugin;
};

export default keymapPlugin;
