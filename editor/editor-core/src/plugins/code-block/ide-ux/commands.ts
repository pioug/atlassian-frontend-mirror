import { EditorState, TextSelection } from 'prosemirror-state';

import {
  getLinesFromSelection,
  getLineInfo,
  forEachLine,
  getStartOfCurrentLine,
} from './line-handling';
import { analyticsService } from '../../../analytics';
import {
  addAnalytics,
  ACTION,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
  INDENT_DIR,
  INDENT_TYPE,
  ACTION_SUBJECT,
} from '../../analytics';
import { CommandDispatch } from '../../../types';

/**
 * Return the current indentation level
 * @param indentText - Text in the code block that represent an indentation
 * @param indentSize - Size of the indentation token in a string
 */
function getIndentLevel(indentText: string, indentSize: number) {
  if (indentSize === 0 || indentText.length === 0) {
    return 0;
  }

  return indentText.length / indentSize;
}

export function indent(state: EditorState, dispatch?: CommandDispatch) {
  const { text, start } = getLinesFromSelection(state);
  const { tr, selection } = state;
  forEachLine(text, (line, offset) => {
    const { indentText, indentToken } = getLineInfo(line);
    const indentLevel = getIndentLevel(indentText, indentToken.size);

    const indentToAdd = indentToken.token.repeat(
      indentToken.size - (indentText.length % indentToken.size) ||
        indentToken.size,
    );
    tr.insertText(indentToAdd, tr.mapping.map(start + offset, -1));

    addAnalytics(state, tr, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_INDENT,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: INPUT_METHOD.KEYBOARD,
        previousIndentationLevel: indentLevel,
        newIndentLevel: indentLevel + 1,
        direction: INDENT_DIR.INDENT,
        indentType: INDENT_TYPE.CODE_BLOCK,
      },
    });

    if (!selection.empty) {
      tr.setSelection(
        TextSelection.create(
          tr.doc,
          tr.mapping.map(selection.from, -1),
          tr.selection.to,
        ),
      );
    }
  });
  if (dispatch) {
    dispatch(tr);
    analyticsService.trackEvent(`atlassian.editor.codeblock.indent`);
  }
  return true;
}

export function outdent(state: EditorState, dispatch?: CommandDispatch) {
  const { text, start } = getLinesFromSelection(state);
  const { tr } = state;
  forEachLine(text, (line, offset) => {
    const { indentText, indentToken } = getLineInfo(line);
    if (indentText) {
      const indentLevel = getIndentLevel(indentText, indentToken.size);

      const unindentLength =
        indentText.length % indentToken.size || indentToken.size;
      tr.delete(
        tr.mapping.map(start + offset),
        tr.mapping.map(start + offset + unindentLength),
      );

      addAnalytics(state, tr, {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_INDENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          inputMethod: INPUT_METHOD.KEYBOARD,
          previousIndentationLevel: indentLevel,
          newIndentLevel: indentLevel - 1,
          direction: INDENT_DIR.OUTDENT,
          indentType: INDENT_TYPE.CODE_BLOCK,
        },
      });
    }
  });
  if (dispatch) {
    dispatch(tr);
    analyticsService.trackEvent('atlassian.editor.codeblock.outdent');
  }
  return true;
}

export function insertIndent(state: EditorState, dispatch: CommandDispatch) {
  const { text: textAtStartOfLine } = getStartOfCurrentLine(state);
  const { indentToken } = getLineInfo(textAtStartOfLine);
  const indentToAdd = indentToken.token.repeat(
    indentToken.size - (textAtStartOfLine.length % indentToken.size) ||
      indentToken.size,
  );
  dispatch(state.tr.insertText(indentToAdd));
  analyticsService.trackEvent('atlassian.editor.codeblock.indent.insert');
  return true;
}

export function insertNewlineWithIndent(
  state: EditorState,
  dispatch?: CommandDispatch,
) {
  const { text: textAtStartOfLine } = getStartOfCurrentLine(state);
  const { indentText } = getLineInfo(textAtStartOfLine);
  if (indentText && dispatch) {
    dispatch(state.tr.insertText('\n' + indentText));
    return true;
  }
  return false;
}
