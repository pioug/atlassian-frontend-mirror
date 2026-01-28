import fetchMock from 'fetch-mock/cjs/client';

import getUserRecommendations from '../../../service/recommendation-client';
import { type RecommendationRequest } from '../../../types';
import { type IntlShape } from 'react-intl-next';

const URS_URL = '/gateway/api/v1/recommendations';

const intl = {} as IntlShape;

const mockBitbucketContext = {
	childObjectId: 'childObjectId',
	containerId: 'containerId',
	contextType: 'fieldId',
	objectId: 'objectId',
	principalId: 'principalId',
	productAttributes: {
		emailDomain: 'Context',
		isPublicRepo: false,
		workspaceIds: ['02b941e3-cfaa-40f9-9a58-cec53e20bdc3'],
		pullRequestId: 18056,
	},
	productKey: 'bitbucket',
	sessionId: 'session-id',
	siteId: 'site-id',
};

const exampleRequest: RecommendationRequest = {
	context: mockBitbucketContext,
	maxNumberOfResults: 50,
	query: 'query',
	includeUsers: true,
	includeGroups: true,
	includeTeams: true,
	includeNonLicensedUsers: false,
};

const exampleResponse = {
	status: 200,
	body: JSON.stringify({
		recommendedUsers: [
			{
				entityType: 'USER',
				id: '5ee0adc79583380ab0afec31',
				name: 'John Smith',
				email: 'jsmith@atlassian.com',
				avatarUrl: 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net',
				nickname: 'John Smith',
				matchPositions: {},
				accessLevel: 'CONTAINER',
				accountStatus: 'ACTIVE',
				notMentionable: false,
				locale: 'en-GB',
				title: 'Development Manager',
				userType: 'DEFAULT',
			},
			{
				entityType: 'USER',
				id: '5ee0adc79583380ab0afec32',
				name: 'John Doe',
				email: 'jsmith@atlassian.com',
				avatarUrl: 'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net',
				nickname: 'John Doe',
				matchPositions: {},
				accessLevel: 'CONTAINER',
				accountStatus: 'ACTIVE',
				notMentionable: false,
				locale: 'en-GB',
				title: 'Development Manager',
				userType: 'DEFAULT',
			},
		],
	}),
};

describe('default-value-hydration-client', () => {
	afterEach(() => {
		jest.clearAllMocks();
		fetchMock.restore();
	});

	it('should reject promise on network error', async () => {
		fetchMock.post(URS_URL, 504);

		try {
			await getUserRecommendations(exampleRequest, intl);
		} catch (error) {
			expect((error as any).message).toMatchSnapshot('URS error');
		}
	});

	it('should translate given context to correct fetch request', async () => {
		let requestBody;

		fetchMock.post(
			{
				functionMatcher: (url: string, options: any) => {
					requestBody = JSON.parse(options.body);

					return url === '/gateway/api/v1/recommendations';
				},
			},
			exampleResponse,
			{
				repeat: 1,
				overwriteRoutes: false,
			},
		);

		const users = await getUserRecommendations(exampleRequest, intl);

		expect(fetchMock.called()).toBeTruthy();
		expect(requestBody).toMatchSnapshot('URS query');
		expect(users).toMatchSnapshot('URS users');
	});
});

