import type { DocNode } from '@atlaskit/adf-schema';

import type { ChatContextPayload } from './common/utils/chat-context';

export const Topics = {
	AI_MATE: 'ai-mate',
} as const;
export type Topic = (typeof Topics)[keyof typeof Topics];

export type PayloadCore<TKey extends string, TData = void> = {
	type: TKey;
	source: string;
	openChat?: boolean;
	product?: string;
	interactionSource?: string;
} & (TData extends void ? {} : { data: TData });

export type MessageSendPayload = PayloadCore<
	'message-send',
	{
		prompt: string;
		productKey?: string;
	}
>;

export type ChatClosePayload = PayloadCore<'chat-close', {}>;

// Can only specify either `agentId` or `agentExternalConfigReference`, not both
type TargetAgentParam =
	| {
			agentId: string;
			agentExternalConfigReference?: never;
	  }
	| {
			agentId?: never;
			agentExternalConfigReference: string;
	  };

export type ChatNewPayload = PayloadCore<
	'chat-new',
	{
		name?: string;
		// Used to prefab the chat history
		dialogues: Array<{
			human_message: {
				content: string;
				mimeType?: 'text/markdown' | 'text/adf';
			};
			agent_message: {
				content: string;
				mimeType?: 'text/markdown' | 'text/adf';
			};
		}>;
		// Used for follow-up prompt once chat is created
		prompt?: string | DocNode;
		files?: UploadedFile[];
		contentContext?: 'staging-area' | 'global';
		sourceId?: string;
		minionAlias?: string;
	} & Partial<TargetAgentParam>
>;

export type EditorContextPayloadData =
	| {
			document: {
				type: 'text/markdown' | 'text/adf';
				content: string;
			};
			selection: {
				type: 'text/markdown' | 'text/plain';
				content: string;
			};
			selectionFragment?: string;
			selectionLocalIds?: string;
			isViewMode?: boolean;
	  }
	| undefined;

export type WhiteboardContextPayloadData =
	| {
			type: 'image/svg+xml' | 'text/plain';
			content: string;
			contentId?: string;
			isViewMode?: boolean;
	  }
	| undefined;

export type DatabaseContextPayloadData =
	| {
			contentId: string;
			csv: string;
			title: string;
			url: string;
	  }
	| undefined;

export type BrowserContextPayloadData = {
	context:
		| {
				browserUrl: string;
				htmlBody?: string;
				canvasText?: string;
		  }
		| undefined;
};

export type WorkflowContextPayloadData = {
	currentWorkflowDocument?: Record<string, unknown>;
};

// Not using the PayloadCore because the `data: type | undefined` is necessary
// but `| undefined` will cause `data` to be removed by PayloadCore
export type EditorContextPayload = PayloadCore<'editor-context-payload'> & {
	data: EditorContextPayloadData;
};

// Not using the PayloadCore because the `data: type | undefined` is necessary
// but `| undefined` will cause `data` to be removed by PayloadCore
export type BrowserContextPayload = PayloadCore<'browser-context-payload'> & {
	data: BrowserContextPayloadData;
};

// Not using the PayloadCore because the `data: type | undefined` is necessary
// but `| undefined` will cause `data` to be removed by PayloadCore
export type WhiteboardContextPayload = PayloadCore<'whiteboard-context-payload'> & {
	data: WhiteboardContextPayloadData;
};

export type ChatDraftPayload = PayloadCore<'chat-draft'>;

export type OpenBrowseAgentPayload = PayloadCore<'open-browse-agent-modal'>;

export type OpenBrowseAgentSidebarPayload = PayloadCore<'open-browse-agent-sidebar'>;

export type EditorSuggestionPayload = PayloadCore<
	'editor-suggestion',
	{
		mode: 'insert' | 'replace';
		content: string;
		agentId?: string;
	}
>;

export type EditorAgentChangedPayload = PayloadCore<
	'agent-changed',
	{
		agent: {
			id: string;
			name: string;
			identityAccountId?: string | null;
		} | null;
	}
>;

export type ChatOpenPayload = PayloadCore<
	'chat-open',
	{
		channelId: string;
		// @deprecated this is not being used, please use `chat-new` if you want to open a new chat with an agent
		agentId?: string;
	}
>;

export type ForgeAppAuthSuccess = PayloadCore<
	'forge-auth-success',
	{
		is3pActionAuth?: boolean;
	}
>;
export type ForgeAppAuthFailure = PayloadCore<
	'forge-auth-failure',
	{
		is3pActionAuth?: boolean;
		errorMessage: string | undefined;
	}
>;

/** Inserts a prompt into the chat input - either:
 * - A prompt without a placeholder - sends as a message
 * - A prompt with a placeholder - inserts the prompt into the chat input
 */
