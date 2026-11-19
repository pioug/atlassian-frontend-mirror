import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';

import { UNKNOWN_USER } from '../../../service/constants';
import { graphqlQuery } from '../../../service/graphqlUtils';
import getUserAppTypes from '../../../service/user-app-types-client';
import getHydratedUsers from '../../../service/users-client';

jest.mock('../../../service/graphqlUtils', () => {
	return {
		graphqlQuery: jest.fn(),
	};
});

const ID1 = '58538da6-333b-4e28-8f15-8aadc3961b62';
const ID2 = '58538da6-333b-4e28-8f15-8aadc3961b63';

const expectedGraphQlQuery = `query usersQuery($accountIds: [ID!]!) {
    users(accountIds: $accountIds) {
      name
      accountId
      picture
    }
  }`;

const buildGqlResponse = (ids: string[]) => {
	const users = ids.map((id) => ({
		accountId: id,
		name: 'Edison Rho',
		type: 'user',
		picture: 'https://avatarurl.com',
	}));
	return {
		users,
	};
};

const buildTransformedUsersResponse = (ids: string[]) => {
	return ids.map((id) => ({
		id,
		name: 'Edison Rho',
		type: 'user',
		avatarUrl: 'https://avatarurl.com',
	}));
};

const gqlResponse = {
	users: [
		{
			accountId: '58538da6-333b-4e28-8f15-8aadc3961b62',
			name: 'Edison Rho',
			type: 'user',
			picture: 'https://avatarurl.com',
		},
	],
};

describe('users-client', () => {
	let graphqlQueryMock = graphqlQuery as jest.Mock;

	beforeEach(() => {
		graphqlQueryMock.mockReturnValue(Promise.resolve(gqlResponse));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should transform single user response to user option', async () => {
		mockExpDisabled('platform_user_picker_agent_avatar_hexagon');
		graphqlQueryMock.mockReturnValue(Promise.resolve(buildGqlResponse([ID1])));
		const hydratedUsers = await getHydratedUsers('', [ID1]);

		expect(hydratedUsers).toEqual(buildTransformedUsersResponse([ID1]));
		expect(graphqlQueryMock).toHaveBeenCalledWith(
			'/gateway/api/graphql',
			{
				query: expectedGraphQlQuery,
				variables: {
					accountIds: [ID1],
				},
			},
			undefined,
		);
	});

	it('should transform users response to user options', async () => {
		mockExpDisabled('platform_user_picker_agent_avatar_hexagon');
		graphqlQueryMock.mockReturnValue(Promise.resolve(buildGqlResponse([ID1, ID2])));
		const hydratedUsers = await getHydratedUsers('', [ID1, ID2]);

		expect(hydratedUsers).toEqual(buildTransformedUsersResponse([ID1, ID2]));
		expect(graphqlQueryMock).toHaveBeenCalledWith(
			'/gateway/api/graphql',
			{
				query: expectedGraphQlQuery,
				variables: {
					accountIds: [ID1, ID2],
				},
			},
			undefined,
		);
	});

	it('should return rejected promise if graphql fails', async () => {
		mockExpDisabled('platform_user_picker_agent_avatar_hexagon');
		graphqlQueryMock.mockReturnValue(Promise.reject('504'));
		expect.assertions(1);

		const hydratedUsers = await getHydratedUsers('', [ID1, ID2]);
		expect(hydratedUsers).toEqual([
			{ ...UNKNOWN_USER, id: ID1 },
			{ ...UNKNOWN_USER, id: ID2 },
		]);
	});

	it('preserves AppUser.appType when the experiment is enabled', async () => {
		mockExpEnabled('platform_user_picker_agent_avatar_hexagon');
		graphqlQueryMock.mockResolvedValue({
			users: [{ ...gqlResponse.users[0], appType: 'agent' }],
		});

		const hydratedUsers = await getHydratedUsers('', [ID1]);

		expect(hydratedUsers).toEqual([
			{ ...buildTransformedUsersResponse([ID1])[0], appType: 'agent' },
		]);
		expect(graphqlQueryMock.mock.calls[0][1].query).toContain('... on AppUser');
	});

	it('batches hydrated users when the experiment is enabled', async () => {
		mockExpEnabled('platform_user_picker_agent_avatar_hexagon');
		const ids = Array.from({ length: 91 }, (_, index) => `account-${index}`);
		graphqlQueryMock.mockImplementation(
			(_url: string, request: { variables: { accountIds: string[] } }) =>
				Promise.resolve({
					users: request.variables.accountIds.map((accountId) => ({
						accountId,
						name: 'Agent',
						picture: 'https://avatarurl.com',
						appType: 'agent',
					})),
				}),
		);

		const users = await getHydratedUsers('', ids);

		expect(graphqlQueryMock.mock.calls.map((call) => call[1].variables.accountIds.length)).toEqual([
			90, 1,
		]);
		expect(users).toHaveLength(91);
		expect(users[90].appType).toBe('agent');
	});

	it('batches identity lookups at the AGG limit', async () => {
		const ids = Array.from({ length: 91 }, (_, index) => `account-${index}`);
		graphqlQueryMock.mockImplementation(
			(_url: string, request: { variables: { accountIds: string[] } }) =>
				Promise.resolve({
					users: request.variables.accountIds.map((accountId) => ({ accountId, appType: 'agent' })),
				}),
		);

		const appTypes = await getUserAppTypes('', ids);

		expect(graphqlQueryMock).toHaveBeenCalledTimes(2);
		expect(graphqlQueryMock.mock.calls.map((call) => call[1].variables.accountIds.length)).toEqual([
			90, 1,
		]);
		expect(appTypes.get('account-90')).toBe('agent');
	});
});
