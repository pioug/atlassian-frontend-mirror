import { EditorState, Plugin, TextSelection } from 'prosemirror-state';
import { keydownHandler } from 'prosemirror-keymap';
import { setTextSelection } from 'prosemirror-utils';
import { getCursor } from '../../../utils';
import { filter } from '../../../utils/commands';
import {
  isCursorBeforeClosingCharacter,
  isClosingCharacter,
} from '../ide-ux/paired-character-handling';
import {
  getAutoClosingBracketInfo,
  shouldAutoCloseBracket,
} from '../ide-ux/bracket-handling';
import {
  getAutoClosingQuoteInfo,
  shouldAutoCloseQuote,
} from '../ide-ux/quote-handling';
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

        // If text is a closing bracket/quote and we've already inserted it, move the selection after
        if (
          isCursorBeforeClosingCharacter(afterText) &&
          isClosingCharacter(text) &&
          afterText.startsWith(text)
        ) {
          dispatch(setTextSelection(to + text.length)(state.tr));
          return true;
        }

        // Automatically add right-hand side bracket when user types the left bracket
        if (shouldAutoCloseBracket(beforeText, afterText)) {
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

        // Automatically add closing quote when user types a starting quote
        if (shouldAutoCloseQuote(beforeText, afterText)) {
          const {
            left: leftQuote,
            right: rightQuote,
          } = getAutoClosingQuoteInfo(beforeText + text, afterText);
          if (leftQuote && rightQuote) {
            const quotePair = state.schema.text(text + rightQuote);
            let tr = state.tr.replaceWith(from, to, quotePair);
            dispatch(setTextSelection(from + text.length)(tr));
            return true;
          }
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
            left: leftBracket,
            right: rightBracket,
            hasTrailingMatchingBracket,
          } = getAutoClosingBracketInfo(beforeText, afterText);
          if (
            leftBracket &&
            rightBracket &&
            hasTrailingMatchingBracket &&
            dispatch
          ) {
            dispatch(
              state.tr.delete(
                $cursor.pos - leftBracket.length,
                $cursor.pos + rightBracket.length,
              ),
            );
            return true;
          }

          const {
            left: leftQuote,
            right: rightQuote,
            hasTrailingMatchingQuote,
          } = getAutoClosingQuoteInfo(beforeText, afterText);
          if (leftQuote && rightQuote && hasTrailingMatchingQuote && dispatch) {
            dispatch(
              state.tr.delete(
                $cursor.pos - leftQuote.length,
                $cursor.pos + rightQuote.length,
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
