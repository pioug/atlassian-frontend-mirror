import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';

import type {
	ApiClientResponse,
	ProfileCardClientData,
	ProfileClientOptions,
	TeamsUserQueryResponse,
} from '../types';
import { userRequestAnalytics } from '../util/analytics';
import { localTime } from '../util/date';
import { getPageTime } from '../util/performance';

import CachingClient from './CachingClient';
import { getErrorAttributes } from './errorUtils';
import { AGGQuery } from './graphqlUtils';

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

export const buildAggUserQuery = (userId: string) => ({
	query: `query user($userId: ID!) {
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
			... on AppUser {
      			appType
    		}
		}
	}`,
	variables: {
		userId,
	},
});

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
		const gatewayGraphqlUrl = this.options.gatewayGraphqlUrl || '/gateway/api/graphql';
		const urlWithOperationName = `${gatewayGraphqlUrl}?operationName=aggUserQuery`;
		const userQueryPromise = queryAGGUser(urlWithOperationName, userId);

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
			isAgent: user.appType === 'agent',
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
