import {
  ApiClientResponse,
  ProfileCardClientData,
  ProfileClientOptions,
} from '../types';

import CachingClient from './CachingClient';
import { graphqlQuery } from './graphqlUtils';

/**
 * Transform response from GraphQL
 * - Prefix `timestring` with `remoteWeekdayString` depending on `remoteWeekdayIndex`
 * - Remove properties which will be not used later
 * @ignore
 * @param  {object} response
 * @return {object}
 */
export const modifyResponse = (
  response: ApiClientResponse,
): ProfileCardClientData => {
  const data = {
    ...response.User,
  };

  const localWeekdayIndex = new Date().getDay().toString();

  if (
    data.remoteWeekdayIndex &&
    data.remoteWeekdayIndex !== localWeekdayIndex
  ) {
    data.remoteTimeString = `${data.remoteWeekdayString} ${data.remoteTimeString}`;
  }

  return {
    isBot: data.isBot,
    isCurrentUser: data.isCurrentUser,
    isNotMentionable: data.isNotMentionable,
    status: data.status,
    statusModifiedDate: data.statusModifiedDate || undefined,
    avatarUrl: data.avatarUrl || undefined,
    email: data.email || undefined,
    fullName: data.fullName || undefined,
    location: data.location || undefined,
    meta: data.meta || undefined,
    nickname: data.nickname || undefined,
    companyName: data.companyName || undefined,
    timestring: data.remoteTimeString || undefined,
  };
};

/**
 * @param  {string} userId
 * @param  {string} cloudId
 * @return {string} GraphQL Query String
 */
const buildUserQuery = (cloudId: string, userId: string) => ({
  query: `query User($userId: String!, $cloudId: String!) {
    User: CloudUser(userId: $userId, cloudId: $cloudId) {
      id,
      isCurrentUser,
      status,
      statusModifiedDate,
      isBot,
      isNotMentionable,
      fullName,
      nickname,
      email,
      meta: title,
      location,
      companyName,
      avatarUrl(size: 192),
      remoteWeekdayIndex: localTime(format: "d"),
      remoteWeekdayString: localTime(format: "ddd"),
      remoteTimeString: localTime(format: "h:mma"),
    }
  }`,
  variables: {
    cloudId,
    userId,
  },
});

export default class UserProfileCardClient extends CachingClient<any> {
  options: ProfileClientOptions;

  constructor(options: ProfileClientOptions) {
    super(options);
    this.options = options;
  }

  async makeRequest(cloudId: string, userId: string) {
    if (!this.options.url) {
      throw new Error('options.url is a required parameter');
    }

    const query = buildUserQuery(cloudId, userId);

    const response = await graphqlQuery<ApiClientResponse>(
      this.options.url,
      query,
    );

    return modifyResponse(response);
  }

  getProfile(cloudId: string, userId: string): Promise<any> {
    if (!userId) {
      return Promise.reject(new Error('userId missing'));
    }

    const cacheIdentifier = `${cloudId}/${userId}`;
    const cache = this.getCachedProfile(cacheIdentifier);

    if (cache) {
      return Promise.resolve(cache);
    }

    return new Promise((resolve, reject) => {
      this.makeRequest(cloudId, userId)
        .then((data: any) => {
          if (this.cache) {
            this.setCachedProfile(cacheIdentifier, data);
          }
          resolve(data);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}
