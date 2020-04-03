import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../../keymaps';
import { showLinkingToolbar } from '../../commands/linking';

export default function keymapPlugin(schema: Schema): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.addLink.common!,
    showLinkingToolbar,
    list,
  );

  return keymap(list);
}
