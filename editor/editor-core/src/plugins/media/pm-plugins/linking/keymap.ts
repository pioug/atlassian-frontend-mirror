import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  bindKeymapWithCommand,
  addLink,
} from '@atlaskit/editor-common/keymaps';
import { showLinkingToolbarWithMediaTypeCheck } from '../../commands/linking';

export default function keymapPlugin(schema: Schema): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    addLink.common!,
    showLinkingToolbarWithMediaTypeCheck,
    list,
  );

  return keymap(list) as SafePlugin;
}
