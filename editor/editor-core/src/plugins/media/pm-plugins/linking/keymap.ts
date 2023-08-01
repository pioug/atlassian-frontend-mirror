import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
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
