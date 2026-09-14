import { mockTeamRegex } from './endpoint-regexes';
import { mockCatchAll } from './mock-catch-all';
import type { MockConfig } from './mock-config-2';
import { mockJoinOrRequestDefaultAccessToProductsBulkEndpoint } from './mock-join-or-request-default-access-to-products-bulk-endpoint';
import { mockMeEndpoint } from './mock-me-endpoint';
import { mockMembersMeNotMemberEndpoint } from './mock-members-me-not-member-endpoint';
import { mockProductRecommendationsEndpoint } from './mock-product-recommendations-endpoint';
import { mockProfileWithMutabilityEndpoint } from './mock-profile-with-mutability-endpoint';
import { mockTeamMembershipEndpoint } from './mock-team-membership-endpoint';
import { MOCK_OPEN_TEAM_RESPONSE } from './responses';

const mockTeamEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockTeamRegex,
		(test: string, options: { body: string }) => MOCK_OPEN_TEAM_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

export const mockTeamsClientNotMemberEndpoints = (config: MockConfig): void => {
	if (config.restoreFetchMock) {
		config.fetchMock.restore();
	}
	mockTeamEndpoint(config);
	mockMembersMeNotMemberEndpoint(config);

	mockMeEndpoint(config);
	mockTeamMembershipEndpoint(config);
	mockProductRecommendationsEndpoint(config);
	mockJoinOrRequestDefaultAccessToProductsBulkEndpoint(config);
	mockProfileWithMutabilityEndpoint(config);
	mockCatchAll(config);
};