export type InsertPromptPayload = PayloadCore<
	'insert-prompt',
	{
		prompt: string;
		/**
		 * Overrides the default placeholder type
		 */
		placeholderType?: 'person' | 'link' | 'generic';
	}
>;

export type TransitionId = string;
export type StatusId = string;
export type StatusCategory = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'UNDEFINED';
export type RuleConfig = {
	[key: string]: string;
};
export type AddStatusRovoPayload = {
	statusId: StatusId;
	statusName: string;
	statusCategory: StatusCategory;
};
export type UpdateStatusRovoPayload = {
	oldStatusName: string;
	oldStatusCategory: StatusCategory;
	newStatusName: string;
	newStatusCategory: StatusCategory;
};
export type DeleteStatusRovoPayload = {
	statusId: string;
	statusName: string;
	statusCategory: StatusCategory;
};
export type AddNewTransitionRovoPayload = {
	id: TransitionId;
	name: string;
	toStatusId: StatusId;
	toStatusName: string;
	toStatusCategory: StatusCategory;
	links: {
		fromStatusId: StatusId;
		fromStatusName: string;
		fromStatusCategory: StatusCategory;
	}[];
};
export type UpdateTransitionRovoPayload = {
	id: TransitionId;
	name: string;
	toStatusId: StatusId;
	toStatusName: string;
	toStatusCategory: StatusCategory;
	links: {
		fromStatusId: StatusId;
		fromStatusName: string;
		fromStatusCategory: StatusCategory;
	}[];
};
export type DeleteTransitionRovoPayload = {
	transitionId: TransitionId;
	transitionName: string;
};
export type AddRuleRovoPayload = {
	ruleTemplateKey: string;
	ruleConfig: RuleConfig;
	ruleDescription: string;
	transitionId: TransitionId;
};
export type UpdateRuleRovoPayload = {
	ruleTemplateKey: string;
	ruleConfig: RuleConfig;
	transitionId: TransitionId;
	ruleIdBeingEdited: string;
	ruleDescription: string;
};
export type DeleteRuleRovoPayload = {
	ruleId: string;
	ruleTemplateKey: string;
	ruleDescription: string;
	transitionId: TransitionId;
};

export type JiraWorkflowWizardAction =
	| { operationType: 'ADD_STATUS'; payload: AddStatusRovoPayload }
	| { operationType: 'UPDATE_STATUS'; payload: UpdateStatusRovoPayload }
	| { operationType: 'DELETE_STATUS'; payload: DeleteStatusRovoPayload }
	| { operationType: 'ADD_TRANSITION'; payload: AddNewTransitionRovoPayload }
	| { operationType: 'UPDATE_TRANSITION'; payload: UpdateTransitionRovoPayload }
	| { operationType: 'DELETE_TRANSITION'; payload: DeleteTransitionRovoPayload }
	| { operationType: 'ADD_RULE'; payload: AddRuleRovoPayload }
	| { operationType: 'UPDATE_RULE'; payload: UpdateRuleRovoPayload }
	| { operationType: 'DELETE_RULE'; payload: DeleteRuleRovoPayload };

export type JiraWorkflowWizardActionsPayload = PayloadCore<
	'jira-workflow-wizard-actions',
	{
		operations?: JiraWorkflowWizardAction[];
		currentWorkflowDocument?: Record<string, unknown>;
	}
>;

export type DashboardInsightsActionsPayload = PayloadCore<'dashboard-insights-actions'> & {
	data?: DashboardInsightsActionsPayloadData;
};

export type DashboardInsightsActionsPayloadData =
	| {
			content: string;
	  }
	| undefined;

export type SetChatContextPayload = PayloadCore<'set-message-context', ChatContextPayload>;

export type Payload =
	| MessageSendPayload
	| ChatClosePayload
	| ChatNewPayload
	| ChatDraftPayload
	| EditorContextPayload
	| ChatOpenPayload
	| OpenBrowseAgentPayload
	| OpenBrowseAgentSidebarPayload
	| EditorSuggestionPayload
	| EditorAgentChangedPayload
	| BrowserContextPayload
	| WhiteboardContextPayload
	| ForgeAppAuthSuccess
	| ForgeAppAuthFailure
	| JiraWorkflowWizardActionsPayload
	| InsertPromptPayload
	| DashboardInsightsActionsPayload
	| SetChatContextPayload;

export type Callback = (payload: Payload) => void;

export type TopicEvents = {
	[key in Topic]?: Array<{
		id: string;
		callback: Callback;
	}>;
};

export type TopicEventQueue = {
	[key in Topic]?: Payload;
};

export type UploadedFile = {
	id: string;
	conversation_channel_id?: string;
	blob_id?: string;
	name: string;
	size?: number;
	type?: string;
	created_at?: string;
	owner?: string;
	isLoading: boolean;
	error?: string;
	fileObject?: File;
};
