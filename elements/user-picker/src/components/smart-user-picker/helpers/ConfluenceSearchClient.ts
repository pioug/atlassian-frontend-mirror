import { OptionData } from '../../../types';
import { ApolloClient } from 'apollo-client';
import { UserAndGroupSearchQuery } from './UserAndGroupSearchQuery.graphql';
import { RecommendationRequest } from '../components';

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

const getRecommendations = (
  error: any,
  request: RecommendationRequest,
  client: ApolloClient<any>,
): Promise<OptionData[]> => {
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
      const userList: OptionData[] = users.map(
        (item: UserAndGroupSearchQueryUser) => ({
          id: `user-${item.accountId}`,
          name: item.displayName,
          extra: item,
          type: 'user',
          avatarUrl: item.profilePicture ? item.profilePicture.path : '',
        }),
      );
      const groupList: OptionData[] = groups.map(
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
    .catch(error => {
      return [];
    });
};

export default getRecommendations;
