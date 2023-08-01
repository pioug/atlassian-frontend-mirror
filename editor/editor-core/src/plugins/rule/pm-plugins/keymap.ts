import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import * as keymaps from '../../../keymaps';
import { INPUT_METHOD } from '../../analytics';
import { insertHorizontalRule } from '../commands';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

export function keymapPlugin(featureFlags: FeatureFlags): SafePlugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.insertRule.common!,
    insertHorizontalRule(INPUT_METHOD.SHORTCUT, featureFlags),
    list,
  );

  keymaps.bindKeymapWithCommand(keymaps.escape.common!, () => true, list);

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
