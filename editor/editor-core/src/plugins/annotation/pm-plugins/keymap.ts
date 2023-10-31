import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { bindKeymapWithCommand, addInlineComment } from '../../../keymaps';
import { setInlineCommentDraftState } from '../commands';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';

export function keymapPlugin(
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    addInlineComment.common!,
    setInlineCommentDraftState(editorAnalyticsAPI)(true, INPUT_METHOD.SHORTCUT),
    list,
  );

  return keymap(list) as SafePlugin;
}
