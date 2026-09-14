/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import type { FireEventType } from '@atlaskit/teams-app-internal-analytics/types';

import type { ProfileCardClientData, ProfileClientOptions, TeamsUserQueryResponse } from '../types';
import { PACKAGE_META_DATA } from '../util/analytics';
import { localTime } from '../util/date';
import { getPageTime } from '../util/performance';

import { AGGQuery } from './AGGQuery';
import CachingClient from './CachingClient';
import { buildAggUserQuery } from './buildAggUserQuery';
import { getErrorAttributes } from './getErrorAttributes';

const buildScopedProfileAtlAttributionHeader = (cloudId: string) =>
	JSON.stringify({
		tenantId: `ari:cloud:townsquare::site/${cloudId}`,
		product: 'Atlassian Home',
		service: 'townsquare-frontend',
	});

const queryAGGUser = async (
	url: string,
	userId: string,
	cloudId: string,
): Promise<TeamsUserQueryResponse> => {
	const query = buildAggUserQuery(userId);
	const { user } = await AGGQuery<{ user: TeamsUserQueryResponse }>(
		url,
		query,
		cloudId
			? (headers) => {
					// Temporary atl-attribution for scoped profiles until AGG attribution is handled upstream.
					headers.append('atl-attribution', buildScopedProfileAtlAttributionHeader(cloudId));
					return headers;
				}
			: undefined,
	);
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
		const userQueryPromise = queryAGGUser(urlWithOperationName, userId, cloudId);

		const user = await userQueryPromise;
		let timestring: string | undefined;
		const localWeekdayIndex = new Date().getDay().toString();
		const timeFormat = 'h:mmaaa';
		if (user.zoneinfo) {
			if (localTime(user.zoneinfo, 'i') === localWeekdayIndex) {
				timestring = localTime(user.zoneinfo, timeFormat) || undefined;
			} else {
				timestring = localTime(user.zoneinfo, `eee ${timeFormat}`) || undefined;
			}
		}

		return {
			...user,
			isBot: user.__typename === 'AppUser',
			isAgent: user.appType === 'agent',
			isServiceAccount: user.__typename === 'AppUser' && user.appType === 'service',
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

	getProfile(cloudId: string, userId: string, analytics?: FireEventType): Promise<any> {
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
				analytics('operational.profilecard.triggered.request', {
					firedAt: Math.round(getPageTime()),
					...PACKAGE_META_DATA,
				});
			}

			this.makeRequest(cloudId, userId)
				.then((data: any) => {
					if (this.cache) {
						this.setCachedProfile(cacheIdentifier, data);
					}
					if (analytics) {
						analytics('operational.profilecard.succeeded.request', {
							duration: getPageTime() - startTime,
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						});
					}

					resolve(data);
				})
				.catch((error: any) => {
					if (analytics) {
						analytics('operational.profilecard.failed.request', {
							duration: getPageTime() - startTime,
							...getErrorAttributes(error),
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						});
					}

					reject(error);
				});
		});
	}
}

/**
 * @deprecated Use `import { modifyResponse } from '@atlaskit/profilecard/modify-response'` instead.
 */
export { modifyResponse } from './modifyResponse';
/**
 * @deprecated Use `import { buildAggUserQuery } from '@atlaskit/profilecard/build-agg-user-query'` instead.
 */
export { buildAggUserQuery } from './buildAggUserQuery';
