import { keymap } from '@atlaskit/editor-prosemirror/keymap';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import {
  bindKeymapWithCommand,
  moveDown,
  enter,
  moveUp,
  shiftTab,
  tab,
  moveLeft,
} from '@atlaskit/editor-common/keymaps';
import { findParentNodeOfType } from '@atlaskit/editor-prosemirror/utils';
import type { Command } from '@atlaskit/editor-common/types';
import { createNewParagraphBelow } from '@atlaskit/editor-common/utils';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';

export function captionKeymap(): SafePlugin {
  const list = {};

  bindKeymapWithCommand(moveDown.common!, createNewParagraphBelowCaption, list);
  bindKeymapWithCommand(enter.common!, createNewParagraphBelowCaption, list);

  bindKeymapWithCommand(moveDown.common!, getOutOfCaption, list);

  bindKeymapWithCommand(enter.common!, getOutOfCaption, list);

  bindKeymapWithCommand(moveUp.common!, selectParentMediaSingle, list);

  bindKeymapWithCommand(shiftTab.common!, selectParentMediaSingle, list);

  bindKeymapWithCommand(tab.common!, getOutOfCaption, list);

  bindKeymapWithCommand(
    moveLeft.common!,
    gapCursorSelectLeftParentMediaSingle,
    list,
  );

  return keymap(list) as SafePlugin;
}

const createNewParagraphBelowCaption: Command = (state, dispatch) => {
  const caption = findParentNodeOfType(state.schema.nodes.caption)(
    state.selection,
  );
  if (caption) {
    return createNewParagraphBelow(state, dispatch);
  }
  return false;
};

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

const gapCursorSelectLeftParentMediaSingle: Command = (state, dispatch) => {
  const caption = findParentNodeOfType(state.schema.nodes.caption)(
    state.selection,
  );
  if (caption) {
    const mediaSingleParent = findParentNodeOfType(
      state.schema.nodes.mediaSingle,
    )(state.selection);

    if (
      mediaSingleParent &&
      state.selection.empty &&
      state.tr.doc.resolve(state.selection.from).parentOffset === 0
    ) {
      const gapCursorSelection = GapCursorSelection.findFrom(
        state.tr.doc.resolve(mediaSingleParent.pos),
        0,
        false,
      );

      if (gapCursorSelection) {
        if (dispatch) {
          const tr = state.tr.setSelection(gapCursorSelection);
          dispatch(tr);
        }
        return true;
      }
    }
  }
  return false;
};
