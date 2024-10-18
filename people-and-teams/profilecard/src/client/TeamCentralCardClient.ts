import { fg } from '@atlaskit/platform-feature-flags';

import { type ReportingLinesUser, type TeamCentralReportingLinesData } from '../types';

import CachingClient, { type CacheConfig } from './CachingClient';
import { directoryGraphqlQuery } from './graphqlUtils';

export const buildReportingLinesQuery = (aaid: string) => ({
	query: `
    fragment ReportingLinesUserPII on UserPII {
      name
      picture
    }

    fragment ReportingLinesUserFragment on ReportingLinesUser {
      accountIdentifier
      identifierType
      pii {
        ...ReportingLinesUserPII
      }
    }

    query ReportingLines($aaid: String) {
      reportingLines(aaidOrHash: $aaid) {
        managers {
          ...ReportingLinesUserFragment
        }
        reports {
          ...ReportingLinesUserFragment
        }
      }
    }
  `,
	variables: {
		aaid,
	},
});

export type TeamCentralCardClientOptions = CacheConfig & {
	cloudId?: string;
	teamCentralDisabled?: boolean;
	/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required */
	/**
	 * @deprecated
	 * Enables Team Central functionality if enabled e.g. /gateway/api/watermelon/graphql
	 */
	teamCentralUrl?: string;
	/** URL to the Team Central app e.g. team.atlassian.com */
	teamCentralBaseUrl?: string;
};

let isTCReadyPromiseMap: Map<string, Promise<boolean>> = new Map();
const globalExperiencePromiseCache: Map<string, Promise<boolean>> = new Map();

class TeamCentralCardClient extends CachingClient<TeamCentralReportingLinesData> {
	options: TeamCentralCardClientOptions;
	/**
	 * Simple circuit breaker to avoid making unnecessary calls to Team Central on auth failures
	 * This is to handle the case where products may have provided teamCentralUrl, but the site itself
	 * doesn't actually have any TC product.
	 *
	 * There's currently no way to reset this circuit breaker, but that's fine. This is meant to
	 * catch a pretty specific edge case.
	 */
	bypassOnFailure: boolean;
	isTCReadyPromise: Promise<boolean>;

	private isGlobalExperienceWorkspacePromise: Promise<boolean>;

	constructor(options: TeamCentralCardClientOptions) {
		super(options);
		this.options = options;
		this.bypassOnFailure = false;
		this.isTCReadyPromise = this.createTcReadyPromise(options);
		this.isGlobalExperienceWorkspacePromise = this.preloadIsGlobalExperienceWorkspace(
			options.cloudId,
		);
	}

	createTcReadyPromise(config: TeamCentralCardClientOptions): Promise<boolean> {
		if (config.cloudId) {
			let promise = isTCReadyPromiseMap.get(config.cloudId);
			if (!promise) {
				promise = this.hasTCWorkspace(config);
				isTCReadyPromiseMap.set(config.cloudId, promise);
			}
			return promise;
		}
		return Promise.resolve(true);
	}

	getReportingLines(userId: string): Promise<TeamCentralReportingLinesData> {
		return this.isTCReadyPromise.then(
			(workSpaceExists) => {
				if (workSpaceExists) {
					if (!userId) {
						return Promise.reject(new Error('userId missing'));
					}

					const cache = this.getCachedProfile(userId);

					if (cache) {
						return Promise.resolve(cache);
					}

					if (this.bypassOnFailure) {
						return Promise.resolve({});
					}

					return new Promise((resolve) => {
						this.makeRequest(userId)
							.then((data: TeamCentralReportingLinesData) => {
								const enhancedData = {
									managers: this.filterReportingLinesUser(data?.managers),
									reports: this.filterReportingLinesUser(data?.reports),
								};
								if (this.cache) {
									this.setCachedProfile(userId, enhancedData);
								}
								resolve(enhancedData);
							})
							.catch((error: any) => {
								if (error?.status === 401 || error?.status === 403) {
									// Trigger circuit breaker
									this.bypassOnFailure = true;
								}

								/**
								 * Reporting lines aren't part of the critical path of profile card.
								 * Just resolve with empty values instead of bubbling up the error.
								 */
								resolve({});
							});
					});
				}
				return Promise.resolve({ managers: [], reports: [] });
			},
			() => Promise.resolve({ managers: [], reports: [] }),
		);
	}

