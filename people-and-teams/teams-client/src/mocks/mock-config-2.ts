import type FakerType from 'faker'; // eslint-disable-line import/no-extraneous-dependencies
import type fetchMockType from 'fetch-mock/cjs/client';

import type { MockTeamMembershipConfig } from './mock-team-membership-config';

export type MockConfig = {
	fetchMock: typeof fetchMockType;
	delay?: number;
	faker?: typeof FakerType;

	// requiring multiple examples in the docs/ attempts to mock the same routes
	restoreFetchMock?: boolean;
	endpointConfig?: {
		teamMembership?: MockTeamMembershipConfig;
		teamType?: 'open' | 'inviteOnly' | 'external';
		memberStatus?: 'requestingToJoin' | 'notMember' | 'fullMember';
	};
};
