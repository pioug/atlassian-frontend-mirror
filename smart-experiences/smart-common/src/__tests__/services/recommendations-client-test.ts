import fetchMock from 'fetch-mock/cjs/client';

import fetchUserRecommendations from '../../services/recommendations-client';
import { type UserSearchQuery, type UserSearchRequest } from '../../types';

const URS_URL = '/gateway/api/v1/recommendations';

const exampleContext = {
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

const exampleCpusSearchQuery: UserSearchQuery = {
	cpusQueryHighlights: {
		query: 'query',
		field: 'field',
	},
	customQuery: 'name.mention:test_user email.mention:test_user nickname.mention:test_user',
	customerDirectoryId: '37e1dc69-9db4-4d1e-8083-a663329ba939',
	filter: '(NOT not_mentionable:true) AND (account_status:active)',
	minimumAccessLevel: 'APPLICATION',
	restrictTo: {
		userIds: ['user1', 'user2'],
		groupIds: ['group1', 'group2'],
	},
	searchUserbase: true,
};

const exampleRequest: UserSearchRequest = {
	context: exampleContext,
	maxNumberOfResults: 50,
	query: 'query',
	searchQuery: exampleCpusSearchQuery,
	includeUsers: true,
	includeGroups: true,
	includeTeams: true,
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
			await fetchUserRecommendations(exampleRequest);
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

		const users = await fetchUserRecommendations(exampleRequest);

		expect(fetchMock.called()).toBeTruthy();
		expect(requestBody).toMatchSnapshot('URS query');
		expect(users).toMatchSnapshot('URS users');
	});
});
