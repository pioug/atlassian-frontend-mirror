import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, EditorState } from 'prosemirror-state';
import { keydownHandler } from 'prosemirror-keymap';
import { filterCommands as filter } from '@atlaskit/editor-common/utils';
import { Command } from '../../../types';
import { isSelectionEndOfParagraph } from '../../../utils';

export const newlinePreserveMarksKey = new PluginKey(
  'newlinePreserveMarksPlugin',
);

const isSelectionAligned = (state: EditorState): boolean =>
  !!state.selection.$to.parent.marks.find(
    (m) => m.type === state.schema.marks.alignment,
  );

const splitBlockPreservingMarks: Command = (state, dispatch): boolean => {
  if (dispatch) {
    dispatch(
      state.tr.split(state.tr.mapping.map(state.selection.$from.pos), 1),
    );
  }
  return true;
};

export default () =>
  new SafePlugin({
    key: newlinePreserveMarksKey,
    props: {
      handleKeyDown: keydownHandler({
        Enter: filter(
          [isSelectionEndOfParagraph, isSelectionAligned],
          splitBlockPreservingMarks,
        ),
      }),
    },
  });
