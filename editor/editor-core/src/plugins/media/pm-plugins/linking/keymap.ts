import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../../keymaps';
import { showLinkingToolbarWithMediaTypeCheck } from '../../commands/linking';

export default function keymapPlugin(schema: Schema): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.addLink.common!,
    showLinkingToolbarWithMediaTypeCheck,
    list,
  );

  return keymap(list);
}
