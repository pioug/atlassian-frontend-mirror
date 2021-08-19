import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';

import * as keymaps from '../../../keymaps';
import { INPUT_METHOD } from '../../analytics';
import { insertHorizontalRule } from '../commands';

export function keymapPlugin(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.insertRule.common!,
    insertHorizontalRule(INPUT_METHOD.SHORTCUT),
    list,
  );

  keymaps.bindKeymapWithCommand(keymaps.escape.common!, () => true, list);

  return keymap(list);
}

export default keymapPlugin;
