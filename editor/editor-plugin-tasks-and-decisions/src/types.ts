import type { DecisionItemDefinition, TaskItemDefinition } from '@atlaskit/adf-schema';
import type { INPUT_METHOD, USER_CONTEXT } from '@atlaskit/editor-common/analytics';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type {
	EditorCommand,
	LongPressSelectionPluginOptions,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode';
import type { TypeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

import type { insertTaskDecisionCommand } from './commands';
import type { getIndentCommand, getUnindentCommand } from './pm-plugins/keymaps';

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

/**
 * Interface representing the options for the TaskDecisionPlugin.
 * Extends the LongPressSelectionPluginOptions interface.
 */
export interface TaskDecisionPluginOptions extends LongPressSelectionPluginOptions {
	/**
	 * Indicates whether nested tasks are allowed.
	 * @default false
	 */
	allowNestedTasks?: boolean;

	/**
	 * Indicates whether tab key presses should be consumed.
	 * @default false
	 */
	consumeTabs?: boolean;

	/**
	 * Indicates whether the user has permission to edit.
	 * @default false
	 */
	hasEditPermission?: boolean;

	/**
	 * Indicates whether the user has requested permission to edit.
	 * @default false
	 */
	hasRequestedEditPermission?: boolean;

	/**
	 * Description of the quick insert for creating action items.
	 */
	quickInsertActionDescription?: string;

	/**
	 * Function to request edit permission.
	 */
	requestToEditContent?: () => void;

	/**
	 * The provider for tasks and decisions.
	 */
	taskDecisionProvider?: Promise<TaskDecisionProvider>;

	/**
	 * Placeholder text to display when creating a task.
	 */
	taskPlaceholder?: string;
}

export type TaskDecisionPluginState = {
	insideTaskDecisionItem: boolean;
	focusedTaskItemLocalId: string | null;
	hasEditPermission?: boolean;
	hasRequestedEditPermission?: boolean;
	requestToEditContent?: () => void;
	taskDecisionProvider: TaskDecisionProvider | undefined;
};

export type TaskAndDecisionsSharedState = Pick<
	TaskDecisionPluginState,
	| 'focusedTaskItemLocalId'
	| 'hasEditPermission'
	| 'requestToEditContent'
	| 'taskDecisionProvider'
	| 'hasRequestedEditPermission'
> & {
	// derived state
	isInsideTask: boolean;
	indentDisabled: boolean;
	outdentDisabled: boolean;
};

export type TasksAndDecisionsPlugin = NextEditorPlugin<
	'taskDecision',
	{
		pluginConfiguration: TaskDecisionPluginOptions | undefined;
		sharedState: TaskAndDecisionsSharedState | undefined;
		dependencies: [
			OptionalPlugin<TypeAheadPlugin>,
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<ContextIdentifierPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
		];
		actions: {
			insertTaskDecision: ReturnType<typeof insertTaskDecisionCommand>;
			indentTaskList: ReturnType<typeof getIndentCommand>;
			outdentTaskList: ReturnType<typeof getUnindentCommand>;
			setProvider: (provider: Promise<TaskDecisionProvider>) => Promise<boolean>;
		};
		commands: {
			updateEditPermission: (hasEditPermission: boolean | undefined) => EditorCommand;
			updateHasRequestedEditPermission: (hasRequestedEditPermission: boolean) => EditorCommand;
		};
	}
>;

export type GetContextIdentifier = () => ContextIdentifierProvider | undefined;
