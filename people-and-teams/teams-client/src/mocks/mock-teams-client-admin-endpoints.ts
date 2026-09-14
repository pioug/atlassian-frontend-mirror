import { mockMembersRegex } from './endpoint-regexes';
import { mockCatchAll } from './mock-catch-all';
import type { MockConfig } from './mock-config-2';
import { mockJoinOrRequestDefaultAccessToProductsBulkEndpoint } from './mock-join-or-request-default-access-to-products-bulk-endpoint';
import { mockMeEndpoint } from './mock-me-endpoint';
import { mockOpenTeamWritePermissionEndpoint } from './mock-open-team-write-permission-endpoint';
import { mockProductRecommendationsEndpoint } from './mock-product-recommendations-endpoint';
import { mockProfileWithMutabilityEndpoint } from './mock-profile-with-mutability-endpoint';
import { mockTeamMembershipEndpoint } from './mock-team-membership-endpoint';
import { MOCK_MEMBERS_ME_ADMIN_RESPONSE } from './responses';

const mockMembersMeAdminEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockMembersRegex,
		(_: string, options: { body: string }) => MOCK_MEMBERS_ME_ADMIN_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

export const mockTeamsClientAdminEndpoints = (config: MockConfig): void => {
	if (config.restoreFetchMock) {
		config.fetchMock.restore();
	}
	mockOpenTeamWritePermissionEndpoint(config);
	mockMembersMeAdminEndpoint(config);

	mockMeEndpoint(config);
	mockTeamMembershipEndpoint(config);
	mockProductRecommendationsEndpoint(config);
	mockJoinOrRequestDefaultAccessToProductsBulkEndpoint(config);
	mockProfileWithMutabilityEndpoint(config);
	mockCatchAll(config);
};
