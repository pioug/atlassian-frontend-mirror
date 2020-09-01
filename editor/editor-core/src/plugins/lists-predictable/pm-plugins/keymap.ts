import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import {
  indentList,
  outdentList,
  enterKeyCommand,
  toggleListCommandWithAnalytics,
  backspaceKeyCommand,
  deleteKeyCommand,
} from '../commands';
import { INPUT_METHOD } from '../../analytics';

export function keymapPlugin(): Plugin | undefined {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.toggleOrderedList)!,
    toggleListCommandWithAnalytics(INPUT_METHOD.KEYBOARD, 'orderedList'),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.toggleBulletList)!,
    toggleListCommandWithAnalytics(INPUT_METHOD.KEYBOARD, 'bulletList'),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.indentList.common!,
    indentList(INPUT_METHOD.KEYBOARD),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.outdentList.common!,
    outdentList(INPUT_METHOD.KEYBOARD),
    list,
  );
  keymaps.bindKeymapWithCommand(keymaps.enter.common!, enterKeyCommand, list);
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    backspaceKeyCommand,
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.deleteKey.common!,
    deleteKeyCommand,
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
