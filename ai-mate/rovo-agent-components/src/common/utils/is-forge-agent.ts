import type { AgentCreatorType } from '../types';

// BE will deprecate THIRD_PARTY and use FORGE instead
export const isForgeAgentByCreatorType = (creatorType: AgentCreatorType): boolean =>
	creatorType === 'THIRD_PARTY' || creatorType === 'FORGE' || creatorType === 'REMOTE_A2A';
