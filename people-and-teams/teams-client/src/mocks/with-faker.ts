import type FakerType from 'faker';

import type { Team, TeamWithImageUrls, TeamWithMemberships, TeamLink } from '../types';

import { randomBasicTeam, randomFullTeam, randomTeamWithMemberships } from './team';
import { randomTeamLinks } from './team-link';

type MockConfig = {
	faker: typeof FakerType;
};

export const teamsClientMocks = (config: MockConfig): { randomBasicTeam: (customProps?: {}) => Team; randomFullTeam: (customProps?: {}) => TeamWithImageUrls; randomTeamWithMemberships: (team: TeamWithImageUrls, customProps?: {}) => TeamWithMemberships; randomTeamLinks: (n?: number, customProps?: {}) => TeamLink[]; } => ({
	randomBasicTeam: randomBasicTeam(config),
	randomFullTeam: randomFullTeam(config),
	randomTeamWithMemberships: randomTeamWithMemberships(config),
	randomTeamLinks: randomTeamLinks(config),
});
