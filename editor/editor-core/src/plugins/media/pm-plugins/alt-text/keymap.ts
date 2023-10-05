import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  addAltText,
  bindKeymapWithCommand,
  escape,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

import { closeMediaAltTextMenu, openMediaAltTextMenu } from './commands';

export default function keymapPlugin(
  schema: Schema,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    addAltText.common!,
    openMediaAltTextMenu(editorAnalyticsAPI),
    list,
  );

  bindKeymapWithCommand(escape.common!, closeMediaAltTextMenu, list);

  return keymap(list) as SafePlugin;
}
