import type { DocNode } from '@atlaskit/adf-schema/doc';

import type { SolutionDraftAgentUpdatePayload } from './common/types/agent';
import type { JsmJourneyBuilderActionsPayload } from './common/types/jsm-journey-builder';
import type {
	SolutionArchitectAgentActivationFlowStoppedPayload,
	SolutionArchitectAgentActivationPayload,
	SolutionArchitectAgentActivationFlowStartedPayload,
	SolutionArchitectHandoffPayload,
	SolutionPlanStateUpdatePayload,
	StudioAutomationBuildUpdatePayload,
	StudioLandingPageRedirectPayload,
	UpdateAgentConfigurationPayload,
} from './common/types/solution-architect';
import type { ChatContextPayload } from './common/utils/chat-context/types';
import type { RovoChatOpenMode } from './common/utils/params/types';

export const Topics = {
	AI_MATE: 'ai-mate',
	AI_MATE_ACTIONS: 'ai-mate-actions',
	AI_MATE_INSERT_URLS: 'ai-mate-chat-inserts',
	AI_MATE_CHAT_INPUT_OVERLAY: 'ai-mate-chat-input-overlay',
	AVP: 'avp',
} as const;
export type Topic = (typeof Topics)[keyof typeof Topics];

export type PayloadCore<TKey extends string, TData = void> = {
	type: TKey;
	source: string;
	openChat?: boolean;
	openChatMode?: RovoChatOpenMode;
	product?: string;
	interactionSource?: string;
	/**
	 * When true, subscribers that opt into the same consumeOnceKey should process this
	 * logical event once total. The delivery id used for deduplication is internal to
	 * rovo-triggers and is generated for each publish call.
	 */
	consumeOnce?: boolean;
} & (TData extends void ? {} : { data: TData });

export type MessageSendPayload = PayloadCore<
	'message-send',
	{
		prompt: string;
		productKey?: string;
		minionAlias?: string;
		files?: UploadedFile[];
	}
>;

export type ChatClosePayload = PayloadCore<'chat-close', {}>;

export type SmartCreationModalOpenPayload = PayloadCore<
	'open-smart-creation-modal',
	{
		channelId?: string;
		entryPoint: string;
		stagingAreaActive: boolean;
		isFloating: boolean;
		shouldShowBackButton: boolean;
	}
>;

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

type PlaceholderParam = {
	// Overrides the default placeholder type
	placeholderType?: 'person' | 'link' | 'generic' | 'skill';
};

type ChatModeParam = {
	deepResearchEnabled?: boolean;
	thinkDeeperEnabled?: boolean;
	fastModeEnabled?: boolean;
	taskModeEnabled?: boolean;
	webSearchEnabled?: boolean;
	useCurrentPageContext?: boolean;
	appFilters?: unknown[];
};

type SerializableCreationContextValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| { [key: string | number]: SerializableCreationContextValue }
	| SerializableCreationContextValue[];

