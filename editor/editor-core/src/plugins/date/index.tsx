import React from 'react';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import Loadable from 'react-loadable';
import { date } from '@atlaskit/adf-schema';
import type {
  NextEditorPlugin,
  ExtractInjectionAPI,
} from '@atlaskit/editor-common/types';
import {
  insertDate,
  closeDatePicker,
  closeDatePickerWithAnalytics,
  createDate,
  deleteDate,
} from './actions';
import createDatePlugin from './pm-plugins/main';
import keymap from './pm-plugins/keymap';

import type editorDisabledPlugin from '../editor-disabled';
import { IconDate } from '@atlaskit/editor-common/quick-insert';

import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import type { DatePluginConfig, DateType } from './types';
import { pluginKey as datePluginKey } from './pm-plugins/plugin-key';
import type { Props as DatePickerProps } from './ui/DatePicker';
import type { UiComponentFactoryParams } from '@atlaskit/editor-common/types';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { WeekDay } from '@atlaskit/calendar/types';

const DatePicker = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_editor-datepicker" */ './ui/DatePicker'
    ).then((mod) => mod.default) as Promise<
      React.ComponentType<DatePickerProps>
    >,
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
        deleteDate()(editorView.state, dispatch);
        editorView.focus();
        return;
      }}
      onSelect={(
        date: DateType | null,
        commitMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD,
      ) => {
        // Undefined means couldn't parse date, null means invalid (out of bounds) date
        if (date === undefined || date === null) {
          return;
        }
        insertDate(date, undefined, commitMethod)(editorView.state, dispatch);
        editorView.focus();
      }}
      onTextChanged={(date?: DateType) => {
        insertDate(
          date,
          undefined,
          undefined,
          false,
        )(editorView.state, dispatch);
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

const datePlugin: NextEditorPlugin<
  'date',
  {
    pluginConfiguration: DatePluginConfig | undefined;
    dependencies: [typeof analyticsPlugin, typeof editorDisabledPlugin];
    sharedState: {
      showDatePickerAt?: number | null;
      isNew: boolean;
      focusDateInput: boolean;
    };
  }
> = (options = {}, api) => ({
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

  nodes() {
    return [{ name: 'date', node: date }];
  },

  pmPlugins() {
    return [
      {
        name: 'date',
        plugin: (options) => {
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
          const tr = createDate(true)(insert, state);

          api?.dependencies?.analytics?.actions?.attachAnalyticsEvent?.({
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
