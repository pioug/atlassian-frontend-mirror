import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import {
  bindKeymapWithCommand,
  insertRule,
  escape,
} from '@atlaskit/editor-common/keymaps';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { insertHorizontalRule } from '../commands';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

export function keymapPlugin(
  featureFlags: FeatureFlags,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    insertRule.common!,
    insertHorizontalRule(
      featureFlags,
      editorAnalyticsAPI,
    )(INPUT_METHOD.SHORTCUT),
    list,
  );

  bindKeymapWithCommand(escape.common!, () => true, list);

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