describe('search recommendations with teams', () => {
	afterEach(() => {
		jest.clearAllMocks();
		fetchMock.restore();
	});

	it('should transform team with type.name to teamTypeName', async () => {
		const teamResponse = {
			status: 200,
			body: JSON.stringify({
				recommendedUsers: [
					{
						entityType: 'TEAM',
						id: 'team-123',
						displayName: 'Engineering Team',
						largeAvatarImageUrl: 'https://avatars.atlassian.com/team.png',
						memberCount: 10,
						includesYou: true,
						verified: true,
						type: {
							name: 'Managed team',
						},
					},
				],
			}),
		};

		fetchMock.post(URS_URL, teamResponse);

		const users = await getUserRecommendations(exampleRequest, intl);

		expect(fetchMock.called()).toBeTruthy();
		expect(users).toHaveLength(1);
		expect(users[0]).toEqual(
			expect.objectContaining({
				id: 'team-123',
				name: 'Engineering Team',
				type: 'team',
				verified: true,
				teamTypeName: 'Managed team',
			}),
		);
	});

	it('should handle team without type.name (teamTypeName should be undefined)', async () => {
		const teamResponse = {
			status: 200,
			body: JSON.stringify({
				recommendedUsers: [
					{
						entityType: 'TEAM',
						id: 'team-456',
						displayName: 'Product Team',
						largeAvatarImageUrl: 'https://avatars.atlassian.com/team.png',
						memberCount: 5,
						verified: true,
					},
				],
			}),
		};

		fetchMock.post(URS_URL, teamResponse);

		const users = await getUserRecommendations(exampleRequest, intl);

		expect(fetchMock.called()).toBeTruthy();
		expect(users).toHaveLength(1);
		expect(users[0]).toEqual(
			expect.objectContaining({
				id: 'team-456',
				name: 'Product Team',
				type: 'team',
				verified: true,
				teamTypeName: undefined,
			}),
		);
	});
});

