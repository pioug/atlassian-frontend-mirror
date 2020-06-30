import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';

import { trackAndInvoke } from '../../../analytics';
import * as keymaps from '../../../keymaps';
import { INPUT_METHOD } from '../../analytics';
import { clearFormattingWithAnalytics } from '../commands/clear-formatting';

export function keymapPlugin(): Plugin {
  const list = {};
  keymaps.bindKeymapWithCommand(
    keymaps.clearFormatting.common!,
    trackAndInvoke(
      'atlassian.editor.format.clear.keyboard',
      clearFormattingWithAnalytics(INPUT_METHOD.SHORTCUT),
    ),
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
