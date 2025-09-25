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

	describe('customQuery functionality', () => {
		it('should include customQuery in request body when provided', async () => {
			const mockResponse = {
				recommendedUsers: [
					{
						id: 'user-1',
						name: 'John Doe',
						entityType: 'USER',
						avatarUrl: 'http://example.com/avatar.jpg',
						email: 'john.doe@example.com',
					},
				],
			};

			fetchMock.mock('*', {
				status: 200,
				body: mockResponse,
			});

			const requestWithCustomQuery = {
				baseUrl: '',
				context: {
					containerId: 'container-id',
					contextType: 'test',
					objectId: 'object-id',
					principalId: 'principal-id',
					productKey: 'jira',
					siteId: 'site-id',
					organizationId: 'org-id',
					childObjectId: 'child-object-id',
					sessionId: 'session-id',
				},
				includeUsers: true,
				includeGroups: false,
				includeTeams: false,
				includeNonLicensedUsers: false,
				maxNumberOfResults: 100,
				query: '',
				customQuery: '(email:"test@example.com")',
			};

			await getUserRecommendations(requestWithCustomQuery, intl);

			expect(fetchMock.lastCall()?.[1]?.body).toContain(
				'"customQuery":"(email:\\"test@example.com\\")"',
			);
			expect(fetchMock.lastCall()?.[1]?.body).toContain('"queryString":""');
		});

		it('should use empty customQuery when not provided', async () => {
			const mockResponse = {
				recommendedUsers: [
					{
						id: 'user-1',
						name: 'John Doe',
						entityType: 'USER',
						avatarUrl: 'http://example.com/avatar.jpg',
					},
				],
			};

			fetchMock.mock('*', {
				status: 200,
				body: mockResponse,
			});

			const requestWithoutCustomQuery = {
				baseUrl: '',
				context: {
					containerId: 'container-id',
					contextType: 'test',
					objectId: 'object-id',
					principalId: 'principal-id',
					productKey: 'jira',
					siteId: 'site-id',
					organizationId: 'org-id',
					childObjectId: 'child-object-id',
					sessionId: 'session-id',
				},
				includeUsers: true,
				includeGroups: false,
				includeTeams: false,
				includeNonLicensedUsers: false,
				maxNumberOfResults: 100,
				query: 'john doe',
			};

			await getUserRecommendations(requestWithoutCustomQuery, intl);

			expect(fetchMock.lastCall()?.[1]?.body).toContain('"customQuery":""');
			expect(fetchMock.lastCall()?.[1]?.body).toContain('"queryString":"john doe"');
		});

		it('should handle email search with disabled groups and teams', async () => {
			const mockResponse = {
				recommendedUsers: [
					{
						id: 'user-1',
						name: 'John Doe',
						entityType: 'USER',
						avatarUrl: 'http://example.com/avatar.jpg',
						email: 'john.doe@example.com',
					},
				],
			};

			fetchMock.mock('*', {
				status: 200,
				body: mockResponse,
			});

			const emailSearchRequest = {
				baseUrl: '',
				context: {
					containerId: 'container-id',
					contextType: 'test',
					objectId: 'object-id',
					principalId: 'principal-id',
					productKey: 'jira',
					siteId: 'site-id',
					organizationId: 'org-id',
					childObjectId: 'child-object-id',
					sessionId: 'session-id',
				},
				includeUsers: true,
				includeGroups: false,
				includeTeams: false,
				includeNonLicensedUsers: false,
				maxNumberOfResults: 100,
				query: '',
				customQuery: '(email:"john.doe@example.com")',
			};

			await getUserRecommendations(emailSearchRequest, intl);

			const requestBody = JSON.parse(fetchMock.lastCall()?.[1]?.body as string);
			expect(requestBody.includeGroups).toBe(false);
			expect(requestBody.includeTeams).toBe(false);
			expect(requestBody.searchQuery.customQuery).toBe('(email:"john.doe@example.com")');
			expect(requestBody.searchQuery.queryString).toBe('');
		});
	});
});
