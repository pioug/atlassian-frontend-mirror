import React from 'react';
import { orderedList, bulletList, listItem } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import ToolbarLists from './ui/ToolbarLists';
import { createPlugin, pluginKey } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';
import WithPluginState from '../../ui/WithPluginState';
import { messages } from './messages';
import {
  addAnalytics,
  ACTION,
  EVENT_TYPE,
  INPUT_METHOD,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
} from '../analytics';
import { tooltip, toggleBulletList, toggleOrderedList } from '../../keymaps';
import { IconList, IconListNumber } from '../quick-insert/assets';
import { ToolbarSize } from '../../ui/Toolbar/types';

const listPlugin = (): EditorPlugin => ({
  name: 'list',

  nodes() {
    return [
      { name: 'bulletList', node: bulletList },
      { name: 'orderedList', node: orderedList },
      { name: 'listItem', node: listItem },
    ];
  },

  pmPlugins() {
    return [
      { name: 'lists', plugin: ({ dispatch }) => createPlugin(dispatch) },
      {
        name: 'listsInputRule',
        plugin: ({ schema, featureFlags }) =>
          inputRulePlugin(schema, featureFlags),
      },
      { name: 'listsKeymap', plugin: () => keymapPlugin() },
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

          return addAnalytics(state, tr, {
            action: ACTION.FORMATTED,
            actionSubject: ACTION_SUBJECT.TEXT,
            actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
            eventType: EVENT_TYPE.TRACK,
            attributes: {
              inputMethod: INPUT_METHOD.QUICK_INSERT,
            },
          });
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

          return addAnalytics(state, tr, {
            action: ACTION.FORMATTED,
            actionSubject: ACTION_SUBJECT.TEXT,
            actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
            eventType: EVENT_TYPE.TRACK,
            attributes: {
              inputMethod: INPUT_METHOD.QUICK_INSERT,
            },
          });
        },
      },
    ],
  },

  primaryToolbarComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    toolbarSize,
    disabled,
    isToolbarReducedSpacing,
  }) {
    const isSmall = toolbarSize < ToolbarSize.L;
    return (
      <WithPluginState
        plugins={{ listsState: pluginKey }}
        render={({ listsState }) => (
          <ToolbarLists
            isSmall={isSmall}
            isSeparator={true}
            isReducedSpacing={isToolbarReducedSpacing}
            disabled={disabled}
            editorView={editorView}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            popupsScrollableElement={popupsScrollableElement}
            bulletListActive={listsState!.bulletListActive}
            bulletListDisabled={listsState!.bulletListDisabled}
            orderedListActive={listsState!.orderedListActive}
            orderedListDisabled={listsState!.orderedListDisabled}
          />
        )}
      />
    );
  },
});

export default listPlugin;
