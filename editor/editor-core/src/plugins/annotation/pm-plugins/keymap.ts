import { keymap } from 'prosemirror-keymap';
import { Plugin } from 'prosemirror-state';
import { bindKeymapWithCommand, addInlineComment } from '../../../keymaps';
import { setInlineCommentDraftState } from '../commands';
import { INPUT_METHOD } from '../../analytics';

export function keymapPlugin(): Plugin {
  const list = {};

  bindKeymapWithCommand(
    addInlineComment.common!,
    setInlineCommentDraftState(true, INPUT_METHOD.SHORTCUT),
    list,
  );

  return keymap(list);
}
