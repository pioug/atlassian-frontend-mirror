import { toBeValidAGGQuery } from '@atlassian/ptc-test-utils/is-valid-query-test';

import teamMembershipQuery from './team-membership-query';
import { TeamsUserQuery } from './user-query';

describe('team membership query', () => {
	toBeValidAGGQuery(teamMembershipQuery);
});

describe('user query', () => {
	toBeValidAGGQuery(TeamsUserQuery);
});
