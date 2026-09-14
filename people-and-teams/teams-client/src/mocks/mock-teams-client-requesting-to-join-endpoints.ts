import { mockCatchAll } from './mock-catch-all';
import type { MockConfig } from './mock-config-2';
import { mockInviteOnlyTeamEndpoint } from './mock-invite-only-team-endpoint';
import { mockJoinOrRequestDefaultAccessToProductsBulkEndpoint } from './mock-join-or-request-default-access-to-products-bulk-endpoint';
import { mockMeEndpoint } from './mock-me-endpoint';
import { mockMembersMeRequestingToJoinEndpoint } from './mock-members-me-requesting-to-join-endpoint';
import { mockProductRecommendationsEndpoint } from './mock-product-recommendations-endpoint';
import { mockProfileWithMutabilityEndpoint } from './mock-profile-with-mutability-endpoint';
import { mockTeamMembershipEndpoint } from './mock-team-membership-endpoint';

export const mockTeamsClientRequestingToJoinEndpoints = (config: MockConfig): void => {
	if (config.restoreFetchMock) {
		config.fetchMock.restore();
	}
	mockInviteOnlyTeamEndpoint(config);
	mockMembersMeRequestingToJoinEndpoint(config);

	mockMeEndpoint(config);
	mockTeamMembershipEndpoint(config);
	mockProductRecommendationsEndpoint(config);
	mockJoinOrRequestDefaultAccessToProductsBulkEndpoint(config);
	mockProfileWithMutabilityEndpoint(config);
	mockCatchAll(config);
};
