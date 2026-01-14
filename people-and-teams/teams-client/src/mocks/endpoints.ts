// eslint-disable-next-line import/no-extraneous-dependencies
import type FakerType from 'faker';
import type fetchMockType from 'fetch-mock/cjs/client';

import { type AccessRequestBulk } from '../services/invitations-client/types';

import { mockTeamMembershipResponseWithNEdges } from './generate-data';
import { getJoinOrRequestDefaultAccessToProductsBulkSuccessResponse } from './invitations';
import {
	MOCK_EXTERNAL_TEAM_RESPONSE,
	MOCK_INVITE_ONLY_TEAM_RESPONSE,
	MOCK_INVITE_ONLY_TEAM_WRITE_PERMISSION_RESPONSE,
	MOCK_ME_RESPONSE,
	MOCK_MEMBERS_ME_ADMIN_RESPONSE,
	MOCK_MEMBERS_ME_MEMBER_RESPONSE,
	MOCK_MEMBERS_ME_REQUESTING_RESPONSE,
	MOCK_OPEN_TEAM_RESPONSE,
	MOCK_OPEN_TEAM_WRITE_PERMISSION_RESPONSE,
	MOCK_PRODUCT_RECOMMENDATIONS_RESPONSE,
	MOCK_PROFILE_MUTABILITY_RESPONSE,
	MOCK_TEAM_MEMBERSHIP_RESPONSE,
} from './responses';

type MockConfig = {
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

type MockTeamMembershipConfig = {
	count?: number;
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

const mockMeRegex = /\/gateway\/api\/me/;
const mockMeEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(mockMeRegex, (_: string, options: { body: string }) => MOCK_ME_RESPONSE, {
		method: 'GET',
		overwriteRoutes: true,
		delay,
	});
};

const mockMembersRegex = /\/gateway\/api\/.*teams\/.*\/membership\/me/;
const mockMembersMeFullMemberEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockMembersRegex,
		(_: string, options: { body: string }) => MOCK_MEMBERS_ME_MEMBER_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

const mockMembersMeRequestingToJoinEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockMembersRegex,
		(_: string, options: { body: string }) => MOCK_MEMBERS_ME_REQUESTING_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

const mockMembersMeAdminEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockMembersRegex,
		(_: string, options: { body: string }) => MOCK_MEMBERS_ME_ADMIN_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

const mockMembersMeNotMemberEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(mockMembersRegex, 404, {
		method: 'GET',
		overwriteRoutes: true,
		delay,
	});
};

const mockTeamMembershipRegex = /\/gateway\/api\/graphql\?q=TeamMembership/;
const mockTeamMembershipEndpoint = ({ fetchMock, delay, faker, endpointConfig }: MockConfig) => {
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

const mockTeamRegex =
	/\/gateway\/api\/.*teams\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}\?siteId=.*$/;
const mockTeamEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockTeamRegex,
		(test: string, options: { body: string }) => MOCK_OPEN_TEAM_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

const mockInviteOnlyTeamEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockTeamRegex,
		(test: string, options: { body: string }) => MOCK_INVITE_ONLY_TEAM_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

const mockExternalTeamEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockTeamRegex,
		(test: string, options: { body: string }) => MOCK_EXTERNAL_TEAM_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

const mockInviteOnlyTeamWritePermissionEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockTeamRegex,
		(test: string, options: { body: string }) => MOCK_INVITE_ONLY_TEAM_WRITE_PERMISSION_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

const mockOpenTeamWritePermissionEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockTeamRegex,
		(test: string, options: { body: string }) => MOCK_OPEN_TEAM_WRITE_PERMISSION_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

const mockProfileWithMutabilityRegex = /\/gateway\/api\/users\/manage\/.*\/profile/;
const mockProfileWithMutabilityEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockProfileWithMutabilityRegex,
		(_: string, options: { body: string }) => MOCK_PROFILE_MUTABILITY_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};

const mockProductRecommendationsRegex =
	/\/gateway\/api\/invitations\/v1\/product-recommendations\?orgId=test-orgId&.*/;
const mockProductRecommendationsEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.get(
		mockProductRecommendationsRegex,
		(_: string, options: { body: string }) => MOCK_PRODUCT_RECOMMENDATIONS_RESPONSE,
		{ method: 'GET', overwriteRoutes: true, delay },
	);
};
const mockJoinOrRequestDefaultAccessToProductsBulkRegex =
	/\/gateway\/api\/invitations\/v1\/access-requests\/bulk\/request/;
const mockJoinOrRequestDefaultAccessToProductsBulkEndpoint = ({ fetchMock, delay }: MockConfig) => {
	fetchMock.post(
		mockJoinOrRequestDefaultAccessToProductsBulkRegex,
		(_: string, options: { body: string }) => {
			const request: AccessRequestBulk = JSON.parse(options.body);
			const aris = request.resources.map((resource) => resource.ari);
			return getJoinOrRequestDefaultAccessToProductsBulkSuccessResponse(aris);
		},
		{ method: 'POST', overwriteRoutes: true, delay },
	);
};

const mockCatchAll = ({ fetchMock }: MockConfig) => {
	fetchMock.mock('*', (path: string) => {
		// eslint-disable-next-line no-console
		console.error(`Unmatched request: ${path}`);
	});
};
