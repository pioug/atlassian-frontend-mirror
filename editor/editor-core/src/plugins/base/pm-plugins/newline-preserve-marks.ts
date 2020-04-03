import { PluginKey, Plugin, EditorState } from 'prosemirror-state';
import { keydownHandler } from 'prosemirror-keymap';
import { filter } from '../../../utils/commands';
import { typeAheadPluginKey } from '../../../plugins/type-ahead';
import { Command } from '../../../types';
import { isSelectionEndOfParagraph } from '../../../utils';

export const newlinePreserveMarksKey = new PluginKey(
  'newlinePreserveMarksPlugin',
);

const isSelectionAligned = (state: EditorState): boolean =>
  !!state.selection.$to.parent.marks.find(
    m => m.type === state.schema.marks.alignment,
  );

const isTypeaheadNotDisplaying = (state: EditorState): boolean =>
  !typeAheadPluginKey.getState(state).active;

const splitBlockPreservingMarks: Command = (state, dispatch): boolean => {
  if (dispatch) {
    dispatch(
      state.tr.split(state.tr.mapping.map(state.selection.$from.pos), 1),
    );
  }
  return true;
};

export default () =>
  new Plugin({
    key: newlinePreserveMarksKey,
    props: {
      handleKeyDown: keydownHandler({
        Enter: filter(
          [
            isSelectionEndOfParagraph,
            isSelectionAligned,
            isTypeaheadNotDisplaying,
          ],
          splitBlockPreservingMarks,
        ),
      }),
    },
  });
