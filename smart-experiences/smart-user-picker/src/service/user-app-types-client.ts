import { config } from '../config';
import type { AtlAttributionHeaderData } from './atl-attribution';
import { graphqlQuery } from './graphqlUtils';
import batchAccountIds from './user-query-batches';

const userIdentityQuery = `query userIdentityQuery($accountIds: [ID!]!) {
    users(accountIds: $accountIds) {
      accountId
      ... on AppUser {
        appType
      }
    }
  }`;

const getUserAppTypes = async (
	baseUrl: string | undefined,
	accountIds: string[],
	attributionData?: Partial<AtlAttributionHeaderData>,
): Promise<Map<string, string>> => {
	const url = config.getGraphQLUrl(baseUrl);
	const responses = await Promise.all(
		batchAccountIds(accountIds).map((ids) =>
			graphqlQuery<{ users: Array<{ accountId: string; appType?: string | null } | null> }>(
				url,
				{ query: userIdentityQuery, variables: { accountIds: ids } },
				attributionData,
			),
		),
	);
	return new Map(
		responses.flatMap(({ users }) =>
			users.flatMap((user) => (user?.appType ? [[user.accountId, user.appType] as const] : [])),
		),
	);
};

export default getUserAppTypes;
