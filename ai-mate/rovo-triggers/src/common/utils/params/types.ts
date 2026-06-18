export type RovoChatPathway = 'chat' | 'agents-browse' | 'agents-create' | 'pulse';

export type RovoChatOpenMode = 'sidebar' | 'mini-modal' | 'full-screen-modal';

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
	promptLibraryOpen: boolean;
	openChatMode: RovoChatOpenMode;
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

export type RovoChatParams = Partial<
	ChatParams | AgentCreateParams | AgentBrowseParams | PulseParams
>;
