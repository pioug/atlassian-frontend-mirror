import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import {
  bindKeymapWithCommand,
  insertRule,
  escape,
} from '@atlaskit/editor-common/keymaps';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { insertHorizontalRule } from '../commands';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

export function keymapPlugin(featureFlags: FeatureFlags): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    insertRule.common!,
    insertHorizontalRule(INPUT_METHOD.SHORTCUT, featureFlags),
    list,
  );

  bindKeymapWithCommand(escape.common!, () => true, list);

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