describe('search recommendations with Confluence guests', () => {
	afterEach(() => {
		jest.clearAllMocks();
		fetchMock.restore();
	});

	it('should include guests in request when productAttributes.isEntitledConfluenceExternalCollaborator is true', async () => {
		const entitledGuestConfluenceRequest: RecommendationRequest = {
			context: {
				childObjectId: 'childObjectId',
				containerId: 'containerId',
				contextType: 'fieldId',
				objectId: 'objectId',
				principalId: 'principalId',
				productAttributes: {
					isEntitledConfluenceExternalCollaborator: true,
				},
				productKey: 'confluence',
				sessionId: 'session-id',
				siteId: 'site-id',
			},
			maxNumberOfResults: 50,
			query: 'query',
			includeUsers: true,
			includeGroups: true,
			includeTeams: true,
			includeNonLicensedUsers: false,
		};
		const expectedRequestBody = {
			context: {
				childObjectId: 'childObjectId',
				containerId: 'containerId',
				contextType: 'fieldId',
				objectId: 'objectId',
				principalId: 'principalId',
				productAttributes: {
					isEntitledConfluenceExternalCollaborator: true,
				},
				productKey: 'confluence',
				sessionId: 'session-id',
				siteId: 'site-id',
			},
			includeUsers: true,
			includeGroups: true,
			includeTeams: true,
			includeNonLicensedUsers: false,
			maxNumberOfResults: 50,
			performSearchQueryOnly: false,
			searchQuery: {
				cpusQueryHighlights: {
					query: '',
					field: '',
				},
				productAccessPermissionIds: ['write', 'external-collaborator-write'],
				customQuery: '',
				customerDirectoryId: '',
				filter: '',
				minimumAccessLevel: 'APPLICATION',
				queryString: 'query',
				restrictTo: {
					userIds: [],
					groupIds: [],
				},
				searchUserbase: false,
			},
		};

		let requestBody;
		fetchMock.post(
			{
				functionMatcher: (url: string, options: any) => {
					requestBody = JSON.parse(options.body);
					return url === '/gateway/api/v1/recommendations';
				},
			},
			exampleResponse,
			{
				repeat: 1,
				overwriteRoutes: false,
			},
		);

		await getUserRecommendations(entitledGuestConfluenceRequest, intl);

		expect(fetchMock.called()).toBeTruthy();
		// asserting that recommendations request body has `productPermissionIds: ['write', 'external-collaborator-write']`, which will include guests in the search
		expect(requestBody).toEqual(expectedRequestBody);
	});

	it('should not include guests in request when productAttributes.isEntitledConfluenceExternalCollaborator is false', async () => {
		const notEntitledGuestConfluenceRequest: RecommendationRequest = {
			context: {
				childObjectId: 'childObjectId',
				containerId: 'containerId',
				contextType: 'fieldId',
				objectId: 'objectId',
				principalId: 'principalId',
				productAttributes: {
					isEntitledConfluenceExternalCollaborator: false,
				},
				productKey: 'confluence',
				sessionId: 'session-id',
				siteId: 'site-id',
			},
			maxNumberOfResults: 50,
			query: 'query',
			includeUsers: true,
			includeGroups: true,
			includeTeams: true,
			includeNonLicensedUsers: false,
		};

		const expectedRequestBody = {
			context: {
				childObjectId: 'childObjectId',
				containerId: 'containerId',
				contextType: 'fieldId',
				objectId: 'objectId',
				principalId: 'principalId',
				productAttributes: {
					isEntitledConfluenceExternalCollaborator: false,
				},
				productKey: 'confluence',
				sessionId: 'session-id',
				siteId: 'site-id',
			},
			includeUsers: true,
			includeGroups: true,
			includeTeams: true,
			includeNonLicensedUsers: false,
			maxNumberOfResults: 50,
			performSearchQueryOnly: false,
			searchQuery: {
				cpusQueryHighlights: {
					query: '',
					field: '',
				},
				customQuery: '',
				customerDirectoryId: '',
				filter: '',
				minimumAccessLevel: 'APPLICATION',
				queryString: 'query',
				restrictTo: {
					userIds: [],
					groupIds: [],
				},
				searchUserbase: false,
			},
		};

		let requestBody;
		fetchMock.post(
			{
				functionMatcher: (url: string, options: any) => {
					requestBody = JSON.parse(options.body);
					return url === '/gateway/api/v1/recommendations';
				},
			},
			exampleResponse,
			{
				repeat: 1,
				overwriteRoutes: false,
			},
		);

		await getUserRecommendations(notEntitledGuestConfluenceRequest, intl);

		expect(fetchMock.called()).toBeTruthy();
		// asserting that recommendations request body doesn't have productPermissionsIds "external-collaborator-write", so the response won't include guests in the search
		expect(requestBody).toEqual(expectedRequestBody);
	});

	it('should not include guests in request when productAttributes is not present', async () => {
		const notEntitledGuestConfluenceRequest: RecommendationRequest = {
			context: {
				childObjectId: 'childObjectId',
				containerId: 'containerId',
				contextType: 'fieldId',
				objectId: 'objectId',
				principalId: 'principalId',
				productKey: 'confluence',
				sessionId: 'session-id',
				siteId: 'site-id',
			},
			maxNumberOfResults: 50,
			query: 'query',
			includeUsers: true,
			includeGroups: true,
			includeTeams: true,
			includeNonLicensedUsers: false,
		};

		const expectedRequestBody = {
			context: {
				childObjectId: 'childObjectId',
				containerId: 'containerId',
				contextType: 'fieldId',
				objectId: 'objectId',
				principalId: 'principalId',
				productKey: 'confluence',
				sessionId: 'session-id',
				siteId: 'site-id',
			},
			includeUsers: true,
			includeGroups: true,
			includeTeams: true,
			includeNonLicensedUsers: false,
			maxNumberOfResults: 50,
			performSearchQueryOnly: false,
			searchQuery: {
				cpusQueryHighlights: {
					query: '',
					field: '',
				},
				customQuery: '',
				customerDirectoryId: '',
				filter: '',
				minimumAccessLevel: 'APPLICATION',
				queryString: 'query',
				restrictTo: {
					userIds: [],
					groupIds: [],
				},
				searchUserbase: false,
			},
		};

		let requestBody;
		fetchMock.post(
			{
				functionMatcher: (url: string, options: any) => {
					requestBody = JSON.parse(options.body);
					return url === '/gateway/api/v1/recommendations';
				},
			},
			exampleResponse,
			{
				repeat: 1,
				overwriteRoutes: false,
			},
		);

		await getUserRecommendations(notEntitledGuestConfluenceRequest, intl);

		expect(fetchMock.called()).toBeTruthy();
		// asserting that recommendations request body doesn't have productPermissionsIds "external-collaborator-write", so the response won't include guests in the search
		expect(requestBody).toEqual(expectedRequestBody);
	});
});
