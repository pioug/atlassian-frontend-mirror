import { mockTeamRegex } from './endpoint-regexes';
import { mockCatchAll } from './mock-catch-all';
import type { MockConfig } from './mock-config-2';
import { mockInviteOnlyTeamEndpoint } from './mock-invite-only-team-endpoint';
import { mockJoinOrRequestDefaultAccessToProductsBulkEndpoint } from './mock-join-or-request-default-access-to-products-bulk-endpoint';
import { mockMeEndpoint } from './mock-me-endpoint';
import { mockMembersMeFullMemberEndpoint } from './mock-members-me-full-member-endpoint';
import { mockMembersMeNotMemberEndpoint } from './mock-members-me-not-member-endpoint';
import { mockMembersMeRequestingToJoinEndpoint } from './mock-members-me-requesting-to-join-endpoint';
import { mockOpenTeamWritePermissionEndpoint } from './mock-open-team-write-permission-endpoint';
import { mockProductRecommendationsEndpoint } from './mock-product-recommendations-endpoint';
import { mockProfileWithMutabilityEndpoint } from './mock-profile-with-mutability-endpoint';
import { mockTeamMembershipEndpoint } from './mock-team-membership-endpoint';
import { MOCK_EXTERNAL_TEAM_RESPONSE } from './responses';

const mockExternalTeamEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockTeamRegex,
		(test: string, options: { body: string }) => MOCK_EXTERNAL_TEAM_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

export const mockTeamsClientEndpoints = (config: MockConfig): void => {
	if (config.restoreFetchMock) {
		config.fetchMock.restore();
	}
	if (config.endpointConfig?.teamType === 'inviteOnly') {
		mockInviteOnlyTeamEndpoint(config);
	} else if (config.endpointConfig?.teamType === 'external') {
		mockExternalTeamEndpoint(config);
	} else {
		mockOpenTeamWritePermissionEndpoint(config);
	}
	if (config.endpointConfig?.memberStatus === 'requestingToJoin') {
		mockMembersMeRequestingToJoinEndpoint(config);
	} else if (config.endpointConfig?.memberStatus === 'notMember') {
		mockMembersMeNotMemberEndpoint(config);
	} else {
		mockMembersMeFullMemberEndpoint(config);
	}

	mockMeEndpoint(config);
	mockTeamMembershipEndpoint(config);
	mockProductRecommendationsEndpoint(config);
	mockJoinOrRequestDefaultAccessToProductsBulkEndpoint(config);
	mockProfileWithMutabilityEndpoint(config);
	mockCatchAll(config);
};
