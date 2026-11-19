import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';
import type { User } from '@atlaskit/user-picker/types';

import { config } from '../config';
import type { AtlAttributionHeaderData } from './atl-attribution';
import { UNKNOWN_USER } from './constants';
import { graphqlQuery } from './graphqlUtils';
import batchAccountIds from './user-query-batches';

interface UserData {
	accountId: string;
	name: string;
	picture: string;
	appType?: string | null;
}

export interface ApiClientResponse {
	users: UserData[];
}

/**
 * @param  {string} accountIds ids to hydrate
 * @return GraphQL Query
 */
const usersQuery = `query usersQuery($accountIds: [ID!]!) {
    users(accountIds: $accountIds) {
      name
      accountId
      picture
    }
  }`;

const usersWithAppTypeQuery = `query usersQuery($accountIds: [ID!]!) {
    users(accountIds: $accountIds) {
      name
      accountId
      picture
      ... on AppUser {
        appType
      }
    }
  }`;

const makeRequest = async (
	url: string,
	accountIds: string[],
	attributionData?: Partial<AtlAttributionHeaderData>,
	includeAppType = false,
) => {
	const query = {
		query: includeAppType ? usersWithAppTypeQuery : usersQuery,
		variables: { accountIds },
	};

	return await graphqlQuery<ApiClientResponse>(url, query, attributionData);
};

const modifyResponse = (users: UserData[]): User[] =>
	users.map(({ accountId, name, picture, appType }) => ({
		avatarUrl: picture,
		id: accountId,
		name,
		type: 'user',
		...(appType && { appType }),
	}));

const getHydratedUsers = (
	baseUrl: string | undefined,
	userIds: string[],
	attributionData?: Partial<AtlAttributionHeaderData>,
): Promise<User[]> => {
	const url = config.getGraphQLUrl(baseUrl);
	const includeAppType = expVal('platform_user_picker_agent_avatar_hexagon', 'isEnabled', false);
	return new Promise((resolve) => {
		const requests = (includeAppType ? batchAccountIds(userIds) : [userIds]).map((ids) =>
			makeRequest(url, ids, attributionData, includeAppType),
		);
		Promise.all(requests)
			.then((responses) => {
				resolve(modifyResponse(responses.flatMap(({ users }) => users)));
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
