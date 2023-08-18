import React from 'react';
import {
  bulletList,
  listItem,
  orderedList,
  orderedListWithOrder,
} from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rules';
import keymapPlugin from './pm-plugins/keymap';
import { listMessages as messages } from '@atlaskit/editor-common/messages';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  INPUT_METHOD,
} from '../analytics';
import { toggleBulletList, toggleOrderedList, tooltip } from '../../keymaps';
import { IconList, IconListNumber } from '@atlaskit/editor-common/quick-insert';
import type { ListPlugin } from '@atlaskit/editor-plugin-list';

/*
  Toolbar buttons to bullet and ordered list can be found in
  packages/editor/editor-core/src/plugins/toolbar-lists-indentation/ui/Toolbar.tsx
 */
const listPlugin: ListPlugin = (options, api) => {
  const featureFlags =
    api?.dependencies.featureFlags.sharedState.currentState() || {};
  const editorAnalyticsAPI = api?.dependencies.analytics?.actions;

  return {
    name: 'list',
    nodes() {
      return [
        { name: 'bulletList', node: bulletList },
        {
          name: 'orderedList',
          node: options?.restartNumberedLists
            ? orderedListWithOrder
            : orderedList,
        },
        { name: 'listItem', node: listItem },
      ];
    },

    pmPlugins() {
      return [
        {
          name: 'list',
          plugin: ({ dispatch }) => createPlugin(dispatch, featureFlags),
        },
        {
          name: 'listInputRule',
          plugin: ({ schema, featureFlags }) =>
            inputRulePlugin(schema, featureFlags),
        },
        {
          name: 'listKeymap',
          plugin: () =>
            keymapPlugin(featureFlags, api?.dependencies.analytics?.actions),
        },
      ];
    },

    pluginsOptions: {
      quickInsert: ({ formatMessage }) => [
        {
          id: 'unorderedList',
          title: formatMessage(messages.unorderedList),
          description: formatMessage(messages.unorderedListDescription),
          keywords: ['ul', 'unordered'],
          priority: 1100,
          keyshortcut: tooltip(toggleBulletList),
          icon: () => <IconList />,
          action(insert, state) {
            const tr = insert(
              state.schema.nodes.bulletList.createChecked(
                {},
                state.schema.nodes.listItem.createChecked(
                  {},
                  state.schema.nodes.paragraph.createChecked(),
                ),
              ),
            );

            editorAnalyticsAPI?.attachAnalyticsEvent({
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.LIST,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
              eventType: EVENT_TYPE.TRACK,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT,
              },
            })(tr);

            return tr;
          },
        },
        {
          id: 'orderedList',
          title: formatMessage(messages.orderedList),
          description: formatMessage(messages.orderedListDescription),
          keywords: ['ol', 'ordered'],
          priority: 1200,
          keyshortcut: tooltip(toggleOrderedList),
          icon: () => <IconListNumber />,
          action(insert, state) {
            const tr = insert(
              state.schema.nodes.orderedList.createChecked(
                {},
                state.schema.nodes.listItem.createChecked(
                  {},
                  state.schema.nodes.paragraph.createChecked(),
                ),
              ),
            );

            editorAnalyticsAPI?.attachAnalyticsEvent({
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.LIST,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
              eventType: EVENT_TYPE.TRACK,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT,
              },
            })(tr);

            return tr;
          },
        },
      ],
    },
  };
};

export default listPlugin;
