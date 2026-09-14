import type FakerType from 'faker';

import type { Team, TeamWithImageUrls } from '../types/team';
import type { TeamWithMemberships } from '../types/membership';
import type { TeamLink } from '../types/links';

import { randomBasicTeam } from './random-basic-team';
import { randomFullTeam } from './random-full-team';
import { randomTeamWithMemberships } from './random-team-with-memberships';
import { randomTeamLinks } from './team-link';

type MockConfig = {
	faker: typeof FakerType;
};

export const teamsClientMocks = (
	config: MockConfig,
): {
	randomBasicTeam: (customProps?: {}) => Team;
	randomFullTeam: (customProps?: {}) => TeamWithImageUrls;
	randomTeamWithMemberships: (team: TeamWithImageUrls, customProps?: {}) => TeamWithMemberships;
	randomTeamLinks: (n?: number, customProps?: {}) => TeamLink[];
} => ({
	randomBasicTeam: randomBasicTeam(config),
	randomFullTeam: randomFullTeam(config),
	randomTeamWithMemberships: randomTeamWithMemberships(config),
	randomTeamLinks: randomTeamLinks(config),
});
