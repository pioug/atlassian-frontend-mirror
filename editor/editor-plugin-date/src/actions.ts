import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type {
  Command,
  CommandDispatch,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import { todayTimestampInUTC } from '@atlaskit/editor-common/utils';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, Selection } from '@atlaskit/editor-prosemirror/state';

import { pluginKey } from './pm-plugins/plugin-key';
import type { DatePluginState } from './pm-plugins/types';
import type { DatePlugin, DateType } from './types';
import { isToday } from './utils/internal';

export const createDate =
  (isQuickInsertAction?: boolean) =>
  (
    insert: (
      node: Node | Object | string,
      opts?: { selectInlineNode: boolean },
    ) => Transaction,
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

/** Focus input */
export const focusDateInput =
  () =>
  (state: EditorState, dispatch: CommandDispatch | undefined): boolean => {
    const pluginState = pluginKey.getState(state);
    if (!pluginState || pluginState.showDatePickerAt === null) {
      return false;
    }
    if (!dispatch) {
      return false;
    }

    const tr = state.tr.setMeta(pluginKey, { focusDateInput: true });
    dispatch(tr);
    return true;
  };

export const setDatePickerAt =
  (showDatePickerAt: number | null) =>
  (state: EditorState, dispatch: (tr: Transaction) => void): boolean => {
    dispatch(state.tr.setMeta(pluginKey, { showDatePickerAt }));
    return true;
  };

export const closeDatePicker =
  (): Command =>
  (state: EditorState, dispatch: CommandDispatch | undefined) => {
    const { showDatePickerAt } = pluginKey.getState(state) || {};
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
  pluginInjectionApi,
}: {
  date?: DateType;
  pluginInjectionApi?: ExtractInjectionAPI<DatePlugin>;
}): Command => {
  pluginInjectionApi?.analytics?.actions?.attachAnalyticsEvent({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.COMMITTED,
    actionSubject: ACTION_SUBJECT.DATE,
    attributes: {
      commitMethod: INPUT_METHOD.BLUR,
      isValid: date !== undefined,
      isToday: isToday(date),
    },
  });
  return closeDatePicker();
};

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