export type CreationContextParams = {
	templateInput?: {
		templateId: string;
		templateType: string;
	};
	jiraContext?: unknown;
	dynamicUiType?: string;
	dynamicUiSubtype?: string;
	dynamicUiSource?: unknown;
	forcedContentType?: string;
	contentMauiId?: string;
	mediaFileId?: string;
	source?: string;
	shouldUseExistingContent?: boolean;
	isViewMode?: boolean;
	experience?:
		| 'cwr'
		| 'cwr_type'
		| 'cwr_edit'
		| 'cwr_existing'
		| 'inline_edit'
		| 'inline_view'
		| 'remix'
		| 'remix_edit'
		| 'remix_object'
		| 'remix_custom'
		| 'chat_edit'
		| 'chat_view'
		| 'keep_existing_page_structure';
	contentTypes?: string[];
	blocks?: string[];
	spaceKey?: string;
	additionalContext?: Record<string, SerializableCreationContextValue>;
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
		creationContextParams?: CreationContextParams;
		/**
		 * Overrides the default auto-send behavior for prompts.
		 * Set this to true to insert prompts not containing backticks into the chat input for dynamic
		 * user completion, rather than sending them immediately.
		 */
		overrideAutoSend?: boolean;
		// Used to indicate if the prompt is a placeholder, only works if `prompt` is a string
		isPromptPlaceholder?: boolean;
		files?: UploadedFile[];
		contentContext?: 'staging-area' | 'global';
		sourceId?: string;
		minionAlias?: string;
		// Skip creating a seeded conversation in the BE with auto-generated name
		skipCreatingSeededConversation?: boolean;
		// Space to set as the selected space bar in the chat input
		selectedSpace?: { id: string; name: string; emoji?: string };
		// Reset to default chat view from previously selected view, e.g. Browse agents
		resetActiveMenu?: boolean;
		// Chat mode options to configure the conversation behavior
		mode?: ChatModeParam;
		// AI feature context to set in the store when the chat is created.
		// Each key-value pair is set via setAIFeatureContext. Stale entries for
		// known keys (e.g. 'projectContext') are cleared before new values are applied.
		aiFeatureContext?: Record<string, unknown>;
		// Agent version info for testing a specific version of an agent in the chat.
		// Used by Studio to pass the currently selected version when clicking Test.
		agentVersion?: {
			versionId?: string;
			versionType?: string;
			versionNumber?: number;
		};
		spaceId?: string;
		/**
		 * Optional artifact representing the object the user is currently interacting with or
		 * acting on (e.g. 3P forge artifacts that are not resolvable without an ARI).
		 * Sent as `search_artifact` in `body.context`.
		 */
		searchArtifact?: SendMessageSearchArtifact;
		/**
		 * Optional conversation-channel tags forwarded to the backend on conversation creation.
		 * Used by the agent-mention-in-comment feature to pass mention-in-comment, page:<pageId>,
		 * and comment:<commentId> so the backend can create a SessionAssociationPublic record.
		 */
		tags?: string[];
	} & Partial<TargetAgentParam> &
		PlaceholderParam
>;

/**
 * Opens the Rovo conversation assistant and seeds a chat from a Rovo Insight,
 * reproducing the same experience as clicking an insight inside the in-panel
 * InsightsFeed (seeded ADF agent message, insight header icon/title, seeded
 * follow-ups, and a back-to-pulse override).
 *
 * Published by surfaces that render insights outside the panel (e.g. the home
 * insights carousel). All fields are serializable: the icon is carried as the
 * raw API string keys (`iconKey`/`iconColor`) and re-resolved panel-side via
 * `resolveInsightIcon`/`resolveInsightIconAppearance`, since React components
 * cannot cross the event bus. The standardized back-button label is owned
 * panel-side and is intentionally not part of this payload.
 */
export type InsightsOpenInChatPayload = PayloadCore<
	'insights-open-in-chat',
	{
		/** Stringified ADF JSON for the insight detail — seeded as the agent message. */
		adf: string;
		/** Conversation name / header title. */
		conversationTitle: string;
		/** Raw API `icon` string key (e.g. `'lightbulb'`), re-resolved panel-side. */
		iconKey: string;
		/** Raw API `color` string key (e.g. `'blueBold'`), re-resolved panel-side. */
		iconColor: string;
		/** Insight category (e.g. group category), used for click analytics attribution. */
		insightCategory: string;
		/** Follow-up prompt strings to seed into the conversation. */
		followUps?: string[] | null;
	}
>;

/**
 * Published from the panel (publisher) side when the user leaves a seeded Rovo
 * Insight chat (via any exit path). Surfaces rendering the Rovo Insights carousel
 * subscribe to this to clear the selected-card highlight. Carries no data: the
 * only meaning is "the user is no longer in an insight chat".
 */
export type InsightsChatExitedPayload = PayloadCore<'insights-chat-exited', {}>;

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
			contentMauiId?: string;
			mediaFileId?: string;
			dynamicUiSource?: {
				contentType: string;
				startLocalId?: string;
				endLocalId?: string;
				startIndex?: number;
				endIndex?: number;
				fragmentAdf?: string;
			};
			dynamicUiType?: string;
			isViewMode?: boolean;
			isDraftLockedForEditing?: boolean;
			useGenericEditorSkill?: boolean;
			additionalContext?: Record<string, unknown>;
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

export type SlidesContextPayloadData =
	| {
			xml: string;
			contentId: string;
			title: string;
			url: string;
			selectedSlideIndex: number;
			selectedElementIds: string[];
			isViewMode?: boolean;
	  }
	| undefined;

