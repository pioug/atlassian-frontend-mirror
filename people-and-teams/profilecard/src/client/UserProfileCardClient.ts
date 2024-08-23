import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import type {
	ApiClientResponse,
	ProfileCardClientData,
	ProfileClientOptions,
	TeamsUserQueryResponse,
	UserInSiteUserbase,
} from '../types';
import { userRequestAnalytics } from '../util/analytics';
import { localTime } from '../util/date';
import { getPageTime } from '../util/performance';

import CachingClient from './CachingClient';
import { getErrorAttributes } from './errorUtils';
import { AGGQuery, directoryGraphqlQuery } from './graphqlUtils';

/**
 * Transform response from GraphQL
 * - Prefix `timestring` with `remoteWeekdayString` depending on `remoteWeekdayIndex`
 * - Remove properties which will be not used later
 * @ignore
 * @param  {object} response
 * @return {object}
 */
export const modifyResponse = (response: ApiClientResponse): ProfileCardClientData => {
	const data = {
		...response.User,
	};

	const localWeekdayIndex = new Date().getDay().toString();

	if (data.remoteWeekdayIndex && data.remoteWeekdayIndex !== localWeekdayIndex) {
		data.remoteTimeString = `${data.remoteWeekdayString} ${data.remoteTimeString}`;
	}

	return {
		isBot: data.isBot,
		isCurrentUser: data.isCurrentUser,
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
		accountType: data.accountType || undefined,
	};
};

/**
 * @param  {string} userId
 * @param  {string} cloudId
 * @return {string} GraphQL Query String
 */
export const buildUserQuery = (cloudId: string, userId: string) => ({
	query: `query User($userId: String!, $cloudId: String!) {
    User: CloudUser(userId: $userId, cloudId: $cloudId) {
      id
      isCurrentUser
      status
      statusModifiedDate
      isBot
      isNotMentionable
      fullName
      nickname
      email
      meta: title
      location
      companyName
      avatarUrl(size: 192)
      remoteWeekdayIndex: localTime(format: "d")
      remoteWeekdayString: localTime(format: "ddd")
      remoteTimeString: localTime(format: "h:mma")
    }
  }`,
	variables: {
		cloudId,
		userId,
	},
});

export const buildAggUserQuery = (userId: string) => ({
	query: `query TeamsUserQuery($userId: ID!) {
		user(accountId: $userId) {
			id
			name
			picture
			accountStatus
			__typename
			... on AtlassianAccountUser {
				email
				nickname
				zoneinfo
				extendedProfile {
					jobTitle
					organization
					location
					closedDate
					inactiveDate
				}
			}
			... on CustomerUser {
				email
				zoneinfo
			}
		}
	}`,
	variables: {
		userId,
	},
});

const getUserInSiteUserBase = (cloudId: string, userId: string): Promise<UserInSiteUserbase> => {
	return fetch(
		new Request(`/gateway/api/teams/site/${cloudId}/users/${userId}/exists`, {
			method: 'GET',
			credentials: 'include',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				'X-header-client-id': 'ptc-fe',
			},
		}),
	).then((response) => response.json());
};

const queryAGGUser = async (url: string, userId: string): Promise<TeamsUserQueryResponse> => {
	const query = buildAggUserQuery(userId);
	const { user } = await AGGQuery<{ user: TeamsUserQueryResponse }>(url, query);
	return user;
};

export default class UserProfileCardClient extends CachingClient<any> {
	options: ProfileClientOptions;

	constructor(options: ProfileClientOptions) {
		super(options);
		this.options = options;
	}

	async makeRequest(cloudId: string, userId: string): Promise<ProfileCardClientData> {
		if (fg('migrate_cloud_user_to_agg_user_query')) {
			if (!this.options.gatewayGraphqlUrl) {
				throw new Error('options.gatewayGraphqlUrl is a required parameter');
			}

			const userCheckPromise = getUserInSiteUserBase(cloudId, userId);
			const userQueryPromise = queryAGGUser(this.options.gatewayGraphqlUrl, userId);

			const checkUserPresentInSiteRes = await userCheckPromise;

			if (!checkUserPresentInSiteRes.isPresent) {
				// Use this error message to not trouble SLO, check out getErrorAttributes for reference
				throw new Error('Unable to fetch user: User does not exist in this site');
			}

			const user = await userQueryPromise;

			let timestring: string | undefined;
			const localWeekdayIndex = new Date().getDay().toString();
			if (user.zoneinfo) {
				if (localTime(user.zoneinfo, 'i') === localWeekdayIndex) {
					timestring = localTime(user.zoneinfo, 'h:mmbbb') || undefined;
				} else {
					timestring = localTime(user.zoneinfo, 'eee h:mmbbb') || undefined;
				}
			}

			return {
				...user,
				isBot: user.__typename === 'AppUser',
				status: user.accountStatus,
				statusModifiedDate: user.extendedProfile?.closedDate || user.extendedProfile?.inactiveDate,
				avatarUrl: user.picture,
				email: user.email,
				fullName: user.name,
				location: user.extendedProfile?.location,
				meta: user.extendedProfile?.jobTitle,
				nickname: user.nickname,
				companyName: user.extendedProfile?.organization,
				timestring: timestring,
			};
		} else {
			if (!this.options.url) {
				throw new Error('options.url is a required parameter');
			}

			const query = buildUserQuery(cloudId, userId);

			const response = await directoryGraphqlQuery<ApiClientResponse>(this.options.url, query);

			return modifyResponse(response);
		}
	}

	getProfile(
		cloudId: string,
		userId: string,
		analytics?: (event: AnalyticsEventPayload) => void,
	): Promise<any> {
		if (!userId) {
			return Promise.reject(new Error('userId missing'));
		}

		const cacheIdentifier = `${cloudId}/${userId}`;
		const cache = this.getCachedProfile(cacheIdentifier);

		if (cache) {
			return Promise.resolve(cache);
		}

		return new Promise((resolve, reject) => {
			const startTime = getPageTime();

			if (analytics) {
				analytics(userRequestAnalytics('triggered'));
			}

			this.makeRequest(cloudId, userId)
				.then((data: any) => {
					if (this.cache) {
						this.setCachedProfile(cacheIdentifier, data);
					}
					if (analytics) {
						analytics(
							userRequestAnalytics('succeeded', {
								duration: getPageTime() - startTime,
							}),
						);
					}
					resolve(data);
				})
				.catch((error: any) => {
					if (analytics) {
						analytics(
							userRequestAnalytics('failed', {
								duration: getPageTime() - startTime,
								...getErrorAttributes(error),
							}),
						);
					}
					reject(error);
				});
		});
	}
}
