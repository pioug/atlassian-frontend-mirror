import { keymap } from 'prosemirror-keymap';
import { Plugin, Selection } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { findParentNodeOfType } from 'prosemirror-utils';
import { Command } from '../../../types';
import { createNewParagraphBelow } from '../../../commands';

export function captionKeymap(): Plugin {
  const list = {};

  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    createNewParagraphBelow,
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.enter.common!,
    createNewParagraphBelow,
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.moveDown.common!,
    getOutOfCaption,
    list,
  );

  keymaps.bindKeymapWithCommand(keymaps.enter.common!, getOutOfCaption, list);

  keymaps.bindKeymapWithCommand(
    keymaps.moveUp.common!,
    selectParentMediaSingle,
    list,
  );

  keymaps.bindKeymapWithCommand(
    keymaps.shiftTab.common!,
    selectParentMediaSingle,
    list,
  );

  keymaps.bindKeymapWithCommand(keymaps.tab.common!, getOutOfCaption, list);
  return keymap(list);
}

const getOutOfCaption: Command = (state, dispatch) => {
  const caption = findParentNodeOfType(state.schema.nodes.caption)(
    state.selection,
  );
  if (caption) {
    if (dispatch) {
      const tr = state.tr.setSelection(
        Selection.near(
          state.tr.doc.resolve(caption.pos + caption.node.nodeSize),
        ),
      );
      dispatch(tr);
    }
    return true;
  }
  return false;
};

const selectParentMediaSingle: Command = (state, dispatch) => {
  if (findParentNodeOfType(state.schema.nodes.caption)(state.selection)) {
    const mediaSingleParent = findParentNodeOfType(
      state.schema.nodes.mediaSingle,
    )(state.selection);
    if (mediaSingleParent) {
      if (dispatch) {
        const tr = state.tr.setSelection(
          Selection.near(state.tr.doc.resolve(mediaSingleParent.pos)),
        );
        dispatch(tr);
      }
      return true;
    }
  }
  return false;
};
