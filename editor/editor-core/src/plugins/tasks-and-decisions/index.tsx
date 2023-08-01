/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import {
  decisionItem,
  decisionList,
  taskItem,
  taskList,
} from '@atlaskit/adf-schema';
import type {
  Node as PMNode,
  Schema,
} from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { INPUT_METHOD } from '../analytics';
import { messages as insertBlockMessages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { IconAction, IconDecision } from '@atlaskit/editor-common/quick-insert';

import { insertTaskDecisionAction, getListTypes } from './commands';
import inputRulePlugin from './pm-plugins/input-rules';
import keymap from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import type { TaskDecisionListType, TaskDecisionPluginOptions } from './types';
import ToolbarDecision from './ui/ToolbarDecision';
import ToolbarTask from './ui/ToolbarTask';

const taskDecisionToolbarGroup = css`
  display: flex;
`;

const addItem =
  (
    insert: (node: PMNode) => Transaction,
    listType: TaskDecisionListType,
    schema: Schema,
  ) =>
  ({
    listLocalId,
    itemLocalId,
  }: {
    listLocalId?: string;
    itemLocalId?: string;
  }) => {
    const { list, item } = getListTypes(listType, schema);
    return insert(
      list.createChecked(
        { localId: listLocalId },
        item.createChecked({
          localId: itemLocalId,
        }),
      ),
    );
  };

const tasksAndDecisionsPlugin: NextEditorPlugin<
  'taskDecision',
  {
    pluginConfiguration: TaskDecisionPluginOptions | undefined;
  }
> = ({ allowNestedTasks, consumeTabs, useLongPressSelection } = {}) => ({
  name: 'taskDecision',
  nodes() {
    return [
      { name: 'decisionList', node: decisionList },
      { name: 'decisionItem', node: decisionItem },
      {
        name: 'taskList',
        node: taskList,
      },
      { name: 'taskItem', node: taskItem },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'tasksAndDecisions',
        plugin: ({
          portalProviderAPI,
          providerFactory,
          eventDispatcher,
          dispatch,
        }) => {
          return createPlugin(
            portalProviderAPI,
            eventDispatcher,
            providerFactory,
            dispatch,
            useLongPressSelection,
          );
        },
      },
      {
        name: 'tasksAndDecisionsInputRule',
        plugin: ({ schema, featureFlags }) =>
          inputRulePlugin(schema, featureFlags),
      },
      {
        name: 'tasksAndDecisionsKeyMap',
        plugin: ({ schema }) => keymap(schema, allowNestedTasks, consumeTabs),
      }, // Needs to be after "save-on-enter"
    ];
  },

  secondaryToolbarComponent({ editorView, disabled }) {
    return (
      <div css={taskDecisionToolbarGroup}>
        <ToolbarDecision
          editorView={editorView}
          isDisabled={disabled}
          isReducedSpacing={true}
        />
        <ToolbarTask
          editorView={editorView}
          isDisabled={disabled}
          isReducedSpacing={true}
        />
      </div>
    );
  },

  pluginsOptions: {
    quickInsert: ({ formatMessage }) => [
      {
        id: 'action',
        title: formatMessage(insertBlockMessages.action),
        description: formatMessage(insertBlockMessages.actionDescription),
        priority: 100,
        keywords: ['checkbox', 'task', 'todo'],
        keyshortcut: '[]',
        icon: () => <IconAction />,
        action(insert, state) {
          return insertTaskDecisionAction(
            state,
            'taskList',
            INPUT_METHOD.QUICK_INSERT,
            addItem(insert, 'taskList', state.schema),
          );
        },
      },
      {
        id: 'decision',
        title: formatMessage(insertBlockMessages.decision),
        description: formatMessage(insertBlockMessages.decisionDescription),
        priority: 900,
        keyshortcut: '<>',
        icon: () => <IconDecision />,
        action(insert, state) {
          return insertTaskDecisionAction(
            state,
            'decisionList',
            INPUT_METHOD.QUICK_INSERT,
            addItem(insert, 'decisionList', state.schema),
          );
        },
      },
    ],
  },
});

export default tasksAndDecisionsPlugin;
