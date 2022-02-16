import { User } from '@atlaskit/user-picker';
import { UNKNOWN_USER } from './constants';
import { graphqlQuery } from './graphqlUtils';
import { getConfig } from '../config';

interface UserData {
  accountId: string;
  name: string;
  picture: string;
}

export interface ApiClientResponse {
  users: UserData[];
}

/**
 * @param  {string} accountIds ids to hydrate
 * @return GraphQL Query
 */
const buildUsersQuery = (accountIds: string[]) => ({
  query: `query usersQuery($accountIds: [ID!]!) {
    users(accountIds: $accountIds) {
      name
      accountId
      picture
    }
  }`,
  variables: { accountIds },
});

const makeRequest = async (url: string, accountIds: string[]) => {
  const query = buildUsersQuery(accountIds);

  return await graphqlQuery<ApiClientResponse>(url, query);
};

const modifyResponse = (users: UserData[]): User[] =>
  users.map(({ accountId, name, picture }) => ({
    avatarUrl: picture,
    id: accountId,
    name,
    type: 'user',
  }));

const getHydratedUsers = (
  baseUrl: string | undefined,
  userIds: string[],
): Promise<User[]> => {
  const url = getConfig().getGraphQLUrl(baseUrl);
  return new Promise((resolve) => {
    makeRequest(url, userIds)
      .then((data) => {
        resolve(modifyResponse(data.users));
      })
      .catch(() => {
        // on network error, return original list with label 'Unknown'
        resolve(
          userIds.map((id) => ({
            ...UNKNOWN_USER,
            id,
          })),
        );
      });
  });
};

export default getHydratedUsers;
