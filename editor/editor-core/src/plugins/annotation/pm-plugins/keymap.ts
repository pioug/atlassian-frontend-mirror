import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import { bindKeymapWithCommand, addInlineComment } from '../../../keymaps';
import { setInlineCommentDraftState } from '../commands';

export function keymapPlugin(): Plugin {
  const list = {};

  const showDraftCommentCommand = setInlineCommentDraftState(true);
  bindKeymapWithCommand(
    addInlineComment.common!,
    showDraftCommentCommand,
    list,
  );

  return keymap(list);
}
