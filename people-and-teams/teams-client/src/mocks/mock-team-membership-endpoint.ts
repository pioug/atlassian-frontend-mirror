import { mockTeamMembershipRegex } from './endpoint-regexes';
import type { MockConfig } from './mock-config-2';
import { mockTeamMembershipResponseWithNEdges } from './mock-team-membership-response-with-n-edges';
import { MOCK_TEAM_MEMBERSHIP_RESPONSE } from './responses';

export const mockTeamMembershipEndpoint: any = ({
	fetchMock,
	delay,
	faker,
	endpointConfig,
}: MockConfig) => {
	const count = endpointConfig?.teamMembership?.count;
	// Use a static response as default, for snapshot tests
	const response =
		!faker || !count || count === 21
			? MOCK_TEAM_MEMBERSHIP_RESPONSE
			: mockTeamMembershipResponseWithNEdges({ faker }, count);
	fetchMock.post(mockTeamMembershipRegex, (_: string, options: { body: string }) => response, {
		method: 'POST',
		overwriteRoutes: true,
		delay,
	});
};
