import { keymap } from 'prosemirror-keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import * as keymaps from '@atlaskit/editor-common/keymaps';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { clearFormattingWithAnalytics } from '../commands/clear-formatting';

export function keymapPlugin(
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin {
  const list = {};
  keymaps.bindKeymapWithCommand(
    keymaps.clearFormatting.common!,
    clearFormattingWithAnalytics(INPUT_METHOD.SHORTCUT, editorAnalyticsAPI),
    list,
  );

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
