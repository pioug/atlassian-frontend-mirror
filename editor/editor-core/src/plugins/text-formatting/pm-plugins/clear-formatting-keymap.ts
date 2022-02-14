import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import * as keymaps from '../../../keymaps';
import { INPUT_METHOD } from '../../analytics';
import { clearFormattingWithAnalytics } from '../commands/clear-formatting';

export function keymapPlugin(): SafePlugin {
  const list = {};
  keymaps.bindKeymapWithCommand(
    keymaps.clearFormatting.common!,
    clearFormattingWithAnalytics(INPUT_METHOD.SHORTCUT),
    list,
  );

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
