import { AnalyticsEventPayload } from '@atlaskit/analytics-next';

import type { ProfileClientOptions, Team } from '../types';
import { teamRequestAnalytics } from '../util/analytics';
import { getPageTime } from '../util/performance';

import CachingClient from './CachingClient';
import { getErrorAttributes } from './errorUtils';
import { getTeamFromAGG } from './getTeamFromAGG';
import { GraphQLError, graphqlQuery } from './graphqlUtils';

const QUERY = `query Team($teamId: String!, $organizationId: String) {
  Team: Team(teamId: $teamId, organizationId: $organizationId) {
    id,
    description,
    displayName,
    largeHeaderImageUrl,
    smallHeaderImageUrl,
    largeAvatarImageUrl,
    smallAvatarImageUrl,
    members {
      id,
      fullName,
      avatarUrl,
    },
  }
}`;

const buildTeamQuery = (teamId: string, orgId: string | undefined) => ({
  query: QUERY,
  variables: {
    teamId,
    organizationId: orgId || '',
  },
});

export default class TeamProfileCardClient extends CachingClient<Team> {
  options: ProfileClientOptions;

  constructor(options: ProfileClientOptions) {
    super(options);
    this.options = options;
  }

  makeRequestViaGateway(
    teamId: string,
    _orgId: string | undefined,
  ): Promise<Team> {
    if (!this.options.gatewayGraphqlUrl) {
      throw new Error(
        'Trying to fetch via gateway with no specified config.gatewayGraphqlUrl',
      );
    }

    return getTeamFromAGG(this.options.gatewayGraphqlUrl, teamId);
  }

  makeRequest(teamId: string, orgId: string | undefined): Promise<Team> {
    if (!this.options.url) {
      throw new Error('config.url is a required parameter for fetching teams');
    }

    const query = buildTeamQuery(teamId, orgId);

    return graphqlQuery<{ Team: Team }>(this.options.url, query).then(
      (data) => data.Team,
    );
  }

  getProfile(
    teamId: string,
    orgId: string | undefined,
    analytics?: (event: AnalyticsEventPayload) => void,
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

      if (analytics) {
        analytics(teamRequestAnalytics('triggered'));
      }

      const shouldUseGateway = !!this.options.gatewayGraphqlUrl;

      const promise = shouldUseGateway
        ? this.makeRequestViaGateway(teamId, orgId)
        : this.makeRequest(teamId, orgId);

      promise
        .then((data: Team) => {
          if (this.cache) {
            this.setCachedProfile(teamId, data);
          }
          if (analytics) {
            analytics(
              teamRequestAnalytics('succeeded', {
                duration: getPageTime() - startTime,
                gateway: shouldUseGateway,
              }),
            );
          }
          resolve(data);
        })
        .catch((error: GraphQLError) => {
          if (analytics) {
            analytics(
              teamRequestAnalytics('failed', {
                duration: getPageTime() - startTime,
                ...getErrorAttributes(error),
                gateway: shouldUseGateway,
              }),
            );
          }
          reject(error);
        });
    });
  }
}
