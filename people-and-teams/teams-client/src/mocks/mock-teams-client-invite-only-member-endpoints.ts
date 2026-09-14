import { mockTeamRegex } from './endpoint-regexes';
import { mockCatchAll } from './mock-catch-all';
import type { MockConfig } from './mock-config-2';
import { mockJoinOrRequestDefaultAccessToProductsBulkEndpoint } from './mock-join-or-request-default-access-to-products-bulk-endpoint';
import { mockMeEndpoint } from './mock-me-endpoint';
import { mockMembersMeFullMemberEndpoint } from './mock-members-me-full-member-endpoint';
import { mockProductRecommendationsEndpoint } from './mock-product-recommendations-endpoint';
import { mockProfileWithMutabilityEndpoint } from './mock-profile-with-mutability-endpoint';
import { mockTeamMembershipEndpoint } from './mock-team-membership-endpoint';
import { MOCK_INVITE_ONLY_TEAM_WRITE_PERMISSION_RESPONSE } from './responses';

const mockInviteOnlyTeamWritePermissionEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockTeamRegex,
		(test: string, options: { body: string }) => MOCK_INVITE_ONLY_TEAM_WRITE_PERMISSION_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

export const mockTeamsClientInviteOnlyMemberEndpoints = (config: MockConfig): void => {
	if (config.restoreFetchMock) {
		config.fetchMock.restore();
	}
	mockInviteOnlyTeamWritePermissionEndpoint(config);
	mockMembersMeFullMemberEndpoint(config);

	mockMeEndpoint(config);
	mockTeamMembershipEndpoint(config);
	mockProductRecommendationsEndpoint(config);
	mockJoinOrRequestDefaultAccessToProductsBulkEndpoint(config);
	mockProfileWithMutabilityEndpoint(config);
	mockCatchAll(config);
};
