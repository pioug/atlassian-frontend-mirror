import { keymap } from 'prosemirror-keymap';
import { Plugin, Selection } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { findParentNodeOfType } from 'prosemirror-utils';
import { Command } from '../../../types';

export function captionKeymap(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    getOutOfCaption,
    list,
  );

  keymaps.bindKeymapWithCommand(keymaps.enter.common!, getOutOfCaption, list);

  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    safeCaptionBackspace,
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.ctrlBackSpace.common!,
    safeCmdBackSpaceCaption,
    list,
  );

  keymaps.bindKeymapWithCommand(keymaps.tab.common!, getOutOfCaption, list);
  return keymap(list);
}

const safeCmdBackSpaceCaption: Command = (state, dispatch) => {
  if (findParentNodeOfType(state.schema.nodes.caption)(state.selection)) {
    if (dispatch) {
      dispatch(
        state.tr.replaceRangeWith(
          state.selection.from - state.selection.$from.parentOffset,
          state.selection.from,
          state.schema.nodes.caption.create(),
        ),
      );
    }
    return true;
  }
  return false;
};

/** Safely removes last character from caption without removing media item,
 * Prosemirror removes empty text nodes from the DOM
 */
const safeCaptionBackspace: Command = (state, dispatch) => {
  if (
    findParentNodeOfType(state.schema.nodes.caption)(state.selection) &&
    state.selection.$from.parentOffset === 1
  ) {
    if (dispatch) {
      dispatch(
        state.tr.replaceRangeWith(
          state.selection.from - 1,
          state.selection.from,
          state.schema.nodes.caption.create(),
        ),
      );
    }
    return true;
  }
  return false;
};

const getOutOfCaption: Command = (state, dispatch) => {
  if (findParentNodeOfType(state.schema.nodes.caption)(state.selection)) {
    if (dispatch) {
      const tr = state.tr.setSelection(
        Selection.near(state.tr.doc.resolve(state.selection.to + 1)),
      );
      dispatch(tr);
    }
    return true;
  }
  return false;
};
