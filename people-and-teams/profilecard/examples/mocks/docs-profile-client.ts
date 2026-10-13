import type { ProfileClient, RovoAgentProfileCardInfo } from '@atlaskit/profilecard/types';

const agent: RovoAgentProfileCardInfo = {
	id: 'example-agent',
	named_id: 'example-agent',
	name: 'Example assistant',
	description: 'Helps a team organize a project plan.',
	creator_type: 'SYSTEM' as const,
	visibility: 'PUBLIC' as const,
	is_default: false,
	actor_type: 'AGENT' as const,
	user_defined_conversation_starters: ['Summarize the project plan'],
	favourite: false,
	favourite_count: 0,
	creatorInfo: { type: 'SYSTEM' as const },
};

/** Deterministic local data for docs examples; replace this client with the product's authenticated client. */
export const docsProfileClient: ProfileClient = {
	flushCache: () => undefined,
	getProfile: async (_cloudId, userId) => ({
		isBot: false,
		fullName: userId === 'example-account' ? 'Alex Example' : 'Taylor Sample',
		nickname: 'alex-example',
		email: 'alex@example.test',
		location: 'Sydney',
		meta: 'Design systems',
		status: 'active',
	}),
	getTeamProfile: async (teamId) => ({
		id: teamId,
		displayName: 'Example team',
		description: 'A small team working on a sample project.',
		members: [],
	}),
	getReportingLines: async () => ({ managers: [], reports: [] }),
	shouldShowGiveKudos: async () => false,
	getTeamCentralBaseUrl: async () => undefined,
	getRovoAgentProfile: async () => ({ restData: agent, aggData: null }),
	getRovoAgentPermissions: async () => ({
		permissions: {
			AGENT_CREATE: { permitted: false },
			AGENT_DUPLICATE: { permitted: false },
			AGENT_UPDATE: { permitted: false },
			AGENT_DEACTIVATE: { permitted: false },
		},
	}),
	deleteAgent: async () => undefined,
	setFavouriteAgent: async () => undefined,
};

export { agent as docsAgent };
