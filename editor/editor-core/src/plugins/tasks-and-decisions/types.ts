import type {
  DecisionItemDefinition,
  TaskItemDefinition,
} from '@atlaskit/adf-schema';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';

import type {
  INPUT_METHOD,
  USER_CONTEXT,
} from '@atlaskit/editor-common/analytics';
import type {
  NextEditorPlugin,
  OptionalPlugin,
  LongPressSelectionPluginOptions,
} from '@atlaskit/editor-common/types';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { insertTaskDecisionCommand } from './commands';
import type {
  getIndentCommand,
  getUnindentCommand,
} from './pm-plugins/keymaps';

export type TaskDecisionListType = 'taskList' | 'decisionList';

export type TaskDecisionInputMethod =
  | INPUT_METHOD.TOOLBAR
  | INPUT_METHOD.INSERT_MENU
  | INPUT_METHOD.QUICK_INSERT
  | INPUT_METHOD.FORMATTING
  | INPUT_METHOD.KEYBOARD;

export type ContextData = {
  objectId: string;
  containerId: string;
  userContext: USER_CONTEXT;
};

export type AddItemAttrs =
  | Partial<DecisionItemDefinition['attrs']>
  | Partial<TaskItemDefinition['attrs']>;

export type AddItemTransactionCreator = (opts: {
  state: EditorState;
  tr: Transaction;
  list: NodeType;
  item: NodeType;
  listLocalId: string;
  itemLocalId: string;
  itemAttrs?: AddItemAttrs;
}) => Transaction | null;

export interface TaskDecisionPluginOptions
  extends LongPressSelectionPluginOptions {
  allowNestedTasks?: boolean;
  consumeTabs?: boolean;
}

export type TaskAndDecisionsSharedState = {
  focusedTaskItemLocalId: string | null;
  indentDisabled: boolean;
  outdentDisabled: boolean;
  isInsideTask: boolean;
};

export type TaskAndDecisionsPlugin = NextEditorPlugin<
  'taskDecision',
  {
    pluginConfiguration: TaskDecisionPluginOptions | undefined;
    sharedState: TaskAndDecisionsSharedState | undefined;
    dependencies: [
      OptionalPlugin<TypeAheadPlugin>,
      OptionalPlugin<AnalyticsPlugin>,
    ];
    actions: {
      insertTaskDecision: ReturnType<typeof insertTaskDecisionCommand>;
      indentTaskList: ReturnType<typeof getIndentCommand>;
      outdentTaskList: ReturnType<typeof getUnindentCommand>;
    };
  }
>;
