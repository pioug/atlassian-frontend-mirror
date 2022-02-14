import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { bindKeymapWithCommand, addInlineComment } from '../../../keymaps';
import { setInlineCommentDraftState } from '../commands';
import { INPUT_METHOD } from '../../analytics';

export function keymapPlugin(): SafePlugin {
  const list = {};

  bindKeymapWithCommand(
    addInlineComment.common!,
    setInlineCommentDraftState(true, INPUT_METHOD.SHORTCUT),
    list,
  );

  return keymap(list) as SafePlugin;
}
