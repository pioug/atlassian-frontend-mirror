import { type TeamMembership } from '../../types';
import { type ClientConfig } from '../base-client';
import { DEFAULT_CONFIG } from '../constants';
import { BaseGraphQlClient } from '../graphql-client';
import { logException } from '../sentry/main';

export const BROWSE_USER_SETTINGS_KEY = 'internal.browse-users-allowed';

const buildTeamMembershipQuery = (teamId: string, membershipState: string[]) => ({
	query: `query TeamMembership($teamId: String!, $membershipState: [TeamMembershipStatus]) {
    TeamMembership: TeamMembership(teamId: $teamId, membershipStates: $membershipState) {
      user: profile {
        id,
        fullName,
        title,
        avatarUrl,
        timezone,
        status
      },
      state:membershipStatus,
      role,
      membershipId {
        teamId, memberId
      }
    }
  }`,
	variables: {
		teamId,
		membershipState,
	},
});

/**
 * @type CloudUser
 * @property {string} avatarUrl
 * @property {string} id
 * @property {string} fullName
 * @property {string} title
 */
export interface CloudUser {
	avatarUrl: string;
	id: string;
	fullName: string;
	title?: string;
}

const buildUserQuery = (userId: string, cloudId: string) => ({
	query: `query CloudUser($userId: String!, $cloudId: String!) {
    CloudUser(userId: $userId, cloudId: $cloudId) {
      avatarUrl
      id
      fullName
      title
    }
  }`,
	variables: { userId, cloudId },
});

const delay = (millis: number) =>
	new Promise((resolve) => {
		setTimeout(resolve, millis);
	});

export class DirectoryClient extends BaseGraphQlClient {
	constructor(baseUrl: string, config: ClientConfig) {
		super(`${baseUrl}/directory/graphql`, config);
	}

	setBaseUrl(baseUrl: string) {
		this.setServiceUrl(`${baseUrl}/directory/graphql`);
	}

	async queryFeatureFlags(
		/**
		 * @private
		 * @deprecated don't need to pass param, value is taken from `this.getCloudId()` instead
		 */
		cloudId: string | undefined,
		flags: string[],
	): Promise<Record<string, boolean>> {
		const queryFeatureFlags = {
			query: `query FeatureFlags($cloudId: String!, $flags: [String]!) {
        FeatureFlags(cloudId: $cloudId, flags: $flags) {
          flag
          enabled
        }
      }`,
			variables: {
				cloudId: this.getCloudId(cloudId),
				flags,
			},
		};

		const { FeatureFlags } = await this.makeGraphQLRequest<
			'FeatureFlags',
			{ flag: string; enabled: boolean }[]
		>(queryFeatureFlags, {
			operationName: 'FeatureFlags',
		});

		return FeatureFlags.map<[string, boolean]>(({ flag, enabled }) => [flag, enabled]).reduce<
			Record<string, boolean>
		>((acc, val) => ((acc[val[0]] = val[1]), acc), {});
	}

	private canRetryError(pendingRetries: number, error: unknown): boolean {
		return (
			pendingRetries > 0 &&
			!!error &&
			typeof error === 'object' &&
			'category' in error &&
			(error as Record<string, string>).category === 'NotFound'
		);
	}

	/**
	 * Get user information of all members of a team
	 * @param {string} teamId
	 * @returns {Promise}
	 * @private
	 * @deprecated use AGG instead
	 */
	queryTeamMemberships(
		teamId: string,
		membershipStatus: string[] = ['FULL_MEMBER'],
	): Promise<TeamMembership[]> {
		// eslint-disable-next-line no-console
		console.warn('Directory queryTeamMemberships is deprecated, use AGG instead');
		const teamMembershipsQuery = buildTeamMembershipQuery(teamId, membershipStatus);

		const performRequest = async (
			pendingRetries = 3,
			backoffMaxDelay = 2000,
		): Promise<{ TeamMembership: TeamMembership[] }> => {
			try {
				return (await this.makeGraphQLRequest(teamMembershipsQuery, {
					operationName: 'TeamMembership',
				})) as { TeamMembership: TeamMembership[] };
			} catch (error) {
				if (this.canRetryError(pendingRetries, error)) {
					await delay(backoffMaxDelay / pendingRetries);
					return performRequest(pendingRetries - 1);
				}

				throw error;
			}
		};

		return performRequest().then(({ TeamMembership }) => TeamMembership);
	}

	/**
	 * Get user information of all members of a team
	 * @param {string} userId
	 * @returns {Promise}
	 */
	queryUser(
		userId: string,
		/**
		 * @private
		 * @deprecated don't need to pass param, value is taken from `this.getCloudId()` instead
		 */
		cloudId?: string,
	): Promise<{ CloudUser: CloudUser }> {
		const userQuery = buildUserQuery(userId, this.getCloudId(cloudId));

		const performRequest = async (
			pendingRetries = 3,
			backoffMaxDelay = 2000,
		): Promise<{ CloudUser: CloudUser }> => {
			try {
				return await this.makeGraphQLRequest<'CloudUser', CloudUser>(userQuery, {
					operationName: 'CloudUser',
				});
			} catch (error) {
				if (this.canRetryError(pendingRetries, error)) {
					await delay(backoffMaxDelay / pendingRetries);
					return performRequest(pendingRetries - 1);
				}

				throw error;
			}
		};

		return performRequest();
	}
}
/**
 * @deprecated As part of decommisioning pf-directoy
 */
export const directoryClient = new DirectoryClient(DEFAULT_CONFIG.stargateRoot, {
	logException,
});
