import type { Schema } from 'prosemirror-model';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import * as keymaps from '@atlaskit/editor-common/keymaps';
import { keymap } from 'prosemirror-keymap';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import * as commands from '../commands/text-formatting';

export default function keymapPlugin(
  schema: Schema,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin {
  const list = {};

  if (schema.marks.strong) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleBold.common!,
      commands.toggleStrongWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.em) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleItalic.common!,
      commands.toggleEmWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.code) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleCode.common!,
      commands.toggleCodeWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.strike) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleStrikethrough.common!,
      commands.toggleStrikeWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.subsup) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleSubscript.common!,
      commands.toggleSubscriptWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.subsup) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleSuperscript.common!,
      commands.toggleSuperscriptWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.underline) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleUnderline.common!,
      commands.toggleUnderlineWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  return keymap(list) as SafePlugin;
}
