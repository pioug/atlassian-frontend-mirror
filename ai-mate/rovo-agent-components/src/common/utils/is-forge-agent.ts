export type AgentCreatorType =
	| 'SYSTEM'
	| 'CUSTOMER'
	| 'THIRD_PARTY'
	| 'FORGE'
	| 'OOTB'
	| 'REMOTE_A2A';

// BE will deprecate THIRD_PARTY and use FORGE instead
export const isForgeAgentByCreatorType = (creatorType: AgentCreatorType): boolean =>
	creatorType === 'THIRD_PARTY' || creatorType === 'FORGE' || creatorType === 'REMOTE_A2A';
