import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import * as keymaps from '../../../keymaps';
import {
  indentList,
  enterKeyCommand,
  toggleList,
  backspaceKeyCommand,
  deleteKeyCommand,
} from '../commands';
import { outdentList } from '../commands/outdent-list';
import { INPUT_METHOD } from '../../analytics';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

export function keymapPlugin(
  featureFlags: FeatureFlags,
): SafePlugin | undefined {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.toggleOrderedList)!,
    toggleList(INPUT_METHOD.KEYBOARD, 'orderedList'),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.toggleBulletList)!,
    toggleList(INPUT_METHOD.KEYBOARD, 'bulletList'),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.indentList.common!,
    indentList(INPUT_METHOD.KEYBOARD),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.outdentList.common!,
    outdentList(INPUT_METHOD.KEYBOARD, featureFlags),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.enter.common!,
    enterKeyCommand(featureFlags),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    backspaceKeyCommand(featureFlags),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.deleteKey.common!,
    deleteKeyCommand,
    list,
  );

  // This shortcut is Mac only
  keymaps.bindKeymapWithCommand(
    keymaps.findKeyMapForBrowser(keymaps.forwardDelete) as string,
    deleteKeyCommand,
    list,
  );

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
