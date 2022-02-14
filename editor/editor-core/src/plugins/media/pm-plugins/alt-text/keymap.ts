import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import * as keymaps from '../../../../keymaps';
import { openMediaAltTextMenu, closeMediaAltTextMenu } from './commands';

export default function keymapPlugin(schema: Schema): SafePlugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.addAltText.common!,
    openMediaAltTextMenu,
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.escape.common!,
    closeMediaAltTextMenu,
    list,
  );

  return keymap(list) as SafePlugin;
}
