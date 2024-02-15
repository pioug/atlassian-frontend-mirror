import React from 'react';

import Loadable from 'react-loadable';

import { date } from '@atlaskit/adf-schema';
import type { WeekDay } from '@atlaskit/calendar/types';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { toolbarInsertBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { IconDate } from '@atlaskit/editor-common/quick-insert';
import type {
  ExtractInjectionAPI,
  UiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';

import {
  closeDatePicker,
  closeDatePickerWithAnalytics,
  createDate,
} from './actions';
import { deleteDateCommand, insertDateCommand } from './commands';
import keymap from './pm-plugins/keymap';
import createDatePlugin from './pm-plugins/main';
import { pluginKey as datePluginKey } from './pm-plugins/plugin-key';
import type { DatePlugin, DateType } from './types';
import type { Props as DatePickerProps } from './ui/DatePicker';

const DatePicker = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_editor-datepicker" */ './ui/DatePicker'
    ).then(mod => mod.default) as Promise<React.ComponentType<DatePickerProps>>,
  loading: () => null,
});

function ContentComponent({
  editorView,
  dispatchAnalyticsEvent,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  dependencyApi,
  weekStartDay,
}: Pick<
  UiComponentFactoryParams,
  | 'editorView'
  | 'dispatchAnalyticsEvent'
  | 'popupsMountPoint'
  | 'popupsBoundariesElement'
  | 'popupsScrollableElement'
> & {
  dependencyApi?: ExtractInjectionAPI<typeof datePlugin>;
} & {
  weekStartDay?: WeekDay;
}): JSX.Element | null {
  const { dispatch } = editorView;
  const domAtPos = editorView.domAtPos.bind(editorView);
  const { editorDisabledState, dateState } = useSharedPluginState(
    dependencyApi,
    ['date', 'editorDisabled'],
  );

  if (!dateState?.showDatePickerAt || editorDisabledState?.editorDisabled) {
    return null;
  }

  const { showDatePickerAt, isNew, focusDateInput } = dateState;

  const element = findDomRefAtPos(showDatePickerAt, domAtPos) as HTMLElement;

  return (
    <DatePicker
      mountTo={popupsMountPoint}
      boundariesElement={popupsBoundariesElement}
      scrollableElement={popupsScrollableElement}
      key={showDatePickerAt}
      element={element}
      isNew={isNew}
      autoFocus={focusDateInput}
      onDelete={() => {
        dependencyApi?.core?.actions.execute(deleteDateCommand(dependencyApi));
        editorView.focus();
      }}
      onSelect={(
        date: DateType | null,
        commitMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD,
      ) => {
        // Undefined means couldn't parse date, null means invalid (out of bounds) date
        if (date === undefined || date === null) {
          return;
        }
        dependencyApi?.core?.actions.execute(
          insertDateCommand(dependencyApi)({
            date,
            commitMethod,
          }),
        );
        editorView.focus();
      }}
      onTextChanged={(date?: DateType) => {
        dependencyApi?.core?.actions.execute(
          insertDateCommand(dependencyApi)({
            date,
            enterPressed: false,
          }),
        );
      }}
      closeDatePicker={() => {
        closeDatePicker()(editorView.state, dispatch);
        editorView.focus();
      }}
      closeDatePickerWithAnalytics={({ date }: { date?: DateType }) => {
        closeDatePickerWithAnalytics({ date })(editorView.state, dispatch);
        editorView.focus();
      }}
      dispatchAnalyticsEvent={dispatchAnalyticsEvent}
      weekStartDay={weekStartDay}
    />
  );
}

const datePlugin: DatePlugin = ({ config: options = {}, api }) => ({
  name: 'date',

  getSharedState(editorState) {
    if (!editorState) {
      return {
        showDatePickerAt: null,
        isNew: false,
        focusDateInput: false,
      };
    }
    const { showDatePickerAt, isNew, focusDateInput } =
      datePluginKey.getState(editorState) || {};
    return {
      showDatePickerAt,
      isNew: !!isNew,
      focusDateInput: !!focusDateInput,
    };
  },

  commands: {
    insertDate: insertDateCommand(api),
    deleteDate: deleteDateCommand(api),
  },

  nodes() {
    return [{ name: 'date', node: date }];
  },

  pmPlugins() {
    return [
      {
        name: 'date',
        plugin: options => {
          DatePicker.preload();
          return createDatePlugin(options);
        },
      },
      {
        name: 'dateKeymap',
        plugin: () => {
          DatePicker.preload();
          return keymap();
        },
      },
    ];
  },

  contentComponent({
    editorView,
    dispatchAnalyticsEvent,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
  }) {
    return (
      <ContentComponent
        dependencyApi={api}
        editorView={editorView}
        dispatchAnalyticsEvent={dispatchAnalyticsEvent}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        popupsScrollableElement={popupsScrollableElement}
        weekStartDay={options.weekStartDay}
      />
    );
  },
  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        id: 'date',
        title: formatMessage(messages.date),
        description: formatMessage(messages.dateDescription),
        priority: 800,
        keywords: ['calendar', 'day', 'time', 'today', '/'],
        keyshortcut: '//',
        icon: () => <IconDate />,
        action(insert, state) {
          const tr = createDate(true)(state);

          api?.analytics?.actions?.attachAnalyticsEvent?.({
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.DATE,
            eventType: EVENT_TYPE.TRACK,
            attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
          })(tr);

          return tr;
        },
      },
    ],
  },
});

export default datePlugin;
