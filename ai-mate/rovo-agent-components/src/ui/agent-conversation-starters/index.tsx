import { type MessageDescriptor } from 'react-intl';

export type ConversationStarter = { message: string; type: ConversationStarterType };

type ConversationStarterType = 'static' | 'user-defined' | 'llm-generated';

export type StaticAgentConversationStarter = {
	message: MessageDescriptor;
	type: ConversationStarterType;
};

// eslint-disable-next-line no-barrel-files/no-barrel-files -- Retain the existing compatibility type export.
export type { AgentConversationStartersProps } from './AgentConversationStarters';
// eslint-disable-next-line no-barrel-files/no-barrel-files -- Retain the existing compatibility type export.
export type { ConversationStartersProps } from './ConversationStarters';
