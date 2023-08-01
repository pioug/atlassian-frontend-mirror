import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import * as keymaps from '../../../keymaps';
import {
  indentList,
  enterKeyCommand,
  toggleList,
  backspaceKeyCommand,
  deleteKeyCommand,
} from '../commands';
import { outdentList } from '../commands';
import {
  INPUT_METHOD,
  EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

export function keymapPlugin(
  featureFlags: FeatureFlags,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin | undefined {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.toggleOrderedList)!,
    toggleList(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, 'orderedList'),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.toggleBulletList)!,
    toggleList(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, 'bulletList'),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.indentList.common!,
    indentList(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.outdentList.common!,
    outdentList(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, featureFlags),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.enter.common!,
    enterKeyCommand(editorAnalyticsAPI)(featureFlags),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    backspaceKeyCommand(editorAnalyticsAPI)(featureFlags),
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.deleteKey.common!,
    deleteKeyCommand(editorAnalyticsAPI),
    list,
  );

  // This shortcut is Mac only
  keymaps.bindKeymapWithCommand(
    keymaps.findKeyMapForBrowser(keymaps.forwardDelete) as string,
    deleteKeyCommand(editorAnalyticsAPI),
    list,
  );

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
