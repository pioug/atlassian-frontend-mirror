import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
  bindKeymapWithPluginCommand,
  toggleBold,
  toggleCode,
  toggleItalic,
  toggleStrikethrough,
  toggleSubscript,
  toggleSuperscript,
  toggleUnderline,
} from '@atlaskit/editor-common/keymaps';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { Schema } from '@atlaskit/editor-prosemirror/model';

import {
  toggleCodeWithAnalytics,
  toggleEmWithAnalytics,
  toggleStrikeWithAnalytics,
  toggleStrongWithAnalytics,
  toggleSubscriptWithAnalytics,
  toggleSuperscriptWithAnalytics,
  toggleUnderlineWithAnalytics,
} from '../commands';

export default function keymapPlugin(
  schema: Schema,
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin {
  const list = {};

  if (schema.marks.strong) {
    bindKeymapWithPluginCommand(
      toggleBold.common!,
      toggleStrongWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
      list,
    );
  }

  if (schema.marks.em) {
    bindKeymapWithPluginCommand(
      toggleItalic.common!,
      toggleEmWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
      list,
    );
  }

  if (schema.marks.code) {
    bindKeymapWithPluginCommand(
      toggleCode.common!,
      toggleCodeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
      list,
    );
  }

  if (schema.marks.strike) {
    bindKeymapWithPluginCommand(
      toggleStrikethrough.common!,
      toggleStrikeWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
      list,
    );
  }

  if (schema.marks.subsup) {
    bindKeymapWithPluginCommand(
      toggleSubscript.common!,
      toggleSubscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
      list,
    );
  }

  if (schema.marks.subsup) {
    bindKeymapWithPluginCommand(
      toggleSuperscript.common!,
      toggleSuperscriptWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
      list,
    );
  }

  if (schema.marks.underline) {
    bindKeymapWithPluginCommand(
      toggleUnderline.common!,
      toggleUnderlineWithAnalytics(editorAnalyticsAPI)(INPUT_METHOD.SHORTCUT),
      list,
    );
  }

  return keymap(list) as SafePlugin;
}
