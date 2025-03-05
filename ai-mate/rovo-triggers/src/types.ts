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
	}
>;

export type ChatNewPayload = PayloadCore<
	'chat-new',
	{
		name: string;
		// Used to prefab the chat history
		dialogues: Array<{
			human_message: {
				content: string;
			};
			agent_message: {
				content: string;
			};
		}>;
		// Used for follow-up prompt once chat is created
		prompt?: string;
		sourceId?: string;
		agentId?: string;
	}
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

export type ChatDraftPayload = PayloadCore<'chat-draft'>;

export type OpenBrowseAgentPayload = PayloadCore<'open-browse-agent-modal'>;

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
	}
>;

export type Payload =
	| MessageSendPayload
	| ChatNewPayload
	| ChatDraftPayload
	| EditorContextPayload
	| ChatOpenPayload
	| OpenBrowseAgentPayload
	| EditorSuggestionPayload
	| EditorAgentChangedPayload
	| BrowserContextPayload
	| ForgeAppAuthSuccess
	| ForgeAppAuthFailure
	| InsertPromptPayload;

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