export type DatabaseContextPayloadData =
	| {
			contentId: string;
			csv: string;
			title: string;
			url: string;
			selectedElementIds?: string[];
			isViewMode?: boolean;
	  }
	| undefined;

/** Partial database context for iframe updates (e.g. selection-only). */
export type DatabaseContextUpdatePayloadData = Partial<NonNullable<DatabaseContextPayloadData>>;

export type DatabaseContextPayload = PayloadCore<
	'database-context-payload',
	DatabaseContextUpdatePayloadData
>;

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

export type JiraCreateContextPayloadData = {
	draftWorkItems:
		| {
				projectIdOrKey: string;
				issueTypeId: string;
				summary: string;
				fields: Record<string, unknown>;
		  }[]
		| null;
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

// Not using the PayloadCore because the `data: type | undefined` is necessary
// but `| undefined` will cause `data` to be removed by PayloadCore
export type JiraCreateContextPayload = PayloadCore<'jira-create-context-payload'> & {
	data: JiraCreateContextPayloadData;
};

export type ChatDraftPayload = PayloadCore<'chat-draft'>;

export type SmartLink3PProjectContext = {
	projectId: string;
	projectName: string;
	projectUrl: string;
};

export type SmartLink3PPostAuthProvider = 'Google Drive';

/**
 * Experiment-scoped Smart Link post-auth launch event for
 * platform_sl_3p_post_auth_chat_open_fg / platform_sl_3p_post_auth_chat_open_exp.
 *
 * This opens Rovo Chat in mini-modal mode with custom post-auth UI, without sending
 * a prompt. If the experiment does not become permanent, remove this event type as
 * part of the experiment cleanup.
 */
export type ChatSmartLink3PPostAuthLaunchPayload = PayloadCore<
	'chat-smartlink-3p-post-auth-launch',
	{
		extensionKey: string;
		provider: SmartLink3PPostAuthProvider;
		projectContext: SmartLink3PProjectContext;
	}
>;

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

export type UploadAndInsertMediaPayload = PayloadCore<
	'upload-and-insert-media',
	{
		sourceUrl: string;
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
		// Optimistic agent metadata for immediate header rendering - allows showing agent name
		// and avatar immediately from session data while full agent details are fetched in the background
		agentName?: string;
		agentIdentityAccountId?: string;
		avatarUrl?: string;
		// Reset to default chat view from previously selected view, e.g. Browse agents
		resetActiveMenu?: boolean;
		// Open the agent selector menu when chat is opened
		openAgentSelector?: boolean;
		// Optional AI feature context applied when the chat is opened
		aiFeatureContext?: Record<string, unknown>;
	}
>;

export type ForgeAppAuthSuccess = PayloadCore<
	'forge-auth-success',
	{
		is3pActionAuth?: boolean;
		agentMessageId?: string;
		authUrl?: string;
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
		 * Optional complete ADF document to seed the chat input with instead of the plain-string
		 * `prompt`. When provided, rich nodes (skill pills, links, inline cards, mentions) are
		 * preserved rather than being flattened to text. `prompt` is still used as a fallback.
		 */
		promptAdf?: DocNode;
		/**
		 * Overrides the default auto-send behavior for prompts.
		 * By default, prompts with backticks (`) are inserted as placeholders into the chat input
		 * (backticks indicate a placeholder), while prompts without backticks are sent immediately.
		 * Set this to true to insert prompts not containing backticks into the chat input for dynamic
		 * user completion, rather than sending them immediately.
		 */
		overrideAutoSend?: boolean;
		/**
		 * Optional conversation ID to target. When provided, the handler will resume
		 * the specified conversation (setting placeholder agent, opening the channel,
		 * and selecting the conversation) before inserting or sending the prompt.
		 */
		channelId?: string;
		agentId?: string;
		agentName?: string;
		agentIdentityAccountId?: string;
		avatarUrl?: string;
		/**
		 * Optional files to attach to the chat input alongside the prompt.
		 */
		files?: UploadedFile[];
	} & PlaceholderParam
>;

/** Inserts URLs as inline nodes into the chat input
 * - URLs are deduplicated against existing content
 * - Formatted as inline card nodes in the editor
 * - Supports multiple card types (Jira, Confluence, Trello, etc.)
 */
export type InsertUrlsPayload = PayloadCore<
	'insert-urls-into-prompt-input',
	{
		urls: string[];
	}
>;

/** Inserts a skill chip into the chat input at the current cursor position. */
export type InsertSkillPayload = PayloadCore<
	'insert-skill-into-prompt-input',
	{
		skill: {
			id: string;
			name: string;
			slug: string;
			description?: string;
			product?: string;
			iconName?: string;
			color?: string;
		};
		skillSelectionSource?: string;
	}
>;

/** Selects a conversation action by ID
 * - Used to programmatically open a specific action in the conversation actions list
 * - The action screen must be already open, and the actions list populated
 * - The action must exist in the current actions list
 */
export type SelectActionPayload = PayloadCore<
	'select-action',
	{
		actionId: string;
	}
>;

/**
 * Result shape when a chart is added to an AVP dashboard.
 * Matches the return type of ChartApiService.addChartToDashboard().
 */
export type AddChartToDashboardResult = {
	chart: Record<string, unknown> | null;
	canvasLayout: Record<string, unknown> | null;
};

/**
 * Fired when a chart is added to an AVP dashboard from a Rovo generated chart
 */
export type AddChartToDashboardPayload = PayloadCore<
	'add-chart-to-dashboard',
	AddChartToDashboardResult
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
export type DeleteTransitionRovoPayloadOld = {
	transitionId: TransitionId;
	transitionName: string;
};
export type DeleteTransitionRovoPayload = {
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
export type RedirectToWorkflowRovoPayload = {
	conversationId: string;
	url: string;
};

export type JiraWorkflowWizardAction =
	| { operationType: 'ADD_STATUS'; payload: AddStatusRovoPayload }
	| { operationType: 'UPDATE_STATUS'; payload: UpdateStatusRovoPayload }
	| { operationType: 'DELETE_STATUS'; payload: DeleteStatusRovoPayload }
	| { operationType: 'ADD_TRANSITION'; payload: AddNewTransitionRovoPayload }
	| { operationType: 'UPDATE_TRANSITION'; payload: UpdateTransitionRovoPayload }
	// TODO: Remove DeleteTransitionRovoPayloadOld when hix-7888_-_delete_transition_expanded_fields is cleaned up
	| {
			operationType: 'DELETE_TRANSITION';
			payload: DeleteTransitionRovoPayloadOld | DeleteTransitionRovoPayload;
	  }
	| { operationType: 'ADD_RULE'; payload: AddRuleRovoPayload }
	| { operationType: 'UPDATE_RULE'; payload: UpdateRuleRovoPayload }
	| { operationType: 'DELETE_RULE'; payload: DeleteRuleRovoPayload }
	| { operationType: 'REDIRECT_TO_WORKFLOW'; payload: RedirectToWorkflowRovoPayload };

export type JiraWorkflowWizardActionsPayload = PayloadCore<
	'jira-workflow-wizard-actions',
	{
		invocationId?: string;
		operations?: JiraWorkflowWizardAction[];
		currentWorkflowDocument?: Record<string, unknown>;
	}
>;

type MessageDescriptorWithValues = {
	// MessageDescriptor values
	id?: string;
	description?: string | object;
	defaultMessage?: string;

	// Message values to be passed to the message formatter
	messageValues?: Record<string, string | number | boolean | null | undefined | Date>;
};

export type GenericExternalActionErrorPayload = PayloadCore<
	'generic-external-action-error',
	{
		invocationId: string;
		errors: (string | MessageDescriptorWithValues)[];
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

export type OpenChatDebugModalPayload = PayloadCore<'open-chat-debug-modal'>;

export type OpenChatFeedbackModalPayload = PayloadCore<
	'open-chat-feedback-modal',
	{
		answerQuality: 'good' | 'bad' | 'general';
	}
>;

// Not using PayloadCore because `data: type | undefined` is necessary
// but `| undefined` will cause `data` to be removed by PayloadCore
export type SmartLinksContextPayload = PayloadCore<'smartlinks-context-payload'> & {
	/** Never opens chat — internal signal only. */
	openChat: false;
	data?: Array<{
		/**
		 * ORS auth key from meta.auth[0].key (e.g. 'gdrive', 'notion', 'miro').
		 * Matches the `serviceKey` query param in Knowledge API outboundAuthUrl,
		 * enabling the chat to cross-reference with Knowledge API without a mapping table.
		 */
		orsAuthKey: string;
		/**
		 * Human-readable provider name from ORS generator (e.g. 'Google Drive', 'Slack').
		 * Available regardless of SmartLinks auth state — matched against connector friendlyName.
		 */
		generatorName?: string;
		/** Number of occurrences on the page — used for ranking in the banner. */
		count: number;
	}>;
};

/** Published by the consumer hook to notify the publisher whether it should fetch SmartLinks. */
export type SpaceSelectedPayload = PayloadCore<
	'space-selected',
	{
		spaceId: string;
		title: string;
		emoji: string;
		description?: string;
	}
>;

export type SpaceDeselectedPayload = PayloadCore<'space-deselected'>;

/**
 * Published by the Rovo chat custom-skill update action once the user confirms an
 * `UpdateCustomSkillTool` action. Carries the confirmed skill content so the open
 * Studio custom-skill view/edit page (matched by `skillAri`) can reflect the change
 * optimistically in the Relay store without refetching.
 */
export type CustomSkillUpdatePayload = PayloadCore<
	'custom-skill-update',
	{
		skillAri: string;
		name: string;
		displayName: string;
		description: string;
		instructions: string;
		tools: { id: string; source: string; type: string }[];
	}
>;

export type RecommendedSpacesSelectedPayload = PayloadCore<'recommended-spaces-selected'>;

export type SmartlinksSubscriptionChangedPayload =
	PayloadCore<'smartlinks-subscription-changed'> & {
		/** Never opens chat — internal signal only. */
		openChat: false;
		isActive: boolean;
	};

export type Payload =
	| MessageSendPayload
	| ChatClosePayload
	| SmartCreationModalOpenPayload
	| ChatNewPayload
	| InsightsOpenInChatPayload
	| InsightsChatExitedPayload
	| ChatDraftPayload
	| ChatSmartLink3PPostAuthLaunchPayload
	| EditorContextPayload
	| ChatOpenPayload
	| OpenBrowseAgentPayload
	| SmartlinksSubscriptionChangedPayload
	| OpenBrowseAgentSidebarPayload
	| EditorSuggestionPayload
	| EditorAgentChangedPayload
	| BrowserContextPayload
	| WhiteboardContextPayload
	| JiraCreateContextPayload
	| JiraInlineAgentCreationAgentAssignedPayload
	| JiraWorkItemsCreatingPayload
	| JiraWorkItemsCreatedPayload
	| JiraWorkItemsCreateFailedPayload
	| DatabaseContextPayload
	| ForgeAppAuthSuccess
	| ForgeAppAuthFailure
	| JiraWorkflowWizardActionsPayload
	| InsertPromptPayload
	| DashboardInsightsActionsPayload
	| SetChatContextPayload
	| InsertUrlsPayload
	| InsertSkillPayload
	| SelectActionPayload
	| AddChartToDashboardPayload
	| GenericExternalActionErrorPayload
	| OpenChatDebugModalPayload
	| OpenChatFeedbackModalPayload
	| JsmJourneyBuilderActionsPayload
	| StudioAutomationBuildUpdatePayload
	| SolutionArchitectHandoffPayload
	| SolutionPlanStateUpdatePayload
	| SolutionDraftAgentUpdatePayload
	| SolutionArchitectAgentActivationPayload
	| SolutionArchitectAgentActivationFlowStartedPayload
	| SolutionArchitectAgentActivationFlowStoppedPayload
	| UpdateAgentConfigurationPayload
	| StudioLandingPageRedirectPayload
	| UploadAndInsertMediaPayload
	| SmartLinksContextPayload
	| SpaceSelectedPayload
	| SpaceDeselectedPayload
	| RecommendedSpacesSelectedPayload
	| CustomSkillUpdatePayload
	| TaskPlanConfirmedPayload
	| TaskAskQuestionRenderedPayload
	| TaskPlanRenderedPayload
	| TaskSkipAllQuestionsPayload
	| TaskCancelPlanPayload
	| TaskAskQuestionConfirmedPayload
	| TaskModifyPlanRequestedPayload
	| TaskModifyPlanSubmittedPayload;

export type TaskPlanConfirmedPayload = PayloadCore<
	'task-plan-confirmed',
	{ conversationId: string; planTitle: string }
>;

export type TaskAskQuestionRenderedPayload = PayloadCore<
	'task-ask-question-rendered',
	{ conversationId: string; invocationId: string }
>;

export type TaskPlanRenderedPayload = PayloadCore<
	'task-plan-rendered',
	{ conversationId: string; invocationId: string }
>;

export type TaskSkipAllQuestionsPayload = PayloadCore<
	'task-skip-all-questions',
	{ conversationId: string; invocationId: string }
>;

export type TaskAskQuestionConfirmedPayload = PayloadCore<
	'task-ask-question-confirmed',
	{ conversationId: string; invocationId: string }
>;

export type TaskCancelPlanPayload = PayloadCore<
	'task-cancel-plan',
	{ conversationId: string; invocationId: string }
>;

export type TaskModifyPlanRequestedPayload = PayloadCore<
	'task-modify-plan-requested',
	{ conversationId: string; invocationId: string }
>;

export type TaskModifyPlanSubmittedPayload = PayloadCore<
	'task-modify-plan-submitted',
	{ conversationId: string; invocationId: string; prompt: DocNode }
>;

export const JIRA_INLINE_AGENT_CREATION_AGENT_ASSIGNED_EVENT =
	'jira-inline-agent-creation-agent-assigned' as const;

export type JiraInlineAgentCreationAgentAssignedPayload = PayloadCore<
	typeof JIRA_INLINE_AGENT_CREATION_AGENT_ASSIGNED_EVENT,
	{ issueId: string }
>;

/**
 * Published right before the `create-work-items` skill calls the bulk-create API, carrying the draft
 * work items the user submitted. Subscribers (e.g. the Jira list view) can use the draft fields to
 * render optimistic rows immediately, ahead of the (potentially slow) create request. Correlate this
 * batch with the follow-up {@link JIRA_WORK_ITEMS_CREATED_EVENT} / {@link JIRA_WORK_ITEMS_CREATE_FAILED_EVENT}
 * via `invocationId`.
 */
export const JIRA_WORK_ITEMS_CREATING_EVENT = 'jira-work-items-creating' as const;

export type JiraWorkItemCreatingDraft = {
	/** Skill invocation id of this draft; used as the optimistic row's stable id. */
	invocationId: string;
	/** Draft summary, used to render the optimistic row immediately. */
	summary: string;
};

export type JiraWorkItemsCreatingPayload = PayloadCore<
	typeof JIRA_WORK_ITEMS_CREATING_EVENT,
	{
		/**
		 * Identifies this batch across the creating/created/failed lifecycle events. Conceptually a
		 * per-batch id, distinct from the per-suggestion {@link JiraWorkItemCreatingDraft.invocationId}
		 * ids; on the FE it is derived from the first draft's invocation id (unique per submission,
		 * stable across the three events).
		 */
		invocationId: string;
		/** Draft work items submitted for creation (parents and their children, flattened). */
		draftWorkItems: JiraWorkItemCreatingDraft[];
	}
>;

export const JIRA_WORK_ITEMS_CREATED_EVENT = 'jira-work-items-created' as const;

export type JiraWorkItemsCreatedPayload = PayloadCore<
	typeof JIRA_WORK_ITEMS_CREATED_EVENT,
	{
		/** Identifies the batch; matches the {@link JIRA_WORK_ITEMS_CREATING_EVENT} `invocationId`. */
		invocationId: string;
		/** Ids of the work items created by the skill, used by subscribers to fetch their data. */
		createdIssueIds: string[];
	}
>;

/**
 * Published when the `create-work-items` skill fails to create the work items it announced via a
 * {@link JIRA_WORK_ITEMS_CREATING_EVENT}. Subscribers use `invocationId` to revert any optimistic
 * rows they rendered for that batch.
 */
export const JIRA_WORK_ITEMS_CREATE_FAILED_EVENT = 'jira-work-items-create-failed' as const;

export type JiraWorkItemsCreateFailedPayload = PayloadCore<
	typeof JIRA_WORK_ITEMS_CREATE_FAILED_EVENT,
	{
		/** Identifies the batch; matches the {@link JIRA_WORK_ITEMS_CREATING_EVENT} `invocationId` to revert its optimistic rows. */
		invocationId: string;
	}
>;

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

type SendMessageSearchArtifact = {
	/** The Atlassian Resource Identifier (ARI) of the object. */
	ari?: string;
	/** The URL of the object. */
	url?: string;
};
