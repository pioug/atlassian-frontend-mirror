import { type RovoAgent, type RovoAgentAgg } from '../types';

export const agentData: RovoAgent = {
	id: 'agentId',
	name: 'Profile card agent',
	description: 'this is a agent to use in profile card',
	favourite: true,
	favourite_count: 1234,
	named_id: '',
	creator_type: 'CUSTOMER',
	is_default: false,
	actor_type: 'AGENT',
	user_defined_conversation_starters: [],
	deactivated: false,
};

export const agentAggData: RovoAgentAgg = {
	authoringTeam: {
		displayName: 'Profile card agent',
		profileUrl: 'https://example.com/profile',
	},
};

export default agentData;
