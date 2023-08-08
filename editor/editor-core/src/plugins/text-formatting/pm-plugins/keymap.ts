import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';

import * as keymaps from '@atlaskit/editor-common/keymaps';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
  toggleStrongWithAnalytics,
  toggleEmWithAnalytics,
  toggleCodeWithAnalytics,
  toggleStrikeWithAnalytics,
  toggleSubscriptWithAnalytics,
  toggleSuperscriptWithAnalytics,
  toggleUnderlineWithAnalytics,
} from '../actions';

export default function keymapPlugin(
  schema: Schema,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin {
  const list = {};

  if (schema.marks.strong) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleBold.common!,
      toggleStrongWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.em) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleItalic.common!,
      toggleEmWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.code) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleCode.common!,
      toggleCodeWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.strike) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleStrikethrough.common!,
      toggleStrikeWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.subsup) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleSubscript.common!,
      toggleSubscriptWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.subsup) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleSuperscript.common!,
      toggleSuperscriptWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  if (schema.marks.underline) {
    keymaps.bindKeymapWithCommand(
      keymaps.toggleUnderline.common!,
      toggleUnderlineWithAnalytics(editorAnalyticsAPI)({
        inputMethod: INPUT_METHOD.SHORTCUT,
      }),
      list,
    );
  }

  return keymap(list) as SafePlugin;
}
