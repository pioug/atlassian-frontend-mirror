import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import { type FireEventType } from '@atlaskit/teams-app-internal-analytics';

import type { ProfileClientOptions, Team } from '../types';
import { PACKAGE_META_DATA, teamRequestAnalytics } from '../util/analytics';
import { getPageTime } from '../util/performance';

import CachingClient from './CachingClient';
import { DEPRECATED_getErrorAttributes, getErrorAttributes } from './errorUtils';
import { getTeamFromAGG } from './getTeamFromAGG';

export default class TeamProfileCardClient extends CachingClient<Team> {
	options: ProfileClientOptions;

	constructor(options: ProfileClientOptions) {
		super(options);
		this.options = options;
	}

	makeRequest(teamId: string, _orgId: string | undefined): Promise<Team> {
		if (!this.options.gatewayGraphqlUrl) {
			throw new Error('Trying to fetch via gateway with no specified config.gatewayGraphqlUrl');
		}

		return getTeamFromAGG(this.options.gatewayGraphqlUrl, teamId, this.options.cloudId);
	}

	getProfile(
		teamId: string,
		orgId: string | undefined,
		analytics?: (event: AnalyticsEventPayload) => void,
		analyticsNext?: FireEventType,
	): Promise<Team> {
		if (!teamId) {
			return Promise.reject(new Error('teamId is missing'));
		}

		const cache = this.getCachedProfile(teamId);

		if (cache) {
			return Promise.resolve(cache);
		}

		return new Promise((resolve, reject) => {
			const startTime = getPageTime();
			if (fg('ptc-enable-profile-card-analytics-refactor')) {
				if (analyticsNext) {
					analyticsNext('operational.teamProfileCard.triggered.request', {
						firedAt: Math.round(getPageTime()),
						...PACKAGE_META_DATA,
					});
				}
			} else {
				if (analytics) {
					analytics(teamRequestAnalytics('triggered'));
				}
			}

			this.makeRequest(teamId, orgId)
				.then((data: Team) => {
					if (this.cache) {
						this.setCachedProfile(teamId, data);
					}

					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						if (analyticsNext) {
							analyticsNext('operational.teamProfileCard.succeeded.request', {
								duration: getPageTime() - startTime,
								gateway: true,
								firedAt: Math.round(getPageTime()),
								...PACKAGE_META_DATA,
							});
						}
					} else {
						if (analytics) {
							analytics(
								teamRequestAnalytics('succeeded', {
									duration: getPageTime() - startTime,
									gateway: true,
								}),
							);
						}
					}
					resolve(data);
				})
				.catch((error: unknown) => {
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						if (analyticsNext) {
							analyticsNext('operational.teamProfileCard.failed.request', {
								duration: getPageTime() - startTime,
								...getErrorAttributes(error),
								gateway: true,
								firedAt: Math.round(getPageTime()),
								...PACKAGE_META_DATA,
							});
						}
					} else {
						if (analytics) {
							analytics(
								teamRequestAnalytics('failed', {
									duration: getPageTime() - startTime,
									...DEPRECATED_getErrorAttributes(error),
									gateway: true,
								}),
							);
						}
					}
					reject(error);
				});
		});
	}
}
