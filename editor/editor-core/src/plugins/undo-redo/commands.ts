import { undoInputRule } from 'prosemirror-inputrules';
import { chainCommands } from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { attachInputMeta } from './attach-input-meta';
import { InputSource } from './enums';

export const undoFromKeyboard = attachInputMeta(InputSource.KEYBOARD)(
  chainCommands(undoInputRule, undo),
);

export const redoFromKeyboard = attachInputMeta(InputSource.KEYBOARD)(redo);

export const undoFromToolbar = attachInputMeta(InputSource.TOOLBAR)(
  chainCommands(undoInputRule, undo),
);

export const redoFromToolbar = attachInputMeta(InputSource.TOOLBAR)(redo);
