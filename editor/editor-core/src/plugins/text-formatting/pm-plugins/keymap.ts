import { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

import * as keymaps from '../../../keymaps';
import { keymap } from '../../../utils/keymap';
import { INPUT_METHOD } from '../../analytics';
import * as commands from '../commands/text-formatting';

export default function keymapPlugin(schema: Schema): Plugin {
  const list = {};

  if (schema.marks.strong) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleBold.common!,
      commands.toggleStrongWithAnalytics({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.em) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleItalic.common!,
      commands.toggleEmWithAnalytics({ inputMethod: INPUT_METHOD.SHORTCUT }),
      list,
    );
  }

  if (schema.marks.code) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleCode.common!,
      commands.toggleCodeWithAnalytics({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.strike) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleStrikethrough.common!,
      commands.toggleStrikeWithAnalytics({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.underline) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleUnderline.common!,
      commands.toggleUnderlineWithAnalytics({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  return keymap(list);
}
