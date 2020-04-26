import {
  EditorState,
  Transaction,
  NodeSelection,
  Selection,
} from 'prosemirror-state';
import { Fragment } from 'prosemirror-model';
import { todayTimestampInUTC } from '@atlaskit/editor-common';
import { Command, CommandDispatch } from '../../types';
import { DateType } from './types';
import { TOOLBAR_MENU_TYPE } from '../insert-block/ui/ToolbarInsertBlock/types';
import { pluginKey } from './pm-plugins/plugin-key';

import {
  withAnalytics,
  addAnalytics,
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import { isToday } from './utils/internal';

export const insertDate = (
  date?: DateType,
  inputMethod?: TOOLBAR_MENU_TYPE,
  commitMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD,
  enterPressed: boolean = true,
) => (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
  const { schema } = state;
  let timestamp: string;
  if (date) {
    timestamp = Date.UTC(date.year, date.month - 1, date.day).toString();
  } else {
    timestamp = todayTimestampInUTC();
  }

  let tr = state.tr;
  if (inputMethod) {
    addAnalytics(state, tr, {
      action: ACTION.INSERTED,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: ACTION_SUBJECT_ID.DATE,
      eventType: EVENT_TYPE.TRACK,
      attributes: { inputMethod },
    });
  }

  if (commitMethod) {
    addAnalytics(state, tr, {
      eventType: EVENT_TYPE.TRACK,
      action: ACTION.COMMITTED,
      actionSubject: ACTION_SUBJECT.DATE,
      attributes: {
        commitMethod,
        isValid: date !== undefined,
        isToday: isToday(date),
      },
    });
  }

  const { showDatePickerAt } = pluginKey.getState(state);

  if (!showDatePickerAt) {
    const dateNode = schema.nodes.date.createChecked({ timestamp });
    const textNode = state.schema.text(' ');
    const fragment = Fragment.fromArray([dateNode, textNode]);
    const { from, to } = state.selection;
    dispatch(
      tr
        .replaceWith(from, to, fragment)
        .setSelection(NodeSelection.create(tr.doc, state.selection.$from.pos))
        .scrollIntoView(),
    );
    return true;
  }

  if (state.doc.nodeAt(showDatePickerAt)) {
    if (enterPressed) {
      // Setting selection to outside the date node causes showDatePickerAt
      // to be set to null by the PM plugin (onSelectionChanged), which will
      // immediately close the datepicker once a valid date is typed in.
      // Adding this check forces it to stay open until the user presses Enter.
      tr = tr.setSelection(
        Selection.near(tr.doc.resolve(showDatePickerAt + 2)),
      );
    }
    tr = tr
      .setNodeMarkup(showDatePickerAt, schema.nodes.date, {
        timestamp,
      })
      .setMeta(pluginKey, {
        showDatePickerAt,
      })
      .scrollIntoView();
    dispatch(tr);
    return true;
  }

  return false;
};

export const setDatePickerAt = (showDatePickerAt: number | null) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(state.tr.setMeta(pluginKey, { showDatePickerAt }));
  return true;
};

export const closeDatePicker = (): Command => (
  state: EditorState,
  dispatch: CommandDispatch | undefined,
) => {
  const { showDatePickerAt } = pluginKey.getState(state);

  if (showDatePickerAt && dispatch) {
    dispatch(
      state.tr
        .setMeta(pluginKey, { showDatePickerAt: null })
        .setSelection(
          Selection.near(state.tr.doc.resolve(showDatePickerAt + 2)),
        ),
    );
  }

  return false;
};

export const closeDatePickerWithAnalytics = ({
  date,
}: {
  date?: DateType;
}): Command =>
  withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.COMMITTED,
    actionSubject: ACTION_SUBJECT.DATE,
    attributes: {
      commitMethod: INPUT_METHOD.BLUR,
      isValid: date !== undefined,
      isToday: isToday(date),
    },
  })(closeDatePicker());

export const openDatePicker = (): Command => (state, dispatch) => {
  const { $from } = state.selection;
  const node = state.doc.nodeAt($from.pos);

  if (node && node.type.name === state.schema.nodes.date.name) {
    const showDatePickerAt = $from.pos;
    if (dispatch) {
      dispatch(
        state.tr
          .setMeta(pluginKey, { showDatePickerAt })
          .setSelection(NodeSelection.create(state.doc, showDatePickerAt)),
      );
    }
  }
  return false;
};
