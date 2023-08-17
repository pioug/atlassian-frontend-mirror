import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import {
  bindKeymapWithCommand,
  findShortcutByKeymap,
  toggleOrderedList,
  toggleBulletList,
  indentList,
  outdentList,
  enter,
  backspace,
  deleteKey,
  findKeyMapForBrowser,
  forwardDelete,
} from '@atlaskit/editor-common/keymaps';
import {
  indentList as indentListCommand,
  outdentList as outdentListCommand,
  enterKeyCommand,
  toggleList,
  backspaceKeyCommand,
  deleteKeyCommand,
} from '../commands';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

export function keymapPlugin(
  featureFlags: FeatureFlags,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin | undefined {
  const list = {};

  bindKeymapWithCommand(
    findShortcutByKeymap(toggleOrderedList)!,
    toggleList(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, 'orderedList'),
    list,
  );
  bindKeymapWithCommand(
    findShortcutByKeymap(toggleBulletList)!,
    toggleList(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, 'bulletList'),
    list,
  );
  bindKeymapWithCommand(
    indentList.common!,
    indentListCommand(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD),
    list,
  );
  bindKeymapWithCommand(
    outdentList.common!,
    outdentListCommand(editorAnalyticsAPI)(INPUT_METHOD.KEYBOARD, featureFlags),
    list,
  );
  bindKeymapWithCommand(
    enter.common!,
    enterKeyCommand(editorAnalyticsAPI)(featureFlags),
    list,
  );
  bindKeymapWithCommand(
    backspace.common!,
    backspaceKeyCommand(editorAnalyticsAPI)(featureFlags),
    list,
  );

  bindKeymapWithCommand(
    deleteKey.common!,
    deleteKeyCommand(editorAnalyticsAPI),
    list,
  );

  // This shortcut is Mac only
  bindKeymapWithCommand(
    findKeyMapForBrowser(forwardDelete) as string,
    deleteKeyCommand(editorAnalyticsAPI),
    list,
  );

  return keymap(list) as SafePlugin;
}

export default keymapPlugin;
