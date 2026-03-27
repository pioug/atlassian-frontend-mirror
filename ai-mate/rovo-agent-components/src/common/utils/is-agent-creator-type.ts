import type { AgentCreatorType } from '../types';

const agentCreatorTypes: AgentCreatorType[] = [
	'SYSTEM',
	'CUSTOMER',
	'THIRD_PARTY',
	'FORGE',
	'OOTB',
	'REMOTE_A2A',
];

export const isAgentCreatorType = (creatorType: string): creatorType is AgentCreatorType =>
	(agentCreatorTypes as string[]).includes(creatorType);
