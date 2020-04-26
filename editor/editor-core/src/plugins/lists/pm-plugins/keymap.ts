import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { trackAndInvoke } from '../../../analytics';
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
    trackAndInvoke(
      'atlassian.editor.format.list.numbered.keyboard',
      toggleListCommandWithAnalytics(INPUT_METHOD.KEYBOARD, 'orderedList'),
    ),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.findShortcutByKeymap(keymaps.toggleBulletList)!,
    trackAndInvoke(
      'atlassian.editor.format.list.bullet.keyboard',
      toggleListCommandWithAnalytics(INPUT_METHOD.KEYBOARD, 'bulletList'),
    ),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.indentList.common!!,
    trackAndInvoke(
      'atlassian.editor.format.list.indent.keyboard',
      indentList(INPUT_METHOD.KEYBOARD),
    ),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.outdentList.common!!,
    trackAndInvoke(
      'atlassian.editor.format.list.outdent.keyboard',
      outdentList(INPUT_METHOD.KEYBOARD),
    ),
    list,
  );
  keymaps.bindKeymapWithCommand(keymaps.enter.common!!, enterKeyCommand, list);
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!!,
    backspaceKeyCommand,
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.deleteKey.common!!,
    deleteKeyCommand,
    list,
  );

  return keymap(list);
}

export default keymapPlugin;
