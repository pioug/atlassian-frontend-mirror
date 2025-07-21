import { type TeamsClientUser } from './user';

export type TeamAgentAssociation = {
	associationId: {
		teamId: string;
		accountId: string;
	};
	agent: TeamsClientUser;
};
