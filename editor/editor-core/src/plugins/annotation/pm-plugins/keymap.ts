import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import { bindKeymapWithCommand, addInlineComment } from '../../../keymaps';
import { setInlineCommentDraftState } from '../commands';
import { INPUT_METHOD } from '../../analytics';

export function keymapPlugin(): Plugin {
  const list = {};

  const showDraftCommentCommand = setInlineCommentDraftState(
    true,
    INPUT_METHOD.SHORTCUT,
  );
  bindKeymapWithCommand(
    addInlineComment.common!,
    showDraftCommentCommand,
    list,
  );

  return keymap(list);
}
