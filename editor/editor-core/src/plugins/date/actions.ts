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
import { DatePluginState } from './pm-plugins/types';
import { canInsert } from 'prosemirror-utils';

export const createDate = (isQuickInsertAction?: boolean) => (
  insert: (node: Node | Object | string, opts?: any) => Transaction,
  state: EditorState,
): Transaction => {
  const dateNode = state.schema.nodes.date.createChecked({
    timestamp: todayTimestampInUTC(),
  });
  const space = state.schema.text(' ');

  const tr = insert(Fragment.from([dateNode, space]), {
    selectInlineNode: true,
  });
  const newPluginState: DatePluginState = {
    isQuickInsertAction,
    showDatePickerAt: tr.selection.from,
    isNew: true,
    isDateEmpty: false,
    focusDateInput: false,
  };
  return tr.setMeta(pluginKey, newPluginState);
};

/** Delete the date and close the datepicker */
export const deleteDate = (): Command => (state, dispatch): boolean => {
  const { showDatePickerAt }: DatePluginState = pluginKey.getState(state);
  if (showDatePickerAt === null) {
    return false;
  }
  const tr = state.tr
    .delete(showDatePickerAt, showDatePickerAt + 1)
    .setMeta(pluginKey, { showDatePickerAt: null, isNew: false });
  if (dispatch) {
    dispatch(tr);
  }
  return true;
};

/** Focus input */
export const focusDateInput = () => (
  state: EditorState,
  dispatch: CommandDispatch | undefined,
): boolean => {
  const { showDatePickerAt }: DatePluginState = pluginKey.getState(state);
  if (showDatePickerAt === null) {
    return false;
  }
  if (!dispatch) {
    return false;
  }

  const tr = state.tr.setMeta(pluginKey, { focusDateInput: true });
  dispatch(tr);
  return true;
};

export const insertDate = (
  date?: DateType,
  inputMethod?: TOOLBAR_MENU_TYPE,
  commitMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD,
  enterPressed: boolean = true,
): Command => (state, dispatch) => {
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

  const { showDatePickerAt }: DatePluginState = pluginKey.getState(state);

  if (!showDatePickerAt) {
    const dateNode = schema.nodes.date.createChecked({ timestamp });
    const textNode = state.schema.text(' ');
    const fragment = Fragment.fromArray([dateNode, textNode]);
    const { from, to } = state.selection;

    const insertable = canInsert(tr.selection.$from, fragment);
    if (!insertable) {
      const parentSelection = NodeSelection.create(
        tr.doc,
        tr.selection.from - tr.selection.$anchor.parentOffset - 1,
      );
      tr.insert(parentSelection.to, fragment).setSelection(
        NodeSelection.create(tr.doc, parentSelection.to + 1),
      );
    } else {
      tr.replaceWith(from, to, fragment).setSelection(
        NodeSelection.create(tr.doc, from),
      );
    }
    if (dispatch) {
      dispatch(
        tr.scrollIntoView().setMeta(pluginKey, {
          isNew: true,
        }),
      );
    }
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
        isNew: false,
      })
      .scrollIntoView();

    // Used to keep the date node selected on mobile after changing it
    if (!enterPressed) {
      tr = tr.setSelection(NodeSelection.create(tr.doc, showDatePickerAt));
    }

    if (dispatch) {
      dispatch(tr);
    }
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
  const { showDatePickerAt }: DatePluginState = pluginKey.getState(state);
  if (!dispatch) {
    return false;
  }
  const tr = showDatePickerAt
    ? state.tr
        .setMeta(pluginKey, { showDatePickerAt: null, isNew: false })
        .setSelection(
          Selection.near(state.tr.doc.resolve(showDatePickerAt + 2)),
        )
    : state.tr.setMeta(pluginKey, { isNew: false });

  dispatch(tr);
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
