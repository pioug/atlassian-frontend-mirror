import getHydratedUsers from '../../../service/users-client';
import { graphqlQuery } from '../../../service/graphqlUtils';
import { UNKNOWN_USER } from '../../../service/constants';

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
    graphqlQueryMock.mockReturnValue(Promise.resolve(buildGqlResponse([ID1])));
    const hydratedUsers = await getHydratedUsers('', [ID1]);

    expect(hydratedUsers).toEqual(buildTransformedUsersResponse([ID1]));
    expect(graphqlQueryMock).toHaveBeenCalledWith('/graphql', {
      query: expectedGraphQlQuery,
      variables: {
        accountIds: [ID1],
      },
    });
  });

  it('should transform users response to user options', async () => {
    graphqlQueryMock.mockReturnValue(
      Promise.resolve(buildGqlResponse([ID1, ID2])),
    );
    const hydratedUsers = await getHydratedUsers('', [ID1, ID2]);

    expect(hydratedUsers).toEqual(buildTransformedUsersResponse([ID1, ID2]));
    expect(graphqlQueryMock).toHaveBeenCalledWith('/graphql', {
      query: expectedGraphQlQuery,
      variables: {
        accountIds: [ID1, ID2],
      },
    });
  });

  it('should return rejected promise if graphql fails', async () => {
    graphqlQueryMock.mockReturnValue(Promise.reject('504'));
    expect.assertions(1);

    const hydratedUsers = await getHydratedUsers('', [ID1, ID2]);
    expect(hydratedUsers).toEqual([
      { ...UNKNOWN_USER, id: ID1 },
      { ...UNKNOWN_USER, id: ID2 },
    ]);
  });
});
