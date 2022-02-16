import type { MockApolloClient } from 'mock-apollo-client';
import { UserAndGroupSearchQuery } from './user-and-group-query';

export interface UserAndGroupSearchQueryUser {
  type: string | null;
  displayName: string | null;
  profilePicture: { path: any } | null;
  accountId: string | null;
}

export interface UserAndGroupSearchQueryGroup {
  id: string | null;
  name: string | null;
}

export interface GetRecommendationsRequest {
  includeGroups?: boolean;
  query?: string;
}

export const getRecommendations = <T extends GetRecommendationsRequest, V>(
  error: any,
  request: T,
  client: Pick<MockApolloClient, 'query'>,
): Promise<V[]> => {
  return client
    .query({
      query: UserAndGroupSearchQuery,
      variables: {
        withGroups: request.includeGroups,
        searchTerm: request.query,
      },
    })
    .then(({ data }) => {
      const { users = [], groups = [] } = data.userGroupSearch;
      const userList: V[] = users.map((item: UserAndGroupSearchQueryUser) => ({
        id: `user-${item.accountId}`,
        name: item.displayName,
        extra: item,
        type: 'user',
        avatarUrl: item.profilePicture ? item.profilePicture.path : '',
      }));
      const groupList: V[] = groups.map(
        (item: UserAndGroupSearchQueryGroup) => ({
          id: `group-${item.id}`,
          name: item.name,
          type: 'group',
          extra: item,
        }),
      );
      const usersAndGroups = [...userList, ...groupList];
      return usersAndGroups;
    })
    .catch((error) => {
      return [];
    });
};

export default getRecommendations;