	/**
	 * `public` so that mock client can override it; do not use it otherwise!
	 */
	async makeRequest(userId: string) {
		if (fg('enable_ptc_sharded_townsquare_calls')) {
			if (this.options.teamCentralDisabled === true) {
				throw new Error('makeRequest cannot be called when the client has been disabled');
			}

			const query = buildReportingLinesQuery(userId);

			const response = await directoryGraphqlQuery<{
				reportingLines: TeamCentralReportingLinesData;
			}>('/gateway/api/watermelon/graphql?operationName=ReportingLines', query);

			return response.reportingLines;
		} else {
			if (!this.options.teamCentralUrl) {
				throw new Error(
					'options.teamCentralUrl is a required parameter for retrieving Team Central data',
				);
			}

			const query = buildReportingLinesQuery(userId);

			const response = await directoryGraphqlQuery<{
				reportingLines: TeamCentralReportingLinesData;
			}>(`${this.options.teamCentralUrl}?operationName=ReportingLines`, query);

			return response.reportingLines;
		}
	}

	checkWorkspaceExists(): Promise<boolean> {
		return this.isTCReadyPromise.then(
			(workSpaceExists) => {
				if (workSpaceExists) {
					return Promise.resolve(true);
				}
				return Promise.resolve(false);
			},
			() => Promise.resolve(false),
		);
	}

	getIsGlobalExperienceWorkspace() {
		return this.isGlobalExperienceWorkspacePromise;
	}

	private preloadIsGlobalExperienceWorkspace(cloudId?: string) {
		if (!fg('enable_ptc_sharded_townsquare_calls')) {
			return Promise.resolve(false);
		}

		if (cloudId === undefined) {
			return Promise.resolve(false);
		}

		const maybeIsGlobalExperienceWorkspaceForCloudIdPromise =
			globalExperiencePromiseCache.get(cloudId);

		if (maybeIsGlobalExperienceWorkspaceForCloudIdPromise !== undefined) {
			return maybeIsGlobalExperienceWorkspaceForCloudIdPromise;
		}

		const isGlobalExperienceWorkspaceForCloudIdPromise =
			this.isGlobalExperienceWorkspaceForCloudId(cloudId);

		globalExperiencePromiseCache.set(cloudId, isGlobalExperienceWorkspaceForCloudIdPromise);

		return isGlobalExperienceWorkspaceForCloudIdPromise;
	}

	private hasTCWorkspace(config: TeamCentralCardClientOptions) {
		if (config.cloudId) {
			const maybeShardedApiPath = this.getMaybeShardedApiPath(config.cloudId);
			return fetch(
				`${maybeShardedApiPath}/organization/containsAnyWorkspace?cloudId=${config.cloudId}`,
			).then((res) => {
				return !res || (res && res.ok);
			});
		} else {
			return Promise.resolve(false);
		}
	}

	private async isGlobalExperienceWorkspaceForCloudId(cloudId: string): Promise<boolean> {
		const maybeShardedApiPath = this.getMaybeShardedApiPath(cloudId);
		try {
			const response = await fetch(
				`${maybeShardedApiPath}/workspace/existsWithWorkspaceType?cloudId=${cloudId}`,
				{
					credentials: 'include',
				},
			);
			if (response.ok) {
				const workspaceType = await response.text();
				return Promise.resolve(workspaceType === 'GLOBAL_EXPERIENCE');
			}
			return Promise.resolve(false);
		} catch (err) {
			return Promise.resolve(false);
		}
	}

	private getMaybeShardedApiPath(cloudId: string) {
		const maybeShardedPath = fg('enable_ptc_sharded_townsquare_calls')
			? `/townsquare/s/${cloudId}`
			: '/watermelon';
		return `/gateway/api${maybeShardedPath}`;
	}

	private filterReportingLinesUser(users: ReportingLinesUser[] = []): ReportingLinesUser[] {
		return users.filter((user) => user.identifierType === 'ATLASSIAN_ID');
	}
}

export default TeamCentralCardClient;
