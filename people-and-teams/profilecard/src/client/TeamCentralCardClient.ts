import { fg } from '@atlaskit/platform-feature-flags';

import { type ReportingLinesUser, type TeamCentralReportingLinesData } from '../types';

import CachingClient, { type CacheConfig } from './CachingClient';
import { getOrgIdForCloudIdFromAGG } from './getOrgIdForCloudIdFromAGG';
import { directoryGraphqlQuery } from './graphqlUtils';

const UNSHARDED_PREFIX = '/gateway/api/watermelon';

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
	gatewayGraphqlUrl: string;
	/**
	 * If provided, will avoid resolving the org ID internally from the cloud ID,
	 * and use the provided org ID instead
	 */
	orgId?: string;
	teamCentralDisabled?: boolean;
};

const orgContainsAnyWorkspacePromiseCache: Map<string, Promise<boolean>> = new Map();
const orgIdPromiseCache: Map<string, Promise<string | null>> = new Map();
const workspaceExistsWithTypePromiseCache: Map<string, Promise<string | undefined>> = new Map();

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
	orgContainsAnyWorkspacePromise: Promise<boolean>;

	private orgIdPromise: Promise<string | null>;
	private workspaceExistsWithTypePromise: Promise<string | undefined>;

	constructor(options: TeamCentralCardClientOptions) {
		super(options);
		this.options = options;
		this.bypassOnFailure = false;
		this.orgContainsAnyWorkspacePromise = this.createOrgContainsAnyWorkspacePromise(options);
		this.workspaceExistsWithTypePromise = this.preloadWorkspaceExistsWithType(options.cloudId);
		this.orgIdPromise = this.preloadOrgId(
			options.gatewayGraphqlUrl,
			options.cloudId,
			options.orgId,
		);
	}

	createOrgContainsAnyWorkspacePromise(config: TeamCentralCardClientOptions) {
		if (config.cloudId) {
			let promise = orgContainsAnyWorkspacePromiseCache.get(config.cloudId);
			if (!promise) {
				promise = this.getOrgContainsAnyWorkspace(config.cloudId);
				orgContainsAnyWorkspacePromiseCache.set(config.cloudId, promise);
			}
			return promise;
		}
		return Promise.resolve(true);
	}

	getReportingLines(userId: string): Promise<TeamCentralReportingLinesData> {
		return this.orgContainsAnyWorkspacePromise.then(
			(orgContainsAnyWorkspace) => {
				if (orgContainsAnyWorkspace) {
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
		if (this.options.teamCentralDisabled === true) {
			throw new Error('makeRequest cannot be called when the client has been disabled');
		}

		const query = buildReportingLinesQuery(userId);

		const response = await directoryGraphqlQuery<{
			reportingLines: TeamCentralReportingLinesData;
		}>('/gateway/api/watermelon/graphql?operationName=ReportingLines', query);

		return response.reportingLines;
	}

	async checkWorkspaceExists() {
		const workspaceExistsPromise = fg('enable_ptc_townsquare_reporting_lines_unsharded')
			? this.workspaceExistsWithTypePromise.then(
					(workspaceExistsWithType) => workspaceExistsWithType !== undefined,
				)
			: this.orgContainsAnyWorkspacePromise;
		return workspaceExistsPromise.then(
			(workspaceExistsWithType) => {
				if (workspaceExistsWithType) {
					return Promise.resolve(true);
				}
				return Promise.resolve(false);
			},
			() => Promise.resolve(false),
		);
	}

	async getIsGlobalExperienceWorkspace() {
		return (await this.workspaceExistsWithTypePromise) === 'GLOBAL_EXPERIENCE';
	}

	getOrgId() {
		return this.orgIdPromise;
	}

	preloadWorkspaceExistsWithType(cloudId?: string) {
		if (cloudId === undefined) {
			return Promise.resolve(undefined);
		}

		const maybeWorkspaceExistsWithTypePromise = workspaceExistsWithTypePromiseCache.get(cloudId);

		if (maybeWorkspaceExistsWithTypePromise !== undefined) {
			return maybeWorkspaceExistsWithTypePromise;
		}

		const workspaceExistsWithTypePromise = this.getWorkspaceExistsWithType(cloudId);

		workspaceExistsWithTypePromiseCache.set(cloudId, workspaceExistsWithTypePromise);

		return workspaceExistsWithTypePromise;
	}

	private getOrgContainsAnyWorkspace(cloudId?: string) {
		if (cloudId) {
			return fetch(
				(fg('enable_ptc_townsquare_reporting_lines_unsharded')
					? UNSHARDED_PREFIX
					: this.getShardedApiPath(cloudId)) +
					`/organization/containsAnyWorkspace?cloudId=${cloudId}`,
			).then((res) => {
				return !res || (res && res.ok);
			});
		} else {
			return Promise.resolve(false);
		}
	}

	private async getWorkspaceExistsWithType(cloudId: string) {
		try {
			const response = await fetch(
				`${this.getShardedApiPath(cloudId)}/workspace/existsWithWorkspaceType?cloudId=${cloudId}`,
				{
					credentials: 'include',
				},
			);
			if (response.ok) {
				const workspaceType = await response.text();
				return Promise.resolve(workspaceType);
			}
		} catch (err) {
			return Promise.resolve(undefined);
		}
	}

	preloadOrgId(gatewayGraphqlUrl: string, cloudId?: string, orgId?: string) {
		if (cloudId === undefined) {
			return Promise.resolve(null);
		}

		if (orgId !== undefined) {
			return Promise.resolve(orgId);
		}

		const maybeOrgIdForCloudIdPromise = orgIdPromiseCache.get(cloudId);

		if (maybeOrgIdForCloudIdPromise !== undefined) {
			return maybeOrgIdForCloudIdPromise;
		}

		const orgIdForCloudIdPromise = getOrgIdForCloudIdFromAGG(gatewayGraphqlUrl, cloudId);

		orgIdPromiseCache.set(cloudId, orgIdForCloudIdPromise);

		return orgIdForCloudIdPromise;
	}

	private getShardedApiPath(cloudId: string) {
		return `/gateway/api/townsquare/s/${cloudId}`;
	}

	private filterReportingLinesUser(users: ReportingLinesUser[] = []): ReportingLinesUser[] {
		return users.filter((user) => user.identifierType === 'ATLASSIAN_ID');
	}
}

export default TeamCentralCardClient;
