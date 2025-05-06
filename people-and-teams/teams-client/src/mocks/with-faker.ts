import type FakerType from 'faker';

import { randomBasicTeam, randomFullTeam, randomTeamWithMemberships } from './team';
import { randomTeamLinks } from './team-link';

type MockConfig = {
	faker: typeof FakerType;
};

export const teamsClientMocks = (config: MockConfig) => ({
	randomBasicTeam: randomBasicTeam(config),
	randomFullTeam: randomFullTeam(config),
	randomTeamWithMemberships: randomTeamWithMemberships(config),
	randomTeamLinks: randomTeamLinks(config),
});
