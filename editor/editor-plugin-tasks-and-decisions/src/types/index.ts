import type {
	BlockTaskItemDefinition,
	DecisionItemDefinition,
	TaskItemDefinition,
} from '@atlaskit/adf-schema';
import type { INPUT_METHOD, USER_CONTEXT } from '@atlaskit/editor-common/analytics';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types';
import type { NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';

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
	| Partial<TaskItemDefinition['attrs']>
	| Partial<BlockTaskItemDefinition['attrs']>;

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
export interface TasksAndDecisionsPluginOptions extends LongPressSelectionPluginOptions {
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

	/**
	 * Allows the blockTaskItem node to be a child of taskList (taskItem variant that supports block children - currently only supports extension and is intended to support Confluence TinyMCE migration flows in conjunction with the Legacy Content Extension)
	 */
	allowBlockTaskItem?: boolean;
}

/**
 * @private
 * @deprecated Use {@link TasksAndDecisionsPluginOptions} instead.
 * @see https://product-fabric.atlassian.net/browse/ED-27496
 */
export type TaskDecisionPluginOptions = TasksAndDecisionsPluginOptions;

export type TaskDecisionPluginState = {
	insideTaskDecisionItem: boolean;
	focusedTaskItemLocalId: string | null;
	hasEditPermission?: boolean;
	hasRequestedEditPermission?: boolean;
	requestToEditContent?: () => void;
	taskDecisionProvider: TaskDecisionProvider | undefined;
	openRequestToEditPopupAt?: number | null;
	decorations: DecorationSet;
};

export type TaskAndDecisionsSharedState = Pick<
	TaskDecisionPluginState,
	| 'focusedTaskItemLocalId'
	| 'hasEditPermission'
	| 'requestToEditContent'
	| 'taskDecisionProvider'
	| 'hasRequestedEditPermission'
	| 'openRequestToEditPopupAt'
> & {
	// derived state
	isInsideTask: boolean;
	indentDisabled: boolean;
	outdentDisabled: boolean;
};

export type GetContextIdentifier = () => ContextIdentifierProvider | undefined;

export type TaskItemState = 'DONE' | 'TODO';

export type TaskItemInfoMeta = {
	from: number;
	to: number;
	checkState: TaskItemState;
};
