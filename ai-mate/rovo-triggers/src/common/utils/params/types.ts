export type RovoChatPathway =
	| 'chat'
	| 'agents-browse'
	| 'agents-create'
	| 'pulse'
	| 'remix'
	| 'all-conversations';

export type RovoChatOpenMode = 'sidebar' | 'mini-modal';

export interface BaseRovoChatParams {
	pathway: RovoChatPathway;
	agentId: string;
	conversationId: string;
	prompt: string;
	cloudId: string;
	triggerOpen: boolean;
	initiator: string;
	insertPrompt: 'highlight-action';
	stagingAreaOpen: boolean;
	messageIdSelectedForPreview: string;
	invocationIdSelectedForPreview: string;
	promptLibraryOpen: boolean;
	openChatMode: RovoChatOpenMode;
	rovoJourneyId: string;
	searchQuery: string;
}

export type ValidPrefix = 'rovoChat';
export type ValidParam = keyof BaseRovoChatParams;
export type ValidPrefixedParam = `${ValidPrefix}${ValidParam}`;

type RovoParams<T extends RovoChatPathway, P = object> = BaseRovoChatParams & {
	pathway: T;
} & P;

type ChatParams = RovoParams<'chat'>;
type AgentBrowseParams = RovoParams<'agents-browse'>;
type AgentCreateParams = RovoParams<'agents-create'>;
type PulseParams = RovoParams<'pulse'>;
type RemixParams = RovoParams<'remix'>;
type AllConversationsParams = RovoParams<'all-conversations'>;

export type RovoChatParams = Partial<
	| ChatParams
	| AgentCreateParams
	| AgentBrowseParams
	| PulseParams
	| RemixParams
	| AllConversationsParams
>;
