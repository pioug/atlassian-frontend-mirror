import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
  bindKeymapWithCommand,
  escape,
  insertRule,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';

import { insertHorizontalRule } from '../commands';

export function keymapPlugin(
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    insertRule.common!,
    insertHorizontalRule(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
    list,
  );

  bindKeymapWithCommand(escape.common!, () => true, list);

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
