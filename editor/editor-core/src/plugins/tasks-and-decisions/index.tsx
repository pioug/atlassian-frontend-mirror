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
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages as insertBlockMessages } from '@atlaskit/editor-common/messages';
import { IconAction, IconDecision } from '@atlaskit/editor-common/quick-insert';

import { stateKey as taskPluginKey } from './pm-plugins/plugin-key';
import {
  insertTaskDecisionAction,
  getListTypes,
  insertTaskDecisionCommand,
} from './commands';
import inputRulePlugin from './pm-plugins/input-rules';
import keymap, {
  getIndentCommand,
  getUnindentCommand,
} from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import type { TaskAndDecisionsPlugin, TaskDecisionListType } from './types';
import ToolbarDecision from './ui/ToolbarDecision';
import ToolbarTask from './ui/ToolbarTask';
import {
  getCurrentIndentLevel,
  getTaskItemIndex,
  isInsideTask,
} from './pm-plugins/helpers';
import { MAX_INDENTATION_LEVEL } from '@atlaskit/editor-common/indentation';

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

const tasksAndDecisionsPlugin: TaskAndDecisionsPlugin = ({
  config: { allowNestedTasks, consumeTabs, useLongPressSelection } = {},
  api,
}) => ({
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

  getSharedState(editorState) {
    if (!editorState) {
      return undefined;
    }

    const pluginState = taskPluginKey.getState(editorState);
    const indentLevel = getCurrentIndentLevel(editorState.selection) || 0;
    const itemIndex = getTaskItemIndex(editorState);

    return {
      focusedTaskItemLocalId: pluginState?.focusedTaskItemLocalId || null,
      isInsideTask: isInsideTask(editorState),
      indentDisabled: itemIndex === 0 || indentLevel >= MAX_INDENTATION_LEVEL,
      outdentDisabled: indentLevel <= 1,
    };
  },

  actions: {
    insertTaskDecision: insertTaskDecisionCommand(api?.analytics?.actions),
    indentTaskList: getIndentCommand(api?.analytics?.actions),
    outdentTaskList: getUnindentCommand(api?.analytics?.actions),
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
            api,
            useLongPressSelection,
          );
        },
      },
      {
        name: 'tasksAndDecisionsInputRule',
        plugin: ({ schema, featureFlags }) =>
          inputRulePlugin(api?.analytics?.actions)(schema, featureFlags),
      },
      {
        name: 'tasksAndDecisionsKeyMap',
        plugin: ({ schema }) =>
          keymap(schema, api, allowNestedTasks, consumeTabs),
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
          editorAPI={api}
        />
        <ToolbarTask
          editorView={editorView}
          isDisabled={disabled}
          isReducedSpacing={true}
          editorAPI={api}
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
          return insertTaskDecisionAction(api?.analytics?.actions)(
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
          return insertTaskDecisionAction(api?.analytics?.actions)(
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
