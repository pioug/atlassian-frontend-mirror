import React from 'react';
import { findDomRefAtPos } from 'prosemirror-utils';
import Loadable from 'react-loadable';
import { date } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';
import {
  insertDate,
  closeDatePicker,
  closeDatePickerWithAnalytics,
  createDate,
  deleteDate,
} from './actions';
import createDatePlugin from './pm-plugins/main';
import keymap from './pm-plugins/keymap';

import { getFeatureFlags } from '../feature-flags-context';

import { pluginKey as editorDisabledPluginKey } from '../editor-disabled';
import { IconDate } from '../quick-insert/assets';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  addAnalytics,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { DateType } from './types';
import { pluginKey as datePluginKey } from './pm-plugins/plugin-key';
import type { Props as DatePickerProps } from './ui/DatePicker';

const DatePicker = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_editor-datepicker" */ './ui/DatePicker'
    ).then((mod) => mod.default) as Promise<
      React.ComponentType<DatePickerProps>
    >,
  loading: () => null,
});

const datePlugin = (): EditorPlugin => ({
  name: 'date',

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
    const { state, dispatch } = editorView;
    const domAtPos = editorView.domAtPos.bind(editorView);
    return (
      <WithPluginState
        plugins={{
          datePlugin: datePluginKey,
          editorDisabledPlugin: editorDisabledPluginKey,
        }}
        render={({ editorDisabledPlugin, datePlugin }) => {
          if (
            !datePlugin?.showDatePickerAt ||
            editorDisabledPlugin?.editorDisabled
          ) {
            return null;
          }
          const { showDatePickerAt, isNew, focusDateInput } = datePlugin;

          const element = findDomRefAtPos(
            showDatePickerAt,
            domAtPos,
          ) as HTMLElement;

          const allFlags = getFeatureFlags(state);
          const { keyboardAccessibleDatepicker } = allFlags;

          return (
            <DatePicker
              mountTo={popupsMountPoint}
              boundariesElement={popupsBoundariesElement}
              scrollableElement={popupsScrollableElement}
              key={showDatePickerAt}
              showTextField={keyboardAccessibleDatepicker}
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
                insertDate(
                  date,
                  undefined,
                  commitMethod,
                )(editorView.state, dispatch);
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
                closeDatePickerWithAnalytics({ date })(
                  editorView.state,
                  dispatch,
                );
                editorView.focus();
              }}
              dispatchAnalyticsEvent={dispatchAnalyticsEvent}
            />
          );
        }}
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

          addAnalytics(state, tr, {
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.DATE,
            eventType: EVENT_TYPE.TRACK,
            attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
          });
          return tr;
        },
      },
    ],
  },
});

export default datePlugin;
