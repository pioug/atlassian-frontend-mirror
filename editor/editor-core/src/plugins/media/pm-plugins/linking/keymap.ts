import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import * as keymaps from '../../../../keymaps';
import { showLinkingToolbarWithMediaTypeCheck } from '../../commands/linking';

export default function keymapPlugin(schema: Schema): SafePlugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.addLink.common!,
    showLinkingToolbarWithMediaTypeCheck,
    list,
  );

  return keymap(list) as SafePlugin;
}
