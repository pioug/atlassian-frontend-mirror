import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import * as keymaps from '../../../../keymaps';
import { openMediaAltTextMenu, closeMediaAltTextMenu } from './commands';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

export default function keymapPlugin(
  schema: Schema,
  editorAnalyticsAPI?: EditorAnalyticsAPI | undefined,
): SafePlugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.addAltText.common!,
    openMediaAltTextMenu(editorAnalyticsAPI),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.escape.common!,
    closeMediaAltTextMenu,
    list,
  );

  return keymap(list) as SafePlugin;
}
