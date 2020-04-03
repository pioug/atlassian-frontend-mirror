import { EditorState, Plugin, TextSelection } from 'prosemirror-state';
import { keydownHandler } from 'prosemirror-keymap';
import { setTextSelection } from 'prosemirror-utils';
import { getCursor } from '../../../utils';
import { filter } from '../../../utils/commands';
import {
  getAutoClosingBracketInfo,
  isCursorBeforeClosingBracket,
  isClosingBracket,
} from '../ide-ux/bracket-handling';
import {
  getEndOfCurrentLine,
  getStartOfCurrentLine,
  isCursorInsideCodeBlock,
  isSelectionEntirelyInsideCodeBlock,
  getLineInfo,
} from '../ide-ux/line-handling';
import {
  insertIndent,
  outdent,
  indent,
  insertNewlineWithIndent,
} from '../ide-ux/commands';
import { CommandDispatch } from '../../../types';

export default new Plugin({
  props: {
    handleTextInput(view, from, to, text) {
      const { state, dispatch } = view;
      if (isCursorInsideCodeBlock(state)) {
        const beforeText = getStartOfCurrentLine(state).text;
        const afterText = getEndOfCurrentLine(state).text;

        // If text is a closing bracket and we've already inserted it, move the selection after.
        if (
          isCursorBeforeClosingBracket(afterText) &&
          isClosingBracket(text) &&
          afterText.startsWith(text)
        ) {
          dispatch(setTextSelection(to + text.length)(state.tr));
          return true;
        }

        // Automatically add right-hand side bracket when user types the left bracket
        const { left, right } = getAutoClosingBracketInfo(
          beforeText + text,
          afterText,
        );
        if (left && right) {
          const bracketPair = state.schema.text(text + right);
          let tr = state.tr.replaceWith(from, to, bracketPair);
          dispatch(setTextSelection(from + text.length)(tr));
          return true;
        }
      }
      return false;
    },
    handleKeyDown: keydownHandler({
      Backspace: (state: EditorState, dispatch?: CommandDispatch) => {
        if (isCursorInsideCodeBlock(state)) {
          const $cursor = getCursor(state.selection)!;
          const beforeText = getStartOfCurrentLine(state).text;
          const afterText = getEndOfCurrentLine(state).text;

          const {
            left,
            right,
            hasTrailingMatchingBracket,
          } = getAutoClosingBracketInfo(beforeText, afterText);
          if (left && right && hasTrailingMatchingBracket && dispatch) {
            dispatch(
              state.tr.delete(
                $cursor.pos - left.length,
                $cursor.pos + right.length,
              ),
            );
            return true;
          }
          const {
            indentToken: { size, token },
            indentText,
          } = getLineInfo(beforeText);
          if (beforeText === indentText) {
            if (indentText.endsWith(token.repeat(size)) && dispatch) {
              dispatch(
                state.tr.delete(
                  $cursor.pos - (size - (indentText.length % size) || size),
                  $cursor.pos,
                ),
              );
              return true;
            }
          }
        }
        return false;
      },
      Enter: filter(
        isSelectionEntirelyInsideCodeBlock,
        insertNewlineWithIndent,
      ),
      'Mod-]': filter(isSelectionEntirelyInsideCodeBlock, indent),
      'Mod-[': filter(isSelectionEntirelyInsideCodeBlock, outdent),
      Tab: filter(
        isSelectionEntirelyInsideCodeBlock,
        (state: EditorState, dispatch?: CommandDispatch) => {
          if (!dispatch) {
            return false;
          }

          if (isCursorInsideCodeBlock(state)) {
            return insertIndent(state, dispatch);
          }
          return indent(state, dispatch);
        },
      ),
      'Shift-Tab': filter(isSelectionEntirelyInsideCodeBlock, outdent),
      'Mod-a': (state: EditorState, dispatch?: CommandDispatch) => {
        if (isSelectionEntirelyInsideCodeBlock(state)) {
          const { $from, $to } = state.selection;
          const isFullCodeBlockSelection =
            $from.parentOffset === 0 &&
            $to.parentOffset === $to.parent.nodeSize - 2;
          if (!isFullCodeBlockSelection && dispatch) {
            dispatch(
              state.tr.setSelection(
                TextSelection.create(state.doc, $from.start(), $to.end()),
              ),
            );
            return true;
          }
        }
        return false;
      },
    }),
  },
});
