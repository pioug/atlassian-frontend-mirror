import {
  MentionNameResolver,
  MentionNameDetails,
  MentionNameStatus,
} from '../types';
import { graphqlQuery } from './graphqlUtils';
import { getConfig } from '../config';

interface UserData {
  accountId: string;
  name: string;
}

interface ApiClientResponse {
  users: UserData[];
}

const buildUsersQuery = (accountIds: string[]) => ({
  query: `query usersQuery($accountIds: [ID!]!) {
    users(accountIds: $accountIds) {
      name
      accountId
    }
  }`,

  variables: { accountIds },
});

const makeRequest = async (url: string, accountIds: string[]) => {
  const query = buildUsersQuery(accountIds);

  return graphqlQuery<ApiClientResponse>(url, query);
};

export class DefaultMentionNameResolver implements MentionNameResolver {
  private baseUrl?: string;
  private readonly cache: Map<string, string>;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl;
    this.cache = new Map();
  }

  async lookupName(id: string): Promise<MentionNameDetails> {
    try {
      if (this.cache.has(id)) {
        return { id, name: this.cache.get(id), status: MentionNameStatus.OK };
      }
      const url = getConfig().getGraphQLUrl(this.baseUrl);
      const data = await makeRequest(url, [id]);
      const userInfo = data.users.find((user) => user.accountId === id);
      return userInfo
        ? { id, name: userInfo.name, status: MentionNameStatus.OK }
        : { id, status: MentionNameStatus.UNKNOWN };
    } catch (error) {
      // on network error, return original list with label 'Unknown'
      return {
        id,
        status: MentionNameStatus.UNKNOWN,
      };
    }
  }

  cacheName(id: string, name: string) {
    this.cache.set(id, name);
  }
}
